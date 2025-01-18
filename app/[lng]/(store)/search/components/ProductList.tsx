import { getMe } from "@/app/shared/services/user/controller";
import { Card404, ProductCard } from "@/app/shared/components";
import { getMyLists } from "@/app/shared/services/customList/controller";
import { getProductsForStore } from "@/app/shared/services/product/controller";
import type {
  IUser,
  ICustomList,
  IProductList,
  IProductSearchParams,
  IPromotion,
} from "@/app/shared/interfaces";

interface IProductListComp {
  lng: string;
  promotions: IPromotion[];
  searchParams: IProductSearchParams;
}

const ProductList = async ({
  lng,
  promotions,
  searchParams,
}: IProductListComp) => {
  const me = (await getMe()) as IUser;
  const myLists = (await getMyLists({ isForFav: true })) as ICustomList[];
  const { products } = (await getProductsForStore(
    searchParams
  )) as IProductList;

  return (
    <>
      {products.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {products.map((product) => (
            <ProductCard
              lng={lng}
              key={product.id}
              product={product}
              myLists={myLists}
              userId={me?.id}
              promotions={promotions}
            />
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
