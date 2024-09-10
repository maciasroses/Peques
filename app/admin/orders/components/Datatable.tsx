"use client";

import clsx from "clsx";
import Form from "./Form";
import useModal from "@/hooks/useModal";
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
  Modal,
} from "@/components";
import type { IOrder } from "@/interfaces";
import formatDateLatinAmerican from "@/utils/formatdate-latin";

interface IDatatable {
  orders: IOrder[];
}

interface IProductInOrder {
  productId: string;
  orderId: string;
  quantity: number;
  costMXN: number;
  product: {
    name: string;
  };
}

const Datatable = ({ orders }: IDatatable) => {
  const pathname = usePathname();
  const { isOpen, onOpen, onClose } = useModal();
  const [isMassiveForConfirm, setIsMassiveForConfirm] = useState(false);
  const [selectedRowForConfirm, setSelectedRowForConfirm] = useState<
    IOrder | undefined
  >(undefined);
  const [eventForConfirm, setEventForConfim] =
    useState<React.ChangeEvent<HTMLSelectElement>>();
  const { selectedRows, showMultiActions, handleSelectRows } =
    useRowSelection<IOrder>();

  const handleCancel = async () => {
    location.replace(pathname);
  };

  const handleSelectDeliveryStatus = async (
    id: string,
    event: React.ChangeEvent<HTMLSelectElement>,
    isMassive?: boolean,
    confirm?: boolean
  ) => {
    const newValue = event.target.value;
    const order = orders.find((order) => order.id === id);

    if (newValue === "CANCELLED" && !confirm) {
      if (isMassive) {
        setIsMassiveForConfirm(true);
      } else {
        setSelectedRowForConfirm(order);
      }
      setEventForConfim(event);
      onOpen();
    } else {
      if (isMassive) {
        await updateMassiveDeliveryStatus(
          selectedRows.map((row) => row.id),
          newValue
        );
        location.replace(pathname);
      } else {
        await updateDeliveryStatus(id, newValue, pathname);
      }
    }
    if (confirm) onClose();
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
              onClick={
                row.deliveryStatus !== "CANCELLED"
                  ? () => handleIsPaid(row.id)
                  : () => {}
              }
              className={clsx(
                "bg-accent text-white rounded-md p-2 border borde-white",
                row.deliveryStatus === "CANCELLED" &&
                  "opacity-50 cursor-not-allowed"
              )}
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
              className="bg-accent text-white rounded-md p-2 w-full border border-white"
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
              {product.product.name} - {product.quantity}u -{" "}
              {formatCurrency(product.costMXN, "MXN")}
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
      name: "Método de Pago",
      selector: (row: { paymentMethod: string }) => row.paymentMethod,
      sortable: true,
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
    {
      name: "Creado en",
      selector: (row: { createdAt: string }) => row.createdAt,
      sortable: true,
      format: (row: { createdAt: Date }) =>
        formatDateLatinAmerican(row.createdAt),
    },
    {
      name: "Actualizado en",
      selector: (row: { updatedAt: string }) => row.updatedAt,
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

  return (
    <>
      {orders.length > 0 ? (
        <>
          {isClient ? (
            <>
              <Modal isOpen={isOpen} onClose={handleCancel}>
                <div className="flex flex-col gap-2">
                  <span className="text-2xl text-center text-red-500">
                    ⚠️ Acción irreversible ⚠️
                  </span>
                  <h1 className="text-center text-base md:text-xl">
                    {isMassiveForConfirm
                      ? `¿Estás seguro de cancelar ${
                          pathname === "/admin/orders"
                            ? "estos pedidos"
                            : "estas ventas"
                        }?`
                      : `¿Estás seguro de cancelar ${
                          pathname === "/admin/orders"
                            ? "este pedido"
                            : "esta venta"
                        }?`}
                  </h1>
                  {isMassiveForConfirm ? (
                    <ul className="flex flex-col gap-2 items-center">
                      {selectedRows.map((row, index) => (
                        <li key={index} className="flex gap-2">
                          <span>{row.client}</span>
                          {" | "}
                          <span>{row.shipmentType}</span>
                          {" | "}
                          <ul>
                            {row.products.map((product, index) => (
                              <li key={index}>
                                {
                                  (product as unknown as IProductInOrder)
                                    .product.name
                                }{" "}
                                -{" "}
                                {
                                  (product as unknown as IProductInOrder)
                                    .quantity
                                }{" "}
                                -{" "}
                                {formatCurrency(
                                  (product as unknown as IProductInOrder)
                                    .costMXN,
                                  "MXN"
                                )}
                              </li>
                            ))}
                          </ul>
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <div className="flex gap-2 justify-center">
                      {selectedRowForConfirm?.client}
                      {" | "}
                      {selectedRowForConfirm?.shipmentType}
                      {" | "}
                      <ul>
                        {selectedRowForConfirm?.products.map(
                          (product, index) => (
                            <li key={index}>
                              {
                                (product as unknown as IProductInOrder).product
                                  .name
                              }{" "}
                              -{" "}
                              {(product as unknown as IProductInOrder).quantity}{" "}
                              -{" "}
                              {formatCurrency(
                                (product as unknown as IProductInOrder).costMXN,
                                "MXN"
                              )}
                            </li>
                          )
                        )}
                      </ul>
                    </div>
                  )}
                </div>
                <div className="flex justify-center gap-2 mt-4">
                  <button
                    onClick={() =>
                      handleSelectDeliveryStatus(
                        selectedRowForConfirm?.id as string,
                        eventForConfirm!,
                        isMassiveForConfirm,
                        true
                      )
                    }
                    className="bg-accent hover:bg-accent-dark focus:ring-accent text-white px-4 py-2 rounded-lg"
                  >
                    Sí, cancelar
                  </button>
                  <button
                    onClick={handleCancel}
                    className="bg-accent hover:bg-accent-dark focus:ring-accent text-white px-4 py-2 rounded-lg"
                  >
                    No, regresar
                  </button>
                </div>
              </Modal>
              {showMultiActions && (
                <div className="flex justify-end gap-2 mb-4">
                  <Action action="massiveDelete">
                    {/* @ts-ignore */}
                    <Form order={selectedRows} />
                  </Action>
                  {pathname === "/admin/orders" &&
                    !selectedRows.some(
                      (row) => row.deliveryStatus === "CANCELLED"
                    ) && (
                      <button
                        onClick={() => handleIsPaid(selectedRows[0].id, true)}
                        className="bg-accent text-white rounded-md p-2 border border-white"
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
                      className="bg-accent text-white rounded-md p-2 border border-white"
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
          title={
            pathname === "/admin/orders" ? "No hay pedidos" : "No hay ventas"
          }
          description={
            pathname === "/admin/orders"
              ? "Agrega un pedido para verlo aquí"
              : "Agrega una venta para verla aquí"
          }
        />
      )}
    </>
  );
};

export default Datatable;
