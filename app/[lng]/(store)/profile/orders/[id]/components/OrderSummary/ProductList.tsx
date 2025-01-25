"use client";

import Image from "next/image";
import { useState } from "react";
import CreateReview from "../CreateReview";
import { useModal } from "@/app/shared/hooks";
import { Modal } from "@/app/shared/components";
import formatCurrency from "@/app/shared/utils/format-currency";
import { roundUpNumber } from "@/app/shared/utils/roundUpNumber";
import type { IOrder, IProduct } from "@/app/shared/interfaces";

interface IProductList {
  lng: string;
  order: IOrder;
}

const ProductList = ({ lng, order }: IProductList) => {
  const [productSelected, setProductSelected] = useState<IProduct | null>(null);
  const { isOpen, onClose, onOpen } = useModal();
  return (
    <>
      <Modal isOpen={isOpen} onClose={onClose}>
        <CreateReview
          lng={lng}
          productSelected={productSelected!}
          onClose={onClose}
        />
      </Modal>
      <ul className="flex flex-col gap-2 mt-4">
        {order.products.map((product) => (
          <button
            key={product.productId}
            onClick={() => {
              setProductSelected(product.product);
              onOpen();
            }}
          >
            <li className="flex items-center justify-between gap-2 p-4 shadow-lg dark:shadow-gray-800 border border-gray-200 dark:border-gray-800 hover:bg-gray-50 dark:hover:bg-gray-800 rounded-lg">
              <div className="flex items-center gap-2">
                <div className="size-24">
                  <Image
                    src={
                      product.product.files[0]?.url ??
                      "/assets/images/landscape-placeholder.webp"
                    }
                    alt={product.product.name}
                    width={500}
                    height={300}
                    className="size-full object-contain rounded-lg"
                  />
                </div>
                <p className="text-base sm:text-xl">{product.product.name}</p>
              </div>
              <div className="flex flex-col items-end gap-1">
                {product.discount !== 0 && (
                  <p className="line-through text-xs sm:text-base text-gray-500 dark:text-gray-400">
                    {formatCurrency(product.costMXN, "MXN")}
                  </p>
                )}
                <p className="text-sm sm:text-lg">
                  {product.quantity} x{" "}
                  <span className="font-semibold">
                    {formatCurrency(
                      roundUpNumber(
                        product.discount
                          ? product.costMXN -
                              (product.costMXN * product.discount) / 100
                          : product.costMXN
                      ),
                      "MXN"
                    )}
                  </span>
                </p>
                {product.discount !== 0 && (
                  <p className="text-xs sm:text-base font-medium text-green-600 dark:text-green-400 text-right">
                    Descuento aplicado
                  </p>
                )}
              </div>
            </li>
          </button>
        ))}
      </ul>
    </>
  );
};

export default ProductList;
