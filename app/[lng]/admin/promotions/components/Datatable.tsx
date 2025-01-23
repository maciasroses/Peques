"use client";

import Form from "./Form";
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
  IPromotion,
} from "@/app/shared/interfaces";

// const ExpandedComponent: React.FC<ExpanderComponentProps<ICollection>> = ({
//   data,
// }) => {
//   return (
//     <div className="pl-12 py-4 dark:bg-black dark:text-white">
//       <h1 className="text-2xl">
//         Productos de la colección: {`"${data.name}"`}
//       </h1>
//       <ProductDatatable
//         collectionId={data.id}
//         products={data.products.map(
//           (product: IProductOnCollection) => product.product
//         )}
//       />
//     </div>
//   );
// };

interface IDatatable {
  promotions: IPromotion[];
}

const Datatable = ({ promotions }: IDatatable) => {
  const columns = [
    {
      name: "Nombre",
      maxwidth: "200px",
      selector: (row: { title: string }) => row.title,
      sortable: true,
      cell: (row: { title: string }) => row.title,
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
    useRowSelection<IPromotion>();

  return (
    <>
      {promotions.length > 0 ? (
        <>
          {isClient ? (
            <>
              {showMultiActions && (
                <div className="flex justify-end gap-2 mb-4">
                  <Action action="massiveDelete">
                    {/* @ts-ignore */}
                    <Form collection={selectedRows} />
                  </Action>
                </div>
              )}
              <CustomDatatable
                columns={columns}
                data={promotions}
                onSelectedRowsChange={handleSelectRows}
                isExapandable
                // expandableRowsComponent={(props) => (
                //   <ExpandedComponent {...props} />
                // )}
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
