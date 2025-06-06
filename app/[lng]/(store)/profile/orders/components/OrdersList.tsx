import Link from "next/link";
import { Card404 } from "@/app/shared/components";
import { RightArrow } from "@/app/shared/icons";
import OrderProductCard from "./OrderProductCard";
import formatCurrency from "@/app/shared/utils/format-currency";
import { getMyOrders } from "@/app/shared/services/order/controller";
import formatDateLatinAmerican from "@/app/shared/utils/formatdate-latin";
import type { IOrderList, IOrderSearchParams } from "@/app/shared/interfaces";

interface IOrderListComp {
  lng: string;
  searchParams: IOrderSearchParams;
}

const OrdersList = async ({ lng, searchParams }: IOrderListComp) => {
  const { orders: myOrders } = (await getMyOrders(searchParams)) as IOrderList;

  return (
    <>
      {myOrders.length > 0 ? (
        <>
          {myOrders.map((order) => (
            <Link key={order.id} href={`/${lng}/profile/orders/${order.id}`}>
              <div className="shadow-lg border border-gray-200 hover:bg-gray-50 rounded-lg mt-4 p-4 group">
                <div className="flex flex-col sm:flex-row gap-2 justify-between text-xl border-b border-gray-200 pb-4">
                  <p>{formatDateLatinAmerican(order.createdAt)}</p>
                  <p className="text-right">
                    Total:{" "}
                    <span className="font-bold">
                      {formatCurrency(order.total, "MXN")}
                    </span>
                  </p>
                </div>
                <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-4">
                  {order.products.map((product) => (
                    <OrderProductCard
                      order={order}
                      key={product.productId}
                      product={product.product}
                    />
                  ))}
                </div>
                <p className="flex items-center justify-end gap-0.5 text-blue-600 group-hover:text-blue-700">
                  Ver detalles
                  <RightArrow
                    size="size-5"
                    customClass="group-hover:translate-x-1 duration-300"
                  />
                </p>
              </div>
            </Link>
          ))}
        </>
      ) : (
        <Card404
          title="No tienes pedidos"
          description="Aún no has realizado ninguna compra"
        />
      )}
    </>
  );
};

export default OrdersList;
