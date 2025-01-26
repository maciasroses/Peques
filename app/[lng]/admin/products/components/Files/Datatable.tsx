"use client";

import { useRowSelection } from "@/app/shared/hooks";
import { useEffect, useState } from "react";
import formatCurrency from "@/app/shared/utils/format-currency";
import formatDateLatinAmerican from "@/app/shared/utils/formatdate-latin";
import {
  Action,
  Card404,
  Datatable as CustomDatatable,
  DatatableSkeleton,
} from "@/app/shared/components";
import type { IProductFile, IProductHistory } from "@/app/shared/interfaces";
import Form from "./Form";
import Image from "next/image";

interface IDatatable {
  productId: string;
  files: IProductFile[];
}

const Datatable = ({ files, productId }: IDatatable) => {
  const columns = [
    {
      name: "Acciones",
      width: "80px",
      cell: (row: IProductFile) => (
        <div className="flex justify-center gap-2">
          <Action action="delete">
            {/* @ts-ignore */}
            <Form productId={productId} file={row} />
          </Action>
        </div>
      ),
    },
    {
      name: "Archivo",
      maxWidth: "200px",
      selector: (row: IProductFile) => row.url,
      cell: (row: IProductFile) => {
        return (
          <div className="w-full h-[100px] relative rounded-md text-center p-2 m-2">
            {row.type === "IMAGE" ? (
              <Image
                fill
                sizes="100px"
                alt="Imagen del producto"
                src={row.url}
                className="object-contain size-full"
              />
            ) : (
              <video
                controls
                src={row.url}
                className="object-contain size-full"
              />
            )}
          </div>
        );
      },
    },
    {
      name: "Tipo de archivo",
      selector: (row: IProductFile) => row.type,
      sortable: true,
      cell: (row: IProductFile) => (row.type === "IMAGE" ? "Imagen" : "Video"),
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
    useRowSelection<IProductFile>();

  return (
    <>
      {files.length > 0 ? (
        <>
          {isClient ? (
            <>
              {showMultiActions && (
                <div className="flex justify-start gap-2 my-4">
                  <Action action="massiveDelete">
                    {/* @ts-ignore */}
                    <Form file={selectedRows} productId={productId} />
                  </Action>
                </div>
              )}
              <CustomDatatable
                columns={columns}
                data={files}
                onSelectedRowsChange={handleSelectRows}
              />
            </>
          ) : (
            <DatatableSkeleton />
          )}
        </>
      ) : (
        <Card404
          title="No se encontraron archivos"
          description="Agrega un archivo para verlo aquí"
        />
      )}
    </>
  );
};

export default Datatable;
