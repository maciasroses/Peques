"use client";

import { cn } from "@/app/shared/utils/cn";
import { ReactNode, useState } from "react";
import { INITIAL_STATE_RESPONSE } from "@/app/shared/constants";
import { GenericInput, SubmitButton } from "@/app/shared/components";
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
} from "@/app/shared/interfaces";

interface IForm {
  onClose: () => void;
  products?: IProduct[];
  collections?: ICollection[];
  promotion?: IPromotion | IPromotion[];
  action: "create" | "update" | "delete" | "massiveDelete";
}

const Form = ({ onClose, products, collections, promotion, action }: IForm) => {
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
    const res =
      action === "create"
        ? await createPromotion(formData)
        : action === "update"
          ? await updatePromotion((promotion as IPromotion).id, formData)
          : action === "delete"
            ? await deletePromotion((promotion as IPromotion).id)
            : action === "massiveDelete" &&
              (await deleteMassivePromotions(
                (promotion as IPromotion[]).map((p) => p.id)
              ));
    if (res && !res.success) {
      setBadResponse(res);
    } else {
      onClose();
    }
    setIsPending(false);
  };

  return (
    <div className="flex flex-col items-center gap-4 text-left dark:text-white">
      <div className="flex flex-col items-center gap-2">
        <h1 className="text-center text-xl md:text-4xl">
          {action === "create"
            ? "Creando"
            : action === "update"
              ? "Actualizando"
              : "Eliminando"}{" "}
          promoción
        </h1>
        {badResponse.message && (
          <p className="text-center text-red-500">{badResponse.message}</p>
        )}
      </div>
      <form onSubmit={submitAction}>
        <fieldset disabled={isPending} className="flex flex-col gap-4 text-xl">
          {action === "create" || action === "update" ? (
            <>
              <GenericPairDiv>
                <GenericDiv>
                  <GenericInput
                    id="title"
                    type="text"
                    ariaLabel="Título de la promoción"
                    placeholder="Black Friday"
                    defaultValue={(promotion as IPromotion)?.title ?? ""}
                    error={badResponse.errors?.title}
                  />
                </GenericDiv>
                <GenericDiv>
                  <GenericInput
                    id="description"
                    type="text"
                    ariaLabel="Descripción de la promoción"
                    placeholder="Descuento del 50% en juguetes"
                    defaultValue={(promotion as IPromotion)?.description ?? ""}
                    error={badResponse.errors?.description}
                  />
                </GenericDiv>
              </GenericPairDiv>
              <GenericPairDiv>
                <GenericDiv>
                  <GenericInput
                    type="date"
                    id="startDate"
                    ariaLabel="Fecha de inicio"
                    defaultValue={
                      (promotion as IPromotion)?.startDate
                        ? new Date((promotion as IPromotion).startDate)
                            .toISOString()
                            .split("T")[0]
                        : ""
                    }
                    error={badResponse.errors?.startDate}
                  />
                </GenericDiv>
                <GenericDiv>
                  <GenericInput
                    type="date"
                    id="endDate"
                    ariaLabel="Fecha de fin"
                    defaultValue={
                      (promotion as IPromotion)?.endDate
                        ? new Date((promotion as IPromotion).endDate)
                            .toISOString()
                            .split("T")[0]
                        : ""
                    }
                    error={badResponse.errors?.endDate}
                  />
                </GenericDiv>
              </GenericPairDiv>
              <GenericPairDiv>
                <GenericDiv>
                  <GenericInput
                    type="select"
                    id="discountType"
                    ariaLabel="Tipo de descuento"
                    placeholder="Seleccione un tipo de descuento"
                    defaultValue={(promotion as IPromotion)?.discountType ?? ""}
                    options={[
                      { value: "PERCENTAGE", label: "Porcentaje" },
                      { value: "FIXED", label: "Fijo" },
                    ]}
                    error={badResponse.errors?.discountType}
                  />
                </GenericDiv>
                <GenericDiv>
                  <GenericInput
                    min="0"
                    type="number"
                    placeholder="50"
                    id="discountValue"
                    ariaLabel="Valor del descuento"
                    defaultValue={
                      (promotion as IPromotion)?.discountValue?.toString() ?? ""
                    }
                    error={badResponse.errors?.discountValue}
                  />
                </GenericDiv>
              </GenericPairDiv>
              {action === "create" && (
                <>
                  <ul className="flex gap-2">
                    <li className="w-1/3">
                      <button
                        title="Producto"
                        type="button"
                        onClick={() => setTab("product")}
                        className={cn(
                          "w-full inline-block p-4 rounded-t-lg border-b-2",
                          tab === "product"
                            ? "border-blue-400 dark:border-blue-300 text-blue-400 dark:text-blue-300"
                            : "border-gray-400 dark:border-gray-300"
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
                            ? "border-blue-400 dark:border-blue-300 text-blue-400 dark:text-blue-300"
                            : "border-gray-400 dark:border-gray-300"
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
                            ? "border-blue-400 dark:border-blue-300 text-blue-400 dark:text-blue-300"
                            : "border-gray-400 dark:border-gray-300"
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
                  ) : (
                    <GenericPairDiv>
                      <GenericDiv>
                        <GenericInput
                          id="discountCodeCode"
                          type="text"
                          ariaLabel="Código de descuento"
                          placeholder="BLACKFRIDAY"
                          error={badResponse.errors?.discountCodeCode}
                        />
                      </GenericDiv>
                      <GenericDiv>
                        <GenericInput
                          id="discountCodeUsageLimit"
                          type="number"
                          ariaLabel="Límite de usos"
                          placeholder="100"
                          error={badResponse.errors?.discountCodeUsageLimit}
                        />
                      </GenericDiv>
                    </GenericPairDiv>
                  )}
                </>
              )}
            </>
          ) : (
            <>
              {action === "delete" ? (
                <div className="text-center">
                  <span className="text-2xl text-red-500">
                    ⚠️ Acción irreversible ⚠️
                  </span>
                  <p className="text-base md:text-xl">
                    ¿Estás seguro de querer eliminar la promoción{' "'}
                    {(promotion as IPromotion).title}
                    {'"'}?
                  </p>
                </div>
              ) : (
                <div className="text-center">
                  <span className="text-2xl text-red-500">
                    ⚠️ Acción irreversible ⚠️
                  </span>
                  <p className="text-base md:text-xl">
                    ¿Estás seguro de querer eliminar las siguientes promociones?
                  </p>
                  <ul>
                    {(promotion as IPromotion[]).map((promotion) => (
                      <li key={promotion.id}>{promotion.title}</li>
                    ))}
                  </ul>
                </div>
              )}
            </>
          )}
          <div className="text-center">
            <SubmitButton
              title={
                action === "create"
                  ? "Crear"
                  : action === "update"
                    ? "Actualizar"
                    : "Eliminar"
              }
              color="accent"
              pending={isPending}
            />
          </div>
        </fieldset>
      </form>
    </div>
  );
};

export default Form;

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
