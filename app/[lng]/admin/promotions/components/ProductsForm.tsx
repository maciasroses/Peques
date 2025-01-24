"use client";

import { cn } from "@/app/shared/utils/cn";
import { ReactNode, useState } from "react";
import { INITIAL_STATE_RESPONSE } from "@/app/shared/constants";
import { GenericInput, SubmitButton, Toast } from "@/app/shared/components";
import {
  AutocompleteInput,
  DynamicItemManager,
} from "@/app/shared/components/Form";
import {
  createPromotion,
  deletePromotion,
  updatePromotion,
  deleteMassivePromotions,
  removeProductFromPromotion,
  removeMassiveProductsFromPromotion,
} from "@/app/shared/services/promotion/controller";
import type {
  IProduct,
  IPromotion,
  ICollection,
  IPromotionState,
  IDiscountCode,
  ISharedState,
} from "@/app/shared/interfaces";
import {
  deleteDiscountCodeByIdNPromotionIdNAdmin,
  deleteMassiveDiscountCodeByIdsNPromotionIdNAdmin,
  updateDiscountCodeByIdNPromotionIdNAdmin,
} from "@/app/shared/services/discountCode/controller";
import { useResolvedTheme } from "@/app/shared/hooks";

interface IProductsForm {
  onClose: () => void;
  promotionId: string;
  product: IProduct | IProduct[];
  action: "delete" | "massiveDelete";
}

const ProductsForm = ({
  action,
  onClose,
  product,
  promotionId,
}: IProductsForm) => {
  const theme = useResolvedTheme();
  const [isPending, setIsPending] = useState(false);

  const submitAction: React.FormEventHandler<HTMLFormElement> = async (
    event
  ) => {
    setIsPending(true);
    event.preventDefault();
    const res =
      action === "delete"
        ? await removeProductFromPromotion({
            productId: (product as IProduct).id,
            promotionId,
          })
        : action === "massiveDelete" &&
          (await removeMassiveProductsFromPromotion({
            productIds: (product as IProduct[]).map((p) => p.id),
            promotionId,
          }));
    if (res) {
      Toast({
        type: !res.success ? "error" : "success",
        message: res.message,
        theme,
      });
    }
    onClose();
    setIsPending(false);
  };

  return (
    <div className="flex flex-col items-center gap-4 text-left dark:text-white">
      <div className="flex flex-col items-center gap-2">
        <h1 className="text-center text-xl md:text-4xl">
          Eliminando Producto(s)
        </h1>
      </div>
      <form onSubmit={submitAction}>
        <fieldset disabled={isPending} className="flex flex-col gap-4 text-xl">
          {action === "delete" ? (
            <div className="text-center">
              <span className="text-2xl text-red-500">
                ⚠️ Acción irreversible ⚠️
              </span>
              <p className="text-base md:text-xl">
                ¿Estás seguro de querer eliminar el producto
                {' "'}
                {(product as IProduct).name}
                {'"'}?
              </p>
            </div>
          ) : (
            <div className="text-center">
              <span className="text-2xl text-red-500">
                ⚠️ Acción irreversible ⚠️
              </span>
              <p className="text-base md:text-xl">
                ¿Estás seguro de querer eliminar los siguientes productos?
              </p>
              <ul>
                {(product as IProduct[]).map((product) => (
                  <li key={product.id}>{product.name}</li>
                ))}
              </ul>
            </div>
          )}
          <div className="text-center">
            <SubmitButton color="accent" pending={isPending} title="Eliminar" />
          </div>
        </fieldset>
      </form>
    </div>
  );
};

export default ProductsForm;

const GenericPairDiv = ({ children }: { children: ReactNode }) => {
  return (
    <div className="flex flex-col sm:flex-row gap-4 w-full">{children}</div>
  );
};

const GenericDiv = ({ children }: { children: ReactNode }) => {
  return (
    <div className="flex flex-col gap-2 w-full sm:w-1/2 justify-end">
      {children}
    </div>
  );
};
