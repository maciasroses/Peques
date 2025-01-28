import { notFound } from "next/navigation";
import { ProductSlugCard } from "./components";
import { ProductList } from "@/app/shared/components";
import {
  getProductByKey,
  getSimilarProducts,
} from "@/app/shared/services/product/controller";
import type { Metadata } from "next";
import type {
  IProduct,
  IProductList as IProductListInterface,
} from "@/app/shared/interfaces";

interface ISlugPage {
  params: {
    lng: string;
    slug: string;
  };
}

export async function generateMetadata({
  params: { slug },
}: ISlugPage): Promise<Metadata> {
  try {
    const product = (await getProductByKey({ key: slug })) as IProduct;

    if (!product) notFound();

    return {
      title: product.name,
    };
  } catch {
    return {
      title: "Producto",
    };
  }
}

const SlugPage = async ({ params: { lng, slug } }: ISlugPage) => {
  const product = (await getProductByKey({ key: slug })) as IProduct;
  if (!product) notFound();

  const randomCollection =
    product.collections[Math.floor(Math.random() * product.collections.length)];

  const { products } = (await getSimilarProducts({
    collectionLink: randomCollection && randomCollection.collection.link,
  })) as IProductListInterface;

  const similarProductsWithoutCurrent = products.filter(
    (item) => item.id !== product.id
  );

  return (
    <div className="pt-32 px-4 pb-4 md:pt-48 md:px-24 md:pb-24 flex flex-col gap-8">
      <ProductSlugCard lng={lng} product={product} />
      <ProductList
        lng={lng}
        title="Productos similares"
        products={similarProductsWithoutCurrent}
      />
    </div>
  );
};

export default SlugPage;
