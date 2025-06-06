"use client";

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
} from "@/app/shared/interfaces";
import Form from "./Form";

interface IDatatable {
  filterId: string;
  collections: ICollection[];
}

const Datatable = ({ filterId, collections }: IDatatable) => {
  const columns = [
    {
      name: "Acciones",
      width: "100px",
      cell: (row: ICollection) => (
        <div className="flex justify-center gap-2">
          <Action action="delete">
            {/* @ts-ignore */}
            <Form collection={row} filterId={filterId} />
          </Action>
        </div>
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
                <div className="flex justify-start gap-2 mb-4">
                  <Action action="massiveDelete">
                    {/* @ts-ignore */}
                    <Form collection={selectedRows} filterId={filterId} />
                  </Action>
                </div>
              )}
              <CustomDatatable
                columns={columns}
                data={collections}
                onSelectedRowsChange={handleSelectRows}
              />
            </>
          ) : (
            <DatatableSkeleton />
          )}
        </>
      ) : (
        <Card404
          title="No se encontraron colecciones"
          description="Agrega una colección para verla aquí"
        />
      )}
    </>
  );
};

export default Datatable;
