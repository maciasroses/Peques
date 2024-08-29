import { Suspense } from "react";
import { DatatableSkeleton } from "@/components";
import { Action, DataFetch, Searchbar } from "./components";

interface IAdminProvidersPage {
  searchParams?: {
    q?: string;
  };
}

const AdminProvidersPage = ({ searchParams }: IAdminProvidersPage) => {
  const { q = "" } = searchParams || {};

  const searchParamsForDatatable = { q };

  return (
    <>
      <div className="w-full text-right">
        <Action action="create" />
      </div>
      <Searchbar />
      <Suspense key={q} fallback={<DatatableSkeleton />}>
        <DataFetch searchParams={searchParamsForDatatable} />
      </Suspense>
    </>
  );
};

export default AdminProvidersPage;
