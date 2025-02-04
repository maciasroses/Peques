"use client";

import Form from "./Form";
import { cn } from "@/app/shared/utils/cn";
import { useEffect, useState } from "react";
import ProductsDatatable from "./ProductsDatatable";
import { useResolvedTheme, useRowSelection } from "@/app/shared/hooks";
import formatDateLatinAmerican from "@/app/shared/utils/formatdate-latin";
import {
  Action,
  Card404,
  DatatableSkeleton,
  Datatable as CustomDatatable,
  Toast,
} from "@/app/shared/components";
import type { ExpanderComponentProps } from "react-data-table-component";
import type {
  IProduct,
  IPromotion,
  ICollection,
  IDiscountCode,
} from "@/app/shared/interfaces";
import formatCurrency from "@/app/shared/utils/format-currency";
import CollectionsDatatable from "./CollectionsDatatable";
import DiscountCodesDatatable from "./DiscountCodesDatatable";
import SharedForm from "./SharedForm";
import { EyeIcon, EyeSlashIcon } from "@/app/shared/icons";
import { activateNDeactivatePromotion } from "@/app/shared/services/promotion/controller";

const ExpandedComponent: React.FC<ExpanderComponentProps<IPromotion>> = ({
  data,
}) => {
  const [tab, setTab] = useState<"products" | "collections" | "discountCodes">(
    "products"
  );

  return (
    <div className="pl-12 py-4 dark:bg-black dark:text-white">
      <ul className="flex flex-row gap-4">
        <li>
          <button
            onClick={() => setTab("products")}
            className={cn(
              "px-4 py-2 rounded-md",
              tab === "products"
                ? "bg-primary dark:bg-primary-dark"
                : "bg-gray-200 text-gray-700"
            )}
          >
            Productos
          </button>
        </li>
        <li>
          <button
            onClick={() => setTab("collections")}
            className={cn(
              "px-4 py-2 rounded-md",
              tab === "collections"
                ? "bg-primary dark:bg-primary-dark"
                : "bg-gray-200 text-gray-700"
            )}
          >
            Colecciones
          </button>
        </li>
        <li>
          <button
            onClick={() => setTab("discountCodes")}
            className={cn(
              "px-4 py-2 rounded-md",
              tab === "discountCodes"
                ? "bg-primary dark:bg-primary-dark"
                : "bg-gray-200 text-gray-700"
            )}
          >
            Códigos de descuento
          </button>
        </li>
      </ul>
      {tab === "products" && (
        <ProductsDatatable
          promotionId={data.id}
          products={data.products.map((product) => product.product)}
        />
      )}
      {tab === "collections" && (
        <CollectionsDatatable
          promotionId={data.id}
          collections={data.collections.map(
            (collection) => collection.collection
          )}
        />
      )}
      {tab === "discountCodes" && (
        <DiscountCodesDatatable
          promotionId={data.id}
          discountCodes={data.discountCodes.map((discountCode) => discountCode)}
        />
      )}
    </div>
  );
};

interface IDatatable {
  products: IProduct[];
  promotions: IPromotion[];
  collections: ICollection[];
}

const Datatable = ({ products, promotions, collections }: IDatatable) => {
  const theme = useResolvedTheme();

  const handleActivateNDeactivatePromotion = async (promotionId: string) => {
    const rest = await activateNDeactivatePromotion({ id: promotionId });

    Toast({
      theme,
      message: rest.message,
      type: rest.success ? "success" : "error",
    });
  };

  const columns = [
    {
      name: "Acciones",
      width: "280px",
      cell: (row: IPromotion) => (
        <div className="flex justify-center gap-2">
          <Action action="create">
            {/* @ts-ignore */}
            <SharedForm
              promotionId={row.id}
              products={products.filter(
                (product) =>
                  !row.products.some(
                    (productOnPromotion) =>
                      productOnPromotion.product.id === product.id
                  )
              )}
              collections={collections.filter(
                (collection) =>
                  !row.collections.some(
                    (collectionOnPromotion) =>
                      collectionOnPromotion.collection.id === collection.id
                  )
              )}
            />
          </Action>
          <Action action="update">
            {/* @ts-ignore */}
            <Form promotion={row} />
          </Action>
          <button
            onClick={() => handleActivateNDeactivatePromotion(row.id)}
            className="bg-accent hover:bg-accent-dark focus:ring-accent text-white px-4 py-2 rounded-lg border border-white"
          >
            {row.isActive ? <EyeSlashIcon /> : <EyeIcon />}
          </button>
          <Action action="delete" cannotDelete={row.orders.length > 0}>
            {/* @ts-ignore */}
            <Form promotion={row} />
          </Action>
        </div>
      ),
    },
    {
      name: "Estatus de la promoción",
      maxwidth: "200px",
      selector: (row: { isActive: boolean }) => row.isActive,
      sortable: true,
      cell: (row: { isActive: boolean }) =>
        row.isActive ? "Activa" : "Inactiva",
    },
    {
      name: "Título",
      maxwidth: "200px",
      selector: (row: { title: string }) => row.title,
      sortable: true,
      cell: (row: { title: string }) => row.title,
    },
    {
      name: "Descripción",
      maxwidth: "200px",
      selector: (row: { description: string }) => row.description,
      sortable: true,
      cell: (row: { description: string }) => row.description,
    },
    {
      name: "Tipo de descuento",
      maxwidth: "200px",
      selector: (row: { discountType: string }) => row.discountType,
      sortable: true,
      cell: (row: { discountType: string }) =>
        row.discountType === "PERCENTAGE" ? "Porcentaje" : "Monto",
    },
    {
      name: "Valor del descuento",
      maxwidth: "200px",
      selector: (row: { discountValue: string }) => row.discountValue,
      sortable: true,
      cell: (row: { discountType: string; discountValue: string }) =>
        row.discountType === "PERCENTAGE"
          ? `${row.discountValue}%`
          : `${formatCurrency(Number(row.discountValue), "MXN")}`,
    },
    {
      name: "Inicio",
      selector: (row: { startDate: Date }) => row.startDate,
      sortable: true,
      format: (row: { startDate: Date }) =>
        formatDateLatinAmerican(row.startDate),
    },
    {
      name: "Fin",
      selector: (row: { endDate: Date }) => row.endDate,
      sortable: true,
      format: (row: { endDate: Date }) => formatDateLatinAmerican(row.endDate),
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
    useRowSelection<IPromotion>();

  return (
    <>
      {promotions.length > 0 ? (
        <>
          {isClient ? (
            <>
              {showMultiActions && (
                <div className="flex justify-end gap-2 mb-4">
                  <Action
                    action="massiveDelete"
                    cannotDelete={selectedRows.some(
                      (row) => row.orders.length > 0
                    )}
                  >
                    {/* @ts-ignore */}
                    <Form promotion={selectedRows} />
                  </Action>
                </div>
              )}
              <CustomDatatable
                columns={columns}
                data={promotions}
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
          title="No se encontraron promociones"
          description="Agrega una promoción para verla aquí"
        />
      )}
    </>
  );
};

export default Datatable;
