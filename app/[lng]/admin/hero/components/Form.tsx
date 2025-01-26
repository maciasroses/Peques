import Image from "next/image";
import { ReactNode, useState } from "react";
import { INITIAL_STATE_RESPONSE } from "@/app/shared/constants";
import {
  createHero,
  deleteHero,
  updateHeroById,
  switchHeroVisibility,
} from "@/app/shared/services/hero/controller";
import { GenericInput, SubmitButton } from "@/app/shared/components";
import type { ICollection, IHero, IHeroState } from "@/app/shared/interfaces";

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

  const submitAction: React.FormEventHandler<HTMLFormElement> = async (
    event
  ) => {
    setIsPending(true);
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const res =
      action === "create"
        ? await createHero(formData)
        : action === "update"
          ? await updateHeroById({ id: hero!.id, formData: formData })
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
    <div className="flex flex-col items-center gap-4 text-left dark:text-white">
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
                </GenericDiv>
              </GenericPairDiv>
              {action === "create" && (
                <div>
                  <p>Imagen del Hero</p>
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
              )}
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
