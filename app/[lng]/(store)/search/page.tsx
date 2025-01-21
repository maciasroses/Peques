import { Suspense } from "react";
import { ProductList } from "./components";
import { Filters, ListSkeleton, Pagination } from "@/app/shared/components";
import { getProductsForStore } from "@/app/shared/services/product/controller";
import type {
  IFilterGroup,
  IProductList,
  IBaseLangPage,
  IProductSearchParams,
} from "@/app/shared/interfaces";

import prisma from "@/app/shared/services/prisma";

interface ISearchPage extends IBaseLangPage {
  searchParams?: IProductSearchParams;
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

  const { totalPages } = (await getProductsForStore(
    searchParamsForList
  )) as IProductList;

  const available_filters = (await prisma.filterGroup.findMany({
    include: {
      filters: true,
      collections: {
        select: {
          collection: {
            select: {
              name: true,
            },
          },
        },
      },
    },
  })) as IFilterGroup[];

  return (
    <article className="pt-24 px-4 pb-4 flex md:gap-4">
      <aside className="hidden md:block md:w-1/4 lg:w-1/5 z-20">
        <Filters lng={lng} filters={available_filters} />
      </aside>
      <section className="w-full md:w-3/4 lg:w-4/5">
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
