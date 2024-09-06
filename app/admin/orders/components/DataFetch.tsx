import Datatable from "./Datatable";
import { getOrders } from "@/services/order/controller";
import type { IOrder, IProduct } from "@/interfaces";

interface IDataFetch {
  products: IProduct[];
  searchParams: {
    client?: string;
    deliveryStatus?: string;
    discountFrom?: string;
    discountTo?: string;
    subtotalFrom?: string;
    subtotalTo?: string;
    totalFrom?: string;
    totalTo?: string;
  };
}

const DataFetch = async ({ products, searchParams }: IDataFetch) => {
  const orders = (await getOrders(searchParams)) as unknown as IOrder[];

  return <Datatable orders={orders} products={products} />;
};

export default DataFetch;
