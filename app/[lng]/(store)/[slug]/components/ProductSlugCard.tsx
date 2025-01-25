"use client";

import Image from "next/image";
import { useState } from "react";

import MediaPreview from "./MediaPreview";
import { cn } from "@/app/shared/utils/cn";
import { HandThumbUp } from "@/app/shared/icons";
import formatCurrency from "@/app/shared/utils/format-currency";
import formatDateLatinAmerican from "@/app/shared/utils/formatdate-latin";
import {
  useModal,
  useImageZoom,
  useDisableScroll,
  useAuth,
} from "@/app/shared/hooks";
import {
  AddToCart,
  StarRating,
  ImageGallery,
  AddToCustomList,
} from "@/app/shared/components";
import type { IProduct, IPromotion } from "@/app/shared/interfaces";
import { likeOrDislikeReview } from "@/app/shared/services/productReview/controller";

interface IProductSlugCard {
  lng: string;
  product: IProduct;
}

const ProductSlugCard = ({ lng, product }: IProductSlugCard) => {
  const { user } = useAuth();
  const { isOpen, onOpen, onClose } = useModal();
  const [selectedImageId, setSelectedImageId] = useState(product.files[0]?.id);

  const selectedImage = product.files.find(
    (file) => file.id === selectedImageId
  ) ??
    product.files[0] ?? {
      type: "IMAGE",
      url: "/assets/images/landscape-placeholder.webp",
    };

  useDisableScroll(isOpen);

  const {
    zoomRef,
    zoomPosition,
    zoomBoxPosition,
    handleMouseMove,
    handleMouseLeave,
  } = useImageZoom();

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

  const ratingsDistribution = product.reviews.reduce(
    (acc: { [key: number]: number }, review) => {
      acc[review.rating] = (acc[review.rating] || 0) + 1;
      return acc;
    },
    {}
  );

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
    <>
      {isOpen && (
        <ImageGallery
          product={product}
          onClose={onClose}
          selectedImageId={selectedImageId}
          setSelectedImageId={setSelectedImageId}
        />
      )}
      <div className="flex flex-col md:flex-row gap-4 w-full">
        <div className="flex gap-4 w-full md:w-1/2 h-full justify-center md:justify-start">
          <div className="flex flex-col gap-2">
            {product.files.map((file) => (
              <div
                key={file.id}
                className={cn(
                  "size-16 border border-gray-300 cursor-pointer hover:border-blue-600 dark:hover:border-blue-300 p-1",
                  selectedImage === file &&
                    "border-blue-600 dark:border-blue-300"
                )}
              >
                <MediaPreview
                  file={file}
                  isAllGallery
                  alt={product.name}
                  onMouseEnter={() => setSelectedImageId(file.id)}
                />
              </div>
            ))}
          </div>
          <div
            ref={zoomRef}
            onClick={onOpen}
            onMouseMove={handleMouseMove}
            onMouseLeave={handleMouseLeave}
            className={cn(
              "w-full h-96 flex justify-center border border-gray-300 cursor-pointer relative",
              selectedImage &&
                selectedImage.type === "IMAGE" &&
                "md:cursor-zoom-in "
            )}
          >
            <MediaPreview alt={product.name} file={selectedImage} />
            <div
              className={cn(
                "hidden absolute border border-black bg-black opacity-40",
                selectedImage.type === "IMAGE" && "md:block"
              )}
              style={{
                width: "150px",
                height: "150px",
                left: `${zoomBoxPosition.x}px`,
                top: `${zoomBoxPosition.y}px`,
                visibility:
                  zoomPosition.x === 0 && zoomPosition.y === 0
                    ? "hidden"
                    : "visible",
              }}
            ></div>
          </div>
        </div>
        <div className="relative w-full md:w-1/2">
          <div className="flex flex-col gap-2">
            <div className="flex items-start justify-between gap-4">
              <h1 className="text-2xl md:text-5xl lg:text-9xl font-bold truncate">
                {product.name}
              </h1>
              <AddToCustomList
                lng={lng}
                user={user}
                productId={product.id}
                isFavorite={isFavorite}
              />
            </div>
            <div className="flex flex-col gap-2 md:gap-4">
              <StarRating
                rating={averageRating}
                totalReviews={product.reviews.length}
              />
              <div className="flex flex-col">
                <div className="flex items-baseline gap-2">
                  {selectedPromotion && (
                    <span className="text-sm md:text-lg lg:text-3xl font-semibold line-through text-gray-500 dark:text-gray-400">
                      {formatCurrency(product.salePriceMXN, "MXN")}
                    </span>
                  )}
                  <span className="text-lg md:text-2xl lg:text-5xl font-bold text-gray-900 dark:text-white">
                    {formatCurrency(discountedPrice, "MXN")}
                  </span>
                </div>
                {discountDescription && (
                  <span className="text-sm md:text-lg lg:text-3xl font-medium text-green-600 dark:text-green-400">
                    {discountDescription}
                  </span>
                )}
              </div>
              <p className="text-base md:text-xl lg:text-4xl">
                {product.description}
              </p>
              <AddToCart
                product={product}
                price={discountedPrice}
                discount={discountDescription}
                promotionId={selectedPromotion?.id || null}
              />
            </div>
          </div>
          <div
            className={cn(
              "hidden absolute top-0 right-0 size-full max-h-[600px] pointer-events-none",
              selectedImage.type === "IMAGE" && "md:block"
            )}
            style={{
              backgroundImage: `url(${selectedImage.url})`,
              backgroundSize: "150%",
              backgroundPosition: `${zoomPosition.x}% ${zoomPosition.y}%`,
              visibility:
                zoomPosition.x === 0 && zoomPosition.y === 0
                  ? "hidden"
                  : "visible",
            }}
          ></div>
        </div>
      </div>
      <div className="mt-4">
        <p className="text-4xl mt-6 mb-4">Opiniones</p>
        <div className="flex flex-col md:flex-row gap-4">
          <div className="w-full md:w-1/3">
            <StarRating
              rating={averageRating}
              totalReviews={product.reviews.length}
              ratingsDistribution={ratingsDistribution}
            />
          </div>
          <div className="w-full md:w-2/3">
            {product.reviews.length &&
            product.reviews.some((review) => review.content !== "") ? (
              <div className="flex flex-col gap-6">
                {product.reviews
                  .filter(
                    (review) => review.content && review.content.trim() !== ""
                  )
                  .sort((a, b) => {
                    return (
                      new Date(b.createdAt).getTime() -
                      new Date(a.createdAt).getTime()
                    );
                  })
                  .map((review) => (
                    <div key={review.id} className="flex flex-col gap-2">
                      {review.userId === user?.id && (
                        <p className="text-gray-400 italic">Tu comentario</p>
                      )}
                      <div className="flex gap-2 justify-between">
                        <div className="flex gap-2 items-center">
                          <div className="size-5">
                            <Image
                              width={50}
                              height={50}
                              src={
                                review.user.image ??
                                "/assets/images/profilepic.webp"
                              }
                              alt={review.user.username}
                              className="size-full rounded-full"
                            />
                          </div>
                          <p>
                            {review.user.firstName || review.user.lastName
                              ? `${review.user.firstName} ${review.user.lastName}`
                              : review.user.username}
                          </p>
                        </div>
                        <p className="text-right">
                          {formatDateLatinAmerican(review.createdAt)}
                        </p>
                      </div>
                      <StarRating rating={review.rating} />
                      <p className="py-2">{review.content}</p>
                      <div>
                        <button
                          disabled={review.userId === user?.id}
                          onClick={async () => {
                            await likeOrDislikeReview(review.id);
                          }}
                          className={cn(
                            "px-4 py-2 inline-flex items-center gap-2 rounded-full border",
                            review.userId === user?.id
                              ? "border-gray-300 dark:border-gray-600 text-gray-300 dark:text-gray-600 cursor-not-allowed"
                              : review.likes.filter(
                                  (like) => like.userId === user?.id
                                ).length > 0 &&
                                  "bg-blue-600 border-blue-600 dark:border-blue-300 text-white"
                          )}
                        >
                          Es útil
                          <div className="flex items-center gap-1">
                            <HandThumbUp size="size-4" />
                            {review.likes.length > 0 && (
                              <span>{review.likes.length}</span>
                            )}
                          </div>
                        </button>
                      </div>
                    </div>
                  ))}
              </div>
            ) : (
              <p className="mt-4">Aún no hay comentarios</p>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default ProductSlugCard;
