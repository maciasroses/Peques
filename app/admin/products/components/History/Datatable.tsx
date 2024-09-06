"use client";

import { useRowSelection } from "@/hooks";
import { useEffect, useState } from "react";
import formatCurrency from "@/utils/format-currency";
import formatDateLatinAmerican from "@/utils/formatdate-latin";
import {
  Action,
  Card404,
  Datatable as CustomDatatable,
  DatatableSkeleton,
} from "@/components";
import type { IProductHistory } from "@/interfaces";
import Form from "./Form";

interface IDatatable {
  orders: number;
  history: IProductHistory[];
}

const Datatable = ({ orders, history }: IDatatable) => {
  const columns = [
    {
      name: "Acciones",
      width: "140px",
      cell: (row: IProductHistory) => (
        <div className="flex justify-center gap-2">
          <Action action="update" cannotDelete={orders > 0}>
            {/* @ts-ignore */}
            <Form productId={row.productId} history={row} />
          </Action>
          <Action action="delete" cannotDelete={orders > 0}>
            {/* @ts-ignore */}
            <Form productId={row.productId} history={row} />
          </Action>
        </div>
      ),
    },
    {
      name: "Cantidad",
      selector: (row: { quantityPerCarton: number }) => row.quantityPerCarton,
      sortable: true,
    },
    {
      name: "Cambio de Dolar",
      selector: (row: { dollarExchangeRate: number }) => row.dollarExchangeRate,
      sortable: true,
      format: (row: { dollarExchangeRate: number }) =>
        formatCurrency(row.dollarExchangeRate, "USD"),
    },
    {
      name: "Costo de China (USD)",
      selector: (row: { chinesePriceUSD: number }) => row.chinesePriceUSD,
      sortable: true,
      format: (row: { chinesePriceUSD: number }) =>
        formatCurrency(row.chinesePriceUSD, "USD"),
    },
    {
      name: "Costo por cantidad (USD)",
      selector: (row: { pricePerCartonOrProductUSD: number }) =>
        row.pricePerCartonOrProductUSD,
      sortable: true,
      format: (row: { pricePerCartonOrProductUSD: number }) =>
        formatCurrency(row.pricePerCartonOrProductUSD, "USD"),
    },
    {
      name: "Costo (MXN)",
      selector: (row: { costMXN: number }) => row.costMXN,
      sortable: true,
      format: (row: { costMXN: number }) => formatCurrency(row.costMXN, "MXN"),
    },
    {
      name: "Costo de Envio (MXN)",
      selector: (row: { shippingCostMXN: number }) => row.shippingCostMXN,
      sortable: true,
      format: (row: { shippingCostMXN: number }) =>
        formatCurrency(row.shippingCostMXN, "MXN"),
    },
    {
      name: "Costo Total (MXN)",
      selector: (row: { totalCostMXN: number }) => row.totalCostMXN,
      sortable: true,
      format: (row: { totalCostMXN: number }) =>
        formatCurrency(row.totalCostMXN, "MXN"),
    },
    {
      name: "Precio de Venta (MXN)",
      selector: (row: { salePriceMXN: number }) => row.salePriceMXN,
      sortable: true,
      format: (row: { salePriceMXN: number }) =>
        formatCurrency(row.salePriceMXN, "MXN"),
    },
    {
      name: "Margen (%)",
      selector: (row: { margin: number }) => row.margin,
      sortable: true,
      format: (row: { margin: number }) => (
        <span
          className={`${
            row.margin >= 0 ? "text-green-900" : "text-red-900"
          } font-semibold`}
        >
          {row.margin.toFixed(2)}%
        </span>
      ),
    },
    {
      name: "Venta por cantidad (MXN)",
      selector: (row: { salePerQuantity: number }) => row.salePerQuantity,
      sortable: true,
      format: (row: { salePerQuantity: number }) =>
        formatCurrency(row.salePerQuantity, "MXN"),
    },
    {
      name: "Fecha de Pedido",
      selector: (row: { orderDate: Date }) => row.orderDate,
      sortable: true,
      format: (row: { orderDate: Date }) =>
        formatDateLatinAmerican(row.orderDate),
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
    useRowSelection<IProductHistory>();

  return (
    <>
      {history.length > 0 ? (
        <>
          {isClient ? (
            <>
              {showMultiActions && (
                <div className="flex justify-end gap-2 my-4">
                  <Action action="massiveDelete" cannotDelete={orders > 0}>
                    {/* @ts-ignore */}
                    <Form
                      history={selectedRows}
                      productId={selectedRows[0].productId}
                    />
                  </Action>
                </div>
              )}
              <CustomDatatable
                columns={columns}
                data={history}
                onSelectedRowsChange={handleSelectRows}
              />
            </>
          ) : (
            <DatatableSkeleton />
          )}
        </>
      ) : (
        <Card404
          title="No se encontró historial"
          description="Agrega una orden para verlo aquí"
        />
      )}
    </>
  );
};

export default Datatable;
