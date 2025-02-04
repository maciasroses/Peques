import { Suspense } from "react";
import { Form, DataFetch, Searchbar } from "./components";
import { Action, DatatableSkeleton } from "@/app/shared/components";
import { getProviders } from "@/app/shared/services/provider/controller";
import type { Metadata } from "next";
import type { IProvider } from "@/app/shared/interfaces";

export const metadata: Metadata = {
  title: "Productos",
};

interface IAdminProductsPage {
  searchParams?: {
    q?: string;
    availableQuantityFrom?: string;
    availableQuantityTo?: string;
    salePriceMXNFrom?: string;
    salePriceMXNTo?: string;
    provider?: string;
  };
}

const AdminProductsPage = async ({ searchParams }: IAdminProductsPage) => {
  const {
    q = "",
    availableQuantityFrom = "",
    availableQuantityTo = "",
    salePriceMXNFrom = "",
    salePriceMXNTo = "",
    provider = "",
  } = searchParams || {};

  const searchParamsForDatatable = {
    q,
    availableQuantityFrom,
    availableQuantityTo,
    salePriceMXNFrom,
    salePriceMXNTo,
    provider,
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
      <Searchbar providers={providers} />
      <Suspense
        key={
          q +
          availableQuantityFrom +
          availableQuantityTo +
          salePriceMXNFrom +
          salePriceMXNTo +
          provider
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
