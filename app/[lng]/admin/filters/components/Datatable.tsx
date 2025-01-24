"use client";

import Form from "./Form";
import Image from "next/image";
import { useEffect, useState } from "react";
import { useRowSelection } from "@/app/shared/hooks";
import formatDateLatinAmerican from "@/app/shared/utils/formatdate-latin";
import { Form as ProductForm, Datatable as ProductDatatable } from "./Products";
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

const ExpandedComponent: React.FC<ExpanderComponentProps<IFilterGroup>> = ({
  data,
}) => {
  return (
    <div className="pl-12 py-4 dark:bg-black dark:text-white">
      <h1 className="text-2xl">
        Productos de la colección: {`"${data.name}"`}
      </h1>
      {/* <ProductDatatable
        collectionId={data.id}
        products={data.products.map(
          (product: IProductOnCollection) => product.product
        )}
      /> */}
    </div>
  );
};

interface IDatatable {
  products: IProduct[];
  filters: IFilterGroup[];
  collections: ICollection[];
}

const Datatable = ({ filters, collections, products }: IDatatable) => {
  const columns = [
    {
      name: "Acciones",
      width: "200px",
      cell: (row: IFilterGroup) => (
        <div className="flex justify-center gap-2">
          {/* <Action action="create"> */}
          {/* @ts-ignore */}
          {/* <SharedForm
              promotionId={row.id}
              products={products.filter(
                (product) =>
                  !row.products.some(
                    (productOnPromotion) =>
                      productOnPromotion.product.id === product.id
                  )
              )}
              collections={collections.filter(
                (collection) =>
                  !row.collections.some(
                    (collectionOnPromotion) =>
                      collectionOnPromotion.collection.id === collection.id
                  )
              )}
            /> */}
          {/* </Action> */}
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
      selector: (row: { createdAt: Date }) => row.createdAt.toString(),
      sortable: true,
      format: (row: { createdAt: Date }) =>
        formatDateLatinAmerican(row.createdAt),
    },
    {
      name: "Actualizado en",
      selector: (row: { updatedAt: Date }) => row.updatedAt.toString(),
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
