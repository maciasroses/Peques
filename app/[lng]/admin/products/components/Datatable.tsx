"use client";

import Form from "./Form";
import { useRowSelection } from "@/app/shared/hooks";
import { useEffect, useState } from "react";
import formatCurrency from "@/app/shared/utils/format-currency";
import { Form as HistoryForm, Datatable as HistoryDatatable } from "./History";
import formatDateLatinAmerican from "@/app/shared/utils/formatdate-latin";
import {
  Action,
  Card404,
  Datatable as CustomDatatable,
  DatatableSkeleton,
} from "@/app/shared/components";
import type { IProduct, IProvider } from "@/app/shared/interfaces";
import type {
  ConditionalStyles,
  ExpanderComponentProps,
} from "react-data-table-component";

const ExpandedComponent: React.FC<ExpanderComponentProps<IProduct>> = ({
  data,
}) => {
  return (
    <div className="pl-12 py-4">
      <h1 className="text-2xl">
        Historial de pedidos del producto: {`"${data.name}"`}
      </h1>
      <HistoryDatatable orders={data._count.orders} history={data.history} />
    </div>
  );
};

const conditionalRowStyles = (theme: string): ConditionalStyles<IProduct>[] => {
  return [
    {
      when: (row: IProduct) =>
        row.availableQuantity > row.minimumAcceptableQuantity,
      style: {
        backgroundColor: theme === "dark" ? "#BCFBBF" : "#BCFBBF",
      },
    },
    {
      when: (row: IProduct) =>
        row.availableQuantity <= row.minimumAcceptableQuantity &&
        row.availableQuantity > 0,
      style: {
        backgroundColor: theme === "dark" ? "#FBF2BC" : "#FBF2BC",
      },
    },
    {
      when: (row: IProduct) => row.availableQuantity === 0,
      style: {
        backgroundColor: theme === "dark" ? "#FBBCC0" : "#FBBCC0",
      },
    },
  ];
};

interface IDatatable {
  products: IProduct[];
  providers: IProvider[];
}

const Datatable = ({ products, providers }: IDatatable) => {
  const columns = [
    {
      name: "Acciones",
      width: "200px",
      cell: (row: IProduct) => (
        <div className="flex justify-center gap-2">
          <Action action="create">
            {/* @ts-ignore */}
            <HistoryForm productId={row.id} />
          </Action>
          <Action action="update">
            {/* @ts-ignore */}
            <Form product={row} providers={providers} />
          </Action>
          <Action action="delete" cannotDelete={row._count.orders > 0}>
            {/* @ts-ignore */}
            <Form product={row} />
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
      selector: (row: { key: string }) => row.key,
      sortable: true,
      cell: (row: { key: string }) => row.key,
    },
    {
      name: "Cantidad Disponible",
      selector: (row: { availableQuantity: number }) => row.availableQuantity,
      sortable: true,
    },
    {
      name: "Cantidad mínima Aceptable",
      selector: (row: { minimumAcceptableQuantity: number }) =>
        row.minimumAcceptableQuantity,
      sortable: true,
    },
    {
      name: "Precio de Venta",
      selector: (row: { salePriceMXN: number }) => row.salePriceMXN,
      sortable: true,
      format: (row: { salePriceMXN: number }) =>
        formatCurrency(row.salePriceMXN, "MXN"),
    },
    {
      name: "Proveedor",
      selector: (row: { provider: { name: string } }) => row.provider.name,
      sortable: true,
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
    useRowSelection<IProduct>();

  return (
    <>
      {products.length > 0 ? (
        <>
          {isClient ? (
            <>
              {showMultiActions && (
                <div className="flex justify-end gap-2 mb-4">
                  <Action
                    action="massiveDelete"
                    cannotDelete={selectedRows.some(
                      (row) => row._count.orders > 0
                    )}
                  >
                    {/* @ts-ignore */}
                    <Form product={selectedRows} />
                  </Action>
                </div>
              )}
              <CustomDatatable
                columns={columns}
                data={products}
                onSelectedRowsChange={handleSelectRows}
                isExapandable
                expandableRowsComponent={(props) => (
                  <ExpandedComponent {...props} />
                )}
                conditionalRowStyles={conditionalRowStyles}
              />
            </>
          ) : (
            <DatatableSkeleton />
          )}
        </>
      ) : (
        <Card404
          title="No se encontraron productos"
          description="Agrega un producto para verlo aquí"
        />
      )}
    </>
  );
};

export default Datatable;
