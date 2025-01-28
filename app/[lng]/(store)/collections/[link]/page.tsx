import { Suspense } from "react";
import { notFound } from "next/navigation";
import { ProductList } from "./components";
import { getFilters } from "@/app/shared/services/filter/controller";
import { Filters, ListSkeleton, Pagination } from "@/app/shared/components";
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

    const q = searchParams?.q || "";

    return {
      title: q || collection.name,
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
  const collection = await getCollectionByLink({
    link,
  });

  if (!collection) notFound();

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

  const { totalPages, totalCount } = (await getProductsByCollection({
    ...searchParamsForList,
    collection: link,
  })) as IProductList;

  const available_filters = (await getFilters({})) as IFilterGroup[];

  return (
    <article className="pt-36 px-4 pb-4 flex md:gap-4">
      <aside className="hidden md:block md:w-1/4 lg:w-1/5 z-20">
        <Filters collection={link} filters={available_filters} />
      </aside>
      <section className="w-full md:w-3/4 lg:w-4/5">
        <div className="mb-4">
          <p className="font-medium text-lg md:text-2xl">
            {q ? `Buscando: ${q}` : `Todos los productos`}
          </p>
          <p className="text-sm md:text-lg text-gray-800 dark:text-gray-200">
            {totalCount} resultado
            {totalCount > 1 || totalCount === 0 ? "s" : ""}
          </p>
        </div>
        <Suspense
          key={q + page + filters + salePriceMXNTo + salePriceMXNFrom}
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
