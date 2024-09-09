"use client";

import clsx from "clsx";
import React from "react";
import { Modal } from "@/components";
import useModal from "@/hooks/useModal";
import { PencilIcon, PlusCircle, TrashIcon } from "@/public/icons";

interface IAction {
  cannotDelete?: boolean;
  children: React.ReactElement<{
    onClose: () => void;
    action: IAction["action"];
  }>;
  action: "create" | "update" | "delete" | "massiveDelete";
}

const Action = ({ cannotDelete, children, action }: IAction) => {
  const { isOpen, onOpen, onClose } = useModal();

  const handleClick = () => {
    if (!cannotDelete) onOpen();
  };

  return (
    <>
      <button
        onClick={handleClick}
        className={clsx(
          "bg-accent hover:bg-accent-dark focus:ring-accent text-white px-4 py-2 rounded-lg border border-white",
          cannotDelete && "opacity-50 cursor-not-allowed"
        )}
        title={`${
          action === "create"
            ? "Crear"
            : action === "update"
            ? "Editar"
            : "Eliminar"
        }`}
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
        {React.cloneElement(children, {
          onClose,
          action,
        })}
      </Modal>
    </>
  );
};

export default Action;
