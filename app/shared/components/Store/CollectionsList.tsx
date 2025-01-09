import Link from "next/link";
import type { ICollection } from "@/app/shared/interfaces";
import { cn } from "../../utils/cn";

interface ICollectionsList {
  lng: string;
  layDown?: boolean;
  collections: ICollection[];
}

const CollectionsList = ({ lng, layDown, collections }: ICollectionsList) => {
  return (
    <section>
      <ul className="flex pr-5 overflow-x-auto items-start w-full max-w-min mx-auto">
        {collections.map((collection) => (
          <li
            key={collection.id}
            className={cn(
              "bg-gray-300 relative rounded-md text-center ml-5",
              layDown
                ? "w-[250px] md:w-[500px] h-[150px] md:h-[300px]"
                : "w-[150px] md:w-[300px] h-[250px] md:h-[500px] "
            )}
          >
            <Link
              href={`/${lng}/collections/${collection.link}`}
              className="group"
            >
              <div
                className={cn(
                  "bg-cover rounded-md",
                  layDown
                    ? "w-[250px] md:w-[500px] h-[150px] md:h-[300px]"
                    : "w-[150px] md:w-[300px] h-[250px] md:h-[500px] "
                )}
                style={{
                  backgroundImage: `url(${collection.imageUrl})`,
                }}
              />
              <div className="absolute size-full top-0 left-0 py-10 px-4 bg-black bg-opacity-50 group-hover:bg-opacity-30 transition-all duration-500 flex flex-col justify-end items-center rounded-md">
                <p className="font-bold text-lg md:text-2xl text-white">
                  {collection.name}
                </p>
                <p className="opacity-0 scale-95 group-hover:opacity-100 group-hover:scale-100 transition-all duration-500 text-gray-600 dark:text-white hover:text-white dark:hover:text-gray-600 bg-primary dark:bg-primary-dark hover:bg-primary-dark dark:hover:bg-primary border border-gray-600 hover:border-white dark:border-white/70 dark:hover:border-gray-600 px-4 py-2 rounded-md text-xs md:text-base">
                  Ver colección
                </p>
              </div>
            </Link>
          </li>
        ))}
      </ul>
    </section>
  );
};

export default CollectionsList;
