import { Suspense } from "react";
import { notFound } from "next/navigation";
import { ProductList } from "./components";
import { getFilters } from "@/app/shared/services/filter/controller";
import {
  Filters,
  FiltersMenu,
  ListSkeleton,
  Pagination,
} from "@/app/shared/components";
import { getCollectionByLink } from "@/app/shared/services/collection/controller";
import { getProductsByCollection } from "@/app/shared/services/product/controller";
import type { Metadata } from "next";
import type {
  ICollection,
  IFilterGroup,
  IProductList,
  IProductSearchParams,
} from "@/app/shared/interfaces";

interface ICollectionNamePage {
  params: {
    lng: string;
    link: string;
  };
  searchParams?: IProductSearchParams;
}

export async function generateMetadata({
  params: { link },
  searchParams,
}: ICollectionNamePage): Promise<Metadata> {
  try {
    const collection = (await getCollectionByLink({
      link,
    })) as ICollection;

    if (!collection) notFound();

    return {
      title: collection.name,
    };
  } catch {
    return {
      title: "Colección",
    };
  }
}

const CollectionNamePage = async ({
  searchParams,
  params: { lng, link },
}: ICollectionNamePage) => {
  const collection = (await getCollectionByLink({
    link,
  })) as ICollection;

  if (!collection) notFound();

  const {
    page = "1",
    filters = "",
    salePriceMXNTo = "",
    salePriceMXNFrom = "",
  } = searchParams || {};

  const searchParamsForList = {
    page,
    filters,
    salePriceMXNTo,
    salePriceMXNFrom,
  };

  const { totalPages, totalCount } = (await getProductsByCollection({
    ...searchParamsForList,
    collection: link,
  })) as IProductList;

  const available_filters = (await getFilters({})) as IFilterGroup[];

  return (
    <article className="pt-40 px-4 pb-4 flex md:gap-4">
      <aside className="hidden md:block md:w-1/4 lg:w-1/5 z-20">
        <Filters collection={link} filters={available_filters} />
      </aside>
      <section className="w-full md:w-3/4 lg:w-4/5">
        <div className="w-full mb-4 flex justify-between items-center">
          <p className="text-sm md:text-lg text-gray-800">
            {totalCount} resultado
            {totalCount > 1 || totalCount === 0 ? "s" : ""}
          </p>
          <div className="block md:hidden">
            <FiltersMenu
              collection={link}
              filters_available={available_filters}
            />
          </div>
        </div>
        <Suspense
          key={page + filters + salePriceMXNTo + salePriceMXNFrom}
          fallback={<ListSkeleton />}
        >
          <ProductList
            lng={lng}
            collection={link}
            searchParams={searchParamsForList}
          />
        </Suspense>
        <Pagination totalPages={totalPages} />
      </section>
    </article>
  );
};

export default CollectionNamePage;
