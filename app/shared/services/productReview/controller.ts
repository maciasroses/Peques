"use server";

import { validateSchema } from "./schema";
import { getSession } from "@/app/shared/services/auth";
import {
  read,
  create,
  readReviewLike,
  createReviewLike,
  removeReviewLike,
} from "./model";

export async function createReview(formData: FormData) {
  const dataToValidate = {
    rating: Number(formData.get("rating")),
    content: formData.get("content") as string,
    productId: formData.get("productId") as string,
  };

  const errors = validateSchema("create", dataToValidate);

  if (Object.keys(errors).length > 0) {
    return { success: false, message: "Error en los datos", errors };
  }

  try {
    const session = await getSession();
    if (!session || !session.userId) {
      throw new Error("There is no user session");
    }

    const existingReview = await read({
      userId: session.userId as string,
      productId: dataToValidate.productId,
    });

    if (existingReview) {
      throw new Error("This user already has a review for this product");
    }

    const { rating, content } = dataToValidate;

    await create({
      data: {
        rating,
        content,
        product: {
          connect: {
            id: dataToValidate.productId,
          },
        },
        user: {
          connect: {
            id: session.userId,
          },
        },
      },
    });

    return { success: true };
  } catch (error) {
    console.error(error);
    return { success: false, message: "Error interno al crear la reseña" };
  }
}

export async function likeOrDislikeReview(reviewId: string) {
  try {
    const session = await getSession();
    if (!session || !session.userId) {
      throw new Error("There is no user session");
    }

    const userAlreadyLikes = await readReviewLike({
      reviewId,
      userId: session.userId as string,
    });

    if (userAlreadyLikes) {
      await removeReviewLike({
        reviewId: reviewId,
        userId: session.userId as string,
      });
    } else {
      await createReviewLike({
        data: {
          reviewId,
          userId: session.userId as string,
        },
      });
    }
    return { success: true };
  } catch (error) {
    console.error(error);
    return { success: false, message: "Error interno al dar like a la reseña" };
  }
}
