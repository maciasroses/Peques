"use client";

import { cn } from "@/app/shared/utils/cn";
import { Toast } from "@/app/shared/components";
import { useCart, useResolvedTheme } from "@/app/shared/hooks";
import type { IProduct } from "@/app/shared/interfaces";

interface IAddToCart {
  // lng: string;
  product: IProduct;
}

const AddToCart = ({ product }: IAddToCart) => {
  const theme = useResolvedTheme();
  const { addToCart } = useCart();

  const handleAddToCart = () => {
    addToCart({
      quantity: 1,
      id: product.key,
      name: product.name,
      file: product.files[0].url,
      price: product.salePriceMXN,
    });
    Toast({
      theme,
      type: "success",
      message: "Producto agregado al carrito",
    });
  };

  return (
    <button
      onClick={product.availableQuantity > 0 ? handleAddToCart : () => {}}
      className={cn(
        "font-medium rounded-lg text-sm",
        product.availableQuantity > 0
          ? "link-button-blue"
          : "px-4 py-2 text-gray-600 dark:text-gray-200 bg-gray-300 cursor-not-allowed  dark:bg-gray-700"
      )}
    >
      {product.availableQuantity > 0
        ? "Agregar al carrito"
        : "Producto agotado"}
    </button>
  );
};

export default AddToCart;
