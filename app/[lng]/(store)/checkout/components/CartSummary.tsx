"use client";

import Image from "next/image";
import { cn } from "@/app/shared/utils/cn";
import formatCurrency from "@/app/shared/utils/format-currency";
import type { ICartItemForFrontend } from "@/app/shared/interfaces";
import { GenericInput, SubmitButton } from "@/app/shared/components";

interface ICartSummary {
  lng: string;
  finished: boolean;
  shippingCost: number;
  cart: ICartItemForFrontend[];
}

const CartSummary = ({ lng, cart, finished, shippingCost }: ICartSummary) => {
  return (
    <div className={cn("w-full md:w-2/3", finished && "opacity-50")}>
      <h1 className="text-2xl font-bold">
        {lng === "en" ? "Order Summary" : "Resumen del pedido"}
      </h1>
      <ul className="flex flex-col gap-4 mt-4">
        {cart.map((item) => (
          <li
            key={item.id}
            className="flex items-center justify-between gap-2 border-b-2 border-b-gray-200 dark:border-b-gray-700 p-2"
          >
            <div className="flex items-center gap-2">
              <div className="size-24">
                <Image
                  src={item.file}
                  alt={item.name}
                  width={500}
                  height={300}
                  className="size-full object-contain rounded-lg"
                />
              </div>
              <p className="text-base sm:text-xl">{item.name}</p>
            </div>
            <div className="flex flex-col items-end gap-2">
              {item.discount && (
                <>
                  <p className="text-sm line-through text-gray-500 dark:text-gray-400">
                    {formatCurrency(item.price, "MXN")}
                  </p>
                  <p className="text-sm text-green-600 dark:text-green-400 text-right">
                    {item.discount}
                  </p>
                </>
              )}
              <p className="text-sm sm:text-lg">
                {item.quantity} x{" "}
                <span className="font-semibold">
                  {formatCurrency(item.finalPrice, "MXN")}
                </span>
              </p>
            </div>
          </li>
        ))}
      </ul>
      <p className="text-sm sm:text-lg text-right mt-4">
        Envío:{" "}
        <span className="font-bold">
          {formatCurrency(shippingCost / 100, "MXN")}
        </span>
      </p>
      <p className="text-sm sm:text-lg text-right">
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
      <p className="text-lg sm:text-2xl text-right mt-2">
        Total:{" "}
        <span className="font-bold">
          {formatCurrency(
            cart.reduce(
              (acc, item) => acc + item.finalPrice * item.quantity,
              0
            ) +
              shippingCost / 100,
            "MXN"
          )}
        </span>
      </p>
      <form>
        <div className="flex flex-col gap-2 my-2">
          <GenericInput
            id="code"
            type="text"
            ariaLabel="¿Tienes un cupón?"
            placeholder="WELCOME10"
            className="w-36"
          />
        </div>
        <SubmitButton pending={false} title="Aplicar" color="primary" />
      </form>
    </div>
  );
};

export default CartSummary;
