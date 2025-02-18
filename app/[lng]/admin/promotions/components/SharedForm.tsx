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
  addToPromotion,
} from "@/app/shared/services/promotion/controller";
import type {
  IProduct,
  IPromotion,
  ICollection,
  IPromotionState,
} from "@/app/shared/interfaces";
import { useResolvedTheme } from "@/app/shared/hooks";

interface ISharedForm {
  onClose: () => void;
  promotionId: string;
  products: IProduct[];
  collections: ICollection[];
}

const SharedForm = ({
  onClose,
  products,
  collections,
  promotionId,
}: ISharedForm) => {
  const [isPending, setIsPending] = useState(false);
  const [tab, setTab] = useState<"product" | "collection" | "discountCode">(
    "product"
  );
  const [badResponse, setBadResponse] = useState<IPromotionState>(
    INITIAL_STATE_RESPONSE
  );

  const submitAction: React.FormEventHandler<HTMLFormElement> = async (
    event
  ) => {
    setIsPending(true);
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    formData.set("promotionType", tab);
    const res = await addToPromotion(promotionId, formData);
    if (res && !res.success) {
      setBadResponse(res);
    } else {
      onClose();
    }
    setIsPending(false);
  };

  return (
    <div className="flex flex-col items-center gap-4 text-left">
      <div className="flex flex-col items-center gap-2">
        <h1 className="text-center text-xl md:text-4xl">
          Agregando a la promoción
        </h1>
        {badResponse.message && (
          <p className="text-center text-red-500">{badResponse.message}</p>
        )}
      </div>
      <form onSubmit={submitAction}>
        <fieldset disabled={isPending} className="flex flex-col gap-4 text-xl">
          <ul className="flex gap-2">
            <li className="w-1/3">
              <button
                title="Producto"
                type="button"
                onClick={() => setTab("product")}
                className={cn(
                  "w-full inline-block p-4 rounded-t-lg border-b-2",
                  tab === "product"
                    ? "border-blue-400 text-blue-400"
                    : "border-gray-400"
                )}
              >
                <p className="line-clamp-1">Producto</p>
              </button>
            </li>
            <li className="w-1/3">
              <button
                title="Colección"
                type="button"
                onClick={() => setTab("collection")}
                className={cn(
                  "w-full inline-block p-4 rounded-t-lg border-b-2",
                  tab === "collection"
                    ? "border-blue-400 text-blue-400"
                    : "border-gray-400"
                )}
              >
                <p className="line-clamp-1">Colección</p>
              </button>
            </li>
            <li className="w-1/3">
              <button
                title="Código de descuento"
                type="button"
                onClick={() => setTab("discountCode")}
                className={cn(
                  "w-full inline-block p-4 rounded-t-lg border-b-2",
                  tab === "discountCode"
                    ? "border-blue-400 text-blue-400"
                    : "border-gray-400"
                )}
              >
                <p className="line-clamp-1">Código de descuento</p>
              </button>
            </li>
          </ul>
          {tab === "product" ? (
            <DynamicItemManager
              items={products ?? []}
              renderForm={(index, items, onSelect) => (
                <AutocompleteInput
                  key={index}
                  id="productKeys"
                  ariaLabel="Producto"
                  customClassName="mt-2"
                  placeholder="Busca un producto..."
                  additionOnChange={(e) => onSelect(index, e.target.value)}
                  suggestions={items.map((i) => ({
                    value: i.key,
                    label: i.name,
                  }))}
                />
              )}
            />
          ) : tab === "collection" ? (
            <DynamicItemManager
              items={
                collections?.map((collection) => ({
                  key: collection.name,
                  name: collection.name,
                })) ?? []
              }
              renderForm={(index, items, onSelect) => (
                <AutocompleteInput
                  key={index}
                  id="collectionNames"
                  ariaLabel="Colección"
                  customClassName="mt-2"
                  placeholder="Busca una colección..."
                  additionOnChange={(e) => onSelect(index, e.target.value)}
                  suggestions={items.map((i) => ({
                    value: i.key,
                    label: i.name,
                  }))}
                />
              )}
            />
          ) : (
            <GenericPairDiv>
              <GenericDiv>
                <GenericInput
                  type="text"
                  id="discountCodeCode"
                  placeholder="BLACKFRIDAY"
                  ariaLabel="Código de descuento"
                />
              </GenericDiv>
              <GenericDiv>
                <GenericInput
                  type="number"
                  placeholder="100"
                  id="discountCodeUsageLimit"
                  ariaLabel="Límite de usos"
                />
              </GenericDiv>
            </GenericPairDiv>
          )}
          <div className="text-center">
            <SubmitButton color="accent" title="Agregar" pending={isPending} />
          </div>
        </fieldset>
      </form>
    </div>
  );
};

export default SharedForm;

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
