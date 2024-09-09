"use client";

import { ReactNode, useState } from "react";
import { INITIAL_STATE_RESPONSE } from "@/constants";
import { GenericInput, SubmitButton } from "@/components";
import {
  createProvider,
  updateProvider,
  deleteProvider,
  deleteMassiveProviders,
} from "@/services/provider/controller";
import type { ICreateNUpdateProviderState, IProvider } from "@/interfaces";

interface IForm {
  onClose: () => void;
  provider?: IProvider | IProvider[];
  action: "create" | "update" | "delete" | "massiveDelete";
}

const Form = ({ provider, action, onClose }: IForm) => {
  const [isPending, setIsPending] = useState(false);
  const [badResponse, setBadResponse] = useState<ICreateNUpdateProviderState>(
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
        ? await createProvider(formData)
        : action === "update"
        ? await updateProvider(formData, (provider as IProvider).id)
        : action === "delete"
        ? await deleteProvider((provider as IProvider).id)
        : await deleteMassiveProviders(
            (provider as IProvider[]).map((p) => p.id)
          );
    if (res && !res.success) {
      setBadResponse(res);
    } else {
      onClose();
      if (action === "massiveDelete") location.reload();
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
          proveedor
        </h1>
      </div>
      <form onSubmit={submitAction}>
        <fieldset disabled={isPending}>
          {action !== "delete" && action !== "massiveDelete" ? (
            <GenericPairDiv>
              <GenericDiv>
                <GenericInput
                  id="name"
                  type="text"
                  ariaLabel="Nombre"
                  placeholder="Juan Perez"
                  defaultValue={(provider as IProvider)?.name ?? ""}
                  error={badResponse.errors?.name}
                />
              </GenericDiv>
              <GenericDiv>
                <GenericInput
                  id="alias"
                  type="text"
                  ariaLabel="Alias"
                  placeholder="juanperez"
                  defaultValue={(provider as IProvider)?.alias ?? ""}
                  error={badResponse.errors?.alias}
                />
              </GenericDiv>
            </GenericPairDiv>
          ) : (
            <>
              {action === "delete" ? (
                <div className="text-center">
                  <span className="text-2xl text-center text-red-500">
                    ⚠️ Acción irreversible ⚠️
                  </span>
                  <h1 className="text-center text-base md:text-xl">
                    ¿Estás seguro que deseas eliminar al proveedor{' "'}
                    {(provider as IProvider).name}
                    {'"'}?
                  </h1>
                </div>
              ) : (
                <div className="text-center flex flex-col gap-2">
                  <span className="text-2xl text-center text-red-500">
                    ⚠️ Acción irreversible ⚠️
                  </span>
                  <h1 className="text-xl md:text-xl">
                    ¿Estás seguro que deseas eliminar a los proveedores
                    seleccionados?:
                  </h1>
                  <div className="max-h-[60px] overflow-y-auto">
                    <ul className="list-disc list-inside text-left">
                      {(provider as IProvider[]).map((p) => (
                        <li key={p.id}>{p.name}</li>
                      ))}
                    </ul>
                  </div>
                </div>
              )}
            </>
          )}
          <div className="text-center mt-4">
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
  return <div className="flex flex-col gap-2 w-full sm:w-1/2">{children}</div>;
};
