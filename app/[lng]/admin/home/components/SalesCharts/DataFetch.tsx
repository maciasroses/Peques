import PieChart from "./PieChart";
import LineChart from "./LineChart";
import { Card404 } from "@/app/shared/components";
import { getSales } from "@/app/shared/services/order/controller";
import type { IOrder } from "@/app/shared/interfaces";

interface IDataFetch {
  searchParams: {
    yearOfData?: string;
  };
}

const DataFetch = async ({ searchParams }: IDataFetch) => {
  const sales = (await getSales({
    isForGraph: true,
    orderBy: { createdAt: "asc" },
    yearOfData: searchParams.yearOfData,
  })) as unknown as IOrder[];
  return (
    <div className="flex flex-col md:flex-row gap-4">
      {sales.reduce((acc, order) => acc + order.total, 0) > 0 ? (
        <>
          <LineChart sales={sales} />
          <PieChart sales={sales} />
        </>
      ) : (
        <div className="w-full">
          <Card404
            title="No hay ventas"
            description="No se han encontrado ventas en el sistema para graficar."
          />
        </div>
      )}
    </div>
  );
};

export default DataFetch;
