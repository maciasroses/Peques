"use client";

import Form from "./Form";
import Image from "next/image";
import { useEffect, useState } from "react";
import { useRowSelection } from "@/app/shared/hooks";
import formatDateLatinAmerican from "@/app/shared/utils/formatdate-latin";
import {
  Action,
  Card404,
  DatatableSkeleton,
  Datatable as CustomDatatable,
} from "@/app/shared/components";
import type { ExpanderComponentProps } from "react-data-table-component";
import type {
  IProduct,
  ICollection,
  IProductOnCollection,
  IFilterGroup,
} from "@/app/shared/interfaces";
import { Datatable as CollectionsDatatable } from "./Collections";
import { Datatable as ProductsFiltersDatatable } from "./ProductsFilters";
import { cn } from "@/app/shared/utils/cn";
import SharedForm from "./SharedForm";

interface IDatatable {
  products: IProduct[];
  filters: IFilterGroup[];
  collections: ICollection[];
}

const Datatable = ({ filters, collections, products }: IDatatable) => {
  const ExpandedComponent: React.FC<ExpanderComponentProps<IFilterGroup>> = ({
    data,
  }) => {
    const [tab, setTab] = useState<"productsFilters" | "collections">(
      "productsFilters"
    );

    return (
      <div className="pl-12 py-4 dark:bg-black dark:text-white">
        <ul className="flex flex-row gap-4">
          <li>
            <button
              onClick={() => setTab("productsFilters")}
              className={cn(
                "px-4 py-2 rounded-md",
                tab === "productsFilters"
                  ? "bg-primary dark:bg-primary-dark"
                  : "bg-gray-200 text-gray-700"
              )}
            >
              Filtros de Productos
            </button>
          </li>
          <li>
            <button
              onClick={() => setTab("collections")}
              className={cn(
                "px-4 py-2 rounded-md",
                tab === "collections"
                  ? "bg-primary dark:bg-primary-dark"
                  : "bg-gray-200 text-gray-700"
              )}
            >
              Colecciones
            </button>
          </li>
        </ul>
        {tab === "productsFilters" && (
          <ProductsFiltersDatatable
            filterId={data.id}
            products={products}
            productsFilters={data.filters}
          />
        )}
        {tab === "collections" && (
          <CollectionsDatatable
            filterId={data.id}
            collections={data.collections.map(
              (collection) => collection.collection
            )}
          />
        )}
      </div>
    );
  };

  const columns = [
    {
      name: "Acciones",
      width: "200px",
      cell: (row: IFilterGroup) => (
        <div className="flex justify-center gap-2">
          <Action action="create">
            {/* @ts-ignore */}
            <SharedForm
              filterGroupId={row.id}
              products={products}
              collections={collections.filter(
                (collection) =>
                  !row.collections.some(
                    (collectionOnPromotion) =>
                      collectionOnPromotion.collection.id === collection.id
                  )
              )}
            />
          </Action>
          <Action action="update">
            {/* @ts-ignore */}
            <Form filter={row} />
          </Action>
          <Action action="delete">
            {/* @ts-ignore */}
            <Form filter={row} />
          </Action>
        </div>
      ),
    },
    {
      name: "Nombre",
      maxwidth: "200px",
      selector: (row: { name: string }) => row.name,
      sortable: true,
      cell: (row: { name: string }) => row.name,
    },
    {
      name: "Clave",
      maxwidth: "200px",
      selector: (row: { key: string }) => row.key,
      sortable: true,
      cell: (row: { key: string }) => row.key,
    },
    {
      name: "Creado en",
      selector: (row: { createdAt: Date }) => row.createdAt,
      sortable: true,
      format: (row: { createdAt: Date }) =>
        formatDateLatinAmerican(row.createdAt),
    },
    {
      name: "Actualizado en",
      selector: (row: { updatedAt: Date }) => row.updatedAt,
      sortable: true,
      format: (row: { updatedAt: Date }) =>
        formatDateLatinAmerican(row.updatedAt),
    },
  ];

  // react-hydration-error SOLUTION
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);
  // react-hydration-error SOLUTION

  const { selectedRows, showMultiActions, handleSelectRows } =
    useRowSelection<IFilterGroup>();

  return (
    <>
      {filters.length > 0 ? (
        <>
          {isClient ? (
            <>
              {showMultiActions && (
                <div className="flex justify-end gap-2 mb-4">
                  <Action action="massiveDelete">
                    {/* @ts-ignore */}
                    <Form filter={selectedRows} />
                  </Action>
                </div>
              )}
              <CustomDatatable
                columns={columns}
                data={filters}
                onSelectedRowsChange={handleSelectRows}
                isExapandable
                expandableRowsComponent={(props) => (
                  <ExpandedComponent {...props} />
                )}
              />
            </>
          ) : (
            <DatatableSkeleton />
          )}
        </>
      ) : (
        <Card404
          title="No se encontraron filtros"
          description="Agrega un filtro para verlo aquí"
        />
      )}
    </>
  );
};

export default Datatable;
