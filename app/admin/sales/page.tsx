import { DatatableSkeleton } from "@/components";
import { Suspense } from "react";
import { DataFetch } from "./components";

interface IAdminSalesPage {
  searchParams?: {
    client?: string;
    deliveryStatus?: string;
  };
}

const AdminSalesPage = async ({ searchParams }: IAdminSalesPage) => {
  const { client = "", deliveryStatus = "" } = searchParams || {};

  const searchParamsForDatatable = { client, deliveryStatus };

  return (
    <Suspense key={client + deliveryStatus} fallback={<DatatableSkeleton />}>
      <DataFetch searchParams={searchParamsForDatatable} />
    </Suspense>
  );
};

export default AdminSalesPage;
