import { OrderInfo } from "./components";
import {
  Img,
  Html,
  Body,
  Head,
  Preview,
  Tailwind,
  Container,
} from "@react-email/components";
import type { IOrderInfoForEmail } from "@/app/shared/interfaces";

OrderReceipt.PreviewProps = {
  order: {
    email: "test@test.com",
    order: {
      id: "123",
      client: "",
      discount: 0,
      subtotal: 1234,
      total: 1234,
      shipmentType: "",
      paymentMethod: "",
      isPaid: false,
      pendingPayment: 0,
      deliveryStatus: "PENDING",

      user: {
        id: "",
        email: "",
        password: "",
        username: "",
        firstName: "",
        lastName: "",
        role: "USER",
        image: "",
        wantsNewsletter: false,
        stripeCustomerId: "",
        resetPasswordToken: "",
        resetPasswordExpires: new Date(),
        orderInfoDataForStripe: "",
        orders: [],
        reviews: [],
        addresses: [],
        customLists: [],
        paymentMethods: [],
        stockReservations: [],
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      products: [],
      userId: "",
      addressId: "",
      paymentId: "",
      promotionId: "",
      discountCodeId: "",
      createdAt: new Date(),
      updatedAt: new Date(),
    },
    products: [
      {
        name: "Product 1",
        file: "https://via.placeholder.com/100",
        price: 1234,
        quantity: 1,
      },
      {
        name: "Product 2",
        file: "https://via.placeholder.com/100",
        price: 5678,
        quantity: 1,
      },
    ],
    totalInCents: 6912 + 9900,
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
            <div className="text-4xl flex items-center justify-between">
              <Img
                width={150}
                height={70}
                alt="Peques logo"
                src="https://ilidf54ifchqqkqe.public.blob.vercel-storage.com/logo-color-9xETxiG2pvAMLO8T7lJL6xrxGwc1iM.webp"
              />
              <p className="font-thin text-gray-500">Recibo</p>
            </div>
            <OrderInfo order={order} />
          </Tailwind>
        </Container>
      </Body>
    </Html>
  );
}
