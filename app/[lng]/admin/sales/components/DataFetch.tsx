import Datatable from "../../orders/components/Datatable";
import { getSales } from "@/app/shared/services/order/controller";
import type { IOrder } from "@/app/shared/interfaces";

interface IDataFetch {
  lng: string;
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

const DataFetch = async ({ lng, searchParams }: IDataFetch) => {
  const sales = (await getSales(searchParams)) as unknown as IOrder[];

  return <Datatable orders={sales} lng={lng} />;
};

export default DataFetch;
