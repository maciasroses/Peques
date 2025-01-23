import { Suspense } from "react";
import { Form, DataFetch, Searchbar } from "./components";
import { Action, DatatableSkeleton } from "@/app/shared/components";
import { getPromotions } from "@/app/shared/services/promotion/controller";
import type { Metadata } from "next";
import { IPromotion } from "@/app/shared/interfaces";
import { getAllProducts } from "@/app/shared/services/product/controller";
import { getAllCollections } from "@/app/shared/services/collection/controller";

export const metadata: Metadata = {
  title: "Colecciones",
};

export interface IAdminPromotionsPage {
  searchParams?: {
    q?: string;
  };
}

const AdminPromotionsPage = async ({ searchParams }: IAdminPromotionsPage) => {
  const { q = "" } = searchParams || {};

  const searchParamsForDatatable = { q };

  const products = await getAllProducts();
  const collections = await getAllCollections();

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
        <DataFetch searchParams={searchParamsForDatatable} />
      </Suspense>
    </>
  );
};

export default AdminPromotionsPage;
