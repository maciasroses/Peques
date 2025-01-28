import Image from "next/image";
import { ProductCard } from "@/app/shared/components";
import { getAllCollections } from "@/app/shared/services/collection/controller";
import type { Metadata } from "next";
import type {
  ICollection,
  IBaseLangPage,
  IProductOnCollection,
} from "@/app/shared/interfaces";

export const metadata: Metadata = {
  title: "Colecciones",
};

interface ICollectionsPage extends IBaseLangPage {}

const CollectionsPage = async ({ params: { lng } }: ICollectionsPage) => {
  const collections = (await getAllCollections()) as ICollection[];

  return (
    <article className="pt-32 px-4 pb-4 flex md:gap-4">
      <CollectionList collections={collections} lng={lng} />
    </article>
  );
};

export default CollectionsPage;

type CollectionListProps = {
  lng: string;
  collections: ICollection[];
};

const CollectionList: React.FC<CollectionListProps> = ({
  collections,
  lng,
}) => (
  <div className="flex flex-col gap-12 w-full">
    {collections.map((collection) => (
      <CollectionItem key={collection.id} collection={collection} lng={lng} />
    ))}
  </div>
);

const CollectionItem: React.FC<{ collection: ICollection; lng: string }> = ({
  collection,
  lng,
}) => (
  <div className="flex flex-col lg:flex-row gap-10 w-full p-10">
    <CollectionBanner collection={collection} />
    <div className="w-full lg:w-1/2">
      <ProductList products={collection.products} lng={lng} />
      <div className="mt-4 text-right">
        <a
          href={`/${lng}/collections/${collection.link}`}
          className="text-blue-600 hover:underline"
        >
          Ver todos los productos de la colección {collection.name}
        </a>
      </div>
    </div>
  </div>
);

const ProductList: React.FC<{
  products: IProductOnCollection[];
  lng: string;
}> = ({ products, lng }) => (
  <div className="w-full grid grid-cols-1 md:grid-cols-2 gap-8">
    {products.slice(0, 4).map((product) => (
      <ProductCard
        lng={lng}
        key={product.productId}
        product={product.product}
      />
    ))}
  </div>
);

const CollectionBanner: React.FC<{ collection: ICollection }> = ({
  collection,
}) => (
  <div className="relative w-full lg:w-1/2 h-80 lg:h-full bg-gray-200 rounded-lg overflow-hidden shadow-md">
    <Image
      width={500}
      height={500}
      src={collection.imageUrl}
      alt={collection.name}
      className="absolute w-full h-full object-cover"
    />
    <div className="absolute inset-0 bg-black bg-opacity-40 flex flex-col justify-center items-center text-center text-white p-4">
      <h2 className="text-2xl font-bold">{collection.name}</h2>
    </div>
  </div>
);
