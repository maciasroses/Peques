import Link from "next/link";
import Image from "next/image";
import formatCurrency from "@/app/shared/utils/format-currency";
import { AddToCart, AddCustomList, StarRating } from "@/app/shared/components";
import type { ICustomList, IProduct } from "@/app/shared/interfaces";

interface IProductCard {
  lng: string;
  userId: string;
  product: IProduct;
  myLists: ICustomList[];
}

const ProductCard = ({ lng, userId, product, myLists }: IProductCard) => {
  const isFavorite = myLists.some((list) => {
    return list.products.some(
      (myProduct) => myProduct.productId === product.id
    );
  });

  const averageRating = product.reviews.length
    ? Number(
        (
          product.reviews.reduce((sum, review) => sum + review.rating, 0) /
          product.reviews.length
        ).toFixed(1)
      )
    : 0;

  return (
    <div className="w-full bg-white border border-gray-200 rounded-lg shadow dark:bg-gray-800 dark:border-gray-700">
      <Link href={`/${lng}/${product.key}`} className="flex justify-center p-8">
        <Image
          width={500}
          height={300}
          alt={product.name}
          className="size-auto"
          src={
            product.files[0]?.url || "/assets/images/landscape-placeholder.webp"
          }
        />
      </Link>
      <div className="flex flex-col gap-2 px-5 pb-5">
        <div className="flex gap-2 justify-between">
          <StarRating
            rating={averageRating}
            totalReviews={product.reviews.length}
          />
          <AddCustomList
            lng={lng}
            userId={userId}
            myLists={myLists}
            productId={product.id}
            isFavorite={isFavorite}
          />
        </div>
        <Link href={`/${lng}/${product.key}`}>
          <h1 className="text-xl font-semibold tracking-tight text-gray-900 dark:text-white">
            {product.name}
          </h1>
          <span className="text-3xl font-bold text-gray-900 dark:text-white">
            {formatCurrency(product.salePriceMXN, "MXN")}
          </span>
        </Link>
        <AddToCart product={product} />
      </div>
    </div>
  );
};

export default ProductCard;
