"use client";

import Image from "next/image";
import formatDateLatinAmerican from "@/app/shared/utils/formatdate-latin";
import type { IOrder, IProduct } from "@/app/shared/interfaces";

interface IOrderProductCard {
  order: IOrder;
  product: IProduct;
}

const OrderProductCard = ({ order, product }: IOrderProductCard) => {
  return (
    <div className="p-6">
      <div className="flex gap-2 items-center">
        <div className="size-16 sm:size-24 md:size-32">
          <Image
            alt={product.name}
            src={
              product.files[0]?.url ??
              "/assets/images/landscape-placeholder.webp"
            }
            width={50}
            height={50}
            className="size-full object-contain"
          />
        </div>
        <div>
          <h1 className="text-xl md:text-2xl">{product.name}</h1>
          <p className="text-gray-400 dark:text-gray-500 text-sm md:text-base">
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
          </p>
        </div>
      </div>
    </div>
  );
};

export default OrderProductCard;
