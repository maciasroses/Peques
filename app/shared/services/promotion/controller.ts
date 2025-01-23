"use server";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { isAdmin } from "@/app/shared/services/auth";
import { create, read, remove, update } from "./model";
import {
  createDiscountCodeByAdmin,
  getDiscountCodeByCode,
} from "@/app/shared/services/discountCode/controller";
import type {
  ICollection,
  IProduct,
  IPromotion,
} from "@/app/shared/interfaces";
import { getProductByKey } from "../product/controller";
import { getCollectionByName } from "../collection/controller";
import { validateSchema } from "./schema";

export async function getPromotions() {
  try {
    await isAdmin();

    return await read({});
  } catch (error) {
    console.error(error);
    throw new Error("Failed to get promotions");
  }
}

export async function getPromotionById({ id }: { id: string }) {
  try {
    return await read({
      id,
    });
  } catch (error) {
    console.error(error);
    throw new Error("Failed to get discount code");
  }
}

export async function createPromotion(formData: FormData) {
  const dataToValidate = {
    title: formData.get("title") as string,
    endDate: new Date(formData.get("endDate") as string),
    startDate: new Date(formData.get("startDate") as string),
    description: formData.get("description") as string,
    discountType: formData.get("discountType") as string,
    discountValue: Number(formData.get("discountValue") as string),
    promotionType: formData.get("promotionType") as string,
    discountCodeCode: formData.get("discountCodeCode") as string,
    discountCodeUsageLimit: Number(
      formData.get("discountCodeUsageLimit") as string
    ),
  };

  const errors = validateSchema("create", dataToValidate);

  if (Object.keys(errors).length !== 0) {
    return {
      errors,
      success: false,
    };
  }

  const productKeys = formData.getAll("productKeys") as string[];
  const collectionNames = formData.getAll("collectionNames") as string[];

  if (!(productKeys.length > 0) && dataToValidate.promotionType === "product") {
    return {
      success: false,
      message: "Se requiere al menos un producto",
    };
  }

  if (
    !(collectionNames.length > 0) &&
    dataToValidate.promotionType === "collection"
  ) {
    return {
      success: false,
      message: "Se requiere al menos una colección",
    };
  }

  if (
    !dataToValidate.discountCodeCode &&
    dataToValidate.promotionType === "discountCode"
  ) {
    return {
      success: false,
      message: "El código de descuento es requerido",
    };
  }

  try {
    await isAdmin();

    const dataToCreateBasePromotion = {
      title: dataToValidate.title,
      endDate: dataToValidate.endDate,
      startDate: dataToValidate.startDate,
      description: dataToValidate.description,
      discountType: dataToValidate.discountType,
      discountValue: dataToValidate.discountValue,
    };

    if (dataToValidate.promotionType === "collection") {
      const collectionIds = await Promise.all(
        collectionNames.map(async (name) => {
          const collection = (await getCollectionByName({
            name,
          })) as ICollection;
          return collection.id;
        })
      );

      const dataToCreatePromotion = {
        ...dataToCreateBasePromotion,
        collections: {
          create: collectionIds.map((id) => ({ collectionId: id })),
        },
      };

      await create({
        data: dataToCreatePromotion,
      });
    } else if (dataToValidate.promotionType === "product") {
      const productIds = await Promise.all(
        productKeys.map(async (key) => {
          const product = (await getProductByKey({ key })) as IProduct;
          return product.id;
        })
      );

      const dataToCreatePromotion = {
        ...dataToCreateBasePromotion,
        products: {
          create: productIds.map((id) => ({ productId: id })),
        },
      };

      await create({
        data: dataToCreatePromotion,
      });
    } else {
      const promotion = await create({
        data: dataToCreateBasePromotion,
      });

      const discountCodeAlreadyExists = await getDiscountCodeByCode(
        dataToValidate.discountCodeCode
      );

      if (discountCodeAlreadyExists) {
        return {
          success: false,
          message: "El código de descuento con este código ya existe",
        };
      }

      await createDiscountCodeByAdmin({
        code: dataToValidate.discountCodeCode,
        usageLimit:
          dataToValidate.discountCodeUsageLimit === 0
            ? undefined
            : dataToValidate.discountCodeUsageLimit,
        promotionId: promotion.id,
      });
    }
  } catch (error) {
    console.error(error);
    return {
      success: false,
      message: "Ha ocurrido un error al crear la promoción",
    };
  }
  const lng = cookies().get("i18next")?.value ?? "es";
  revalidatePath(`/${lng}/admin/promotions`);
  redirect(`/${lng}/admin/promotions`);
}

export async function updatePromotion(formData: FormData) {
  const dataToValidate = {
    id: formData.get("id") as string,
    title: formData.get("title") as string,
    endDate: formData.get("endDate") as string,
    startDate: formData.get("startDate") as string,
    description: formData.get("description") as string,
    discountType: formData.get("discountType") as string,
    discountValue: formData.get("discountValue") as string,
  };

  // const errors = validateSchema("update", dataToValidate);

  // if (Object.keys(errors).length !== 0) {
  //   return {
  //     errors,
  //     success: false,
  //   };
  // }
  try {
    await isAdmin();

    const promotion = await read({ id: dataToValidate.id });

    if (!promotion) {
      return {
        success: false,
        message: "La promoción no existe",
      };
    }

    await update({
      id: dataToValidate.id,
      data: {
        title: dataToValidate.title,
        endDate: dataToValidate.endDate,
        startDate: dataToValidate.startDate,
        description: dataToValidate.description,
        discountType: dataToValidate.discountType,
        discountValue: dataToValidate.discountValue,
      },
    });
  } catch (error) {
    console.error(error);
    return {
      success: false,
      message: "Ha ocurrido un error al actualizar la promoción",
    };
  }
}

export async function activateNDeactivatePromotion({ id }: { id: string }) {
  try {
    await isAdmin();

    const promotion = (await read({ id })) as IPromotion;

    if (!promotion) {
      return {
        success: false,
        message: "La promoción no existe",
      };
    }

    await update({
      id,
      data: {
        isActive: !promotion.isActive,
      },
    });
  } catch (error) {
    console.error(error);
    return {
      success: false,
      message: "Ha ocurrido un error al activar/desactivar la promoción",
    };
  }
}

export async function deletePromotion({ id }: { id: string }) {
  try {
    await isAdmin();

    await read({ id });

    await remove({ id });
  } catch (error) {
    console.error(error);
    throw new Error("Failed to delete promotion");
  }
}
