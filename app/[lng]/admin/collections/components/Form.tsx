"use client";

import { ReactNode, useState } from "react";
import { INITIAL_STATE_RESPONSE } from "@/app/shared/constants";
import { GenericInput, SubmitButton } from "@/app/shared/components";
import {
  AutocompleteInput,
  DynamicItemManager,
} from "@/app/shared/components/Form";
import {
  createCollection,
  deleteCollection,
  updateCollection,
  deleteMassiveCollections,
  getCollectionByName,
  getCollectionByLink,
  getCollectionById,
  getCollections,
} from "@/app/shared/services/collection/controller";
import type {
  IProduct,
  ICollection,
  ICollectionState,
} from "@/app/shared/interfaces";
import { generateFileKey } from "@/app/shared/utils/generateFileKey";
import { validateSchema } from "@/app/shared/services/collection/schema";
import { getProductIdsByKeys } from "@/app/shared/services/product/controller";

interface IForm {
  onClose: () => void;
  products?: IProduct[];
  collection?: ICollection | ICollection[];
  action: "create" | "update" | "delete" | "massiveDelete";
}

const Form = ({ onClose, products, collection, action }: IForm) => {
  const [isPending, setIsPending] = useState(false);
  const [file, setFile] = useState<File | null>(null);
  const [badResponse, setBadResponse] = useState<ICollectionState>(
    INITIAL_STATE_RESPONSE
  );

  const handleCreateCollection = async (formData: FormData) => {
    const dataToValidate = {
      name: formData.get("name"),
      link: formData.get("link"),
      imageUrl: formData.get("imageUrl"),
    };

    const errors = validateSchema("create", dataToValidate);

    if (Object.keys(errors).length !== 0) {
      return {
        errors,
        success: false,
      };
    }

    const products = formData.getAll("product") as string[];

    if (!products.length) {
      return {
        success: false,
        message: "No hay productos para agregar",
      };
    }

    if (products.some((productId) => productId === "")) {
      return {
        success: false,
        message: "Seleccione los productos válidos",
      };
    }

    const collectionExistsByName = await getCollectionByName({
      name: dataToValidate.name as string,
    });
    if (collectionExistsByName) {
      return {
        success: false,
        message: "La colección con ese nombre ya existe",
      };
    }

    const collectionExistsByLink = await getCollectionByLink({
      link: dataToValidate.link as string,
    });
    if (collectionExistsByLink) {
      return {
        success: false,
        message: "La colección con ese link ya existe",
      };
    }

    const productIds = await getProductIdsByKeys(products);

    if (productIds.length !== products.length) {
      return {
        success: false,
        message: "Algunos productos no se encontraron",
      };
    }

    const image = formData.get("imageUrl") as File;

    const fileKey = generateFileKey(image);

    const signedRes = await fetch("/api/aws-s3-signed-url", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        fileKey: `Collections/${fileKey}`,
        contentType: image.type,
      }),
    });

    const { signedUrl } = await signedRes.json();

    await fetch(signedUrl, {
      method: "PUT",
      body: image,
      headers: { "Content-Type": image.type },
    });

    const finalData = {
      productIds,
      imageKey: fileKey,
      name: dataToValidate.name as string,
      link: dataToValidate.link as string,
    };

    return await createCollection(finalData);
  };

  const handleUpdateCollection = async (id: string, formData: FormData) => {
    const dataToValidate = {
      name: formData.get("name"),
      link: formData.get("link"),
      imageUrl: formData.get("imageUrl"),
    };

    const errors = validateSchema("update", dataToValidate);

    if (Object.keys(errors).length !== 0) {
      return {
        errors,
        success: false,
      };
    }

    const collection = (await getCollectionById({ id })) as ICollection;
    if (!collection) {
      throw new Error("Collection not found");
    }

    const collections = (await getCollections({})) as ICollection[];

    const collectionsWithoutCurrent = collections.filter((c) => c.id !== id);

    const collectionExistsByName = collectionsWithoutCurrent.find(
      (c) => c.name === dataToValidate.name
    );
    if (collectionExistsByName) {
      return {
        success: false,
        message: "La colección con ese nombre ya existe",
      };
    }

    const collectionExistsByLink = collectionsWithoutCurrent.find(
      (c) => c.link === dataToValidate.link
    );
    if (collectionExistsByLink) {
      return {
        success: false,
        message: "La colección con ese link ya existe",
      };
    }

    const image = formData.get("imageUrl") as File;

    let fileKey = "";
    if (image.size > 0) {
      fileKey = generateFileKey(image);

      const signedRes = await fetch("/api/aws-s3-signed-url", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          fileKey: `Collections/${fileKey}`,
          contentType: image.type,
        }),
      });

      const { signedUrl } = await signedRes.json();

      await fetch(signedUrl, {
        method: "PUT",
        body: image,
        headers: { "Content-Type": image.type },
      });
    }

    const data = {
      name: dataToValidate.name as string,
      link: dataToValidate.link as string,
      imageKey: fileKey.length > 0 ? fileKey : null,
      prevCollectionImageUrl: fileKey.length > 0 ? collection.imageUrl : null,
    };

    return await updateCollection({
      id,
      data,
    });
  };

  const submitAction: React.FormEventHandler<HTMLFormElement> = async (
    event
  ) => {
    setIsPending(true);
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const res =
      action === "create"
        ? await handleCreateCollection(formData)
        : action === "update"
          ? await handleUpdateCollection(
              (collection as ICollection).id,
              formData
            )
          : action === "delete"
            ? await deleteCollection({ id: (collection as ICollection).id })
            : action === "massiveDelete" &&
              (await deleteMassiveCollections({
                ids: (collection as ICollection[]).map((c) => c.id),
              }));
    if (res && !res.success) {
      setBadResponse(res);
    } else {
      onClose();
    }
    setIsPending(false);
  };

  return (
    <div className="flex flex-col items-center gap-4 text-left">
      <div className="flex flex-col items-center gap-2">
        <h1 className="text-center text-xl md:text-4xl">
          {action === "create"
            ? "Creando"
            : action === "update"
              ? "Actualizando"
              : "Eliminando"}{" "}
          colección
        </h1>
        {badResponse.message && (
          <p className="text-center text-red-500">{badResponse.message}</p>
        )}
      </div>
      <form onSubmit={submitAction}>
        <fieldset disabled={isPending} className="flex flex-col gap-4 text-xl">
          {action === "create" || action === "update" ? (
            <>
              <GenericPairDiv>
                <GenericDiv>
                  <GenericInput
                    id="name"
                    type="text"
                    ariaLabel="Nombre de la colección"
                    placeholder="Juguetes de madera"
                    defaultValue={(collection as ICollection)?.name ?? ""}
                    error={badResponse.errors?.name}
                  />
                </GenericDiv>
                <GenericDiv>
                  <GenericInput
                    id="link"
                    type="text"
                    ariaLabel="Link de la colección"
                    placeholder="juguetes-de-madera"
                    defaultValue={(collection as ICollection)?.link ?? ""}
                    error={badResponse.errors?.link}
                  />
                </GenericDiv>
              </GenericPairDiv>
              <div>
                <p>Imagen de la colección</p>
                {action === "update" && (
                  <small className="text-gray-500 font-bold">
                    * Dejar en blanco si no se desea actualizar la imagen *
                  </small>
                )}
                <GenericInput
                  type="file"
                  file={file}
                  id="imageUrl"
                  fileAccept="image/webp"
                  ariaLabel="Imagen de la colección"
                  error={badResponse.errors?.imageUrl}
                  onChange={(event) => {
                    setFile(
                      (event.target as HTMLInputElement).files?.[0] ?? null
                    );
                  }}
                />
              </div>
              {action === "create" && (
                <DynamicItemManager
                  items={products ?? []}
                  renderForm={(index, items, onSelect) => (
                    <AutocompleteInput
                      key={index}
                      id="product"
                      ariaLabel="Producto"
                      customClassName="mt-2"
                      placeholder="Busca un producto..."
                      additionOnChange={(e) => onSelect(index, e.target.value)}
                      suggestions={items.map((i) => ({
                        value: i.key,
                        label: i.name,
                      }))}
                    />
                  )}
                />
              )}
            </>
          ) : (
            <>
              {action === "delete" ? (
                <div className="text-center">
                  <span className="text-2xl text-red-500">
                    ⚠️ Acción irreversible ⚠️
                  </span>
                  <p className="text-base md:text-xl">
                    ¿Estás seguro de querer eliminar la colección{' "'}
                    {(collection as ICollection).name}
                    {'"'}?
                  </p>
                </div>
              ) : (
                <div className="text-center">
                  <span className="text-2xl text-red-500">
                    ⚠️ Acción irreversible ⚠️
                  </span>
                  <p className="text-base md:text-xl">
                    ¿Estás seguro de querer eliminar las siguientes colecciones?
                  </p>
                  <ul>
                    {(collection as ICollection[]).map((c) => (
                      <li key={c.id}>{c.name}</li>
                    ))}
                  </ul>
                </div>
              )}
            </>
          )}
          <div className="text-center">
            <SubmitButton
              title={
                action === "create"
                  ? "Crear"
                  : action === "update"
                    ? "Actualizar"
                    : "Eliminar"
              }
              color="accent"
              pending={isPending}
            />
          </div>
        </fieldset>
      </form>
    </div>
  );
};

export default Form;

const GenericPairDiv = ({ children }: { children: ReactNode }) => {
  return (
    <div className="flex flex-col sm:flex-row gap-4 w-full">{children}</div>
  );
};

const GenericDiv = ({ children }: { children: ReactNode }) => {
  return (
    <div className="flex flex-col gap-2 w-full sm:w-1/2 justify-end">
      {children}
    </div>
  );
};
