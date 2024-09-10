import { Suspense } from "react";
import { Action, DatatableSkeleton } from "@/components";
import { DataFetch, Form, Searchbar } from "./components";
import { getProducts } from "@/services/product/controller";
import type { IProduct } from "@/interfaces";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Pedidos",
};

interface IAdminOrdersPage {
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

const AdminOrdersPage = async ({ searchParams }: IAdminOrdersPage) => {
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
      <Suspense
        key={
          deliveryStatus +
          paymentMethod +
          client +
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

export default AdminOrdersPage;
