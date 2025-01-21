"use server";

import { read } from "./model";
import { validateSchema } from "./schema";
import type { ISharedState } from "@/app/shared/interfaces";

export async function validateDiscountCodeForUser(
  formData: FormData
): Promise<ISharedState> {
  const dataToValidate = {
    code: formData.get("code") as string,
  };

  const errors = validateSchema("validate", dataToValidate);

  if (Object.keys(errors).length !== 0) {
    return {
      success: false,
      message: "Código de descuento no válido",
    };
  }

  try {
    const discountCode = await read({ code: dataToValidate.code });

    if (!discountCode) {
      return { message: "Código de descuento no válido", success: false };
    }

    return { message: "Código de descuento válido", success: true };
  } catch (error) {
    console.error(error);
    // throw new Error("Failed to validate discount code");
    return {
      message: "Error interno al validar el código de descuento",
      success: false,
    };
  }
}
