import { Suspense } from "react";
import { ProductList } from "./components";
import { getFilters } from "@/app/shared/services/filter/controller";
import { Filters, ListSkeleton, Pagination } from "@/app/shared/components";
import { getProductsForStore } from "@/app/shared/services/product/controller";
import type { Metadata } from "next";
import type {
  IFilterGroup,
  IProductList,
  IBaseLangPage,
  IProductSearchParams,
} from "@/app/shared/interfaces";

interface ISearchPage extends IBaseLangPage {
  searchParams?: IProductSearchParams;
}

export async function generateMetadata({
  searchParams,
}: ISearchPage): Promise<Metadata> {
  const q = searchParams?.q || "";

  return {
    title: q || "Todos los productos",
  };
}

const SearchPage = async ({ searchParams, params: { lng } }: ISearchPage) => {
  const {
    q = "",
    page = "1",
    filters = "",
    salePriceMXNTo = "",
    salePriceMXNFrom = "",
  } = searchParams || {};

  const searchParamsForList = {
    q,
    page,
    filters,
    salePriceMXNTo,
    salePriceMXNFrom,
  };

  const { totalPages, totalCount } = (await getProductsForStore(
    searchParamsForList
  )) as IProductList;

  const available_filters = (await getFilters({})) as IFilterGroup[];

  return (
    <article className="pt-40 px-4 pb-4 flex md:gap-4">
      <aside className="hidden md:block md:w-1/4 lg:w-1/5 z-20">
        <Filters filters={available_filters} />
      </aside>
      <section className="w-full md:w-3/4 lg:w-4/5">
        <div className="mb-4">
          <p className="font-medium text-lg md:text-2xl">
            {q ? `Buscando: ${q}` : `Todos los productos`}
          </p>
          <p className="text-sm md:text-lg text-gray-800">
            {totalCount} resultado
            {totalCount > 1 || totalCount === 0 ? "s" : ""}
          </p>
        </div>
        <Suspense
          key={q + page + filters + salePriceMXNTo + salePriceMXNFrom}
          fallback={<ListSkeleton />}
        >
          <ProductList lng={lng} searchParams={searchParamsForList} />
        </Suspense>
        <Pagination totalPages={totalPages} />
      </section>
    </article>
  );
};

export default SearchPage;
