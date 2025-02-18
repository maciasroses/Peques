"use client";

import { cn } from "@/app/shared/utils/cn";
import React, { ReactNode, useState } from "react";
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
  ISharedState,
} from "@/app/shared/interfaces";
import { useResolvedTheme } from "@/app/shared/hooks";
import { addToFilterGroup } from "@/app/shared/services/filter/controller";
import { MinusCircle, PlusCircle } from "@/app/shared/icons";

interface ISharedForm {
  onClose: () => void;
  products: IProduct[];
  filterGroupId: string;
  collections: ICollection[];
}

const SharedForm = ({
  onClose,
  products,
  collections,
  filterGroupId,
}: ISharedForm) => {
  const [isPending, setIsPending] = useState(false);
  const [filtersCounter, setFiltersCounter] = useState(1);
  const [tab, setTab] = useState<"product" | "collection">("product");
  const [badResponse, setBadResponse] = useState<ISharedState>(
    INITIAL_STATE_RESPONSE
  );

  const submitAction: React.FormEventHandler<HTMLFormElement> = async (
    event
  ) => {
    setIsPending(true);
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const res = await addToFilterGroup(formData, filterGroupId, tab);
    if (res && !res.success) {
      setBadResponse(res);
    } else {
      onClose();
    }
    setIsPending(false);
  };

  const handleIncreaseNSubtract = (action: string) => {
    setFiltersCounter((prev) => {
      if (action === "increase") {
        return prev + 1;
      } else if (action === "subtract" && prev > 1) {
        return prev - 1;
      }
      return prev;
    });
  };

  return (
    <div className="flex flex-col items-center gap-4 text-left">
      <div className="flex flex-col items-center gap-2">
        <h1 className="text-center text-xl md:text-4xl">
          Agregando al grupo de filtros
        </h1>
        {badResponse.message && (
          <p className="text-center text-red-500">{badResponse.message}</p>
        )}
      </div>
      <form onSubmit={submitAction}>
        <fieldset disabled={isPending} className="flex flex-col gap-4 text-xl">
          <ul className="flex gap-2">
            <li className="w-1/2">
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
                <p className="line-clamp-1">Filtro de Producto</p>
              </button>
            </li>
            <li className="w-1/2">
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
          </ul>
          {tab === "product" ? (
            <>
              {Array.from({ length: filtersCounter }).map((_, filterIndex) => (
                <React.Fragment key={filterIndex}>
                  <GenericPairDiv key={filterIndex}>
                    <GenericDiv>
                      <GenericInput
                        id="filterName"
                        type="text"
                        ariaLabel="Nombre del Filtro"
                        placeholder="Simbólico"
                      />
                    </GenericDiv>
                    <GenericDiv>
                      <GenericInput
                        id="filterKey"
                        type="text"
                        ariaLabel="Clave del Filtro"
                        placeholder="symbolic"
                      />
                    </GenericDiv>
                  </GenericPairDiv>
                  <div className="px-4">
                    <p className="text-xl text-center border-b pb-2 my-4">
                      Agregar productos
                    </p>
                    <DynamicItemManager
                      items={products ?? []}
                      renderForm={(index, items, onSelect) => (
                        <AutocompleteInput
                          key={index}
                          id={`product-${filterIndex}`}
                          ariaLabel="Producto"
                          customClassName="mt-2"
                          placeholder="Busca un producto..."
                          additionOnChange={(e) =>
                            onSelect(index, e.target.value)
                          }
                          suggestions={items.map((i) => ({
                            value: i.key,
                            label: i.name,
                          }))}
                        />
                      )}
                    />
                    <div className="border-t mt-2" />
                  </div>
                </React.Fragment>
              ))}
              <div className="flex gap-2 items-center justify-end border-b pb-2">
                <button
                  type="button"
                  onClick={() => handleIncreaseNSubtract("increase")}
                >
                  <PlusCircle />
                </button>
                {filtersCounter > 1 && (
                  <button
                    type="button"
                    onClick={() => handleIncreaseNSubtract("subtract")}
                  >
                    <MinusCircle />
                  </button>
                )}
                <span>{filtersCounter > 1 && `(${filtersCounter} total)`}</span>
              </div>
            </>
          ) : (
            tab === "collection" && (
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
                    id="collectionKey"
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
            )
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
