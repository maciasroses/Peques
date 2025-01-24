import { Action, DatatableSkeleton } from "@/app/shared/components";
import { ICollection, IProduct } from "@/app/shared/interfaces";
import { getCollections } from "@/app/shared/services/collection/controller";
import { getProducts } from "@/app/shared/services/product/controller";
import { Metadata } from "next";
import { Form, DataFetch, Searchbar } from "./components";
import { Suspense } from "react";

export const metadata: Metadata = {
  title: "Colecciones",
};

export interface IAdminFiltersPage {
  searchParams?: {
    q?: string;
  };
}

const AdminFiltersPage = async ({ searchParams }: IAdminFiltersPage) => {
  const { q = "" } = searchParams || {};

  const searchParamsForDatatable = { q };

  const products = (await getProducts({})) as IProduct[];
  const collections = (await getCollections({})) as ICollection[];

  return (
    <>
      <div className="w-full text-right">
        <Action action="create">
          {/* @ts-ignore */}
          <Form products={products} collections={collections} />
        </Action>
      </div>
      <Searchbar />
      <Suspense key={q} fallback={<DatatableSkeleton />}>
        <DataFetch
          products={products}
          collections={collections}
          searchParams={searchParamsForDatatable}
        />
      </Suspense>
    </>
  );
};

export default AdminFiltersPage;
