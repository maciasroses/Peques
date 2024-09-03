"use client";

import clsx from "clsx";
import Form from "./Form";
import { Modal } from "@/components";
import useModal from "@/hooks/useModal";
import { PencilIcon, PlusCircle, TrashIcon } from "@/public/icons";
import type { IProvider } from "@/interfaces";

interface IAction {
  canDelete?: boolean;
  provider?: IProvider | IProvider[];
  action: "create" | "update" | "delete" | "massiveDelete";
}

const Action = ({ canDelete, provider, action }: IAction) => {
  const { isOpen, onOpen, onClose } = useModal();
  return (
    <>
      <button
        onClick={canDelete ? () => {} : onOpen}
        className={clsx(
          "bg-accent hover:bg-accent-dark focus:ring-accent text-white px-4 py-2 rounded-lg",
          canDelete && "opacity-50 cursor-not-allowed"
        )}
        title={`${
          action === "create"
            ? "Crear"
            : action === "update"
            ? "Editar"
            : "Eliminar"
        } proveedor`}
      >
        {action === "create" ? (
          <PlusCircle />
        ) : action === "update" ? (
          <PencilIcon />
        ) : (
          <TrashIcon />
        )}
      </button>
      <Modal isOpen={isOpen} onClose={onClose}>
        <Form onClose={onClose} action={action} provider={provider} />
      </Modal>
    </>
  );
};

export default Action;
