"use client";

import { useState } from "react";
import { cn } from "@/app/shared/utils/cn";
import { useModal, useResolvedTheme } from "@/app/shared/hooks";
import { Toast, Modal, SubmitButton } from "@/app/shared/components";
import { deleteExistingCustomList } from "@/app/shared/services/customList/controller";

interface IDelete {
  lng: string;
  customList: {
    id: string;
    name: string;
    description: string | null;
  };
  handleClose: () => void;
}

const Delete = ({ lng, customList, handleClose }: IDelete) => {
  const theme = useResolvedTheme();
  const { isOpen, onOpen } = useModal();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    setIsSubmitting(true);
    e.preventDefault();
    const res = await deleteExistingCustomList(customList.id);
    if (res && res.success) {
      Toast({
        theme,
        type: "success",
        message:
          lng === "en"
            ? "List deleted successfully"
            : "Lista eliminada con éxito",
      });
    } else {
      Toast({
        theme,
        type: "error",
        message: lng === "en" ? "Something went wrong" : "Algo salió mal",
      });
    }
    handleClose();
    setIsSubmitting(false);
  };

  return (
    <>
      <button
        className="block w-full p-2 hover:bg-gray-100 dark:hover:bg-gray-800"
        onClick={onOpen}
      >
        {lng === "en" ? "Delete" : "Eliminar"}
      </button>
      <Modal isOpen={isOpen} onClose={handleClose}>
        <div className="flex flex-col gap-4">
          <div className="flex flex-col gap-2">
            <h1 className="text-xl md:text-4xl">
              {lng === "en" ? "Delete list" : "Eliminar lista"}
            </h1>
          </div>
          <form onSubmit={handleSubmit} className="px-4">
            <fieldset
              disabled={isSubmitting}
              className={cn("text-center", isSubmitting && "opacity-50")}
            >
              <h2 className="text-red-600 dark:text-red-300 text-xl">
                ⚠️ Esta acción no se puede deshacer ⚠️
              </h2>
              <p className="text-2xl">
                {lng === "en"
                  ? "Are you sure you want to delete the list"
                  : "¿Estás seguro de que quieres eliminar la lista"}{" "}
                <span className="font-bold">{customList.name}</span>?
              </p>
              <div className="text-center mt-4 w-full">
                <SubmitButton
                  color="red"
                  pending={isSubmitting}
                  title={lng === "en" ? "Delete" : "Eliminar"}
                />
              </div>
            </fieldset>
          </form>
        </div>
      </Modal>
    </>
  );
};

export default Delete;
