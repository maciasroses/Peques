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
  removeCollectionFromPromotion,
  removeMassiveCollectionsFromPromotion,
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

interface ICollectionsForm {
  onClose: () => void;
  promotionId: string;
  collection: ICollection | ICollection[];
  action: "delete" | "massiveDelete";
}

const CollectionsForm = ({
  action,
  onClose,
  collection,
  promotionId,
}: ICollectionsForm) => {
  const theme = useResolvedTheme();
  const [isPending, setIsPending] = useState(false);

  const submitAction: React.FormEventHandler<HTMLFormElement> = async (
    event
  ) => {
    setIsPending(true);
    event.preventDefault();
    const res =
      action === "delete"
        ? await removeCollectionFromPromotion({
            collectionId: (collection as ICollection).id,
            promotionId,
          })
        : action === "massiveDelete" &&
          (await removeMassiveCollectionsFromPromotion({
            collectionIds: (collection as ICollection[]).map((c) => c.id),
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
          Eliminando Colección(es)
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
                ¿Estás seguro de querer eliminar la colección
                {' "'}
                {(collection as ICollection).name}
                {'"'}?
              </p>
            </div>
          ) : (
            <div className="text-center">
              <span className="text-2xl text-red-500">
                ⚠️ Acción irreversible ⚠️
              </span>
              <p className="text-base md:text-xl">
                ¿Estás seguro de querer eliminar las siguientes colecciones?
              </p>
              <ul>
                {(collection as ICollection[]).map((collection) => (
                  <li key={collection.id}>{collection.name}</li>
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

export default CollectionsForm;
