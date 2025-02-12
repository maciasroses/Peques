"use client";

import Form from "./Form";
import { useEffect, useState } from "react";
import { useRowSelection } from "@/app/shared/hooks";
import formatCurrency from "@/app/shared/utils/format-currency";
import formatDateLatinAmerican from "@/app/shared/utils/formatdate-latin";
import {
  Action,
  Card404,
  DatatableSkeleton,
  Datatable as CustomDatatable,
} from "@/app/shared/components";
import type { IProduct } from "@/app/shared/interfaces";
import { updateProductOnCollectionOrder } from "@/app/shared/services/collection/controller";

interface IProductWithOrder extends IProduct {
  order: number;
}

interface IDatatable {
  products: IProductWithOrder[];
  collectionId: string;
}

const Datatable = ({ products, collectionId }: IDatatable) => {
  const handleChangeOrder = async (id: string, order: number) => {
    await updateProductOnCollectionOrder({
      order,
      collectionId,
      productId: id,
    });
  };
  const columns = [
    {
      name: "Acciones",
      width: "100px",
      cell: (row: IProduct) => (
        <Action action="delete">
          {/* @ts-ignore */}
          <Form product={row} collectionId={collectionId} />
        </Action>
      ),
    },
    {
      name: "Orden de muestra",
      selector: (row: { order: number }) => row.order,
      sortable: true,
      cell: (row: { id: string; order: number }) => (
        <select
          defaultValue={row.order}
          onChange={(e) => handleChangeOrder(row.id, Number(e.target.value))}
          className="bg-accent text-white rounded-md p-3 border border-white"
        >
          {Array.from({ length: products.length }, (_, i) => i + 1).map(
            (value) => (
              <option key={value} value={value}>
                {value}
              </option>
            )
          )}
        </select>
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
    useRowSelection<IProduct>();

  return (
    <>
      {products.length > 0 ? (
        <>
          {isClient ? (
            <>
              {showMultiActions && (
                <div className="flex justify-start gap-2 my-4">
                  <Action action="massiveDelete">
                    {/* @ts-ignore */}
                    <Form product={selectedRows} collectionId={collectionId} />
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
          description="Agrega un producto a la colección para comenzar"
        />
      )}
    </>
  );
};

export default Datatable;
