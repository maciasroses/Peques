import { Suspense } from "react";
import { DataFetch } from "./components";
import { Searchbar } from "../orders/components";
import { DatatableSkeleton } from "@/app/shared/components";
import { Metadata } from "next";
import { IBaseLangPage } from "@/app/shared/interfaces";

export const metadata: Metadata = {
  title: "Ventas",
};

interface IAdminSalesPage extends IBaseLangPage {
  searchParams?: {
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

const AdminSalesPage = async ({
  searchParams,
  params: { lng },
}: IAdminSalesPage) => {
  const {
    client = "",
    deliveryStatus = "",
    paymentMethod = "",
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
    paymentMethod,
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
          paymentMethod +
          discountFrom +
          discountTo +
          subtotalFrom +
          subtotalTo +
          totalFrom +
          totalTo
        }
        fallback={<DatatableSkeleton />}
      >
        <DataFetch lng={lng} searchParams={searchParamsForDatatable} />
      </Suspense>
    </>
  );
};

export default AdminSalesPage;
