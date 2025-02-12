import { Card404, ProductCard } from "@/app/shared/components";
import { getProductsByCollection } from "@/app/shared/services/product/controller";
import type {
  IProduct,
  IProductList,
  IProductSearchParams,
} from "@/app/shared/interfaces";

interface IProductListComp {
  lng: string;
  collection: string;
  searchParams: IProductSearchParams;
}

const ProductList = async ({
  lng,
  collection,
  searchParams,
}: IProductListComp) => {
  const { products } = (await getProductsByCollection({
    ...searchParams,
    collection,
  })) as IProductList;

  const sortedProducts = sortByCollectionOrder(products, collection);

  return (
    <>
      {sortedProducts.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {sortedProducts.map((product) => (
            <ProductCard lng={lng} key={product.id} product={product} />
          ))}
        </div>
      ) : (
        <Card404
          title="No se encontraron productos"
          description="Intenta con otra búsqueda"
        />
      )}
    </>
  );
};

export default ProductList;

const sortByCollectionOrder = (
  products: IProduct[],
  collectionLink: string
) => {
  return products
    .map((product) => {
      const collectionData = product.collections.find(
        (c) => c.collection.link === collectionLink
      );
      return collectionData
        ? { ...product, order: collectionData.order }
        : null;
    })
    .filter((product) => product !== null)
    .sort((a, b) => a.order - b.order);
};
