"use client";

import Link from "next/link";
import Image from "next/image";
import { useState } from "react";
import { TrashIcon } from "@/app/shared/icons";
import { useResolvedTheme } from "@/app/shared/hooks";
import formatCurrency from "@/app/shared/utils/format-currency";
import { AddToCart, Modal, Toast } from "@/app/shared/components";
import { deleteProductFromCustomList } from "@/app/shared/services/customList/controller";
import type { IProduct } from "@/app/shared/interfaces";

interface IProductCard {
  lng: string;
  product: IProduct;
  customListId: string;
}

const ProductCard = ({ lng, product, customListId }: IProductCard) => {
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
      <div className="w-full bg-white border border-gray-200 rounded-lg shadow dark:bg-gray-800 dark:border-gray-700">
        <Link
          href={`/${lng}/${product.key}`}
          className="flex justify-center p-8"
        >
          <Image
            className="size-auto"
            alt={product.name}
            src={product.files[0].url}
            width={500}
            height={300}
          />
        </Link>
        <div className="flex flex-col gap-2 px-5 pb-5 relative">
          <div className="absolute top-0 right-5">
            <button
              type="button"
              onClick={() => setIsOpen(true)}
              className="text-red-600 dark:text-red-300 hover:text-red-700 dark:hover:text-red-400"
            >
              <TrashIcon />
            </button>
          </div>
          <Link href={`/${lng}/${product.key}`}>
            <h1 className="text-xl font-semibold tracking-tight text-gray-900 dark:text-white">
              {product.name}
            </h1>
            <span className="text-3xl font-bold text-gray-900 dark:text-white">
              {formatCurrency(product.salePriceMXN, "MXN")}
            </span>
          </Link>
          <AddToCart product={product} />
        </div>
      </div>
    </>
  );
};

export default ProductCard;
