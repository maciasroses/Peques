import { notFound } from "next/navigation";
import { ProductSlugCard } from "./components";
import { ProductList } from "@/app/shared/components";
import { getMe } from "@/app/shared/services/user/controller";
import { getMyLists } from "@/app/shared/services/customList/controller";
import {
  getProductByKey,
  getSimilarProducts,
} from "@/app/shared/services/product/controller";
import type {
  IUser,
  IProduct,
  ICustomList,
  IProductList as IProductListInterface,
} from "@/app/shared/interfaces";

interface ISlugPage {
  params: {
    lng: string;
    slug: string;
  };
}

const SlugPage = async ({ params: { lng, slug } }: ISlugPage) => {
  const me = (await getMe()) as IUser;
  const product = (await getProductByKey({ key: slug })) as IProduct;
  const myLists = (await getMyLists({ isForFav: true })) as ICustomList[];

  if (!product) notFound();

  const { products } = (await getSimilarProducts({
    category: product.category as string,
  })) as IProductListInterface;

  const isFavorite = myLists.some((list) => {
    return list.products.some(
      (listProduct) => listProduct.productId === product.id
    );
  });

  const similarProductsWithoutCurrent = products.filter(
    (item) => item.id !== product.id
  );

  return (
    <div className="pt-24 px-4 pb-4 flex flex-col gap-8">
      <ProductSlugCard
        lng={lng}
        userId={me?.id}
        product={product}
        myLists={myLists}
        isFavorite={isFavorite}
      />
      <ProductList
        lng={lng}
        userId={me?.id}
        myLists={myLists}
        products={similarProductsWithoutCurrent}
        title="Productos similares"
      />
    </div>
  );
};

export default SlugPage;
