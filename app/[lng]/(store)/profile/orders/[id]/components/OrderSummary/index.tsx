"use client";

import ProductList from "./ProductList";
import { cn } from "@/app/shared/utils/cn";
import formatCurrency from "@/app/shared/utils/format-currency";
import { roundUpNumber } from "@/app/shared/utils/roundUpNumber";
import formatDateLatinAmerican from "@/app/shared/utils/formatdate-latin";
import type { IOrder } from "@/app/shared/interfaces";

interface IOrderSummary {
  lng: string;
  order: IOrder;
}

const OrderSummary = ({ lng, order }: IOrderSummary) => {
  const hasGlobalDiscount = order.discount !== 0;

  const subtotal = order.products.reduce(
    (acc, product) =>
      acc +
      product.costMXN * product.quantity * (1 - (product.discount ?? 0) / 100),
    0
  );

  return (
    <div className="flex flex-col md:flex-row gap-4 mt-2">
      <div className="w-full h-full md:w-1/3 md:sticky md:top-24">
        <h1 className="text-2xl font-bold">Resumen</h1>
        <p className="text-sm sm:text-lg mt-2">
          Envío:{" "}
          <span
            className={cn(
              "font-bold",
              order.shippingCost === 0 && "text-green-600"
            )}
          >
            {formatCurrency(order.shippingCost ?? 190, "MXN")}
          </span>
        </p>
        <p className="text-sm sm:text-lg">
          Subtotal:{" "}
          <span
            className={cn("font-bold", hasGlobalDiscount && "line-through")}
          >
            {formatCurrency(roundUpNumber(subtotal), "MXN")}
          </span>
          {hasGlobalDiscount && (
            <span className="ml-2 font-bold text-green-600">
              {formatCurrency(order.total - (order.shippingCost ?? 190), "MXN")}
            </span>
          )}
        </p>
        <p className="text-lg sm:text-2xl mt-2">
          Total:{" "}
          <span
            className={cn("font-bold", hasGlobalDiscount && "line-through")}
          >
            {formatCurrency(
              roundUpNumber(subtotal) + (order.shippingCost ?? 190),
              "MXN"
            )}
          </span>
          {hasGlobalDiscount && (
            <span className="ml-2 font-bold text-green-600">
              {formatCurrency(order.total, "MXN")}
            </span>
          )}
        </p>
        {hasGlobalDiscount && (
          <div className="flex flex-col gap-1 mt-2">
            <p className="text-xs sm:text-base font-medium text-green-600">
              Descuento aplicado
            </p>
            <p className="text-base sm:text-xl">
              {order.promotions.find(
                (promo) => promo.promotion.discountCodes.length > 0
              )?.promotion.title ?? ""}
            </p>
          </div>
        )}
      </div>
      <div className="w-full md:w-2/3">
        <h2 className="text-4xl font-bold">
          {order.deliveryStatus === "PENDING"
            ? "Pendiente de entrega"
            : order.deliveryStatus === "CANCELLED"
              ? `Cancelado el ${formatDateLatinAmerican(order.updatedAt)}`
              : order.deliveryStatus === "SHIPPED"
                ? `Enviado el ${formatDateLatinAmerican(order.updatedAt)}`
                : order.deliveryStatus === "DELIVERED"
                  ? `Entregado el ${formatDateLatinAmerican(order.updatedAt)}`
                  : order.deliveryStatus === "READY_FOR_PICKUP"
                    ? `Listo para recoger el ${formatDateLatinAmerican(order.updatedAt)}`
                    : `Recogido el ${formatDateLatinAmerican(order.updatedAt)}`}
        </h2>
        <ProductList lng={lng} order={order} />
      </div>
    </div>
  );
};

export default OrderSummary;
