import { Suspense } from "react";
import { Action, DatatableSkeleton } from "@/components";
import { DataFetch, Form, Searchbar } from "./components";
import { getProducts } from "@/services/product/controller";
import type { IProduct } from "@/interfaces";

interface IAdminOrdersPage {
  searchParams?: {
    client?: string;
    deliveryStatus?: string;
  };
}

const AdminOrdersPage = async ({ searchParams }: IAdminOrdersPage) => {
  const { client = "", deliveryStatus = "" } = searchParams || {};

  const searchParamsForDatatable = { client, deliveryStatus };

  const products = (await getProducts({})) as unknown as IProduct[];

  return (
    <>
      {products.length > 0 && (
        <div className="w-full text-right">
          <Action action="create">
            {/* @ts-ignore */}
            <Form products={products} />
          </Action>
        </div>
      )}
      <Searchbar />
      <Suspense key={deliveryStatus + client} fallback={<DatatableSkeleton />}>
        <DataFetch
          products={products}
          searchParams={searchParamsForDatatable}
        />
      </Suspense>
    </>
  );
};

export default AdminOrdersPage;
