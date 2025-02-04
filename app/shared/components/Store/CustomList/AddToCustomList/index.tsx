"use client";

import Form from "./Form";
import { Heart } from "@/app/shared/icons";
import { Modal, Toast } from "@/app/shared/components";
import { useModal, useResolvedTheme } from "@/app/shared/hooks";
import { deleteProductFromAllCustomLists } from "@/app/shared/services/customList/controller";
import type { IUser } from "@/app/shared/interfaces";

interface IAddToCustomList {
  lng: string;
  user: IUser | null;
  productId: string;
  isFavorite: boolean;
}

const AddToCustomList = ({
  lng,
  user,
  productId,
  isFavorite,
}: IAddToCustomList) => {
  const theme = useResolvedTheme();
  const { isOpen, onOpen, onClose } = useModal();

  const handleFavorite = async () => {
    if (user) {
      if (isFavorite) {
        await deleteProductFromAllCustomLists(productId);
        Toast({
          theme,
          type: "success",
          message:
            lng === "en"
              ? "Product removed from all lists"
              : "Producto eliminado de todas las listas",
        });
      } else {
        onOpen();
      }
    } else {
      window.location.href = `/${lng}/login`;
    }
  };

  return (
    <>
      <button aria-label="Custom List Button" onClick={handleFavorite}>
        {isFavorite ? (
          <Heart isFilled size="size-7 md:size-10" />
        ) : (
          <Heart size="size-7 md:size-10" />
        )}
      </button>
      <Modal isOpen={isOpen && user !== null} onClose={onClose}>
        {user && (
          <Form
            lng={lng}
            myLists={user.customLists}
            productId={productId}
            handleClose={onClose}
          />
        )}
      </Modal>
    </>
  );
};

export default AddToCustomList;
