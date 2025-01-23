import { Suspense } from "react";
import { notFound } from "next/navigation";
import { ProductList } from "./components";
import prisma from "@/app/shared/services/prisma";
import { Filters, ListSkeleton, Pagination } from "@/app/shared/components";
import { getCollectionByLink } from "@/app/shared/services/collection/controller";
import { getProductsByCollection } from "@/app/shared/services/product/controller";
import type {
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

  const { totalPages } = (await getProductsByCollection({
    ...searchParamsForList,
    collection: link,
  })) as IProductList;

  const available_filters = (await prisma.filterGroup.findMany({
    include: {
      filters: true,
      collections: {
        select: {
          collection: {
            select: {
              link: true,
            },
          },
        },
      },
    },
  })) as IFilterGroup[];

  return (
    <article className="pt-24 px-4 pb-4 flex md:gap-4">
      <aside className="hidden md:block md:w-1/4 lg:w-1/5 z-20">
        <Filters lng={lng} filters={available_filters} collection={link} />
      </aside>
      <section className="w-full md:w-3/4 lg:w-4/5">
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
