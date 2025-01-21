"use client";

import { cn } from "@/app/shared/utils/cn";
import { Toast } from "@/app/shared/components";
import { useCart, useResolvedTheme } from "@/app/shared/hooks";
import type { IProduct } from "@/app/shared/interfaces";

interface IAddToCart {
  price: number;
  product: IProduct;
  discount?: string | null;
  promotionId?: string | null;
}

const AddToCart = ({ price, product, discount, promotionId }: IAddToCart) => {
  const theme = useResolvedTheme();
  const { cart, addToCart } = useCart();

  const handleAddToCart = () => {
    addToCart({
      quantity: 1,
      promotionId,
      id: product.key,
      finalPrice: price,
      name: product.name,
      discount: discount,
      file: product.files[0].url,
      price: product.salePriceMXN,
    });
    Toast({
      theme,
      type: "success",
      message: "Producto agregado al carrito",
    });
  };

  const currentQuantityProduct =
    cart.find((item) => item.id === product.key)?.quantity ?? 0;

  return (
    <button
      onClick={
        currentQuantityProduct < product.availableQuantity &&
        product.availableQuantity > 0
          ? handleAddToCart
          : () => {}
      }
      className={cn(
        "font-medium rounded-lg text-sm",
        currentQuantityProduct < product.availableQuantity &&
          product.availableQuantity > 0
          ? "link-button-primary"
          : "px-4 py-2 text-gray-600 dark:text-gray-200 bg-gray-300 cursor-not-allowed  dark:bg-gray-700"
      )}
    >
      {currentQuantityProduct < product.availableQuantity &&
      product.availableQuantity > 0
        ? "Agregar al carrito"
        : "Producto agotado"}
    </button>
  );
};

export default AddToCart;
