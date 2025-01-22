"use server";

import { getSession } from "../auth";
import { createUserOnDiscount, read, update } from "./model";
import { validateSchema } from "./schema";
import type {
  IDiscountCode,
  IDiscountCodeState,
} from "@/app/shared/interfaces";

export async function getDiscountCodeById(id: string) {
  try {
    return await read({ id });
  } catch (error) {
    console.error(error);
    throw new Error("Failed to get discount code by id");
  }
}

export async function validateDiscountCodeForUser(
  formData: FormData
): Promise<IDiscountCodeState> {
  const dataToValidate = {
    code: formData.get("code") as string,
  };

  const errors = validateSchema("validate", dataToValidate);

  if (Object.keys(errors).length !== 0) {
    return {
      success: false,
      message: errors.code,
    };
  }

  try {
    const session = await getSession();
    if (!session || !session.userId) {
      return { message: "Usuario no autenticado", success: false };
    }

    const discountCode = (await read({
      code: dataToValidate.code,
    })) as IDiscountCode;

    if (!discountCode) {
      return { message: "Código de descuento no válido", success: false };
    }

    if (
      !discountCode.promotion.isActive ||
      discountCode.promotion.endDate < new Date() ||
      discountCode.promotion.startDate > new Date()
    ) {
      return { message: "Código de descuento expirado", success: false };
    }

    if (
      discountCode.usageLimit &&
      discountCode.usageLimit <= discountCode.timesUsed
    ) {
      return {
        message: "Código de descuento alcanzó su límite de uso",
        success: false,
      };
    }

    const userUsage = await read({
      id: discountCode.id,
      userId: session.userId as string,
    });

    if (userUsage) {
      return {
        message: "Código de descuento ya utilizado por el usuario",
        success: false,
      };
    }

    return {
      success: true,
      message: "Código de descuento válido",
      discountCode,
    };
  } catch (error) {
    console.error(error);
    // throw new Error("Failed to validate discount code");
    return {
      message: "Error interno al validar el código de descuento",
      success: false,
    };
  }
}

export async function createDiscountCodeToUser(
  userId: string,
  discountCodeId: string
) {
  try {
    await createUserOnDiscount({
      data: {
        userId: userId,
        discountCodeId: discountCodeId,
      },
    });
  } catch (error) {
    console.error(error);
    throw new Error("Failed to create discount code to user");
  }
}

export async function updateUsagesOfDiscountCode(discountCodeId: string) {
  try {
    const discountCode = (await read({ id: discountCodeId })) as IDiscountCode;

    if (!discountCode) {
      throw new Error("Discount code not found");
    }

    await update({
      id: discountCodeId,
      data: {
        timesUsed: discountCode.timesUsed + 1,
      },
    });
  } catch (error) {
    console.error(error);
    throw new Error("Failed to update discount code usage");
  }
}
