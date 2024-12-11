import { Suspense } from "react";
import { Action, DatatableSkeleton } from "@/app/shared/components";
import { Form, DataFetch, Searchbar } from "./components";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Proveedores",
};

interface IAdminProvidersPage {
  searchParams?: {
    q?: string;
  };
}

const AdminProvidersPage = async ({ searchParams }: IAdminProvidersPage) => {
  const { q = "" } = searchParams || {};

  const searchParamsForDatatable = { q };

  return (
    <>
      <div className="w-full text-right">
        {/* <Action action="create" /> */}
        <Action action="create">
          {/* @ts-ignore */}
          <Form />
        </Action>
      </div>
      <Searchbar />
      <Suspense key={q} fallback={<DatatableSkeleton />}>
        <DataFetch searchParams={searchParamsForDatatable} />
      </Suspense>
    </>
  );
};

export default AdminProvidersPage;
