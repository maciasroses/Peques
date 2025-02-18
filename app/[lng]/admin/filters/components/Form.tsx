"use client";

import React, { ReactNode, useState } from "react";
import { INITIAL_STATE_RESPONSE } from "@/app/shared/constants";
import { GenericInput, SubmitButton } from "@/app/shared/components";
import {
  AutocompleteInput,
  DynamicItemManager,
} from "@/app/shared/components/Form";
import {
  createCollection,
  deleteCollection,
  updateCollection,
  deleteMassiveCollections,
} from "@/app/shared/services/collection/controller";
import type {
  IProduct,
  ICollection,
  ICollectionState,
  IFilterGroup,
  ISharedState,
} from "@/app/shared/interfaces";
import { MinusCircle, PlusCircle } from "@/app/shared/icons";
import {
  createFilter,
  deleteFilter,
  deleteMassiveFilter,
  updateFilter,
} from "@/app/shared/services/filter/controller";

interface IForm {
  onClose: () => void;
  products?: IProduct[];
  collections?: ICollection[];
  filter?: IFilterGroup | IFilterGroup[];
  action: "create" | "update" | "delete" | "massiveDelete";
}

const Form = ({ onClose, products, collections, filter, action }: IForm) => {
  const [isPending, setIsPending] = useState(false);
  const [filtersCounter, setFiltersCounter] = useState(1);
  const [badResponse, setBadResponse] = useState<ISharedState>(
    INITIAL_STATE_RESPONSE
  );

  const submitAction: React.FormEventHandler<HTMLFormElement> = async (
    event
  ) => {
    setIsPending(true);
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const res =
      action === "create"
        ? await createFilter(formData)
        : action === "update"
          ? await updateFilter((filter as IFilterGroup).id, formData)
          : action === "delete"
            ? await deleteFilter((filter as IFilterGroup).id)
            : action === "massiveDelete" &&
              (await deleteMassiveFilter(
                (filter as IFilterGroup[]).map((f) => f.id)
              ));
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
          {action === "create"
            ? "Creando"
            : action === "update"
              ? "Actualizando"
              : "Eliminando"}{" "}
          filtro
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
                    id="name"
                    type="text"
                    ariaLabel="Nombre del Grupo de Filtros"
                    placeholder="Nivel de Juego"
                    defaultValue={(filter as IFilterGroup)?.name ?? ""}
                    // error={badResponse.errors?.name}
                  />
                </GenericDiv>
                <GenericDiv>
                  <GenericInput
                    id="key"
                    type="text"
                    ariaLabel="Clave del Grupo de Filtros"
                    placeholder="game-level"
                    defaultValue={(filter as IFilterGroup)?.key ?? ""}
                    // error={badResponse.errors?.link}
                  />
                </GenericDiv>
              </GenericPairDiv>
              {action === "create" && (
                <>
                  <p className="text-2xl text-center border-b pb-2 mt-4">
                    Agregar filtros
                  </p>
                  {Array.from({ length: filtersCounter }).map(
                    (_, filterIndex) => (
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
                    )
                  )}
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
                    <span>
                      {filtersCounter > 1 && `(${filtersCounter} total)`}
                    </span>
                  </div>

                  <p className="text-2xl text-center border-b pb-2 mt-4">
                    Agregar colecciones
                  </p>
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
                    ¿Estás seguro de querer eliminar el filtro{' "'}
                    {(filter as IFilterGroup).name}
                    {'"'}?
                  </p>
                </div>
              ) : (
                <div className="text-center">
                  <span className="text-2xl text-red-500">
                    ⚠️ Acción irreversible ⚠️
                  </span>
                  <p className="text-base md:text-xl">
                    ¿Estás seguro de querer eliminar los siguientes filtros?
                  </p>
                  <ul>
                    {(filter as IFilterGroup[]).map((filter) => (
                      <li key={filter.id}>{filter.name}</li>
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
