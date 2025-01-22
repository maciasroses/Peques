"use server";

import { use } from "react";
import { getSession } from "../auth";
import { create } from "./model";
import { validateSchema } from "./schema";

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
      throw new Error("No hay sesión activa");
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
