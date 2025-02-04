"use client";

// import Form from "./Form";
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
import { Datatable as ProductDatatable } from "./Products";
import type { ExpanderComponentProps } from "react-data-table-component";
import type {
  IProduct,
  ICollection,
  IProductOnCollection,
  IFilterGroup,
  IProductFilter,
} from "@/app/shared/interfaces";
import { cn } from "@/app/shared/utils/cn";
import Form from "./Form";

const ExpandedComponent: React.FC<ExpanderComponentProps<IProductFilter>> = ({
  data,
}) => {
  return (
    <div className="pl-12 py-4 dark:bg-black dark:text-white">
      <h1 className="text-2xl">
        Productos del filtro de producto: {`"${data.name}"`}
      </h1>
      <ProductDatatable
        productFilterId={data.id}
        products={data.products.map((product) => product.product)}
      />
    </div>
  );
};

interface IDatatable {
  filterId: string;
  products: IProduct[];
  productsFilters: IProductFilter[];
}

const Datatable = ({ filterId, products, productsFilters }: IDatatable) => {
  const columns = [
    {
      name: "Acciones",
      width: "200px",
      cell: (row: IProductFilter) => (
        <div className="flex justify-center gap-2">
          <Action action="create">
            {/* @ts-ignore */}
            <Form
              products={products.filter(
                (product) =>
                  !row.products.some(
                    (productOnFilter) =>
                      productOnFilter.product.id === product.id
                  )
              )}
              productFilter={row}
            />
          </Action>
          <Action action="update">
            {/* @ts-ignore */}
            <Form productFilter={row} />
          </Action>
          <Action action="delete">
            {/* @ts-ignore */}
            <Form productFilter={row} />
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
    useRowSelection<IProductFilter>();

  return (
    <>
      {productsFilters.length > 0 ? (
        <>
          {isClient ? (
            <>
              {showMultiActions && (
                <div className="flex justify-start gap-2 mb-4">
                  <Action action="massiveDelete">
                    {/* @ts-ignore */}
                    <Form productFilter={selectedRows} />
                  </Action>
                </div>
              )}
              <CustomDatatable
                columns={columns}
                data={productsFilters}
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
          title="No se encontraron filtros de producto"
          description="Agrega un filtro de producto para verlo aquí"
        />
      )}
    </>
  );
};

export default Datatable;
