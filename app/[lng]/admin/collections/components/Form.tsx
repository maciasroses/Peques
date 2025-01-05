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
} from "@/app/shared/services/collection/controller";
import type {
  IProduct,
  ICollection,
  ICollectionState,
} from "@/app/shared/interfaces";

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

  const submitAction: React.FormEventHandler<HTMLFormElement> = async (
    event
  ) => {
    setIsPending(true);
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const res =
      action === "create"
        ? await createCollection(formData)
        : action === "update"
          ? await updateCollection({
              id: (collection as ICollection).id,
              formData,
            })
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
    <div className="flex flex-col items-center gap-4 text-left dark:text-white">
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
