"use client";

import Link from "next/link";
import Image from "next/image";
import { useState } from "react";
import { cn } from "@/app/shared/utils/cn";
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
  const [loading, setLoading] = useState(true);

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

  const selectedPromotion = applicablePromotions.reduce<IPromotion | null>(
    (bestPromo, promo) => {
      const calculateEffectiveDiscount = (promotion: IPromotion) => {
        if (promotion.discountType === "PERCENTAGE") {
          return (promotion.discountValue / 100) * product.salePriceMXN;
        }
        if (promotion.discountType === "FIXED") {
          return promotion.discountValue;
        }
        return 0;
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
    <div className="w-full bg-white rounded-lg">
      <Link
        href={`/${lng}/${product.key}`}
        className="relative flex justify-center"
      >
        {loading && (
          <div className="absolute rounded-lg inset-0 w-full h-64 bg-primary-light animate-pulse"></div>
        )}
        <Image
          width={500}
          height={300}
          alt={product.name}
          className={cn(
            "w-full h-64 object-contain transition-opacity duration-300",
            loading ? "opacity-0" : "opacity-100"
          )}
          src={
            product.files.find(
              (file) => file.order === 1 && file.type === "IMAGE"
            )?.url || "/assets/images/landscape-placeholder.webp"
          }
          onLoad={() => setLoading(false)}
        />
      </Link>
      <div className="flex flex-col gap-2 sm:p-5">
        <div className="flex gap-2 justify-between">
          <StarRating
            rating={averageRating}
            totalReviews={product.reviews.length}
          />
          <div className="hidden sm:block">
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
        </div>
        <Link href={`/${lng}/${product.key}`}>
          <h1 className="sm:text-xl font-semibold tracking-tight text-gray-900">
            {product.name}
          </h1>
          <div className="flex flex-col">
            <div className="flex items-baseline gap-2">
              {selectedPromotion && (
                <span className="text-base sm:text-lg font-semibold line-through text-gray-500">
                  {formatCurrency(product.salePriceMXN, "MXN")}
                </span>
              )}
              <span className="text-xl sm:text-3xl font-bold text-gray-900">
                {formatCurrency(discountedPrice, "MXN")}
              </span>
            </div>
            {discountDescription && (
              <span className="text-sm font-medium text-green-600">
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
