"use client";

import Link from "next/link";
import Image from "next/image";
import { useAuth } from "@/app/shared/hooks";
import formatCurrency from "@/app/shared/utils/format-currency";
import {
  AddToCart,
  AddToCustomList,
  DeleteFromCustomList,
  StarRating,
} from "@/app/shared/components";
import type { IProduct, IPromotion } from "@/app/shared/interfaces";

interface IProductCard {
  lng: string;
  product: IProduct;
  customListId?: string;
  isForCustomList?: boolean;
}

const ProductCard = ({
  lng,
  product,
  customListId,
  isForCustomList = false,
}: IProductCard) => {
  const { user } = useAuth();

  const isFavorite =
    user?.customLists.some((list) => {
      return list.products.some(
        (myProduct) => myProduct.productId === product.id
      );
    }) || false;

  const averageRating = product.reviews.length
    ? Number(
        (
          product.reviews.reduce((sum, review) => sum + review.rating, 0) /
          product.reviews.length
        ).toFixed(1)
      )
    : 0;

  // Filter active promotions applicable to the product or its category
  const applicablePromotions = [
    ...product.promotions
      .map((promotion) => promotion.promotion)
      .filter(
        (promo) =>
          promo.isActive &&
          new Date(promo.startDate) <= new Date() &&
          new Date(promo.endDate) >= new Date()
      ),
    ...product.collections.flatMap((collection) =>
      collection.collection.promotions
        .map((promotion) => promotion.promotion)
        .filter(
          (promo) =>
            promo.isActive &&
            new Date(promo.startDate) <= new Date() &&
            new Date(promo.endDate) >= new Date()
        )
    ),
  ];

  // Select the best promotion based on the total discount
  const selectedPromotion = applicablePromotions.reduce<IPromotion | null>(
    (bestPromo, promo) => {
      const calculateEffectiveDiscount = (promotion: IPromotion) => {
        if (promotion.discountType === "PERCENTAGE") {
          return (promotion.discountValue / 100) * product.salePriceMXN;
        }
        if (promotion.discountType === "FIXED") {
          return promotion.discountValue;
        }
        return 0; // No discount
      };

      const currentDiscount = calculateEffectiveDiscount(promo);
      const bestDiscount = bestPromo
        ? calculateEffectiveDiscount(bestPromo)
        : 0;

      if (!bestPromo || currentDiscount > bestDiscount) {
        return promo;
      }

      return bestPromo;
    },
    null
  );

  // Calculate the price with discount (if applicable)
  const discountedPrice = selectedPromotion
    ? product.salePriceMXN -
      (selectedPromotion.discountType === "PERCENTAGE"
        ? (selectedPromotion.discountValue / 100) * product.salePriceMXN
        : selectedPromotion.discountValue <= 0
          ? 0
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
          {isForCustomList && customListId ? (
            <DeleteFromCustomList
              lng={lng}
              product={product}
              customListId={customListId}
            />
          ) : (
            <AddToCustomList
              lng={lng}
              user={user}
              productId={product.id}
              isFavorite={isFavorite}
            />
          )}
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
        <AddToCart
          product={product}
          price={discountedPrice}
          discount={discountDescription}
          promotionId={selectedPromotion?.id || null}
        />
      </div>
    </div>
  );
};

export default ProductCard;
