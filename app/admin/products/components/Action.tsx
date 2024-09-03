"use client";

import Form from "./Form";
import { Modal } from "@/components";
import useModal from "@/hooks/useModal";
import { PencilIcon, PlusCircle, TrashIcon } from "@/public/icons";
import type { IProduct, IProvider } from "@/interfaces";

interface IAction {
  providers?: IProvider[];
  product?: IProduct | IProduct[];
  action: "create" | "update" | "delete" | "massiveDelete";
}

const Action = ({ providers, product, action }: IAction) => {
  const { isOpen, onOpen, onClose } = useModal();
  return (
    <>
      <button
        onClick={onOpen}
        className="bg-accent hover:bg-accent-dark focus:ring-accent text-white px-4 py-2 rounded-lg"
        title={`${
          action === "create"
            ? "Crear"
            : action === "update"
            ? "Editar"
            : "Eliminar"
        } producto`}
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
        <Form
          onClose={onClose}
          action={action}
          product={product}
          providers={providers}
        />
      </Modal>
    </>
  );
};

export default Action;
