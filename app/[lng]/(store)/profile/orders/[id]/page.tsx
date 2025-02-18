import Link from "next/link";
import { notFound } from "next/navigation";
import { OrderSummary } from "./components";
import { LeftArrow } from "@/app/shared/icons";
import formatDateLatinAmerican from "@/app/shared/utils/formatdate-latin";
import { getMyOrderById } from "@/app/shared/services/order/controller";
import type { Metadata } from "next";
import type { IOrder } from "@/app/shared/interfaces";

interface IOrderPage {
  params: {
    id: string;
    lng: string;
  };
}

export async function generateMetadata({
  params: { id },
}: IOrderPage): Promise<Metadata> {
  try {
    const order = (await getMyOrderById({ id })) as IOrder;
    if (!order) notFound();

    return {
      title: `Pedido #${order.id}`,
    };
  } catch {
    return {
      title: "Pedidos",
    };
  }
}

const OrderPage = async ({ params: { id, lng } }: IOrderPage) => {
  const order = (await getMyOrderById({ id })) as IOrder;
  if (!order) notFound();

  return (
    <>
      <div className="flex items-start gap-2">
        <Link
          href={`/${lng}/profile/orders`}
          aria-label="Volver a la lista de pedidos"
          className="text-blue-600 hover:text-blue-700 mt-1"
        >
          <LeftArrow size="size-6 md:size-8" />
        </Link>
        <div className="w-full">
          <div className="flex flex-col lg:flex-row gap-1 justify-between ">
            <h1 className="text-xl md:text-4xl">Detalles</h1>
            <p className="text-base md:text-2xl text-gray-500">
              Identificador: {order.id}
            </p>
          </div>
          <p className="text-base md:text-2xl text-gray-500">
            Ordenado el {formatDateLatinAmerican(order.createdAt)}
          </p>
        </div>
      </div>
      <OrderSummary lng={lng} order={order} />
    </>
  );
};

export default OrderPage;
