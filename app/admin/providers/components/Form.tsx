"use client";

import { useState } from "react";
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
            <GenericInput
              id="name"
              type="text"
              ariaLabel="Nombre"
              placeholder="Juan Perez"
              defaultValue={(provider as IProvider)?.name ?? ""}
              error={badResponse.errors?.name}
            />
          ) : (
            <>
              {action === "delete" ? (
                <h1 className="text-center text-xl md:text-4xl">
                  ¿Estás seguro que deseas eliminar al proveedor "
                  {(provider as IProvider).name}"?
                </h1>
              ) : (
                <div className="text-center flex flex-col gap-2">
                  <h1 className="text-xl md:text-4xl">
                    ¿Estás seguro que deseas eliminar a los proveedores
                    seleccionados?:
                  </h1>
                  <div className="flex flex-col max-h-[60px] overflow-y-auto">
                    {(provider as IProvider[]).map((p) => (
                      <span key={p.id}>{p.name}</span>
                    ))}
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
              color="primary"
              pending={isPending}
            />
          </div>
        </fieldset>
      </form>
    </div>
  );
};

export default Form;
