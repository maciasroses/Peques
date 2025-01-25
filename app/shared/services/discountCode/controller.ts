"use server";

import { validateSchema } from "./schema";
import { getSession, isAdmin } from "@/app/shared/services/auth";
import { create, createUserOnDiscount, read, remove, update } from "./model";
import type {
  IDiscountCode,
  IDiscountCodeState,
  IUser,
} from "@/app/shared/interfaces";
import { getMe } from "../user/controller";

export async function getDiscountCodeById(id: string) {
  try {
    return await read({ id });
  } catch (error) {
    console.error(error);
    throw new Error("Failed to get discount code by id");
  }
}

export async function getDiscountCodeByCode(code: string) {
  try {
    return await read({ code });
  } catch (error) {
    console.error(error);
    throw new Error("Failed to get discount code by code");
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

    const me = (await getMe()) as IUser;

    if (
      me.cart?.items.some(
        (item) => item.promotionId === discountCode.promotionId
      )
    ) {
      return {
        message: "Código de descuento ya utilizado en el carrito",
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

export async function createDiscountCodeByAdmin({
  code,
  usageLimit,
  promotionId,
}: {
  code: string;
  usageLimit?: number;
  promotionId: string;
}) {
  try {
    await isAdmin();

    if (!code) {
      throw new Error("Discount code is required");
    }

    await create({
      data: {
        code,
        usageLimit,
        promotionId,
      },
    });
  } catch (error) {
    console.error(error);
    throw new Error("Failed to create discount code");
  }
}

export async function updateDiscountCodeByIdNPromotionIdNAdmin({
  id,
  formData,
  promotionId,
}: {
  id: string;
  formData: FormData;
  promotionId: string;
}) {
  const dataToValidate = {
    code: formData.get("discountCodeCode") as string,
    usageLimit: Number(formData.get("discountCodeUsageLimit") as string),
  };

  if (!dataToValidate.code) {
    return {
      success: false,
      message: "Código de descuento es requerido",
    };
  }

  try {
    await isAdmin();

    const discountCode = await read({
      id,
    });

    if (!discountCode) {
      throw new Error("Discount code not found");
    }

    const confirmRelation = await read({
      id,
      promotionId,
    });

    if (!confirmRelation) {
      throw new Error("Discount code not found in promotion");
    }

    const discountCodes = (await read({})) as IDiscountCode[];

    const discountCodeWithoutCurrent = discountCodes.find(
      (dc) => dc.code === dataToValidate.code && dc.id !== id
    );

    if (discountCodeWithoutCurrent) {
      return {
        success: false,
        message: "Código de descuento ya existe",
      };
    }

    await update({
      id,
      data: {
        code: dataToValidate.code,
        usageLimit:
          dataToValidate.usageLimit === 0 ? null : dataToValidate.usageLimit,
      },
    });

    return {
      success: true,
      message: "Código de descuento actualizado",
    };
  } catch (error) {
    console.error(error);
    throw new Error("Failed to update discount code");
  }
}

export async function deleteDiscountCodeByIdNPromotionIdNAdmin({
  id,
  promotionId,
}: {
  id: string;
  promotionId: string;
}) {
  try {
    await isAdmin();

    const confirmRelation = await read({
      id,
      promotionId,
    });

    if (!confirmRelation) {
      throw new Error("Discount code not found in promotion");
    }

    await remove({
      id,
    });

    return {
      success: true,
      message: "Código de descuento eliminado",
    };
  } catch (error) {
    console.error(error);
    throw new Error("Failed to delete discount code");
  }
}

export async function deleteMassiveDiscountCodeByIdsNPromotionIdNAdmin(
  ids: string[],
  promotionId: string
) {
  try {
    await isAdmin();

    await Promise.all(
      ids.map(async (id) => {
        const confirmRelation = await read({
          id,
          promotionId,
        });

        if (!confirmRelation) {
          throw new Error("Discount code not found in promotion");
        }

        await remove({
          id,
        });
      })
    );

    return {
      success: true,
      message: "Códigos de descuento eliminados",
    };
  } catch (error) {
    console.error(error);
    throw new Error("Failed to delete discount codes");
  }
}
