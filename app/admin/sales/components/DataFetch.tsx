import Datatable from "../../orders/components/Datatable";
import { getSales } from "@/services/order/controller";
import type { IOrder } from "@/interfaces";

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
  const sales = (await getSales(searchParams)) as unknown as IOrder[];

  return <Datatable orders={sales} />;
};

export default DataFetch;
