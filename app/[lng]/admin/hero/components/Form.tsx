import Image from "next/image";
import { ReactNode, useState } from "react";
import { INITIAL_STATE_RESPONSE } from "@/app/shared/constants";
import {
  createHero,
  deleteHero,
  updateHeroById,
  switchHeroVisibility,
  getHeroById,
} from "@/app/shared/services/hero/controller";
import { generateFileKey } from "@/app/shared/utils/generateFileKey";
import { GenericInput, SubmitButton } from "@/app/shared/components";
import type { ICollection, IHero, IHeroState } from "@/app/shared/interfaces";
import { validateSchema } from "@/app/shared/services/hero/schema";

interface IForm {
  hero: IHero | null;
  onClose: () => void;
  collections: ICollection[];
  action: "create" | "update" | "delete" | "activate" | "deactivate";
}

const Form = ({ hero, onClose, collections, action }: IForm) => {
  const [isPending, setIsPending] = useState(false);
  const [file, setFile] = useState<File | null>(null);
  const [badResponse, setBadResponse] = useState<IHeroState>(
    INITIAL_STATE_RESPONSE
  );

  const handleCreateHero = async (formData: FormData) => {
    const dataToValidate = {
      title: formData.get("title"),
      subtitle: formData.get("subtitle"),
      imageUrl: formData.get("imageUrl"),
      buttonLink: formData.get("buttonLink"),
      description: formData.get("description"),
      collectionId: formData.get("collectionId"),
    };

    const errors = validateSchema("create", dataToValidate);

    if (Object.keys(errors).length !== 0) {
      return {
        errors,
        success: false,
      };
    }

    const image = formData.get("imageUrl") as File;
    const fileKey = generateFileKey(image);

    const signedRes = await fetch("/api/aws-s3-signed-url", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        fileKey: `Heroes/${fileKey}`,
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
      imageKey: fileKey,
      collectionId: dataToValidate.collectionId as string,
      title: dataToValidate.title ? (dataToValidate.title as string) : null,
      subtitle: dataToValidate.subtitle
        ? (dataToValidate.subtitle as string)
        : null,
      buttonLink: dataToValidate.buttonLink
        ? (dataToValidate.buttonLink as string)
        : null,
      description: dataToValidate.description
        ? (dataToValidate.description as string)
        : null,
    };

    return await createHero(finalData);
  };

  const handleUploadHero = async (id: string, formData: FormData) => {
    const dataToValidate = {
      title: formData.get("title"),
      imageUrl: formData.get("imageUrl"),
      subtitle: formData.get("subtitle"),
      buttonLink: formData.get("buttonLink"),
      description: formData.get("description"),
      collectionId: formData.get("collectionId"),
    };

    const errors = validateSchema("update", dataToValidate);

    if (Object.keys(errors).length !== 0) {
      return {
        errors,
        success: false,
      };
    }

    const prevHero = (await getHeroById({ id })) as IHero;

    if (!prevHero) {
      throw new Error("Hero not found");
    }

    const image = formData.get("imageUrl") as File;

    let fileKey = "";
    if (image.size > 0) {
      fileKey = generateFileKey(image);

      const signedRes = await fetch("/api/aws-s3-signed-url", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          fileKey: `Heroes/${fileKey}`,
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
      imageKey: fileKey.length > 0 ? fileKey : null,
      prevHeroImageUrl: fileKey.length > 0 ? prevHero.imageUrl : null,
      collectionId: dataToValidate.collectionId as string,
      title: dataToValidate.title ? (dataToValidate.title as string) : null,
      subtitle: dataToValidate.subtitle
        ? (dataToValidate.subtitle as string)
        : null,
      buttonLink: dataToValidate.buttonLink
        ? (dataToValidate.buttonLink as string)
        : null,
      description: dataToValidate.description
        ? (dataToValidate.description as string)
        : null,
    };

    return await updateHeroById({ id, data });
  };

  const submitAction: React.FormEventHandler<HTMLFormElement> = async (
    event
  ) => {
    setIsPending(true);
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const res =
      action === "create"
        ? await handleCreateHero(formData)
        : action === "update"
          ? await handleUploadHero(hero!.id, formData)
          : action === "activate" || action === "deactivate"
            ? await switchHeroVisibility({
                id: hero!.id,
              })
            : action === "delete" && (await deleteHero({ id: hero!.id }));
    if (res && !res.success) {
      setBadResponse(res);
    } else {
      onClose();
    }
    setIsPending(false);
  };

  const filteredCollections = collections.filter(
    (collection) => collection.hero === null
  );

  if (action === "update" && hero) {
    filteredCollections.push(hero.collection);
  }

  return (
    <div className="flex flex-col items-center gap-4 text-left">
      <div className="flex flex-col items-center gap-2">
        <h1 className="text-center text-xl md:text-4xl">
          {action === "create"
            ? "Creando"
            : action === "update"
              ? "Actualizando"
              : action === "delete"
                ? "Eliminando"
                : action === "activate"
                  ? "Activando"
                  : "Desactivando"}{" "}
          Hero
        </h1>
      </div>
      <form onSubmit={submitAction}>
        <fieldset disabled={isPending} className="flex flex-col gap-4 text-xl">
          {action === "create" || action === "update" ? (
            <>
              <GenericPairDiv>
                <GenericDiv>
                  <GenericInput
                    id="title"
                    type="text"
                    ariaLabel="Título del Hero"
                    defaultValue={hero?.title ?? ""}
                    error={badResponse.errors?.title}
                    placeholder="Encuentra todo para la"
                  />
                </GenericDiv>
                <GenericDiv>
                  <GenericInput
                    id="subtitle"
                    type="text"
                    ariaLabel="Subtítulo del Hero"
                    defaultValue={hero?.subtitle ?? ""}
                    error={badResponse.errors?.subtitle}
                    placeholder="ALIMENTACIÓN COMPLEMENTARIA"
                  />
                </GenericDiv>
              </GenericPairDiv>
              <GenericPairDiv>
                <GenericDiv>
                  <GenericInput
                    id="description"
                    type="text"
                    ariaLabel="Descripción del Hero"
                    defaultValue={hero?.description ?? ""}
                    error={badResponse.errors?.description}
                    placeholder="10% de descuento al agregar 5 productos o más de alimentación complementaria con el código “ALIMENTACION10”"
                  />
                </GenericDiv>
                <GenericDiv>
                  <GenericInput
                    type="text"
                    id="buttonLink"
                    placeholder="Let's go"
                    ariaLabel="Texto del botón"
                    defaultValue={hero?.buttonLink ?? ""}
                    error={badResponse.errors?.buttonLink}
                  />
                </GenericDiv>
              </GenericPairDiv>
              <div>
                <GenericInput
                  type="select"
                  id="collectionId"
                  ariaLabel="Colección"
                  placeholder="Selecciona una colección"
                  defaultValue={hero?.collectionId ?? ""}
                  error={badResponse.errors?.collectionId}
                  options={filteredCollections.map((collection) => ({
                    value: collection.id,
                    label: collection.name,
                  }))}
                />
              </div>
              <div>
                <p>Imagen del Hero</p>
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
                  ariaLabel="Imagen del Hero"
                  error={badResponse.errors?.imageUrl}
                  onChange={(event) => {
                    setFile(
                      (event.target as HTMLInputElement).files?.[0] ?? null
                    );
                  }}
                />
              </div>
            </>
          ) : (
            <>
              <p className="text-2xl text-center font-bold">
                {action === "delete"
                  ? "¿Estás seguro que deseas eliminar al siguiente Hero?"
                  : `¿Estás seguro que deseas ${
                      action === "activate" ? "activar" : "desactivar"
                    } al siguiente Hero?`}
              </p>
              <div className="w-full h-[200px] relative rounded-md text-center">
                <Image
                  fill
                  sizes="200px"
                  alt={hero?.title ?? ""}
                  src={hero?.imageUrl ?? ""}
                  className="object-contain size-full"
                />
              </div>
            </>
          )}
          <div className="text-center">
            <SubmitButton
              title={
                action === "create"
                  ? "Crear"
                  : action === "update"
                    ? "Actualizar"
                    : action === "delete"
                      ? "Eliminar"
                      : action === "activate"
                        ? "Activar"
                        : "Desactivar"
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
