import { Suspense } from "react";
import { Form, DataFetch, Searchbar } from "./components";
import { Action, DatatableSkeleton } from "@/app/shared/components";
import { getProducts } from "@/app/shared/services/product/controller";
import type { Metadata } from "next";
import type { IProduct } from "@/app/shared/interfaces";

export const metadata: Metadata = {
  title: "Colecciones",
};

export interface IAdminCollectionsPage {
  searchParams?: {
    q?: string;
  };
}

const AdminCollectionsPage = async ({
  searchParams,
}: IAdminCollectionsPage) => {
  const { q = "" } = searchParams || {};

  const searchParamsForDatatable = { q };

  const products = (await getProducts({})) as IProduct[];

  return (
    <>
      <div className="w-full text-right">
        <Action action="create">
          {/* @ts-ignore */}
          <Form />
        </Action>
      </div>
      <Searchbar />
      <Suspense key={q} fallback={<DatatableSkeleton />}>
        <DataFetch
          searchParams={searchParamsForDatatable}
          products={products}
        />
      </Suspense>
    </>
  );
};

export default AdminCollectionsPage;
