import { Metadata } from "next";
import { Suspense } from "react";
import { BarSkeleton, PieSkeleton, CardSkeleton } from "@/components";
import {
  ProductsAlertDataFetch,
  SalesPieChartDataFetch,
  Searchbar,
} from "./components";

export const metadata: Metadata = {
  title: "Inicio",
};

interface IAdminHomePage {
  searchParams?: {
    yearOfData?: string;
  };
}

const AdminHomePage = async ({ searchParams }: IAdminHomePage) => {
  const { yearOfData = "" } = searchParams || {};

  const searchParamsForSalesCharts = {
    yearOfData,
  };

  return (
    <div className="flex flex-col gap-4">
      <Suspense
        fallback={
          <div className="flex flex-col md:flex-row gap-4 h-48">
            <CardSkeleton />
            <CardSkeleton />
          </div>
        }
      >
        <ProductsAlertDataFetch />
      </Suspense>
      <Searchbar />
      <Suspense
        key={yearOfData}
        fallback={
          <div className="flex flex-col md:flex-row gap-4 h-48">
            <BarSkeleton />
            <PieSkeleton />
          </div>
        }
      >
        <SalesPieChartDataFetch searchParams={searchParamsForSalesCharts} />
      </Suspense>
    </div>
  );
};

export default AdminHomePage;
