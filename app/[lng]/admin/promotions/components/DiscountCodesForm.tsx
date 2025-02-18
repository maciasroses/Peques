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

interface IDiscountCodeForm {
  onClose: () => void;
  promotionId: string;
  discountCode: IDiscountCode | IDiscountCode[];
  action: "update" | "delete" | "massiveDelete";
}

const DiscountCodeForm = ({
  onClose,
  promotionId,
  discountCode,
  action,
}: IDiscountCodeForm) => {
  const theme = useResolvedTheme();
  const [isPending, setIsPending] = useState(false);

  const submitAction: React.FormEventHandler<HTMLFormElement> = async (
    event
  ) => {
    setIsPending(true);
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const res =
      action === "update"
        ? await updateDiscountCodeByIdNPromotionIdNAdmin({
            formData,
            promotionId,
            id: (discountCode as IDiscountCode).id,
          })
        : action === "delete"
          ? await deleteDiscountCodeByIdNPromotionIdNAdmin({
              id: (discountCode as IDiscountCode).id,
              promotionId,
            })
          : action === "massiveDelete" &&
            (await deleteMassiveDiscountCodeByIdsNPromotionIdNAdmin(
              (discountCode as IDiscountCode[]).map((dc) => dc.id),
              promotionId
            ));
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
    <div className="flex flex-col items-center gap-4 text-left">
      <div className="flex flex-col items-center gap-2">
        <h1 className="text-center text-xl md:text-4xl">
          {action === "update" ? "Actualizando" : "Eliminando"} código de
          descuento
        </h1>
      </div>
      <form onSubmit={submitAction}>
        <fieldset disabled={isPending} className="flex flex-col gap-4 text-xl">
          {action === "update" ? (
            <>
              <GenericPairDiv>
                <GenericDiv>
                  <GenericInput
                    id="discountCodeCode"
                    type="text"
                    placeholder="BLACKFRIDAY"
                    ariaLabel="Código de descuento"
                    defaultValue={(discountCode as IDiscountCode).code}
                  />
                </GenericDiv>
                <GenericDiv>
                  <GenericInput
                    type="number"
                    placeholder="100"
                    id="discountCodeUsageLimit"
                    ariaLabel="Límite de usos"
                    defaultValue={
                      (discountCode as IDiscountCode).usageLimit?.toString() ||
                      ""
                    }
                  />
                </GenericDiv>
              </GenericPairDiv>
            </>
          ) : (
            <>
              {action === "delete" ? (
                <div className="text-center">
                  <span className="text-2xl text-red-500">
                    ⚠️ Acción irreversible ⚠️
                  </span>
                  <p className="text-base md:text-xl">
                    ¿Estás seguro de querer eliminar el código de descuento
                    {' "'}
                    {(discountCode as IDiscountCode).code}
                    {'"'}?
                  </p>
                </div>
              ) : (
                <div className="text-center">
                  <span className="text-2xl text-red-500">
                    ⚠️ Acción irreversible ⚠️
                  </span>
                  <p className="text-base md:text-xl">
                    ¿Estás seguro de querer eliminar los siguientes códigos de
                    descuento?
                  </p>
                  <ul>
                    {(discountCode as IDiscountCode[]).map((discountCode) => (
                      <li key={discountCode.id}>{discountCode.code}</li>
                    ))}
                  </ul>
                </div>
              )}
            </>
          )}
          <div className="text-center">
            <SubmitButton
              color="accent"
              pending={isPending}
              title={action === "update" ? "Actualizar" : "Eliminar"}
            />
          </div>
        </fieldset>
      </form>
    </div>
  );
};

export default DiscountCodeForm;

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
