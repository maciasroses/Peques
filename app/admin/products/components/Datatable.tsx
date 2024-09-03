"use client";

// import Action from "./Action";
import Form from "./Form";
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
import type { IProduct, IProvider } from "@/interfaces";

interface IDatatable {
  products: IProduct[];
  providers: IProvider[];
}

const Datatable = ({ products, providers }: IDatatable) => {
  const columns = [
    {
      name: "Acciones",
      wdith: "100px",
      cell: (row: IProduct) => (
        <div className="flex justify-center gap-2">
          {/* <Action action="update" product={row} providers={providers} /> */}
          <Action action="update">
            {/* @ts-ignore */}
            <Form product={row} providers={providers} />
          </Action>
          {/* <Action action="delete" product={row} /> */}
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
      name: "Cantidad",
      selector: (row: { quantityPerCarton: number }) => row.quantityPerCarton,
      sortable: true,
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
      name: "Proveedor",
      selector: (row: { provider: { alias: string } }) => row.provider.alias,
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
                  {/* <Action action="massiveDelete" product={selectedRows} /> */}
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
