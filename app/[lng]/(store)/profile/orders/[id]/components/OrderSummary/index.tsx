"use client";

import ProductList from "./ProductList";
import { cn } from "@/app/shared/utils/cn";
import formatCurrency from "@/app/shared/utils/format-currency";
import formatDateLatinAmerican from "@/app/shared/utils/formatdate-latin";
import type { IOrder } from "@/app/shared/interfaces";

interface IOrderSummary {
  lng: string;
  order: IOrder;
}

const OrderSummary = ({ lng, order }: IOrderSummary) => {
  const hasGlobalDiscount = order.promotions.find(
    (promo) => promo.promotion.discountCodes.length > 0
  );

  const subtotal = order.total - (order.shippingCost ?? 190);

  const finalSubtotal =
    hasGlobalDiscount &&
    hasGlobalDiscount.promotion.discountType === "PERCENTAGE"
      ? subtotal + (subtotal * hasGlobalDiscount.promotion.discountValue) / 100
      : subtotal + (hasGlobalDiscount?.promotion.discountValue ?? 0);

  return (
    <div className="flex flex-col md:flex-row gap-4 mt-2">
      <div className="w-full h-full md:w-1/3 md:sticky md:top-24">
        <h1 className="text-2xl font-bold">Resumen</h1>
        <p className="text-sm sm:text-lg mt-2">
          Envío:{" "}
          <span className="font-bold">
            {formatCurrency(order.shippingCost ?? 190, "MXN")}
          </span>
        </p>
        <p className="text-sm sm:text-lg">
          Subtotal:{" "}
          <span
            className={cn("font-bold", hasGlobalDiscount && "line-through")}
          >
            {formatCurrency(finalSubtotal, "MXN")}
          </span>
          {hasGlobalDiscount && (
            <span className="ml-2 font-bold text-green-600 dark:text-green-400">
              {formatCurrency(order.total - (order.shippingCost ?? 190), "MXN")}
            </span>
          )}
        </p>
        <p className="text-lg sm:text-2xl mt-2">
          Total:{" "}
          <span
            className={cn("font-bold", hasGlobalDiscount && "line-through")}
          >
            {formatCurrency(finalSubtotal + (order.shippingCost ?? 190), "MXN")}
          </span>
          {hasGlobalDiscount && (
            <span className="ml-2 font-bold text-green-600 dark:text-green-400">
              {formatCurrency(order.total, "MXN")}
            </span>
          )}
        </p>
        {hasGlobalDiscount && (
          <div className="flex flex-col gap-1 mt-2">
            <p className="text-xs sm:text-base font-medium text-green-600 dark:text-green-400">
              Descuento aplicado
            </p>
            <p className="text-base sm:text-xl">
              {hasGlobalDiscount.promotion.title}
            </p>
          </div>
        )}
      </div>
      <div className="w-full md:w-2/3">
        <h2 className="text-4xl font-bold">
          {`${
            order.deliveryStatus === "DELIVERED" ? "Entregado" : "Pendiente"
          } ${formatDateLatinAmerican(order.updatedAt)}`}
        </h2>
        <ProductList lng={lng} order={order} />
      </div>
    </div>
  );
};

export default OrderSummary;
