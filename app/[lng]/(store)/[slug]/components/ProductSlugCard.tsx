"use client";

import Image from "next/image";
import { useState } from "react";

import MediaPreview from "./MediaPreview";
import { cn } from "@/app/shared/utils/cn";
import { HandThumbUp } from "@/app/shared/icons";
import formatCurrency from "@/app/shared/utils/format-currency";
import formatDateLatinAmerican from "@/app/shared/utils/formatdate-latin";
import { useModal, useImageZoom, useDisableScroll } from "@/app/shared/hooks";
import {
  AddToCart,
  StarRating,
  ImageGallery,
  AddCustomList,
} from "@/app/shared/components";
import type { IProduct, ICustomList } from "@/app/shared/interfaces";

interface IProductSlugCard {
  lng: string;
  userId: string;
  product: IProduct;
  isFavorite: boolean;
  myLists: ICustomList[];
}

const ProductSlugCard = ({
  lng,
  userId,
  product,
  myLists,
  isFavorite,
}: IProductSlugCard) => {
  const { isOpen, onOpen, onClose } = useModal();
  const [selectedImageId, setSelectedImageId] = useState(product.files[0]?.id);

  const selectedImage =
    product.files.find((file) => file.id === selectedImageId) ??
    product.files[0];

  useDisableScroll(isOpen);

  const {
    zoomRef,
    zoomPosition,
    zoomBoxPosition,
    handleMouseMove,
    handleMouseLeave,
  } = useImageZoom();

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
              <AddCustomList
                lng={lng}
                userId={userId}
                myLists={myLists}
                productId={product.id}
                isFavorite={isFavorite}
              />
            </div>
            <div className="flex flex-col gap-2 md:gap-4">
              <StarRating
                rating={averageRating}
                totalReviews={product.reviews.length}
              />
              <p className="text-lg md:text-2xl lg:text-5xl">
                {formatCurrency(product.salePriceMXN, "MXN")}
              </p>
              <p className="text-base md:text-xl lg:text-4xl">
                {product.description}
              </p>
              <AddToCart product={product} />
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
            {product.reviews.length ? (
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
                        <button className="px-4 py-2 inline-flex items-center gap-2 bg-blue-600 rounded-full">
                          Es útil
                          {review.likesCount !== 0 && (
                            <div className="flex items-center gap-1">
                              <HandThumbUp size="size-4" />
                              <span>{review.likesCount}</span>
                            </div>
                          )}
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
