"use client";

import Image from "next/image";
import { useState } from "react";
import { cn } from "@/app/shared/utils/cn";
import { useRouter } from "next/navigation";
import { useCart, useDisableScroll } from "@/app/shared/hooks";
import formatCurrency from "@/app/shared/utils/format-currency";
import {
  XMark,
  PlusCircle,
  MinusCircle,
  ShoppingBag,
} from "@/app/shared/icons";
import type { IProduct } from "@/app/shared/interfaces";

interface ICartMenu {
  lng: string;
  products: IProduct[];
}

const CartMenu = ({ lng, products }: ICartMenu) => {
  const { push } = useRouter();
  const [isOpen, setIsOpen] = useState(false);
  const { cart, addToCart, clearCart, removeFromCart } = useCart();

  useDisableScroll(isOpen);

  const toggleCart = () => {
    setIsOpen(!isOpen);
  };

  const handleCheckout = () => {
    toggleCart();
    push(`/${lng}/checkout`);
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
        <div className="h-full p-4 flex flex-col justify-between gap-4">
          <div className="h-5/6 flex flex-col gap-4">
            <div className="flex justify-between items-center gap-2">
              <h2 className="text-xl font-semibold">Carrito</h2>
              <button onClick={toggleCart} aria-label="Close Cart">
                <XMark />
              </button>
            </div>
            {cart.length === 0 ? (
              <p className="text-gray-500 dark:text-gray-200">
                Tu carrito está vacío
              </p>
            ) : (
              <ul className=" overflow-y-auto">
                {cart.map((item) => (
                  <li
                    key={item.id}
                    className="flex justify-between items-center py-2 gap-2"
                  >
                    <div className="w-1/3">
                      <Image
                        width={50}
                        height={50}
                        src={item.file}
                        alt={item.name}
                        className="rounded-lg size-auto"
                      />
                    </div>
                    <div className="w-2/3">
                      <div className="flex justify-end">
                        {(products.find((product) => product.key === item.id)
                          ?.availableQuantity ?? 0) > 0 &&
                          (products.find((product) => product.key === item.id)
                            ?.availableQuantity ?? 0) > item.quantity && (
                            <button
                              aria-label="Add one more"
                              className="text-green-600 dark:text-green-400 hover:text-green-700 dark:hover:text-green-500"
                              onClick={() =>
                                addToCart({
                                  ...item,
                                  quantity: 1,
                                })
                              }
                            >
                              <PlusCircle />
                            </button>
                          )}
                        {item.quantity > 1 && (
                          <button
                            aria-label="Remove one"
                            className="text-red-600 dark:text-red-400 hover:text-red-700 dark:hover:text-red-500"
                            onClick={() =>
                              addToCart({
                                ...item,
                                quantity: -1,
                              })
                            }
                          >
                            <MinusCircle />
                          </button>
                        )}
                      </div>
                      <p className="font-semibold">{item.name}</p>
                      {item.discount && (
                        <>
                          <p className="text-sm line-through text-gray-500 dark:text-gray-400">
                            {formatCurrency(item.price, "MXN")}
                          </p>
                          <p className="text-sm text-green-600 dark:text-green-400">
                            {item.discount}
                          </p>
                        </>
                      )}
                      <p className="text-sm text-gray-800 dark:text-gray-200">
                        {item.quantity} x{" "}
                        {formatCurrency(item.finalPrice, "MXN")}
                      </p>
                      {item.customRequest && (
                        <>
                          <p className="font-semibold">
                            Producto personalizado
                          </p>
                          <div className="flex flex-col gap-0">
                            <p className="inline-flex gap-2">
                              Nombre:
                              <span>{JSON.parse(item.customRequest).name}</span>
                            </p>
                            <p className="inline-flex gap-2">
                              Fuente:
                              <span>{JSON.parse(item.customRequest).font}</span>
                            </p>
                            <div className="inline-flex gap-2">
                              Color:
                              <div
                                style={{
                                  backgroundColor: JSON.parse(
                                    item.customRequest
                                  ).color,
                                  width: "20px",
                                  height: "20px",
                                  borderRadius: "100%",
                                }}
                              />
                            </div>
                          </div>
                        </>
                      )}
                      <button
                        className="text-red-600 dark:text-red-400 hover:text-red-700 dark:hover:text-red-500"
                        onClick={() => removeFromCart(item.id)}
                      >
                        Borrar
                      </button>
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </div>
          {cart.length > 0 && (
            <div className="h-1/6 flex flex-col justify-end gap-2">
              <p className="text-right">
                Subtotal:{" "}
                <span className="font-bold">
                  {formatCurrency(
                    cart.reduce(
                      (acc, item) => acc + item.finalPrice * item.quantity,
                      0
                    ),
                    "MXN"
                  )}
                </span>
              </p>
              <button onClick={handleCheckout} className="link-button-primary">
                Ir a pagar
              </button>
              <button className="link-button-red" onClick={clearCart}>
                Vaciar carrito
              </button>
            </div>
          )}
        </div>
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
