import { Filters } from "@/app/shared/components";
import { CollectionKeys } from "@/app/shared/interfaces";

interface ICollectionNamePage {
  params: {
    lng: string;
    name: CollectionKeys;
  };
}

const CollectionNamePage = ({ params: { lng, name } }: ICollectionNamePage) => {
  return (
    <article className="pt-24 px-4 pb-4 flex md:gap-4">
      <aside className="hidden md:block md:w-1/4 lg:w-1/5 z-20">
        <Filters lng={lng} collection={name} />
      </aside>
    </article>
  );
};

export default CollectionNamePage;
