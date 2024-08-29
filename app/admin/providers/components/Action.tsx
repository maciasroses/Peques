"use client";

import Form from "./Form";
import { Modal } from "@/components";
import useModal from "@/hooks/useModal";
import { PencilIcon, PlusCircle, TrashIcon } from "@/public/icons";
import type { IProvider } from "@/interfaces";

interface IAction {
  provider?: IProvider | IProvider[];
  action: "create" | "update" | "delete" | "massiveDelete";
}

const Action = ({ provider, action }: IAction) => {
  const { isOpen, onOpen, onClose } = useModal();
  return (
    <>
      <button
        onClick={onOpen}
        className="bg-accent hover:bg-accent-dark focus:ring-accent text-white px-4 py-2 rounded-lg"
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
