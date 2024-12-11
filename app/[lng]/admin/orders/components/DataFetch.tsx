import Datatable from "./Datatable";
import { getOrders } from "@/app/shared/services/order/controller";
import type { IOrder } from "@/app/shared/interfaces";

interface IDataFetch {
  searchParams: {
    client?: string;
    deliveryStatus?: string;
    paymentMethod?: string;
    discountFrom?: string;
    discountTo?: string;
    subtotalFrom?: string;
    subtotalTo?: string;
    totalFrom?: string;
    totalTo?: string;
  };
}

const DataFetch = async ({ searchParams }: IDataFetch) => {
  const orders = (await getOrders(searchParams)) as unknown as IOrder[];

  return <Datatable orders={orders} />;
};

export default DataFetch;
