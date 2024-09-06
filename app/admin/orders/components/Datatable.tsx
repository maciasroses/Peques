"use client";

import Form from "./Form";
import { useRowSelection } from "@/hooks";
import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import formatCurrency from "@/utils/format-currency";
import {
  markAsPaid,
  markMassiveAsPaid,
  updateDeliveryStatus,
  updateMassiveDeliveryStatus,
} from "@/services/order/controller";
import {
  Action,
  Card404,
  DatatableSkeleton,
  Datatable as CustomDatatable,
} from "@/components";
import type { IOrder } from "@/interfaces";

interface IDatatable {
  orders: IOrder[];
}

interface IProductInOrder {
  productId: string;
  orderId: string;
  quantity: number;
  product: {
    name: string;
  };
}

const Datatable = ({ orders }: IDatatable) => {
  const pathname = usePathname();
  // const [selectedValue, setSelectedValue] = useState<string | null>(null);
  // const [previousSelect, setPreviousSelect] = useState<string | null>(null);
  const { selectedRows, showMultiActions, handleSelectRows } =
    useRowSelection<IOrder>();

  const handleSelectDeliveryStatus = async (
    id: string,
    event: React.ChangeEvent<HTMLSelectElement>,
    isMassive?: boolean
  ) => {
    // if (event.target.value === "CANCELLED") {
    //   setPreviousSelect(selectedValue);
    // } else {
    //   setSelectedValue(event.target.value);
    // }
    // console.log("selectedValue", selectedValue);
    // console.log("previousSelect", previousSelect);
    if (isMassive) {
      await updateMassiveDeliveryStatus(
        selectedRows.map((row) => row.id),
        event.target.value
      );
      location.replace(pathname);
    } else {
      await updateDeliveryStatus(id, event.target.value, pathname);
    }
  };

  const handleIsPaid = async (id: string, isMassive?: boolean) => {
    if (isMassive) {
      await markMassiveAsPaid(selectedRows.map((row) => row.id));
      location.reload();
    } else {
      await markAsPaid(id);
    }
  };

  const columns = [
    {
      name: "Acciones",
      width: pathname === "/admin/orders" ? "250px" : "80px",
      cell: (row: IOrder) => (
        <div className="flex justify-center gap-2">
          <Action action="delete">
            {/* @ts-ignore */}
            <Form order={row} />
          </Action>
          {pathname === "/admin/orders" && (
            <button
              onClick={() => handleIsPaid(row.id)}
              className={"bg-accent text-white rounded-md p-2"}
            >
              Marcar como Pagado
            </button>
          )}
        </div>
      ),
    },
    {
      name: "Estado de Entrega",
      selector: (row: { deliveryStatus: string }) => row.deliveryStatus,
      sortable: true,
      width: "140px",
      format: (row: { id: string; deliveryStatus: string }) => {
        if (row.deliveryStatus === "CANCELLED") {
          return <span className="text-red-500 font-semibold">Cancelado</span>;
        } else {
          return (
            <select
              defaultValue={row.deliveryStatus}
              onChange={(event) => handleSelectDeliveryStatus(row.id, event)}
              className="bg-accent text-white rounded-md p-2 w-full"
            >
              <option value="PENDING">Pendiente</option>
              <option value="DELIVERED">Entregado</option>
              <option value="CANCELLED">Cancelado</option>
            </select>
          );
        }
      },
    },
    {
      name: "Tipo de Envío",
      selector: (row: { shipmentType: string }) => row.shipmentType,
      sortable: true,
    },
    {
      name: "Cliente",
      selector: (row: { client: string }) => row.client,
      sortable: true,
    },
    {
      name: "Producto(s)",
      width: "300px",
      cell: (row: { products: IProductInOrder[] }) => (
        <li className="list-none list-inside m-2 space-y-2">
          {row.products.map((product, index) => (
            <ul key={index}>
              {product.product.name} - {product.quantity}
            </ul>
          ))}
        </li>
      ),
    },
    {
      name: "Descuento",
      selector: (row: { discount: number }) => row.discount,
      sortable: true,
      format: (row: { discount: number }) => `${row.discount}%`,
    },
    {
      name: "Subtotal",
      selector: (row: { subtotal: number }) => row.subtotal,
      sortable: true,
      format: (row: { subtotal: number }) =>
        formatCurrency(row.subtotal, "MXN"),
    },
    {
      name: "Total",
      selector: (row: { total: number }) => row.total,
      sortable: true,
      format: (row: { total: number }) => formatCurrency(row.total, "MXN"),
    },
  ];

  // react-hydration-error SOLUTION
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);
  // react-hydration-error SOLUTION

  return (
    <>
      {orders.length > 0 ? (
        <>
          {isClient ? (
            <>
              {showMultiActions && (
                <div className="flex justify-end gap-2 mb-4">
                  <Action action="massiveDelete">
                    {/* @ts-ignore */}
                    <Form order={selectedRows} />
                  </Action>
                  {pathname === "/admin/orders" && (
                    <button
                      onClick={() => handleIsPaid(selectedRows[0].id, true)}
                      className={"bg-accent text-white rounded-md p-2"}
                    >
                      Marcar como Pagado
                    </button>
                  )}
                  {!selectedRows.some(
                    (row) => row.deliveryStatus === "CANCELLED"
                  ) && (
                    <select
                      onChange={(event) =>
                        handleSelectDeliveryStatus(
                          selectedRows[0].id,
                          event,
                          true
                        )
                      }
                      className="bg-accent text-white rounded-md p-2"
                    >
                      <option value="">Estado de Envio</option>
                      <option value="PENDING">Pendiente</option>
                      <option value="DELIVERED">Entregado</option>
                      <option value="CANCELLED">Cancelado</option>
                    </select>
                  )}
                </div>
              )}
              <CustomDatatable
                columns={columns}
                data={orders}
                onSelectedRowsChange={handleSelectRows}
              />
            </>
          ) : (
            <DatatableSkeleton />
          )}
        </>
      ) : (
        <Card404
          title="No hay ordenes"
          description="Agrega una orden para verla aquí"
        />
      )}
    </>
  );
};

export default Datatable;
