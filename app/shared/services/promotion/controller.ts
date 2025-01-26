"use server";

import { cookies } from "next/headers";
import { validateSchema } from "./schema";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { isAdmin } from "@/app/shared/services/auth";
import { create, read, remove, update } from "./model";
import { getProductByKey } from "@/app/shared/services/product/controller";
import { getCollectionByName } from "@/app/shared/services//collection/controller";
import {
  createDiscountCodeByAdmin,
  getDiscountCodeByCode,
} from "@/app/shared/services/discountCode/controller";
import type {
  ICollection,
  IProduct,
  IPromotion,
} from "@/app/shared/interfaces";

export async function getPromotions({ q }: { q?: string }) {
  try {
    await isAdmin();

    return await read({
      q,
    });
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

  if (
    (!productKeys.length || productKeys.some((key) => key === "")) &&
    dataToValidate.promotionType === "product"
  ) {
    return {
      success: false,
      message: "Se requiere al menos un producto",
    };
  }

  if (
    (!collectionNames.length || collectionNames.some((name) => name === "")) &&
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

export async function addToPromotion(promotionId: string, formData: FormData) {
  const dataToValidate = {
    promotionType: formData.get("promotionType") as string,
    discountCodeCode: formData.get("discountCodeCode") as string,
    discountCodeUsageLimit: Number(
      formData.get("discountCodeUsageLimit") as string
    ),
  };

  const errors = validateSchema("addToPromotion", dataToValidate);

  if (Object.keys(errors).length !== 0) {
    return {
      success: false,
      message: "Ha ocurrido un error al agregar a la promoción",
    };
  }

  const productKeys = formData.getAll("productKeys") as string[];
  const collectionNames = formData.getAll("collectionNames") as string[];

  if (
    (!productKeys.length || productKeys.some((key) => key === "")) &&
    dataToValidate.promotionType === "product"
  ) {
    return {
      success: false,
      message: "Se requiere al menos un producto",
    };
  }

  if (
    (!collectionNames.length || collectionNames.some((name) => name === "")) &&
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

    if (dataToValidate.promotionType === "collection") {
      const collectionIds = await Promise.all(
        collectionNames.map(async (name) => {
          const collection = (await getCollectionByName({
            name,
          })) as ICollection;
          return collection.id;
        })
      );

      await update({
        id: promotionId,
        data: {
          collections: {
            create: collectionIds.map((id) => ({ collectionId: id })),
          },
        },
      });

      return {
        success: true,
        message: "La o las colecciones ha sido agregada a la promoción",
      };
    } else if (dataToValidate.promotionType === "product") {
      const productIds = await Promise.all(
        productKeys.map(async (key) => {
          const product = (await getProductByKey({ key })) as IProduct;
          return product.id;
        })
      );

      await update({
        id: promotionId,
        data: {
          products: {
            create: productIds.map((id) => ({ productId: id })),
          },
        },
      });

      return {
        success: true,
        message: "El o los productos han sido agregados a la promoción",
      };
    } else {
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
        promotionId: promotionId,
      });

      return {
        success: true,
        message: "El código de descuento ha sido agregado a la promoción",
      };
    }
  } catch (error) {
    console.error(error);
    return {
      success: false,
      message: "Ha ocurrido un error interno al agregar a la promoción",
    };
  }
}

export async function updatePromotion(promotionId: string, formData: FormData) {
  const dataToValidate = {
    title: formData.get("title") as string,
    endDate: new Date(formData.get("endDate") as string),
    startDate: new Date(formData.get("startDate") as string),
    description: formData.get("description") as string,
    discountType: formData.get("discountType") as string,
    discountValue: Number(formData.get("discountValue") as string),
  };

  const errors = validateSchema("update", dataToValidate);

  if (Object.keys(errors).length !== 0) {
    return {
      errors,
      success: false,
    };
  }

  try {
    await isAdmin();

    const promotion = await read({ id: promotionId });

    if (!promotion) {
      return {
        success: false,
        message: "La promoción no existe",
      };
    }

    await update({
      id: promotionId,
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
  const lng = cookies().get("i18next")?.value ?? "es";
  revalidatePath(`/${lng}/admin/promotions`);
  redirect(`/${lng}/admin/promotions`);
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

    return {
      success: true,
      message: `Promoción ${
        promotion.isActive ? "desactivada" : "activada"
      } correctamente`,
    };
  } catch (error) {
    console.error(error);
    return {
      success: false,
      message: "Ha ocurrido un error al activar/desactivar la promoción",
    };
  }
}

export async function deletePromotion(id: string) {
  try {
    await isAdmin();

    await read({ id });

    await remove({ id });
  } catch (error) {
    console.error(error);
    throw new Error("Failed to delete promotion");
  }
}

export async function deleteMassivePromotions(ids: string[]) {
  try {
    await isAdmin();

    await Promise.all(
      ids.map(async (id) => {
        await read({ id });
        await remove({ id });
      })
    );
  } catch (error) {
    console.error(error);
    throw new Error("Failed to delete promotions");
  }
}

export async function removeProductFromPromotion({
  promotionId,
  productId,
}: {
  promotionId: string;
  productId: string;
}) {
  try {
    await isAdmin();

    await update({
      id: promotionId,
      data: {
        products: {
          delete: {
            productId_promotionId: {
              productId,
              promotionId,
            },
          },
        },
      },
    });

    return {
      success: true,
      message: "Producto eliminado de la promoción",
    };
  } catch (error) {
    console.error(error);
    // throw new Error("Failed to remove product from promotion");
    return {
      success: false,
      message:
        "Ha ocurrido un error interno al eliminar el producto de la promoción",
    };
  }
}

export async function removeMassiveProductsFromPromotion({
  promotionId,
  productIds,
}: {
  promotionId: string;
  productIds: string[];
}) {
  try {
    await isAdmin();

    await update({
      id: promotionId,
      data: {
        products: {
          delete: productIds.map((id) => ({
            productId_promotionId: {
              productId: id,
              promotionId,
            },
          })),
        },
      },
    });

    return {
      success: true,
      message: "Productos eliminados de la promoción",
    };
  } catch (error) {
    console.error(error);
    // throw new Error("Failed to remove products from promotion");
    return {
      success: false,
      message:
        "Ha ocurrido un error interno al eliminar los productos de la promoción",
    };
  }
}

export async function removeCollectionFromPromotion({
  promotionId,
  collectionId,
}: {
  promotionId: string;
  collectionId: string;
}) {
  try {
    await isAdmin();

    await update({
      id: promotionId,
      data: {
        collections: {
          delete: {
            collectionId_promotionId: {
              collectionId,
              promotionId,
            },
          },
        },
      },
    });

    return {
      success: true,
      message: "Colección eliminada de la promoción",
    };
  } catch (error) {
    console.error(error);
    // throw new Error("Failed to remove collection from promotion");
    return {
      success: false,
      message:
        "Ha ocurrido un error interno al eliminar la colección de la promoción",
    };
  }
}

export async function removeMassiveCollectionsFromPromotion({
  promotionId,
  collectionIds,
}: {
  promotionId: string;
  collectionIds: string[];
}) {
  try {
    await isAdmin();

    await update({
      id: promotionId,
      data: {
        collections: {
          delete: collectionIds.map((id) => ({
            collectionId_promotionId: {
              collectionId: id,
              promotionId,
            },
          })),
        },
      },
    });

    return {
      success: true,
      message: "Colecciones eliminadas de la promoción",
    };
  } catch (error) {
    console.error(error);
    // throw new Error("Failed to remove collections from promotion");

    return {
      success: false,
      message:
        "Ha ocurrido un error interno al eliminar las colecciones de la promoción",
    };
  }
}
