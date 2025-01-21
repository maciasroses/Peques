import prisma from "@/app/shared/services/prisma";
import { Filters } from "@/app/shared/components";
import type { IFilterGroup } from "@/app/shared/interfaces";

interface ICollectionNamePage {
  params: {
    lng: string;
    name: string;
  };
}

const CollectionNamePage = async ({
  params: { lng, name },
}: ICollectionNamePage) => {
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
        <Filters lng={lng} filters={available_filters} collection={name} />
      </aside>
    </article>
  );
};

export default CollectionNamePage;
