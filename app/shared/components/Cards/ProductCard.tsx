import Link from "next/link";
import Image from "next/image";
import formatCurrency from "@/app/shared/utils/format-currency";
import { AddToCart, AddCustomList, StarRating } from "@/app/shared/components";
import type {
  ICustomList,
  IProduct,
  IPromotion,
} from "@/app/shared/interfaces";

interface IProductCard {
  lng: string;
  userId: string;
  product: IProduct;
  myLists: ICustomList[];
  promotions?: IPromotion[];
}

const ProductCard = ({
  lng,
  userId,
  product,
  myLists,
  promotions,
}: IProductCard) => {
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

  // Filtra las promociones aplicables al producto o a su categoría
  const applicablePromotions = promotions?.filter(
    (promotion) =>
      promotion.products.some(
        (promoProduct) => promoProduct.productId === product.id
      ) ||
      promotion.categories.some(
        (promoCategory) =>
          promoCategory.productCategoryId === product.categoryId
      )
  );

  // Selecciona la promoción más relevante (por ejemplo, mayor descuento)
  const selectedPromotion = applicablePromotions?.reduce<IPromotion | null>(
    (bestPromo, promo) => {
      if (!bestPromo) return promo;
      return promo.discountValue > bestPromo.discountValue ? promo : bestPromo;
    },
    null
  );

  // Calcula el precio con descuento (si aplica)
  const discountedPrice = selectedPromotion
    ? product.salePriceMXN -
      (selectedPromotion.discountType === "PERCENTAGE"
        ? (selectedPromotion.discountValue / 100) * product.salePriceMXN
        : selectedPromotion.discountValue)
    : product.salePriceMXN;

  const discountDescription = selectedPromotion
    ? selectedPromotion.discountType === "PERCENTAGE"
      ? `${selectedPromotion.discountValue}% de descuento`
      : `Descuento de ${formatCurrency(selectedPromotion.discountValue, "MXN")}`
    : null;

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
          <div className="flex flex-col">
            <div className="flex items-baseline gap-2">
              {selectedPromotion && (
                <span className="text-lg font-semibold line-through text-gray-500 dark:text-gray-400">
                  {formatCurrency(product.salePriceMXN, "MXN")}
                </span>
              )}
              <span className="text-3xl font-bold text-gray-900 dark:text-white">
                {formatCurrency(discountedPrice, "MXN")}
              </span>
            </div>
            {discountDescription && (
              <span className="text-sm font-medium text-green-600 dark:text-green-400">
                {discountDescription}
              </span>
            )}
          </div>
        </Link>
        <AddToCart product={product} />
      </div>
    </div>
  );
};

export default ProductCard;
