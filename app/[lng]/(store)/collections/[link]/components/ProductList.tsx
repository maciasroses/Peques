import { Card404, ProductCard } from "@/app/shared/components";
import { getProductsByCollection } from "@/app/shared/services/product/controller";
import type {
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

  return (
    <>
      {products.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {products.map((product) => (
            <ProductCard lng={lng} key={product.id} product={product} />
          ))}
        </div>
      ) : (
        <Card404
          title="No products found"
          description="Try changing the search parameters"
        />
      )}
    </>
  );
};

export default ProductList;
