import type { ICollection } from "@/app/shared/interfaces";
import Link from "next/link";

interface ICollectionsList {
  lng: string;
  collections: ICollection[];
}

const CollectionsList = ({ lng, collections }: ICollectionsList) => {
  return (
    <section>
      <ul className="flex pr-14 overflow-x-auto items-start w-full max-w-min">
        {collections.map((collection) => (
          <li
            key={collection.id}
            className="w-[300px] h-[500px] bg-gray-300 relative rounded-md text-center ml-14"
          >
            <Link
              href={`/${lng}/collections/${collection.link}`}
              className="group"
            >
              <div
                className="w-[300px] h-[500px] bg-cover rounded-md"
                style={{
                  backgroundImage: `url(${collection.imageUrl})`,
                }}
              />
              <div className="absolute size-full top-0 left-0 p-4 bg-black bg-opacity-50 group-hover:bg-opacity-30 transition-all duration-500 flex flex-col justify-center items-center rounded-md">
                <p className="font-bold text-2xl text-white">
                  {collection.name}
                </p>
                <p className="hidden opacity-0 scale-95 group-hover:block group-hover:opacity-100 group-hover:scale-100 bg-white text-black px-4 py-2 rounded-md mt-4 transition-all duration-500">
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
