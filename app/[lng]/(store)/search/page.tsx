import { Suspense } from "react";
import { ProductList } from "./components";
import { Filters, ListSkeleton, Pagination } from "@/app/shared/components";
import { getProductsForStore } from "@/app/shared/services/product/controller";
import type {
  IProductList,
  IBaseLangPage,
  IProductSearchParams,
} from "@/app/shared/interfaces";

interface ISearchPage extends IBaseLangPage {
  searchParams?: IProductSearchParams;
}

const SearchPage = async ({ searchParams, params: { lng } }: ISearchPage) => {
  const {
    q = "",
    page = "1",
    category = "",
    salePriceMXNTo = "",
    salePriceMXNFrom = "",
  } = searchParams || {};

  const searchParamsForList = {
    q,
    page,
    category,
    salePriceMXNTo,
    salePriceMXNFrom,
  };

  const { totalPages } = (await getProductsForStore(
    searchParamsForList
  )) as IProductList;

  return (
    <article className="pt-24 px-4 pb-4 flex md:gap-4">
      <aside className="hidden md:block md:w-1/4 lg:w-1/5 z-20">
        <Filters lng={lng} />
      </aside>
      <section className="w-full md:w-3/4 lg:w-4/5">
        <Suspense
          key={q + page + category + salePriceMXNTo + salePriceMXNFrom}
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
