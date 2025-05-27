"use client";

import Image from "next/image";
import { useState } from "react";
import { cn } from "@/app/shared/utils/cn";
import formatCurrency from "@/app/shared/utils/format-currency";
import { INITIAL_STATE_RESPONSE } from "@/app/shared/constants";
import { GenericInput, SubmitButton } from "@/app/shared/components";
import { validateDiscountCodeForUser } from "@/app/shared/services/discountCode/controller";
import type {
  IDiscountCode,
  IDiscountCodeState,
  ICartItemForFrontend,
} from "@/app/shared/interfaces";

interface ICartSummary {
  lng: string;
  finished: boolean;
  shippingCost: number;
  cart: ICartItemForFrontend[];
  discountCode: IDiscountCode | null;
  isShippingInformationSelected: boolean;
  setDiscountCode: (code: IDiscountCode | null) => void;
}

const CartSummary = ({
  lng,
  cart,
  finished,
  shippingCost,
  discountCode,
  setDiscountCode,
  isShippingInformationSelected,
}: ICartSummary) => {
  const [isPending, setIsPending] = useState(false);
  const [badResponse, setBadResponse] = useState<IDiscountCodeState>(
    INITIAL_STATE_RESPONSE
  );

  const submitAction: React.FormEventHandler<HTMLFormElement> = async (
    event
  ) => {
    setIsPending(true);
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const res = await validateDiscountCodeForUser(formData);
    if (res && res.success) {
      setDiscountCode(res.discountCode as IDiscountCode);
      setBadResponse(INITIAL_STATE_RESPONSE);
    } else {
      setBadResponse(res);
    }
    setIsPending(false);
  };

  const subTotal = cart.reduce(
    (acc, item) => acc + item.finalPrice * item.quantity,
    0
  );

  let subTotalWithDiscount = 0;
  if (discountCode) {
    if (discountCode.promotion.discountType === "PERCENTAGE") {
      subTotalWithDiscount =
        subTotal - (subTotal * discountCode.promotion.discountValue) / 100;
    } else {
      subTotalWithDiscount =
        subTotal - discountCode.promotion.discountValue <= 0
          ? 0
          : subTotal - discountCode.promotion.discountValue;
    }
  }

  return (
    <div className={cn("w-full", finished && "opacity-50")}>
      <h1 className="text-2xl font-bold">
        {lng === "en" ? "Order Summary" : "Resumen del pedido"}
      </h1>
      <ul className="flex flex-col gap-4 my-4">
        {cart.map((item) => (
          <li
            key={item.id}
            className="flex items-center justify-between gap-2 border-b-2 border-b-gray-200 p-2"
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
                  <p className="text-sm line-through text-gray-500">
                    {formatCurrency(item.price, "MXN")}
                  </p>
                  <p className="text-sm text-green-600 text-right">
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
              {item.customRequest && (
                <>
                  <p className="font-semibold text-right">
                    Producto personalizado
                  </p>
                  <div className="flex flex-col items-end gap-0">
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
                          backgroundColor: JSON.parse(item.customRequest).color,
                          width: "20px",
                          height: "20px",
                          borderRadius: "100%",
                        }}
                      />
                    </div>
                  </div>
                </>
              )}
            </div>
          </li>
        ))}
      </ul>
      {isShippingInformationSelected && (
        <p className="text-sm sm:text-lg text-right">
          Envío:{" "}
          <span
            className={cn("font-bold", shippingCost === 0 && "text-green-600")}
          >
            {formatCurrency(shippingCost / 100, "MXN")}
          </span>
        </p>
      )}
      <p className="text-sm sm:text-lg text-right">
        Subtotal:{" "}
        <span className={cn("font-bold", discountCode && "line-through")}>
          {formatCurrency(subTotal, "MXN")}
        </span>
        {discountCode && (
          <span className="ml-2 font-bold text-green-600">
            {formatCurrency(subTotalWithDiscount, "MXN")}
          </span>
        )}
      </p>
      <p className="text-lg sm:text-2xl text-right mt-2">
        Total:{" "}
        <span className={cn("font-bold", discountCode && "line-through")}>
          {formatCurrency(
            cart.reduce(
              (acc, item) => acc + item.finalPrice * item.quantity,
              0
            ) +
              shippingCost / 100,
            "MXN"
          )}
        </span>
        {discountCode && (
          <span className="ml-2 font-bold text-green-600">
            {formatCurrency(subTotalWithDiscount + shippingCost / 100, "MXN")}
          </span>
        )}
      </p>
      {cart.every((item) => !item.discount) && (
        <>
          {!discountCode ? (
            <form onSubmit={submitAction}>
              <fieldset
                disabled={isPending}
                className={cn(isPending && "opacity-50")}
              >
                {badResponse.message && (
                  <p className="text-red-600">{badResponse.message}</p>
                )}
                <div className="flex flex-col gap-2 my-2">
                  <GenericInput
                    id="code"
                    type="text"
                    ariaLabel="¿Tienes un cupón?"
                    placeholder="WELCOME10"
                    className="w-36"
                  />
                </div>
                <SubmitButton
                  title="Aplicar"
                  color="accent"
                  finish={finished}
                  pending={isPending}
                />
              </fieldset>
            </form>
          ) : (
            <div className="flex flex-col gap-2 my-2">
              <p className="text-lg">Código de descuento aplicado: </p>
              <p className="text-xl">{discountCode.promotion.title}</p>
              <p className="text-lg">{discountCode.promotion.description}</p>
              <div>
                <button
                  type="button"
                  disabled={finished}
                  onClick={() => setDiscountCode(null)}
                  className="text-sm link-button-red"
                >
                  Eliminar
                </button>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default CartSummary;
