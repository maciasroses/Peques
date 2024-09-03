"use client";

// import Action from "./Action";
import Form from "./Form";
import { useRowSelection } from "@/hooks";
import { useEffect, useState } from "react";
import formatDateLatinAmerican from "@/utils/formatdate-latin";
import {
  Action,
  Card404,
  Datatable as CustomDatatable,
  DatatableSkeleton,
} from "@/components";
import type { IProvider } from "@/interfaces";

const columns = [
  {
    name: "Acciones",
    wdith: "100px",
    cell: (row: IProvider) => (
      <div className="flex justify-center gap-2">
        {/* <Action action="update" provider={row} /> */}
        <Action action="update">
          {/* @ts-ignore */}
          <Form provider={row} />
        </Action>
        {/* <Action
          action="delete"
          provider={row}
          canDelete={row._count.products > 0}
        /> */}
        <Action action="delete" cannotDelete={row._count.products > 0}>
          {/* @ts-ignore */}
          <Form provider={row} />
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
    name: "Alias",
    maxwidth: "200px",
    selector: (row: { alias: string }) => row.alias,
    sortable: true,
    cell: (row: { alias: string }) => row.alias,
  },
  {
    name: "Productos",
    selector: (row: { _count: { products: number } }) => row._count.products,
    sortable: true,
    cell: (row: { _count: { products: number } }) => row._count.products,
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

const Datatable = ({ providers }: { providers: IProvider[] }) => {
  // react-hydration-error SOLUTION
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);
  // react-hydration-error SOLUTION

  const { selectedRows, showMultiActions, handleSelectRows } =
    useRowSelection<IProvider>();

  return (
    <>
      {providers.length > 0 ? (
        <>
          {isClient ? (
            <>
              {showMultiActions && (
                <div className="flex justify-end gap-2 mb-4">
                  {/* <Action
                    action="massiveDelete"
                    provider={selectedRows}
                    canDelete={selectedRows.some(
                      (row) => row._count.products > 0
                    )} */}
                  <Action
                    action="massiveDelete"
                    cannotDelete={selectedRows.some(
                      (row) => row._count.products > 0
                    )}
                  >
                    {/* @ts-ignore */}
                    <Form provider={selectedRows} />
                  </Action>
                </div>
              )}
              <CustomDatatable
                columns={columns}
                data={providers}
                onSelectedRowsChange={handleSelectRows}
              />
            </>
          ) : (
            <DatatableSkeleton />
          )}
        </>
      ) : (
        <Card404
          title="No se encontraron proveedores"
          description="Agrega un proveedor para verlo aquí"
        />
      )}
    </>
  );
};

export default Datatable;
