"use client";

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
import type { IDiscountCode, IProduct } from "@/app/shared/interfaces";
import DiscountCodeForm from "./DiscountCodesForm";

interface IDiscountCodesDatatable {
  promotionId: string;
  discountCodes: IDiscountCode[];
}

const DiscountCodesDatatable = ({
  promotionId,
  discountCodes,
}: IDiscountCodesDatatable) => {
  const columns = [
    {
      name: "Acciones",
      width: "150px",
      cell: (row: IDiscountCode) => (
        <div className="flex justify-center gap-2">
          <Action action="update">
            {/* @ts-ignore */}
            <DiscountCodeForm discountCode={row} promotionId={promotionId} />
          </Action>
          <Action action="delete">
            {/* @ts-ignore */}
            <DiscountCodeForm discountCode={row} promotionId={promotionId} />
          </Action>
        </div>
      ),
    },
    {
      name: "Código",
      maxwidth: "200px",
      selector: (row: { code: string }) => row.code,
      sortable: true,
      cell: (row: { code: string }) => row.code,
    },
    {
      name: "# de Usos",
      maxwidth: "200px",
      selector: (row: { timesUsed: number }) => row.timesUsed,
      sortable: true,
      cell: (row: { timesUsed: number }) => row.timesUsed,
    },
    {
      name: "Limite de Usos",
      maxwidth: "200px",
      selector: (row: { usageLimit?: number }) => row.usageLimit || 0,
      sortable: true,
      cell: (row: { usageLimit?: number }) => row.usageLimit || "Sin límite",
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
    useRowSelection<IDiscountCode>();

  return (
    <>
      {discountCodes.length > 0 ? (
        <>
          {isClient ? (
            <>
              {showMultiActions && (
                <div className="flex justify-start gap-2 my-4">
                  <Action action="massiveDelete">
                    {/* @ts-ignore */}
                    <DiscountCodeForm
                      promotionId={promotionId}
                      discountCode={selectedRows}
                    />
                  </Action>
                </div>
              )}
              <CustomDatatable
                columns={columns}
                data={discountCodes}
                onSelectedRowsChange={handleSelectRows}
              />
            </>
          ) : (
            <DatatableSkeleton />
          )}
        </>
      ) : (
        <Card404
          title="No se encontraron código de descuento"
          description="Agrega un código de descuento a la promoción para comenzar"
        />
      )}
    </>
  );
};

export default DiscountCodesDatatable;
