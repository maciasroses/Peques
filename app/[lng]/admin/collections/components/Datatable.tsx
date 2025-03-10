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
} from "@/app/shared/interfaces";
import { updateCollectionOrderById } from "@/app/shared/services/collection/controller";

const ExpandedComponent: React.FC<ExpanderComponentProps<ICollection>> = ({
  data,
}) => {
  return (
    <div className="pl-12 py-4">
      <h1 className="text-2xl">
        Productos de la colección: {`"${data.name}"`}
      </h1>
      <ProductDatatable
        collectionId={data.id}
        products={data.products
          .map((product: IProductOnCollection) => ({
            ...product.product,
            order: product.order,
          }))
          .sort((a, b) => a.order - b.order)}
      />
    </div>
  );
};

interface IDatatable {
  products: IProduct[];
  collections: ICollection[];
}

const Datatable = ({ collections, products }: IDatatable) => {
  const handleChangeOrder = async (id: string, order: number) => {
    await updateCollectionOrderById({
      id,
      order,
    });
  };

  const columns = [
    {
      name: "Acciones",
      width: "200px",
      cell: (row: ICollection) => (
        <div className="flex justify-center gap-2">
          <Action action="create">
            {/* @ts-ignore */}
            <ProductForm
              collectionId={row.id}
              product={products.filter(
                (product) =>
                  !row.products.some(
                    (productOnCollection) =>
                      productOnCollection.product.id === product.id
                  )
              )}
            />
          </Action>
          <Action action="update">
            {/* @ts-ignore */}
            <Form collection={row} />
          </Action>
          <Action
            action="delete"
            cannotDelete={row.hero !== null || row.filters.length > 0}
          >
            {/* @ts-ignore */}
            <Form collection={row} />
          </Action>
        </div>
      ),
    },
    {
      name: "Orden de muestra",
      selector: (row: { order: number }) => row.order,
      sortable: true,
      cell: (row: { id: string; order: number }) => (
        <select
          defaultValue={row.order}
          onChange={(e) => handleChangeOrder(row.id, parseInt(e.target.value))}
          className="bg-accent text-white rounded-md p-3 border border-white"
        >
          {Array.from({ length: collections.length }, (_, i) => i + 1).map(
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
      name: "Imagen",
      maxwidth: "150px",
      selector: (row: { imageUrl: string }) => row.imageUrl,
      cell: (row: { imageUrl: string }) => (
        <div className="w-full h-[100px] relative rounded-md text-center p-2 m-2">
          <Image
            fill
            sizes="100px"
            alt="Imagen de la colección"
            src={row.imageUrl}
            className="object-contain size-full"
          />
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
      name: "Link",
      maxwidth: "200px",
      selector: (row: { link: string }) => row.link,
      cell: (row: { link: string }) => row.link,
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
    useRowSelection<ICollection>();

  return (
    <>
      {collections.length > 0 ? (
        <>
          {isClient ? (
            <>
              {showMultiActions && (
                <div className="flex justify-end gap-2 mb-4">
                  <Action
                    action="massiveDelete"
                    cannotDelete={selectedRows.some(
                      (row) => row.hero !== null || row.filters.length > 0
                    )}
                  >
                    {/* @ts-ignore */}
                    <Form collection={selectedRows} />
                  </Action>
                </div>
              )}
              <CustomDatatable
                columns={columns}
                data={collections}
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
          title="No se encontraron colleciones"
          description="Agrega una colleción para verla aquí"
        />
      )}
    </>
  );
};

export default Datatable;
