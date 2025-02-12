"use client";

import Form from "./Form";
import { useEffect, useState } from "react";
import { useRowSelection } from "@/app/shared/hooks";
import formatCurrency from "@/app/shared/utils/format-currency";
import formatDateLatinAmerican from "@/app/shared/utils/formatdate-latin";
import { Form as HistoryForm, Datatable as HistoryDatatable } from "./History";
import { Datatable as FilesDatatable } from "./Files";
import {
  Action,
  Card404,
  DatatableSkeleton,
  Datatable as CustomDatatable,
} from "@/app/shared/components";
import type { IProduct, IProvider } from "@/app/shared/interfaces";
import type {
  ConditionalStyles,
  ExpanderComponentProps,
} from "react-data-table-component";
import SharedForm from "./SharedForm";
import { cn } from "@/app/shared/utils/cn";
import { activateNDeactivateProduct } from "@/app/shared/services/product/controller";

const ExpandedComponent: React.FC<ExpanderComponentProps<IProduct>> = ({
  data,
}) => {
  const [tab, setTab] = useState<"files" | "history">("files");

  return (
    <div className="pl-12 py-4 dark:bg-black dark:text-white">
      <ul className="flex flex-row gap-4">
        <li>
          <button
            onClick={() => setTab("files")}
            className={cn(
              "px-4 py-2 rounded-md",
              tab === "files"
                ? "bg-primary dark:bg-primary-dark"
                : "bg-gray-200 text-gray-700"
            )}
          >
            Archivos
          </button>
        </li>
        <li>
          <button
            onClick={() => setTab("history")}
            className={cn(
              "px-4 py-2 rounded-md",
              tab === "history"
                ? "bg-primary dark:bg-primary-dark"
                : "bg-gray-200 text-gray-700"
            )}
          >
            Historial de pedidos
          </button>
        </li>
      </ul>
      {tab === "files" && (
        <FilesDatatable
          files={data.files.sort((a, b) => a.order - b.order)}
          productId={data.id}
        />
      )}
      {tab === "history" && (
        <HistoryDatatable
          orders={(data._count as { orders: number })?.orders}
          history={data.history}
        />
      )}
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
  const handleActivateNDeactivateProduct = async (
    productId: string,
    isActive: boolean
  ) => {
    await activateNDeactivateProduct(productId, isActive);
  };

  const columns = [
    {
      name: "Acciones",
      width: "200px",
      cell: (row: IProduct) => (
        <div className="flex justify-center gap-2">
          <Action action="create">
            {/* @ts-ignore */}
            <SharedForm productId={row.id} />
          </Action>
          <Action action="update">
            {/* @ts-ignore */}
            <Form product={row} providers={providers} />
          </Action>
          <Action
            action="delete"
            cannotDelete={(row._count as { orders: number })?.orders > 0}
          >
            {/* @ts-ignore */}
            <Form product={row} />
          </Action>
        </div>
      ),
    },
    {
      name: "¿Es visible?",
      selector: (row: { isActive: boolean }) => row.isActive,
      sortable: true,
      cell: (row: { id: string; isActive: boolean }) => (
        <select
          defaultValue={row.isActive ? "true" : "false"}
          onChange={(e) => {
            handleActivateNDeactivateProduct(row.id, e.target.value === "true");
          }}
          className="bg-accent text-white rounded-md p-3 border border-white"
        >
          <option value="true">Sí</option>
          <option value="false">No</option>
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
      name: "Descripción",
      width: "600px",
      selector: (row: { description: string }) => row.description,
      cell: (row: { description: string }) => (
        <div
          className="max-w-[600px] max-h-[300px] overflow-y-auto ql-editor"
          dangerouslySetInnerHTML={{ __html: row.description }}
        />
      ),
    },
    {
      name: "¿Es personalizable?",
      width: "160px",
      selector: (row: { isCustomizable: boolean }) => row.isCustomizable,
      sortable: true,
      cell: (row: { isCustomizable: boolean }) =>
        row.isCustomizable ? "Sí" : "No",
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
                <div className="flex justify-end gap-2 mb-4">
                  <Action
                    action="massiveDelete"
                    cannotDelete={selectedRows.some(
                      (row) => (row._count as { orders: number })?.orders > 0
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
