"use client";

import { useState } from "react";
import { cn } from "@/app/shared/utils/cn";
import { Modal } from "@/app/shared/components";
import { useAuth, useModal } from "@/app/shared/hooks";
import { INITIAL_STATE_RESPONSE } from "@/app/shared/constants";
import { deleteAccount } from "@/app/shared/services/user/controller";
import type { ISharedState } from "@/app/shared/interfaces";

const DeleteAccount = () => {
  const { setUser } = useAuth();
  const { isOpen, onClose, onOpen } = useModal();
  const [isPending, setIsPending] = useState(false);
  const [badResponse, setBadResponse] = useState<ISharedState>(
    INITIAL_STATE_RESPONSE
  );

  const submitAction: React.FormEventHandler<HTMLFormElement> = async (
    event
  ) => {
    setIsPending(true);
    event.preventDefault();
    const res = await deleteAccount();
    if (res && !res.success) {
      setBadResponse(res);
    } else {
      onClose();
      setUser(null);
    }
    setIsPending(false);
  };

  return (
    <>
      <Modal isOpen={isOpen} onClose={onClose}>
        <form onSubmit={submitAction}>
          {badResponse.message && (
            <p className="text-red-600">{badResponse.message}</p>
          )}
          <div className="mb-4">
            <h1 className="text-center text-2xl mb-2">
              ¿Estás seguro de que deseas borrar tu cuenta?
            </h1>
            <p className="text-center text-lg font-bold">
              Esta acción no se puede deshacer, lo que significa que perderás
              toda tu información y no podrás recuperarla, pedidos, direcciones,
              listas de deseos, etc.
            </p>
          </div>
          <div
            className={cn(
              isPending && "opacity-50",
              "flex justify-center gap-4"
            )}
          >
            <button
              onClick={onClose}
              disabled={isPending}
              className="link-button-primary"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={isPending}
              className="link-button-red"
            >
              Eliminar
            </button>
          </div>
        </form>
      </Modal>
      <button type="button" onClick={onOpen} className="link-button-red">
        Borrar cuenta
      </button>
    </>
  );
};

export default DeleteAccount;
