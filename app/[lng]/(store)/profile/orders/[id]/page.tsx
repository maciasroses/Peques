import Link from "next/link";
import Image from "next/image";
import { notFound } from "next/navigation";
import { LeftArrow } from "@/app/shared/icons";
import formatCurrency from "@/app/shared/utils/format-currency";
import formatDateLatinAmerican from "@/app/shared/utils/formatdate-latin";
import { getMyOrderById } from "@/app/shared/services/order/controller";
import type { IOrder } from "@/app/shared/interfaces";

interface IOrderPage {
  params: {
    id: string;
    lng: string;
  };
}

const OrderPage = async ({ params: { id, lng } }: IOrderPage) => {
  const order = (await getMyOrderById({ id })) as IOrder;
  if (!order) notFound();

  return (
    <>
      <div className="flex items-start gap-2">
        <Link
          href={`/${lng}/profile/orders`}
          className="text-blue-600 dark:text-blue-300 hover:text-blue-700 dark:hover:text-blue-400 mt-1"
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
      <div className="flex flex-col md:flex-row gap-4 mt-2">
        <div className="w-full h-full md:w-1/3 md:sticky md:top-24">
          <h1 className="text-2xl font-bold">Resumen</h1>
          <p className="text-sm sm:text-lg mt-2">
            Envío: <span className="font-bold">$99.00</span>
          </p>
          <p className="text-sm sm:text-lg">
            Subtotal:{" "}
            <span className="font-bold">
              {formatCurrency(order.total - 99, "MXN")}
            </span>
          </p>
          <p className="text-lg sm:text-2xl mt-2">
            Total:{" "}
            <span className="font-bold">
              {formatCurrency(order.total, "MXN")}
            </span>
          </p>
        </div>
        <div className="w-full md:w-2/3">
          <h2 className="text-4xl font-bold">
            {`${
              order.deliveryStatus === "DELIVERED" ? "Entregado" : "Pendiente"
            } ${formatDateLatinAmerican(order.updatedAt)}`}
          </h2>
          <ul className="flex flex-col gap-2 mt-4">
            {order.products.map((product) => (
              <Link
                key={product.productId}
                href={`/${lng}/${product.product.key}`}
              >
                <li className="flex items-center justify-between gap-2 p-4 shadow-lg dark:shadow-gray-800 border border-gray-200 dark:border-gray-800 hover:bg-gray-50 dark:hover:bg-gray-800 rounded-lg">
                  <div className="flex items-center gap-2">
                    <div className="size-24">
                      <Image
                        src={product.product.files[0].url}
                        alt={product.product.name}
                        width={500}
                        height={300}
                        className="size-full object-contain rounded-lg"
                      />
                    </div>
                    <p className="text-base sm:text-xl">
                      {product.product.name}
                    </p>
                  </div>
                  <p className="text-sm sm:text-lg">
                    {product.quantity} x{" "}
                    <span className="font-semibold">
                      {formatCurrency(product.costMXN, "MXN")}
                    </span>
                  </p>
                </li>
              </Link>
            ))}
          </ul>
        </div>
      </div>
    </>
  );
};

export default OrderPage;
