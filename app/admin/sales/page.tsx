import { Suspense } from "react";
import { DataFetch } from "./components";
import { Searchbar } from "../orders/components";
import { DatatableSkeleton } from "@/components";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Ventas",
};

interface IAdminSalesPage {
  searchParams?: {
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

const AdminSalesPage = async ({ searchParams }: IAdminSalesPage) => {
  const {
    client = "",
    deliveryStatus = "",
    discountFrom = "",
    discountTo = "",
    subtotalFrom = "",
    subtotalTo = "",
    totalFrom = "",
    totalTo = "",
  } = searchParams || {};

  const searchParamsForDatatable = {
    client,
    deliveryStatus,
    discountFrom,
    discountTo,
    subtotalFrom,
    subtotalTo,
    totalFrom,
    totalTo,
  };

  return (
    <>
      <Searchbar />
      <Suspense
        key={
          client +
          deliveryStatus +
          discountFrom +
          discountTo +
          subtotalFrom +
          subtotalTo +
          totalFrom +
          totalTo
        }
        fallback={<DatatableSkeleton />}
      >
        <DataFetch searchParams={searchParamsForDatatable} />
      </Suspense>
    </>
  );
};

export default AdminSalesPage;
