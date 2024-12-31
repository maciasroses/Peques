import { Suspense } from "react";
import { DataFetch, Searchbar } from "./components";
import { DatatableSkeleton } from "@/app/shared/components";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Usuarios",
};

export interface IAdminUsersPage {
  searchParams?: {
    q?: string;
    wantsNewsletter?: string;
  };
}

const AdminUsersPage = async ({ searchParams }: IAdminUsersPage) => {
  const { q = "", wantsNewsletter = "" } = searchParams || {};

  const searchParamsForDatatable = { q, wantsNewsletter };

  return (
    <>
      <Searchbar />
      <Suspense key={q + wantsNewsletter} fallback={<DatatableSkeleton />}>
        <DataFetch searchParams={searchParamsForDatatable} />
      </Suspense>
    </>
  );
};

export default AdminUsersPage;
