import { Suspense } from "react";
import { Action, DatatableSkeleton } from "@/components";
import { Form, DataFetch, Searchbar } from "./components";
import { getProviders } from "@/services/provider/controller";
import type { IProvider } from "@/interfaces";

interface IAdminProductsPage {
  searchParams?: {
    q?: string;
    quantityPerCartonFrom?: string;
    quantityPerCartonTo?: string;
    orderDateFrom?: string;
    orderDateTo?: string;
  };
}

const AdminProductsPage = async ({ searchParams }: IAdminProductsPage) => {
  const {
    q = "",
    quantityPerCartonFrom = "",
    quantityPerCartonTo = "",
    orderDateFrom = "",
    orderDateTo = "",
  } = searchParams || {};

  const searchParamsForDatatable = {
    q,
    quantityPerCartonFrom,
    quantityPerCartonTo,
    orderDateFrom,
    orderDateTo,
  };

  const providers = (await getProviders({})) as IProvider[];
  return (
    <>
      {providers.length > 0 && (
        <div className="w-full text-right">
          {/* <Action action="create" providers={providers} /> */}
          <Action action="create">
            {/* @ts-ignore */}
            <Form providers={providers} />
          </Action>
        </div>
      )}
      <Searchbar />
      <Suspense
        key={
          q +
          quantityPerCartonFrom +
          quantityPerCartonTo +
          orderDateFrom +
          orderDateTo
        }
        fallback={<DatatableSkeleton />}
      >
        <DataFetch
          searchParams={searchParamsForDatatable}
          providers={providers}
        />
      </Suspense>
    </>
  );
};

export default AdminProductsPage;
