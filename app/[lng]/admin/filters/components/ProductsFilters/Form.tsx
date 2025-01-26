"use client";

import { ReactNode, useState } from "react";
import { SubmitButton } from "@/app/shared/components";
import { MinusCircle, PlusCircle } from "@/app/shared/icons";
import { INITIAL_STATE_RESPONSE } from "@/app/shared/constants";
import {
  AutocompleteInput,
  DynamicItemManager,
  GenericInput,
} from "@/app/shared/components/Form";
import {
  addProductsToCollection,
  removeProductsFromCollection,
} from "@/app/shared/services/collection/controller";
import type {
  IProduct,
  IAddNDeleteProductToFromCollectionState,
  ISharedState,
  IProductFilter,
} from "@/app/shared/interfaces";
import {
  addProductsToFilterFromGroup,
  deleteMassiveProductFilterFromGroup,
  deleteProductFilterFromGroup,
  updateProductFilterFromGroup,
} from "@/app/shared/services/filter/controller";

interface IForm {
  onClose: () => void;
  products?: IProduct[];
  productFilter?: IProductFilter | IProductFilter[];
  action: "create" | "update" | "delete" | "massiveDelete";
}

const Form = ({ onClose, productFilter, products, action }: IForm) => {
  const [isPending, setIsPending] = useState(false);
  const [badResponse, setBadResponse] = useState<ISharedState>(
    INITIAL_STATE_RESPONSE
  );

  const submitAction: React.FormEventHandler<HTMLFormElement> = async (
    event
  ) => {
    setIsPending(true);
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const productsIds = formData.getAll("productsKeys") as string[];
    const res =
      action === "create"
        ? await addProductsToFilterFromGroup(
            productsIds,
            (productFilter as IProductFilter).id
          )
        : action === "update"
          ? await updateProductFilterFromGroup(
              formData,
              (productFilter as IProductFilter).id
            )
          : action === "delete"
            ? await deleteProductFilterFromGroup(
                (productFilter as IProductFilter).id
              )
            : action === "massiveDelete" &&
              (await deleteMassiveProductFilterFromGroup(
                (productFilter as IProductFilter[]).map((c) => c.id)
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
            ? "Agregando"
            : action === "update"
              ? "Actualizando"
              : "Quitando"}{" "}
          filtro de productos
        </h1>
        {badResponse.message && (
          <div className="text-red-500 text-center">{badResponse.message}</div>
        )}
      </div>
      <form onSubmit={submitAction}>
        <fieldset disabled={isPending}>
          {action === "create" ? (
            <DynamicItemManager
              items={products ?? []}
              renderForm={(index, items, onSelect) => (
                <AutocompleteInput
                  key={index}
                  id="productsKeys"
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
          ) : action === "update" ? (
            <GenericPairDiv>
              <GenericDiv>
                <GenericInput
                  id="name"
                  type="text"
                  ariaLabel="Nombre"
                  placeholder="Nombre del filtro"
                  defaultValue={(productFilter as IProductFilter).name}
                />
              </GenericDiv>
              <GenericDiv>
                <GenericInput
                  id="key"
                  type="text"
                  ariaLabel="Clave"
                  placeholder="Clave del filtro"
                  defaultValue={(productFilter as IProductFilter).key}
                />
              </GenericDiv>
            </GenericPairDiv>
          ) : (
            <>
              {action === "delete" ? (
                <div className="text-center">
                  <span className="text-2xl text-center text-red-500">
                    ⚠️ Acción irreversible ⚠️
                  </span>
                  <h1 className="text-center text-base md:text-xl">
                    ¿Estás seguro de que deseas quitar el filtro de productos
                    {` "${(productFilter as IProductFilter).name}"`}?
                  </h1>
                </div>
              ) : (
                <div className="text-center">
                  <span className="text-2xl text-center text-red-500">
                    ⚠️ Acción irreversible ⚠️
                  </span>
                  <h1 className="text-center text-base md:text-xl">
                    ¿Estás seguro de que deseas quitar los siguientes filtros de
                    productos?
                  </h1>
                  <ul>
                    {(productFilter as IProductFilter[]).map((p) => (
                      <li key={p.id}>{p.name}</li>
                    ))}
                  </ul>
                </div>
              )}
            </>
          )}
          <div className="text-center mt-4">
            <SubmitButton
              title={
                action === "create"
                  ? "Agregar"
                  : action === "update"
                    ? "Actualizar"
                    : "Quitar"
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
