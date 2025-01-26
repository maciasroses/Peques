import { OrderInfo } from "./components";
import {
  Html,
  Body,
  Head,
  Preview,
  Tailwind,
  Container,
} from "@react-email/components";
import type { IOrderInfoForEmail } from "@/app/shared/interfaces";
import { Footer, Header } from "../components";

OrderReceipt.PreviewProps = {
  order: {
    email: "test@test.com",
    order: {
      id: "d814ab35-0c22-4214-a572-0f1b6403a979",
      client: "test macias",
      shippingCost: 190,
      discount: 0,
      // discount: 10,
      // subtotal: 220,
      subtotal: 170,
      // total: 410,
      total: 343,
      shipmentType: "Compra desde e-commerce",
      paymentMethod: "visa credit",
      isPaid: true,
      deliveryStatus: "PENDING",
      pendingPayment: null,
      paymentIntentId: "pi_3QkyhO4cbtG1N3KF0c3Ag7bh",
      userId: "6fd22be3-e6a8-430e-aa3f-7fef381ed1c5",
      paymentId: "0363d935-3166-4544-8ca0-e5f098f5dd5f",
      addressId: "0d63f958-3f81-4b61-bcbd-7b347b5f0849",
      createdAt: new Date("2025-01-25T02:02:21.790Z"),
      updatedAt: new Date("2025-01-25T02:02:21.790Z"),
      products: [
        {
          quantity: 1,
          costMXN: 220,
          // discount: 22.73,
          discount: 0,
          productId: "bb3ea36f-fab2-487f-a2a5-7b57461bc3c9",
          orderId: "d814ab35-0c22-4214-a572-0f1b6403a979",
          createdAt: new Date("2025-01-25T02:02:21.790Z"),
          product: {
            id: "bb3ea36f-fab2-487f-a2a5-7b57461bc3c9",
            key: "anticaida-azul",
            name: "mordedera anticaida azul",
            description: null,
            salePriceMXN: 220,
            availableQuantity: 17,
            minimumAcceptableQuantity: 7,
            providerId: "ec09474e-1229-4035-8d85-149577f6d042",
            createdAt: new Date("2024-09-18T01:00:51.051Z"),
            updatedAt: new Date("2024-09-18T01:00:51.051Z"),
            files: [],
            reviews: [],
            provider: {
              id: "ec09474e-1229-4035-8d85-149577f6d042",
              name: "test",
              alias: "test",
              createdAt: new Date("2024-09-18T01:00:51.051Z"),
              updatedAt: new Date("2024-09-18T01:00:51.051Z"),
              products: [],
            },
            cartItems: [],
            orders: [],
            history: [],
            promotions: [],
            filters: [],
            collections: [],
            transactions: [],
            stockReservations: [],
            customProductsList: [],
          },
          order: {
            addressId: "0d63f958-3f81-4b61-bcbd-7b347b5f0849",
            client: "test macias",
            createdAt: new Date("2025-01-25T02:02:21.790Z"),
            deliveryStatus: "PENDING",
            discount: 10,
            id: "d814ab35-0c22-4214-a572-0f1b6403a979",
            isPaid: true,
            paymentId: "0363d935-3166-4544-8ca0-e5f098f5dd5f",
            paymentMethod: "visa credit",
            paymentIntentId: "pi_3QkyhO4cbtG1N3KF0c3Ag7bh",
            pendingPayment: null,
            shipmentType: "Compra desde e-commerce",
            shippingCost: 190,
            total: 343,
            updatedAt: new Date("2025-01-25T02:02:21.790Z"),
            userId: "6fd22be3-e6a8-430e-aa3f-7fef381ed1c5",
            products: [],
            promotions: [],
            subtotal: 220,
            transactions: [],
          },
        },
      ],
      promotions: [
        {
          orderId: "d814ab35-0c22-4214-a572-0f1b6403a979",
          promotionId: "1237c05b-830b-4d47-bbff-9fbcb51f65f4",
          createdAt: new Date("2025-01-25T02:02:21.790Z"),
          promotion: {
            id: "1237c05b-830b-4d47-bbff-9fbcb51f65f4",
            title: "Descuento de 10%",
            endDate: new Date("2025-01-31T00:00:00.000Z"),
            isActive: true,
            startDate: new Date("2025-01-24T00:00:00.000Z"),
            description: "testss",
            discountType: "PERCENTAGE",
            discountValue: 10,
            createdAt: new Date("2025-01-25T02:01:16.603Z"),
            updatedAt: new Date("2025-01-25T02:01:16.603Z"),
            discountCodes: [
              {
                id: "180d2da9-0ce4-4f1a-a32b-25c274d80e60",
                code: "WELCOME10",
                timesUsed: 1,
                usageLimit: null,
                promotionId: "1237c05b-830b-4d47-bbff-9fbcb51f65f4",

                createdAt: new Date("2025-01-25T02:01:16.611Z"),
                updatedAt: new Date("2025-01-25T02:05:53.214Z"),
                users: [
                  {
                    discountCodeId: "180d2da9-0ce4-4f1a-a32b-25c274d80e60",
                    userId: "6fd22be3-e6a8-430e-aa3f-7fef381ed1c5",
                    createdAt: new Date("2025-01-25T02:02:21.782Z"),
                    user: {
                      id: "6fd22be3-e6a8-430e-aa3f-7fef381ed1c5",
                      role: "USER",
                      email: "joshrom@outlook.com",
                      image: "/assets/images/profilepic.webp",
                      password:
                        "$2b$10$YPLVX7e2XWcz//S.gWPjF.C9qXAYHIr/2xWJKP.EKB6iZtZ/f8LAO",
                      username: "test macias",
                      lastName: "macias",
                      firstName: "test",
                      wantsNewsletter: false,
                      stripeCustomerId: "cus_ReH88NfVbpwYfr",
                      resetPasswordToken: null,
                      resetPasswordExpires: null,
                      createdAt: new Date("2025-01-25T01:44:11.425Z"),
                      updatedAt: new Date("2025-01-25T01:55:01.869Z"),
                      orders: [],
                      addresses: [],
                      stockReservations: [],
                      reviews: [],
                      customLists: [],
                      discountCodes: [],
                      likes: [],
                      paymentMethods: [],
                    },
                    discountCode: {
                      code: "WELCOME10",
                      timesUsed: 1,
                      usageLimit: null,
                      promotionId: "1237c05b-830b-4d47-bbff-9fbcb51f65f4",
                      createdAt: new Date("2025-01-25T02:01:16.611Z"),
                      updatedAt: new Date("2025-01-25T02:05:53.214Z"),
                      users: [],
                      id: "180d2da9-0ce4-4f1a-a32b-25c274d80e60",
                      promotion: {
                        id: "1237c05b-830b-4d47-bbff-9fbcb51f65f4",
                        title: "testss",
                        endDate: new Date("2025-01-31T00:00:00.000Z"),
                        isActive: true,
                        startDate: new Date("2025-01-24T00:00:00.000Z"),
                        description: "testss",
                        discountType: "PERCENTAGE",
                        discountValue: 10,
                        createdAt: new Date("2025-01-25T02:01:16.603Z"),
                        updatedAt: new Date("2025-01-25T02:01:16.603Z"),
                        discountCodes: [],
                        cartItems: [],
                        orders: [],
                        collections: [],
                        products: [],
                      },
                    },
                  },
                ],
                promotion: {
                  id: "1237c05b-830b-4d47-bbff-9fbcb51f65f4",
                  title: "testss",
                  endDate: new Date("2025-01-31T00:00:00.000Z"),
                  isActive: true,
                  startDate: new Date("2025-01-24T00:00:00.000Z"),
                  description: "testss",
                  discountType: "PERCENTAGE",
                  discountValue: 10,
                  createdAt: new Date("2025-01-25T02:01:16.603Z"),
                  updatedAt: new Date("2025-01-25T02:01:16.603Z"),
                  discountCodes: [],
                  cartItems: [],
                  orders: [],
                  collections: [],
                  products: [],
                },
              },
            ],
            cartItems: [],
            collections: [],
            orders: [],
            products: [],
          },
          order: {
            addressId: "0d63f958-3f81-4b61-bcbd-7b347b5f0849",
            client: "test macias",
            createdAt: new Date("2025-01-25T02:02:21.790Z"),
            deliveryStatus: "PENDING",
            discount: 10,
            id: "d814ab35-0c22-4214-a572-0f1b6403a979",
            isPaid: true,
            paymentId: "0363d935-3166-4544-8ca0-e5f098f5dd5f",
            paymentMethod: "visa credit",
            paymentIntentId: "pi_3QkyhO4cbtG1N3KF0c3Ag7bh",
            pendingPayment: null,
            shipmentType: "Compra desde e-commerce",
            shippingCost: 190,
            total: 343,
            updatedAt: new Date("2025-01-25T02:02:21.790Z"),
            userId: "6fd22be3-e6a8-430e-aa3f-7fef381ed1c5",
            products: [],
            promotions: [],
            subtotal: 220,
            transactions: [],
          },
        },
        {
          orderId: "d814ab35-0c22-4214-a572-0f1b6403a979",
          promotionId: "86e0099c-3c23-4ec3-be69-78c96161e782",
          createdAt: new Date("2025-01-25T02:02:21.790Z"),
          promotion: {
            id: "86e0099c-3c23-4ec3-be69-78c96161e782",
            title: "test",
            endDate: new Date("2025-01-30T00:00:00.000Z"),
            isActive: true,
            startDate: new Date("2025-01-24T00:00:00.000Z"),
            description: "test",
            discountType: "FIXED",
            discountValue: 50,
            createdAt: new Date("2025-01-25T02:00:53.386Z"),
            updatedAt: new Date("2025-01-25T02:00:53.386Z"),
            discountCodes: [],
            cartItems: [],
            collections: [],
            orders: [],
            products: [],
          },
          order: {
            addressId: "0d63f958-3f81-4b61-bcbd-7b347b5f0849",
            client: "test macias",
            createdAt: new Date("2025-01-25T02:02:21.790Z"),
            deliveryStatus: "PENDING",
            discount: 10,
            id: "d814ab35-0c22-4214-a572-0f1b6403a979",
            isPaid: true,
            paymentId: "0363d935-3166-4544-8ca0-e5f098f5dd5f",
            paymentMethod: "visa credit",
            paymentIntentId: "pi_3QkyhO4cbtG1N3KF0c3Ag7bh",
            pendingPayment: null,
            shipmentType: "Compra desde e-commerce",
            shippingCost: 190,
            total: 343,
            updatedAt: new Date("2025-01-25T02:02:21.790Z"),
            userId: "6fd22be3-e6a8-430e-aa3f-7fef381ed1c5",
            products: [],
            promotions: [],
            subtotal: 220,
            transactions: [],
          },
        },
      ],
      transactions: [],
    },
    products: [
      {
        id: "anticaida-azul",
        name: "mordedera anticaida azul",
        file: "https://ilidf54ifchqqkqe.public.blob.vercel-storage.com/Products/test-P6foS1ey0j134TE2BEQVSxotMzaxNO.webp",
        price: 220,
        // discount: "Descuento de $50.00",
        quantity: 1,
        // finalPrice: 170,
        finalPrice: 220,
        // promotionId: "86e0099c-3c23-4ec3-be69-78c96161e782",
      },
    ],
  },
} satisfies { order: IOrderInfoForEmail };

export default function OrderReceipt({ order }: { order: IOrderInfoForEmail }) {
  return (
    <Html lang="en">
      <Preview>Tu recibo de Peques</Preview>
      <Head />
      <Body className="bg-white">
        <Container className="max-w-2xl">
          <Tailwind>
            <Header title="Recibo" />
            <OrderInfo order={order} />
            <Footer />
          </Tailwind>
        </Container>
      </Body>
    </Html>
  );
}
