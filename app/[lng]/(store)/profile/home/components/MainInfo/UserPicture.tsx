"use client";

import Image from "next/image";
import React, { useState } from "react";
import { cn } from "@/app/shared/utils/cn";
import { GenericInput, Modal, Toast } from "@/app/shared/components";
import { PencilIcon, TrashIcon } from "@/app/shared/icons";
import { useModal, useResolvedTheme } from "@/app/shared/hooks";
import {
  removeProfilePicture,
  updateProfilePicture,
} from "@/app/shared/services/user/controller";

interface IUserPicture {
  image: string;
  onParentClose: () => void;
}

const UserPicture = ({ image, onParentClose }: IUserPicture) => {
  const theme = useResolvedTheme();
  const { isOpen, onClose, onOpen } = useModal();
  const [isPending, setIsPending] = useState(false);
  const [action, setAction] = useState<"edit" | "delete">("edit");
  const [imageUpload, setImageUpload] = useState<File | null>(null);

  const handleDeleteProfilePicture = async () => {
    setIsPending(true);
    const res = await removeProfilePicture();
    Toast({
      theme,
      type: res.success ? "success" : "error",
      message: res.message,
    });
    if (res && res.success) {
      onClose();
      onParentClose();
    }
    setIsPending(false);
  };

  const submitAction: React.FormEventHandler<HTMLFormElement> = async (
    event
  ) => {
    setIsPending(true);
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    formData.append("image", imageUpload as File);
    const res = await updateProfilePicture(formData);
    Toast({
      theme,
      type: res.success ? "success" : "error",
      message: res.message,
    });
    if (res && res.success) {
      onClose();
      onParentClose();
    }
    setIsPending(false);
  };

  return (
    <>
      <Modal isOpen={isOpen} onClose={onClose}>
        <>
          {action === "edit" ? (
            <form onSubmit={submitAction}>
              <div className="flex flex-col gap-2">
                <h1 className="text-center text-xl">Sube tu foto de perfil</h1>
                {imageUpload ? (
                  <div className="flex justify-center">
                    <Image
                      src={URL.createObjectURL(imageUpload)}
                      width={80}
                      height={80}
                      alt="User Profile"
                      className="inline-block size-40"
                    />
                  </div>
                ) : (
                  <GenericInput
                    id="image"
                    ariaLabel="Subir foto de perfil"
                    type="file"
                    fileAccept="image/*"
                    onChange={(event) =>
                      setImageUpload(
                        (event.target as HTMLInputElement).files?.[0] || null
                      )
                    }
                  />
                )}
                <div
                  className={cn(
                    isPending && "opacity-50",
                    "flex flex-col md:flex-row justify-center gap-4"
                  )}
                >
                  <button
                    type="submit"
                    disabled={isPending || !imageUpload}
                    className={cn(
                      !imageUpload
                        ? "cursor-not-allowed px-4 py-2 border border-black rounded-md"
                        : "link-button-primary"
                    )}
                  >
                    Subir
                  </button>
                  {imageUpload && (
                    <button
                      onClick={() => setImageUpload(null)}
                      disabled={isPending}
                      className="link-button-blue"
                    >
                      Seleccionar otra
                    </button>
                  )}
                  <button
                    type="button"
                    onClick={() => {
                      setImageUpload(null);
                      onClose();
                    }}
                    disabled={isPending}
                    className="link-button-primary"
                  >
                    Cancelar
                  </button>
                </div>
              </div>
            </form>
          ) : (
            <div className="flex flex-col gap-2">
              <h1 className="text-center text-xl">
                ¿Estás seguro de eliminar tu foto de perfil?
              </h1>
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
                  disabled={isPending}
                  className="link-button-red"
                  onClick={() => handleDeleteProfilePicture()}
                >
                  Eliminar
                </button>
              </div>
            </div>
          )}
        </>
      </Modal>
      <div className="flex flex-col items-center gap-4">
        <h1 className="text-2xl">Editando foto</h1>
        <div>
          <Image
            src={image}
            width={80}
            height={80}
            alt="User Profile"
            className="inline-block size-40"
          />
        </div>
        <div className="flex gap-4">
          <button
            onClick={() => {
              setAction("edit");
              onOpen();
            }}
            className="text-blue-600 dark:text-blue-400"
          >
            <PencilIcon />
          </button>
          <button
            disabled={image === "/assets/images/profilepic.webp"}
            onClick={() => {
              setAction("delete");
              onOpen();
            }}
            className={cn(
              "text-red-600 dark:text-red-400",
              image === "/assets/images/profilepic.webp" &&
                "cursor-not-allowed opacity-50"
            )}
          >
            <TrashIcon />
          </button>
        </div>
      </div>
    </>
  );
};

export default UserPicture;
