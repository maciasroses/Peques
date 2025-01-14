"use client";

import { useState } from "react";

import { cn } from "@/app/shared/utils/cn";
import { INITIAL_STATE_RESPONSE } from "@/app/shared/constants";
import { useModal, useResolvedTheme } from "@/app/shared/hooks";
import { updateExistingCustomList } from "@/app/shared/services/customList/controller";
import {
  Toast,
  Modal,
  GenericInput,
  SubmitButton,
} from "@/app/shared/components";
import type { ICustomListState } from "@/app/shared/interfaces";

interface IEdit {
  lng: string;
  customList: {
    id: string;
    name: string;
    description: string | null;
  };
  handleClose: () => void;
}

const Edit = ({ lng, customList, handleClose }: IEdit) => {
  const theme = useResolvedTheme();
  const { isOpen, onOpen } = useModal();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [badResponse, setBadResponse] = useState<ICustomListState>(
    INITIAL_STATE_RESPONSE
  );

  const submitAction: React.FormEventHandler<HTMLFormElement> = async (
    event
  ) => {
    setIsSubmitting(true);
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const res = await updateExistingCustomList(formData);
    if (res && !res.success) {
      setBadResponse(res);
    } else {
      Toast({
        theme,
        type: "success",
        message:
          lng === "en"
            ? "List updated successfully"
            : "Lista actualizada con éxito",
      });
      handleClose();
    }
    setIsSubmitting(false);
  };

  return (
    <>
      <button
        className="block w-full p-2 hover:bg-gray-100 dark:hover:bg-gray-800"
        onClick={onOpen}
      >
        {lng === "en" ? "Edit" : "Editar"}
      </button>
      <Modal isOpen={isOpen} onClose={handleClose}>
        <div className="flex flex-col gap-4">
          <div className="flex flex-col gap-2">
            <h1 className="text-xl md:text-4xl">
              {lng === "en" ? "Edit list" : "Editar lista"}
            </h1>
            {badResponse.message && (
              <p className="text-red-600 dark:text-red-300">
                {badResponse.message}
              </p>
            )}
          </div>
          <form onSubmit={submitAction} className="px-4">
            <fieldset
              disabled={isSubmitting}
              className={cn(isSubmitting && "opacity-50")}
            >
              <div className="flex flex-col gap-2">
                <GenericInput
                  id="name"
                  ariaLabel="Nombre de la lista"
                  type="text"
                  placeholder="Mi lista"
                  error={badResponse.errors?.name}
                  defaultValue={customList.name}
                  autoComplete="off"
                />
                <GenericInput
                  id="description"
                  ariaLabel="Descripción de la lista"
                  type="text"
                  placeholder="Descripción"
                  autoComplete="off"
                  defaultValue={customList.description ?? ""}
                />
              </div>
              <input hidden name="id" defaultValue={customList.id} />
              <div className="text-center mt-4 w-full">
                <SubmitButton
                  pending={isSubmitting}
                  title={lng === "en" ? "Update" : "Actualizar"}
                />
              </div>
            </fieldset>
          </form>
        </div>
      </Modal>
    </>
  );
};

export default Edit;
