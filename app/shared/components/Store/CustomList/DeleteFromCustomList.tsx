"use client";

import { useState } from "react";
import { TrashIcon } from "@/app/shared/icons";
import { useResolvedTheme } from "@/app/shared/hooks";
import { Modal, Toast } from "@/app/shared/components";
import { deleteProductFromCustomList } from "@/app/shared/services/customList/controller";
import type { IProduct } from "@/app/shared/interfaces";

interface IDeleteFromCustomList {
  lng: string;
  product: IProduct;
  customListId: string;
}

const DeleteFromCustomList = ({
  lng,
  product,
  customListId,
}: IDeleteFromCustomList) => {
  const theme = useResolvedTheme();
  const [isOpen, setIsOpen] = useState(false);

  const handleConfirm = async () => {
    const res = await deleteProductFromCustomList(customListId, product.id);

    if (res && res.success) {
      Toast({
        theme,
        type: "success",
        message:
          lng === "en"
            ? "Product removed successfully"
            : "Producto eliminado con éxito",
      });
    } else {
      Toast({
        theme,
        type: "error",
        message: lng === "en" ? "Something went wrong" : "Algo salió mal",
      });
    }
    handleClose();
  };

  const handleClose = () => {
    setIsOpen(false);
  };

  return (
    <>
      <button
        type="button"
        aria-label="Delete product"
        onClick={() => setIsOpen(true)}
        className="text-red-600 dark:text-red-300 hover:text-red-700 dark:hover:text-red-400"
      >
        <TrashIcon />
      </button>
      <Modal isOpen={isOpen} onClose={handleClose}>
        <div className="flex flex-col gap-4">
          <h1 className="text-xl md:text-4xl">
            {lng === "en" ? "Delete product" : "Eliminar producto"}
          </h1>
          <div className="text-center">
            <p className="text-2xl">
              ¿Estás seguro de que quieres eliminar el producto{" "}
              <span className="font-semibold">{product.name}</span> de la lista?
            </p>
            <button
              type="button"
              onClick={handleConfirm}
              className="mt-4 px-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-offset-2 text-white dark:tex-red-300 bg-red-600 dark:bg-red-950 hover:bg-red-700 dark:hover:bg-red-900 focus:ring-red-600 dark:focus:ring-red-300 border border-red-600 hover:border-red-700 dark:border-red-300"
            >
              {lng === "en" ? "Delete" : "Eliminar"}
            </button>
          </div>
        </div>
      </Modal>
    </>
  );
};

export default DeleteFromCustomList;
