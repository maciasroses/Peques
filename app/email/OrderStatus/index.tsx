import React from "react";
import {
  Button,
  Container,
  Heading,
  Text,
  Html,
  Body,
  Preview,
  Head,
  Section,
  Tailwind,
} from "@react-email/components";
import { BASE_URL, PICK_UP_ADDRESSES } from "@/app/shared/constants";
import { IOrder } from "@/app/shared/interfaces";
import { Footer, Header } from "../components";

enum DeliveryStatus {
  PENDING = "PENDING",
  CANCELLED = "CANCELLED",
  SHIPPED = "SHIPPED",
  DELIVERED = "DELIVERED",
  READY_FOR_PICKUP = "READY_FOR_PICKUP",
  PICKED_UP = "PICKED_UP",
}

OrderStatus.PreviewProps = {
  deliveryStatus: "SHIPPED",
  order: {
    id: "52f5674f-086b-41f6-b930-d1a980b4b46f",
    client: "test test",
    discount: 0,
    subtotal: 89,
    shippingCost: 190,
    total: 279,
    shipmentType: "Compra desde e-commerce",
    paymentMethod: "visa credit",
    isPaid: true,
    deliveryStatus: "SHIPPED",
    pendingPayment: null,
    paymentIntentId: "pi_3QnOVf4cbtG1N3KF03Cdge6n",
    userId: "37a36c8a-2756-4475-aceb-37a04ee4ab43",
    paymentId: "6e1d5bce-9dd6-417e-a908-8408281686a3",
    addressId: "dd96aff0-2716-4924-b22e-ebe1c932c09a",
    createdAt: new Date("2025-01-31T18:00:11.167Z"),
    updatedAt: new Date("2025-01-31T18:00:11.167Z"),
    user: {
      id: "37a36c8a-2756-4475-aceb-37a04ee4ab43",
      role: "USER",
      email: "test@test.com",
      image: "/assets/images/profilepic.webp",
      password: "$2b$10$zJB5atUq1QjUy.CGc0Pw9.CqFN/BsREb41h.CIjNXswHoKqcKC/vK",
      username: "test",
      lastName: "test",
      firstName: "test",
      wantsNewsletter: false,
      stripeCustomerId: "cus_RgTzdk87YHbzZU",
      resetPasswordToken: null,
      resetPasswordExpires: null,
      addresses: [],
      customLists: [],
      discountCodes: [],
      likes: [],
      orders: [],
      paymentMethods: [],
      reviews: [],
      stockReservations: [],
      createdAt: new Date("2025-01-30T23:19:44.929Z"),
      updatedAt: new Date("2025-01-30T23:20:05.426Z"),
    },
    payment: {
      orders: [],
      user: {
        id: "37a36c8a-2756-4475-aceb-37a04ee4ab43",
        role: "USER",
        email: "test@test.com",
        addresses: [],
        customLists: [],
        createdAt: new Date("2025-01-30T23:19:44.929Z"),
        discountCodes: [],
        firstName: "test",
        image: "/assets/images/profilepic.webp",
        lastName: "test",
        likes: [],
        orders: [],
        password:
          "$2b$10$zJB5atUq1QjUy.CGc0Pw9.CqFN/BsREb41h.CIjNXswHoKqcKC/vK",
        paymentMethods: [],
        resetPasswordExpires: null,
        resetPasswordToken: null,
        reviews: [],
        stockReservations: [],
        stripeCustomerId: "cus_RgTzdk87YHbzZU",
        updatedAt: new Date("2025-01-30T23:20:05.426Z"),
        username: "test",
        wantsNewsletter: false,
      },
      id: "6e1d5bce-9dd6-417e-a908-8408281686a3",
      brand: "visa",
      isActive: true,
      isDefault: false,
      deletedAt: null,
      expiryYear: 2025,
      expiryMonth: 4,
      last4Digits: "4242",
      stripePaymentMethodId: "pm_1QnOP64cbtG1N3KFO9tTqcdq",
      userId: "37a36c8a-2756-4475-aceb-37a04ee4ab43",
      createdAt: new Date("2025-01-31T17:53:21.272Z"),
      updatedAt: new Date("2025-01-31T17:53:21.272Z"),
    },
    address: {
      id: "dd96aff0-2716-4924-b22e-ebe1c932c09a",
      city: "rest",
      state: "test",
      zipCode: 31000,
      country: "MX",
      fullName: "test",
      address1: "test",
      address2: "test",
      isActive: true,
      deletedAt: null,
      isDefault: false,
      phoneNumber: "test",
      additionalInfo: "test",
      userId: "37a36c8a-2756-4475-aceb-37a04ee4ab43",
      createdAt: new Date("2025-01-31T17:52:00.128Z"),
      updatedAt: new Date("2025-01-31T17:52:00.128Z"),
      orders: [],
      user: {
        id: "37a36c8a-2756-4475-aceb-37a04ee4ab43",
        role: "USER",
        email: "test@test.com",
        addresses: [],
        customLists: [],
        createdAt: new Date("2025-01-30T23:19:44.929Z"),
        discountCodes: [],
        firstName: "test",
        image: "/assets/images/profilepic.webp",
        lastName: "test",
        likes: [],
        orders: [],
        password:
          "$2b$10$zJB5atUq1QjUy.CGc0Pw9.CqFN/BsREb41h.CIjNXswHoKqcKC/vK",
        paymentMethods: [],
        resetPasswordExpires: null,
        resetPasswordToken: null,
        reviews: [],
        stockReservations: [],
        stripeCustomerId: "cus_RgTzdk87YHbzZU",
        updatedAt: new Date("2025-01-30T23:20:05.426Z"),
        username: "test",
        wantsNewsletter: false,
      },
    },
    products: [
      {
        quantity: 1,
        costMXN: 89,
        discount: 0,
        customRequest: '{"name":"Liz","font":"Krone","color":"#F478AF"}',
        productId: "bb3ea36f-fab2-487f-a2a5-7b57461bc3c9",
        orderId: "52f5674f-086b-41f6-b930-d1a980b4b46f",
        createdAt: new Date("2025-01-31T18:00:11.167Z"),
        product: {
          availableQuantity: 100,
          cartItems: [],
          collections: [],
          customProductsList: [],
          filters: [],
          history: [],
          isCustomizable: true,
          key: "custom-name-necklace",
          minimumAcceptableQuantity: 1,
          orders: [],
          promotions: [],
          providerId: "",
          provider: {
            alias: "",
            createdAt: new Date("2025-01-31T17:59:52.748Z"),
            id: "",
            name: "",
            products: [],
            updatedAt: new Date("2025-01-31T17:59:52.748Z"),
          },
          reviews: [],
          stockReservations: [],
          transactions: [],
          id: "bb3ea36f-fab2-487f-a2a5-7b57461bc3c9",
          name: "Custom Name Necklace",
          description: "Custom Name Necklace",
          salePriceMXN: 89,
          isActive: true,
          createdAt: new Date("2025-01-31T17:59:52.748Z"),
          updatedAt: new Date("2025-01-31T17:59:52.748Z"),
          files: [
            {
              id: "b5e7f6b2-5a9c-4e5c-9b8c-7d2d3c3a5f3a",
              url: "/assets/images/custom-name-necklace.webp",
              order: 1,
              productId: "bb3ea36f-fab2-487f-a2a5-7b57461bc3c9",
              product: {
                id: "bb3ea36f-fab2-487f-a2a5-7b57461bc3c9",
                name: "Custom Name Necklace",
                description: "Custom Name Necklace",
                salePriceMXN: 89,
                isActive: true,
                availableQuantity: 100,
                cartItems: [],
                providerId: "",
                provider: {
                  alias: "",
                  createdAt: new Date("2025-01-31T17:59:52.748Z"),
                  id: "",
                  name: "",
                  products: [],
                  updatedAt: new Date("2025-01-31T17:59:52.748Z"),
                },
                collections: [],
                customProductsList: [],
                files: [],
                orders: [],
                filters: [],
                history: [],
                isCustomizable: true,
                key: "custom-name-necklace",
                minimumAcceptableQuantity: 1,
                promotions: [],
                reviews: [],
                stockReservations: [],
                transactions: [],
                createdAt: new Date("2025-01-31T17:59:52.748Z"),
                updatedAt: new Date("2025-01-31T17:59:52.748Z"),
              },
              type: "IMAGE",
              createdAt: new Date("2025-01-31T17:59:52.748Z"),
              updatedAt: new Date("2025-01-31T17:59:52.748Z"),
            },
          ],
        },
        order: {
          addressId: "dd96aff0-2716-4924-b22e-ebe1c932c09a",
          client: "test test",
          createdAt: new Date("2025-01-31T18:00:11.167Z"),
          deliveryStatus: "SHIPPED",
          discount: 0,
          id: "52f5674f-086b-41f6-b930-d1a980b4b46f",
          isPaid: true,
          paymentId: "6e1d5bce-9dd6-417e-a908-8408281686a3",
          paymentIntentId: "pi_3QnOVf4cbtG1N3KF03Cdge6n",
          paymentMethod: "visa credit",
          pendingPayment: null,
          products: [],
          promotions: [],
          shipmentType: "Compra desde e-commerce",
          shippingCost: 190,
          subtotal: 89,
          total: 279,
          transactions: [],
          updatedAt: new Date("2025-01-31T18:00:11.167Z"),
          userId: "37a36c8a-2756-4475-aceb-37a04ee4ab43",
        },
      },
    ],
    promotions: [],
    transactions: [],
  },
} satisfies { order: IOrder; deliveryStatus: string };

export default function OrderStatus({
  order,
  deliveryStatus,
}: {
  order: IOrder;
  deliveryStatus: string;
}) {
  const getStatusLabel = (status: DeliveryStatus) => {
    const labels: Record<DeliveryStatus, string> = {
      PENDING: "Pendiente",
      CANCELLED: "Cancelado",
      SHIPPED: "Enviado",
      DELIVERED: "Entregado",
      READY_FOR_PICKUP: "Listo para recoger",
      PICKED_UP: "Recogido",
    };
    return labels[status];
  };

  return (
    <Html lang="es">
      <Preview>Recupera tu contraseña</Preview>
      <Head />
      <Body className="bg-white">
        <Container className="max-w-2xl">
          <Tailwind>
            <Header
              title={
                deliveryStatus === DeliveryStatus.PENDING
                  ? "Pedido pendiente"
                  : deliveryStatus === DeliveryStatus.DELIVERED
                    ? "Pedido entregado"
                    : deliveryStatus === DeliveryStatus.SHIPPED
                      ? "Pedido enviado"
                      : deliveryStatus === DeliveryStatus.READY_FOR_PICKUP
                        ? "Pedido listo para recoger"
                        : deliveryStatus === DeliveryStatus.PICKED_UP
                          ? "Pedido recogido"
                          : "Pedido cancelado"
              }
            />
            <Section
              style={{
                padding: "20px",
                backgroundColor: "#f9fafb",
                borderRadius: "8px",
              }}
            >
              <Heading as="h3" style={{ marginBottom: "10px" }}>
                Estado del pedido:{" "}
                {getStatusLabel(deliveryStatus as DeliveryStatus)}
              </Heading>

              <Text>
                Productos en el pedido: <strong>{order.products.length}</strong>
              </Text>

              <h3
                style={{
                  fontSize: "16px",
                  fontWeight: "bold",
                  marginBottom: "8px",
                }}
              >
                {order.address ? "Dirección de Envío" : "Dirección de Recogida"}
              </h3>
              {order.address ? (
                <>
                  <p>
                    <strong>{order.address.fullName}</strong>
                  </p>
                  <p>
                    {order.address.address1}, {order.address.address2}
                  </p>
                  <p>
                    {order.address.city}, {order.address.state},{" "}
                    {order.address.zipCode}
                  </p>
                  <p>{order.address.country}</p>
                  <p>
                    <strong>Teléfono:</strong> {order.address.phoneNumber}
                  </p>
                </>
              ) : (
                <>
                  <p>
                    <strong>{PICK_UP_ADDRESSES[0].name}</strong>
                  </p>
                  <p>{PICK_UP_ADDRESSES[0].street}</p>
                  <p>
                    {PICK_UP_ADDRESSES[0].city}, {PICK_UP_ADDRESSES[0].state},{" "}
                    {PICK_UP_ADDRESSES[0].zipCode}
                  </p>
                  <p>{PICK_UP_ADDRESSES[0].country}</p>
                  <p>
                    <strong>Referencia:</strong>{" "}
                    {PICK_UP_ADDRESSES[0].reference}
                  </p>
                  <p>
                    <strong>Horario:</strong>
                    <ul>
                      {PICK_UP_ADDRESSES[0].schedule.map((item) => (
                        <li key={item.id}>{item.value}</li>
                      ))}
                    </ul>
                  </p>
                  <p>
                    <strong>Notas:</strong> {PICK_UP_ADDRESSES[0].notes}
                  </p>
                </>
              )}

              <Button
                href={`${BASE_URL}/es/profile/orders/${order.id}`}
                style={{
                  backgroundColor: "#2563eb",
                  color: "#fff",
                  padding: "10px 20px",
                  borderRadius: "5px",
                  textDecoration: "none",
                  display: "inline-block",
                  marginTop: "10px",
                }}
              >
                Ver detalle del pedido
              </Button>
            </Section>
            <Footer />
          </Tailwind>
        </Container>
      </Body>
    </Html>
  );
}
