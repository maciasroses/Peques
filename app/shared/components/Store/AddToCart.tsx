"use client";

import { cn } from "@/app/shared/utils/cn";
import { Toast } from "@/app/shared/components";
import { useCart, useResolvedTheme } from "@/app/shared/hooks";
import type { IProduct } from "@/app/shared/interfaces";
import { useState } from "react";

interface IAddToCart {
  price: number;
  product: IProduct;
  discount?: string | null;
  promotionId?: string | null;
  customRequest?: string | null;
}

const AddToCart = ({
  price,
  product,
  discount,
  promotionId,
  customRequest,
}: IAddToCart) => {
  const theme = useResolvedTheme();
  const { cart, addToCart } = useCart();
  const [quantity, setQuantity] = useState(1);

  const currentQuantityInCart =
    cart.find((item) => item.id === product.key)?.quantity ?? 0;

  const handleAddToCart = () => {
    if (quantity + currentQuantityInCart > product.availableQuantity) {
      Toast({
        theme,
        type: "error",
        message: "No hay suficiente stock disponible",
      });
      return;
    }

    addToCart({
      quantity,
      promotionId,
      customRequest,
      id: product.key,
      finalPrice: price,
      name: product.name,
      discount: discount,
      file:
        product.files[0]?.url ?? "/assets/images/landscape-placeholder.webp",
      price: product.salePriceMXN,
    });

    Toast({
      theme,
      type: "success",
      message: "Producto agregado al carrito",
    });

    // Resetea la cantidad al valor inicial (opcional)
    setQuantity(1);
  };

  const handleIncrement = () => {
    if (quantity + currentQuantityInCart < product.availableQuantity) {
      setQuantity((prev) => prev + 1);
    } else {
      Toast({
        theme,
        type: "warning",
        message: "No puedes agregar más productos, límite alcanzado",
      });
    }
  };

  const handleDecrement = () => {
    if (quantity > 1) {
      setQuantity((prev) => prev - 1);
    }
  };

  return (
    <div className="flex flex-col md:flex-row gap-4">
      <div className="flex items-center justify-between space-x-2 border border-gray-300 dark:border-gray-700 rounded-lg w-full md:w-1/3">
        <button
          disabled={quantity <= 1}
          onClick={handleDecrement}
          className={cn(
            "w-8 h-8 flex items-center justify-center text-2xl",
            quantity > 1
              ? "text-gray-700 dark:text-gray-200"
              : "text-gray-400 cursor-not-allowed"
          )}
        >
          -
        </button>
        <span className="font-medium text-lg">{quantity}</span>
        <button
          onClick={handleIncrement}
          disabled={
            quantity + currentQuantityInCart >= product.availableQuantity
          }
          className={cn(
            "w-8 h-8 flex items-center justify-center text-2xl",
            quantity + currentQuantityInCart < product.availableQuantity
              ? "text-gray-700 dark:text-gray-200"
              : "text-gray-400 cursor-not-allowed"
          )}
        >
          +
        </button>
      </div>
      <button
        onClick={product.availableQuantity > 0 ? handleAddToCart : () => {}}
        className={cn(
          "font-medium rounded-lg text-sm px-4 py-2 w-full md:w-2/3",
          product.availableQuantity > 0
            ? "bg-accent"
            : "text-gray-600 dark:text-gray-200 bg-gray-300 cursor-not-allowed dark:bg-gray-700"
        )}
      >
        {product.availableQuantity > 0
          ? "Agregar al carrito"
          : "Producto agotado"}
      </button>
    </div>
  );
};

export default AddToCart;
