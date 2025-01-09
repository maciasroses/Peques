"use client";

import { useState } from "react";
import { cn } from "@/app/shared/utils/cn";
import { useRouter } from "next/navigation";
import { useCart, useDisableScroll } from "@/app/shared/hooks";
import { ShoppingBag, XMark } from "@/app/shared/icons";

interface ICartMenu {
  lng: string;
  // products: IProduct[];
}

const CartMenu = ({ lng }: ICartMenu) => {
  const { push } = useRouter();
  const [isOpen, setIsOpen] = useState(false);
  const { cart, addToCart, clearCart, removeFromCart } = useCart();

  useDisableScroll(isOpen);

  const toggleCart = () => {
    setIsOpen(!isOpen);
  };

  return (
    <>
      <button
        aria-label="Cart"
        onClick={toggleCart}
        className={cn("relative", cart.length > 0 && "mr-2")}
      >
        {cart.length > 0 && (
          <span className="absolute -top-2 -end-2 bg-red-500 text-white text-xs rounded-full px-1">
            {cart.reduce((acc, item) => acc + item.quantity, 0)}
          </span>
        )}
        <ShoppingBag strokeWidth={1} />
      </button>
      <div
        className={cn(
          "bg-white dark:bg-gray-800 fixed top-0 right-0 h-screen w-64 shadow-lg transform transition-transform z-40",
          isOpen ? "translate-x-0" : "translate-x-full"
        )}
      >
        <button
          onClick={toggleCart}
          aria-label="Close Cart"
          className="absolute top-0 right-0 m-4"
        >
          <XMark />
        </button>
      </div>
      {isOpen && (
        <div
          className="fixed inset-0 bg-black opacity-50 z-30 h-screen"
          onClick={toggleCart}
        ></div>
      )}
    </>
  );
};

export default CartMenu;
