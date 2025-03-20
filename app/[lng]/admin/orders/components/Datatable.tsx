"use client";

import clsx from "clsx";
import Form from "./Form";
import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import useModal from "@/app/shared/hooks/useModal";
import { useRowSelection } from "@/app/shared/hooks";
import formatCurrency from "@/app/shared/utils/format-currency";
import formatDateLatinAmerican from "@/app/shared/utils/formatdate-latin";
import {
  markAsPaid,
  markMassiveAsPaid,
  updateDeliveryStatus,
  updateMassiveDeliveryStatus,
} from "@/app/shared/services/order/controller";
import {
  Action,
  Card404,
  DatatableSkeleton,
  Datatable as CustomDatatable,
  Modal,
} from "@/app/shared/components";
import type {
  IUser,
  IOrder,
  IAddress,
  IOrderOnPromotion,
} from "@/app/shared/interfaces";
import OrderSummary from "./OrderSummary";
import { roundUpNumber } from "@/app/shared/utils/roundUpNumber";

interface IDataTable {
  lng: string;
  orders: IOrder[];
}

export interface IProductInOrder {
  productId: string;
  orderId: string;
  quantity: number;
  discount: number;
  costMXN: number;
  customRequest: string;
  product: {
    name: string;
  };
}

const Datatable = ({ lng, orders }: IDataTable) => {
  const pathname = usePathname();
  const { isOpen, onOpen, onClose } = useModal();
  const {
    isOpen: isSummaryOpen,
    onOpen: onSummaryOpen,
    onClose: onSummaryClose,
  } = useModal();
  const [orderSelectedForSummary, setOrderSelectedForSummary] = useState(
    [] as IProductInOrder[]
  );
  const [isMassiveForConfirm, setIsMassiveForConfirm] = useState(false);
  const [selectedRowForConfirm, setSelectedRowForConfirm] = useState<
    IOrder | undefined
  >(undefined);
  const [eventForConfirm, setEventForConfirm] =
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
      setEventForConfirm(event);
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

  const handleViewOrderSummary = (order: IProductInOrder[]) => {
    setOrderSelectedForSummary(order);
    onSummaryOpen();
  };

  const columns = [
    {
      name: "Acciones",
      width: pathname === `/${lng}/admin/orders` ? "250px" : "80px",
      cell: (row: IOrder) => (
        <div className="flex justify-center gap-2">
          <Action action="delete">
            {/* @ts-ignore */}
            <Form order={row} lng={lng} />
          </Action>
          {pathname === `/${lng}/admin/orders` && (
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
      width: "180px",
      format: (row: {
        id: string;
        deliveryStatus: string;
        address: IAddress;
        user: IUser;
      }) => {
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
              <option value="CANCELLED">Cancelado</option>
              {!row.user || row.address ? (
                <>
                  {/* (solo para pedidos con envío o sin compra en la página web) */}
                  <option value="SHIPPED">Enviado</option>
                  <option value="DELIVERED">Entregado</option>
                </>
              ) : (
                <>
                  {/* (solo para pedidos con recogida en
                    tienda) */}
                  <option value="READY_FOR_PICKUP">Listo para recoger</option>
                  <option value="PICKED_UP">Recogido</option>
                </>
              )}
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
      name: "Cliente (antiguo)",
      width: "150px",
      selector: (row: { client: string }) => row.client,
      sortable: true,
    },
    {
      name: "Cliente (nuevo)",
      width: "150px",
      selector: (row: { user: IUser }) =>
        row.user?.firstName || row.user?.lastName
          ? `${row.user?.firstName} ${row.user?.lastName}`
          : (row.user?.username ?? "Sin registro de usuario de e-commerce"),
    },
    {
      name: "Correo Electrónico",
      selector: (row: { user: IUser }) => row.user?.email || "Sin correo",
      sortable: true,
    },
    {
      name: "Teléfono",
      selector: (row: { address: IAddress }) =>
        row.address?.phoneNumber || "Sin teléfono",
    },
    {
      name: "Método de Pago",
      selector: (row: { paymentMethod: string }) => row.paymentMethod,
      sortable: true,
    },
    {
      name: "Resumen de Pedido",
      width: "150px",
      cell: (row: { products: IProductInOrder[] }) => (
        <button
          onClick={() => handleViewOrderSummary(row.products)}
          className="bg-accent text-white rounded-md p-2 border borde-white"
        >
          Ver Resumen
        </button>
      ),
    },
    {
      name: "Subtotal de Resumen",
      width: "170px",
      selector: (row: { subtotal: number }) => row.subtotal,
      sortable: true,
      format: (row: { subtotal: number }) =>
        formatCurrency(row.subtotal, "MXN"),
    },
    {
      name: "Subtotal General",
      width: "170px",
      selector: (row: { products: IProductInOrder[] }) =>
        row.products.reduce(
          (acc, product) =>
            acc +
            product.costMXN * product.quantity * (1 - product.discount / 100),
          0
        ),
      sortable: true,
      cell: (row: { products: IProductInOrder[] }) => (
        <span>
          {formatCurrency(
            roundUpNumber(
              row.products.reduce(
                (acc, product) =>
                  acc +
                  product.costMXN *
                    product.quantity *
                    (1 - product.discount / 100),
                0
              )
            ),
            "MXN"
          )}
        </span>
      ),
    },
    {
      name: "Descuento General",
      width: "160px",
      selector: (row: { discount: number }) => row.discount,
      sortable: true,
      format: (row: { discount: number }) => `${row.discount}%`,
    },
    {
      name: "Promociones",
      width: "250px",
      cell: (row: { promotions: IOrderOnPromotion[] }) => {
        return (
          <>
            {row.promotions.length > 0 ? (
              <div>
                <p className="my-4">
                  {row.promotions.length} promociones aplicadas
                </p>
                <ul className="flex flex-col gap-2 mb-4">
                  {row.promotions?.map((promotion, index) => (
                    <li key={index}>
                      <p>
                        <strong>{promotion.promotion.title}</strong>
                      </p>
                      <p>{promotion.promotion.description}</p>
                    </li>
                  ))}
                </ul>
              </div>
            ) : (
              <span>No se aplicaron promociones</span>
            )}
          </>
        );
      },
    },
    {
      name: "Costo de Envío",
      width: "150px",
      selector: (row: { shippingCost: number }) => row.shippingCost,
      sortable: true,
      format: (row: { shippingCost: number }) =>
        formatCurrency(row.shippingCost, "MXN"),
    },
    {
      name: "Total General",
      width: "150px",
      selector: (row: { total: number }) => row.total,
      sortable: true,
      format: (row: { total: number }) => formatCurrency(row.total, "MXN"),
    },
    {
      name: "Dirección de Envío",
      width: "200px",
      selector: (row: { address: IAddress }) => row.address,
      cell: (row: { address: IAddress; user: IUser }) => {
        return (
          <div className="p-2">
            {row.address ? (
              <>
                <h3 className="font-bold text-lg line-clamp-1 pr-5">
                  {row.address.fullName}
                </h3>
                <p>
                  {row.address.address1}
                  {row.address.address2 && ` - ${row.address.address2}`}
                </p>
                <p>
                  {row.address.city}, {row.address.state}, {row.address.zipCode}
                </p>
              </>
            ) : (
              <>
                {row.user ? (
                  <span className="text-blue-700">Se recogerá en tienda</span>
                ) : (
                  <span className="text-red-500">Dirección no disponible</span>
                )}
              </>
            )}
          </div>
        );
      },
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
              <Modal isOpen={isSummaryOpen} onClose={onSummaryClose}>
                <h1 className="text-center text-2xl">Resumen</h1>
                <OrderSummary order={{ products: orderSelectedForSummary }} />
              </Modal>
              <Modal isOpen={isOpen} onClose={handleCancel}>
                <div className="flex flex-col gap-2">
                  <p className="text-2xl text-center text-red-500">
                    ⚠️ Acción irreversible ⚠️
                  </p>
                  <p className="text-center text-base md:text-xl">
                    {isMassiveForConfirm
                      ? `¿Estás seguro de cancelar ${
                          pathname === `/${lng}/admin/orders`
                            ? "estos pedidos"
                            : "estas ventas"
                        }?`
                      : `¿Estás seguro de cancelar ${
                          pathname === `/${lng}/admin/orders`
                            ? "este pedido"
                            : "esta venta"
                        }?`}
                  </p>
                  {isMassiveForConfirm ? (
                    <ul className="flex flex-col gap-2 items-center">
                      {selectedRows.map((row, index) => (
                        <li key={index} className="border-b border-b-black">
                          <div className="text-center">
                            <h2 className="text-lg">
                              <strong>Cliente: </strong>
                              {row.client}
                            </h2>
                            <p>
                              <strong>Tipo de envío: </strong>
                              {row.shipmentType}
                            </p>
                            <div className="w-[220px] sm:w-[300px] md:w-[200px] lg:w-[300px] xl:w-full mx-auto">
                              <OrderSummary
                                order={{
                                  products:
                                    row.products as unknown as IProductInOrder[],
                                }}
                              />
                            </div>
                          </div>
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <div className="text-center">
                      <h2 className="text-lg">
                        <strong>Cliente: </strong>
                        {selectedRowForConfirm?.client}
                      </h2>
                      <p>
                        <strong>Tipo de envío: </strong>
                        {selectedRowForConfirm?.shipmentType}
                      </p>
                      <div className="w-[220px] sm:w-[300px] md:w-[200px] lg:w-[300px] xl:w-full mx-auto">
                        <OrderSummary
                          order={{
                            products:
                              selectedRowForConfirm?.products as unknown as IProductInOrder[],
                          }}
                        />
                      </div>
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
                    <Form order={selectedRows} lng={lng} />
                  </Action>
                  {pathname === `/${lng}/admin/orders` &&
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
                      <option value="">Estado de Envío</option>
                      <option value="PENDING">Pendiente</option>
                      <option value="CANCELLED">Cancelado</option>
                      {selectedRows.every((row) => !row.user || row.address) ? (
                        <>
                          {/* (solo para pedidos con envío o sin compra en la página web) */}
                          <option value="SHIPPED">Enviado</option>
                          <option value="DELIVERED">Entregado</option>
                        </>
                      ) : (
                        selectedRows.every(
                          (row) => row.user && !row.address
                        ) && (
                          <>
                            {/* (solo para pedidos con recogida en
                            tienda) */}
                            <option value="READY_FOR_PICKUP">
                              Listo para recoger
                            </option>
                            <option value="PICKED_UP">Recogido</option>
                          </>
                        )
                      )}
                    </select>
                  )}
                </div>
              )}
              <CustomDatatable
                data={orders}
                columns={columns}
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
            pathname === `/${lng}/admin/orders`
              ? "No hay pedidos"
              : "No hay ventas"
          }
          description={
            pathname === `/${lng}/admin/orders`
              ? "Agrega un pedido para verlo aquí"
              : "Agrega una venta para verla aquí"
          }
        />
      )}
    </>
  );
};

export default Datatable;
