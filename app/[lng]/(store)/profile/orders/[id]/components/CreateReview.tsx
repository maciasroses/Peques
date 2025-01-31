"use client";

import Link from "next/link";
import Image from "next/image";
import React, { useState } from "react";
import { Star } from "@/app/shared/icons";
import { cn } from "@/app/shared/utils/cn";
import { useAuth } from "@/app/shared/hooks";
import { INITIAL_STATE_RESPONSE } from "@/app/shared/constants";
import { GenericInput, SubmitButton } from "@/app/shared/components";
import { createReview } from "@/app/shared/services/productReview/controller";
import type { IProduct, ISharedState } from "@/app/shared/interfaces";

interface ICreateReview {
  lng: string;
  onClose: () => void;
  productSelected: IProduct;
}

const CreateReview = ({ lng, onClose, productSelected }: ICreateReview) => {
  const { user } = useAuth();
  const [rating, setRating] = useState(0);
  const [isPending, setIsPending] = useState(false);
  const [badResponse, setBadResponse] = useState<ISharedState>(
    INITIAL_STATE_RESPONSE
  );

  const submitAction: React.FormEventHandler<HTMLFormElement> = async (
    event
  ) => {
    setIsPending(true);
    event.preventDefault();
    if (rating < 1 || rating > 5) {
      setBadResponse({
        message: "La calificación debe ser de 1 a 5 estrellas",
        success: false,
      });
      setIsPending(false);
      return;
    }
    const formData = new FormData(event.currentTarget);
    formData.append("rating", rating.toString());
    formData.append("productId", productSelected.id);
    const res = await createReview(formData);
    if (res && !res.success) {
      setBadResponse(res);
    } else {
      setBadResponse(INITIAL_STATE_RESPONSE);
      onClose();
    }
    setIsPending(false);
  };

  const handleStarClick = (star: number) => {
    setRating(star);
  };

  const userHasReviewed = productSelected.reviews.find(
    (review) => review.userId === user?.id
  );

  return (
    <>
      <h2 className="text-2xl font-bold mb-4 text-center">
        Escribe una reseña
      </h2>
      <Link href={`/${lng}/${productSelected.key}`}>
        <div className="flex items-center justify-center gap-2">
          <div className="size-24">
            <Image
              src={
                productSelected.files[0]?.url ??
                "/assets/images/landscape-placeholder.webp"
              }
              alt={productSelected.name}
              width={500}
              height={300}
              className="size-full object-contain rounded-lg"
            />
          </div>
          <p className="text-base sm:text-xl">{productSelected.name}</p>
        </div>
      </Link>
      {userHasReviewed ? (
        <p className="text-center mt-2 text-xl">
          Ya has publicado una reseña de este producto.
          <br />
          Gracias por tu opinión.
        </p>
      ) : (
        <form onSubmit={submitAction}>
          {badResponse.message && (
            <p className="text-red-600">{badResponse.message}</p>
          )}
          <div className="mb-4">
            <p className="block text-sm font-medium mb-2">Calificación</p>
            <div className="flex space-x-1">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  type="button"
                  className={cn(
                    "w-6 h-6 md:w-10 md:h-10 flex items-center justify-center transition-colors duration-300",
                    rating >= star ? "text-yellow-400" : "text-gray-200"
                  )}
                  onClick={() => handleStarClick(star)}
                >
                  <Star size="size-6 md:size-10" isFilled={rating >= star} />
                </button>
              ))}
            </div>
          </div>
          <div className="mb-4">
            <GenericInput
              id="content"
              type="textarea"
              ariaLabel="Contenido"
              placeholder="Escribe tu reseña aquí..."
            />
          </div>
          <div className="text-center mt-4">
            <SubmitButton
              color="accent"
              title="Enviar reseña"
              pending={isPending}
            />
          </div>
        </form>
      )}
    </>
  );
};

export default CreateReview;
