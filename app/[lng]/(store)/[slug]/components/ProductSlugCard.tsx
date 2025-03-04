"use client";

import Image from "next/image";
import { useEffect, useState } from "react";

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
  useCart,
} from "@/app/shared/hooks";
import {
  AddToCart,
  StarRating,
  ImageGallery,
  AddToCustomList,
  GenericInput,
  Modal,
} from "@/app/shared/components";
import type { IProduct, IPromotion } from "@/app/shared/interfaces";
import { likeOrDislikeReview } from "@/app/shared/services/productReview/controller";

const COLORS_CUSTOM = [
  "#F478AF",
  "#A2466E",
  "#DBBA0D",
  "#FDEAD4",
  "#1D1489",
  "#32620E",
];

interface IProductSlugCard {
  lng: string;
  product: IProduct;
}

const ProductSlugCard = ({ lng, product }: IProductSlugCard) => {
  const { cart } = useCart();
  const { user } = useAuth();
  const { isOpen, onOpen, onClose } = useModal();
  const [selectedImageId, setSelectedImageId] = useState(
    product.files.find((file) => file.order === 1 && file.type === "IMAGE")
      ?.id ??
      product.files[0]?.id ??
      "/assets/images/landscape-placeholder.webp"
  );
  const {
    isOpen: isCustomOpen,
    onOpen: onCustomOpen,
    onClose: onCustomClose,
  } = useModal();
  const customProduct = cart.find((item) => item.id === product.key);
  const [customName, setCustomName] = useState(
    customProduct?.customRequest
      ? JSON.parse(customProduct.customRequest).name
      : ""
  );
  const [customFont, setCustomFont] = useState(
    customProduct?.customRequest
      ? JSON.parse(customProduct.customRequest).font === "Script 2"
        ? "'Script 2', cursive"
        : JSON.parse(customProduct.customRequest).font
      : ""
  );
  const [customColor, setCustomColor] = useState(
    customProduct?.customRequest
      ? JSON.parse(customProduct.customRequest).color
      : ""
  );

  useEffect(() => {
    if (customProduct) {
      setCustomName(
        customProduct?.customRequest
          ? JSON.parse(customProduct.customRequest).name
          : ""
      );
      setCustomFont(
        customProduct?.customRequest
          ? JSON.parse(customProduct.customRequest).font === "Script 2"
            ? "'Script 2', cursive"
            : JSON.parse(customProduct.customRequest).font
          : ""
      );
      setCustomColor(
        customProduct?.customRequest
          ? JSON.parse(customProduct.customRequest).color
          : ""
      );
    }
  }, [customProduct]);

  const handleCustomClose = () => {
    setCustomName(
      customProduct?.customRequest
        ? JSON.parse(customProduct.customRequest).name
        : ""
    );
    setCustomFont(
      customProduct?.customRequest
        ? JSON.parse(customProduct.customRequest).font === "Script 2"
          ? "'Script 2', cursive"
          : JSON.parse(customProduct.customRequest).font
        : ""
    );
    setCustomColor(
      customProduct?.customRequest
        ? JSON.parse(customProduct.customRequest).color
        : ""
    );
    onCustomClose();
  };

  const selectedImage =
    product.files.find((file) => file.id === selectedImageId) ??
    product.files.find((file) => file.order === 1 && file.type === "IMAGE") ??
    product.files[0] ??
    "/assets/images/landscape placeholder.webp";

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

  const handleLikeComment = async (reviewId: string) => {
    if (user) {
      await likeOrDislikeReview(reviewId);
    } else {
      window.location.href = `/${lng}/login`;
    }
  };

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
      {isCustomOpen && (
        <Modal
          isOpen={isCustomOpen}
          onClose={handleCustomClose}
          backgroundColor="bg-white"
        >
          <>
            <p
              style={{
                fontFamily: "'Champagne & Limousines Bold'",
              }}
            >
              Al ser un producto personalizado, esta pieza tiene un tiempo de
              elaboración de 7 días.
            </p>
            <div
              className="flex flex-col gap-2 mt-2"
              style={{
                fontFamily: "'Champagne & Limousines Bold'",
              }}
            >
              <GenericInput
                type="text"
                id="customName"
                placeholder="Regina"
                ariaLabel="Nombre"
                defaultValue={customName}
                onChange={(e) => setCustomName(e.target.value)}
              />
              <p className="text-right">
                (El nombre se bordará tal y como lo escribas, por favor revisa
                mayúsculas o acentos)
              </p>
            </div>
            <div
              className="flex flex-col gap-2"
              style={{
                fontFamily: "'Champagne & Limousines Bold'",
              }}
            >
              <GenericInput
                type="select"
                id="customFont"
                ariaLabel="Fuente"
                defaultValue={customFont}
                placeholder="Selecciona una fuente"
                onChange={(e) => setCustomFont(e.target.value)}
                options={[
                  {
                    value: "Karin Script",
                    label: "Karin Script",
                  },
                  {
                    value: "'Script 2', cursive",
                    label: "Script 2",
                  },
                  { value: "Krone", label: "Krone" },
                ]}
              />
            </div>
            <p
              className="my-4"
              style={{
                fontFamily: "'Champagne & Limousines Bold'",
              }}
            >
              Elige un color
            </p>
            <div className="my-4 grid grid-cols-6 md:grid-cols-3 lg:grid-cols-6 gap-2">
              {Array.from({ length: 6 }).map((_, index) => (
                <button
                  key={index}
                  aria-label="Color"
                  style={{ backgroundColor: COLORS_CUSTOM[index] }}
                  onClick={() => setCustomColor(COLORS_CUSTOM[index])}
                  className={cn(
                    "rounded-full size-8 md:size-10 xl:size-14",
                    customColor === COLORS_CUSTOM[index] &&
                      `border-4 border-black`
                  )}
                ></button>
              ))}
            </div>
            {customName && customFont && customColor && (
              <>
                <div className="mb-4">
                  <p
                    className="text-xl"
                    style={{
                      fontFamily: "'Champagne & Limousines Bold'",
                    }}
                  >
                    Resultado:
                  </p>
                  <p
                    className="text-4xl text-center"
                    style={{
                      color: customColor,
                      fontFamily: customFont,
                    }}
                  >
                    {customName}
                  </p>
                </div>
                <AddToCart
                  product={product}
                  price={discountedPrice}
                  discount={discountDescription}
                  onParentClose={handleCustomClose}
                  promotionId={selectedPromotion?.id || null}
                  customRequest={JSON.stringify({
                    name: customName,
                    font:
                      customFont === "'Script 2', cursive"
                        ? "Script 2"
                        : customFont,
                    color: customColor,
                  })}
                />
                <div className="mt-4 flex flex-col">
                  <small className="font-black">
                    * Solo puedes agregar varias unidades de un mismo producto
                    personalizado a la vez. Sin embargo, puedes comprar
                    diferentes productos personalizados en una misma orden.
                  </small>
                  <small className="font-black">
                    * Si ya agregaste este producto sin personalizar al carrito,
                    elimínalo y agrégalo nuevamente con la personalización.
                  </small>
                </div>
              </>
            )}
          </>
        </Modal>
      )}
      <div className="flex flex-col md:flex-row gap-2 md:gap-4 w-full">
        <div className="flex gap-4 w-full md:w-[60%] h-full justify-center md:justify-start">
          <div className="hidden sm:flex flex-col gap-2">
            {product.files
              .slice()
              .sort((a, b) => a.order - b.order)
              .map((file) => (
                <div
                  key={file.id}
                  className={cn(
                    "size-16 hover:border cursor-pointer hover:border-black rounded-2xl relative",
                    selectedImage === file && "border border-black"
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
              "w-full h-full flex justify-center cursor-pointer relative",
              selectedImage &&
                selectedImage.type === "IMAGE" &&
                "sm:cursor-zoom-in "
            )}
          >
            <MediaPreview alt={product.name} file={selectedImage} />
          </div>
        </div>
        <div className="flex gap-2 sm:hidden mt-4">
          {product.files
            .slice()
            .sort((a, b) => a.order - b.order)
            .map((file) => (
              <div
                key={file.id}
                className={cn(
                  "size-8 hover:border cursor-pointer hover:border-black rounded-2xl relative",
                  selectedImage === file && "border border-black"
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
        <div className="relative w-full md:w-[40%]">
          <div className="flex flex-col gap-2">
            <div className="flex items-start justify-between gap-4">
              <h1
                className="text-xl md:text-4xl"
                style={{
                  fontFamily: "'Champagne & Limousines Bold'",
                }}
              >
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
              <div
                className="flex flex-col"
                style={{
                  fontFamily: "'Champagne & Limousines Bold'",
                }}
              >
                <div className="flex items-baseline gap-2">
                  {selectedPromotion && (
                    <span className="text-xs md:text-base lg:text-xl font-semibold line-through text-gray-500">
                      {formatCurrency(product.salePriceMXN, "MXN")}
                    </span>
                  )}
                  <span className="text-base md:text-xl lg:text-2xl font-bold text-gray-900">
                    {formatCurrency(discountedPrice, "MXN")}
                  </span>
                </div>
                {discountDescription && (
                  <span className="text-sm md:text-lg lg:text-3xl font-medium text-green-600">
                    {discountDescription}
                  </span>
                )}
              </div>
              <StarRating
                rating={averageRating}
                totalReviews={product.reviews.length}
              />

              {/* {(!product.isCustomizable ||
                (customName && customFont && customColor)) && ( */}
              <AddToCart
                product={product}
                price={discountedPrice}
                discount={discountDescription}
                promotionId={selectedPromotion?.id || null}
                // customRequest={
                //   customName && customFont && customColor
                //     ? JSON.stringify({
                //         name: customName,
                //         font:
                //           customFont === "'Script 2', cursive"
                //             ? "Script 2"
                //             : customFont,
                //         color: customColor,
                //       })
                //     : null
                // }
              />
              {/* )} */}
              {product.isCustomizable && (
                <div>
                  <button
                    onClick={onCustomOpen}
                    className="px-4 py-2 border border-gray-300 rounded-lg"
                  >
                    Personalizar
                  </button>
                </div>
              )}
              {product.description && (
                <div
                  className="ql-editor"
                  dangerouslySetInnerHTML={{ __html: product.description }}
                />
              )}
            </div>
          </div>
        </div>
      </div>
      <div className="mt-4">
        <p className="text-4xl mt-6 mb-4 text-gray-600">Reviews</p>
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
                              width={20}
                              height={20}
                              alt={review.user.username}
                              className="size-full rounded-full"
                              src={
                                review.user.image ??
                                "/assets/images/profilepic.webp"
                              }
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
                          onClick={() => handleLikeComment(review.id)}
                          className={cn(
                            "px-4 py-2 inline-flex items-center gap-2 rounded-full border",
                            review.userId === user?.id
                              ? "border-gray-300 text-gray-300 cursor-not-allowed"
                              : review.likes.filter(
                                  (like) => like.userId === user?.id
                                ).length > 0 &&
                                  "bg-blue-600 border-blue-600 text-white"
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
