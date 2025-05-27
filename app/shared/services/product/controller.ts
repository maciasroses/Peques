"use server";

import { cookies } from "next/headers";
import { validateSchema } from "./schema";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { isAdmin } from "@/app/shared/services/auth";
import { deleteFile } from "@/app/shared/services/aws/s3";
import { normalizeString } from "@/app/shared/utils/normalize-string";
import {
  read,
  update,
  create,
  deleteById,
  readHistory,
  deleteMassive,
  createHistory,
  updateHistory,
  deleteHistoryById,
  deleteHistoryMassive,
} from "./model";
import type {
  IProduct,
  IProductHistory,
  IProductSearchParams,
} from "@/app/shared/interfaces";

export async function getProducts({
  q,
  availableQuantityFrom,
  availableQuantityTo,
  salePriceMXNFrom,
  salePriceMXNTo,
  provider,
}: IProductSearchParams) {
  try {
    return await read({
      isAdminRequest: true,
      q,
      availableQuantityFrom: availableQuantityFrom
        ? Number(availableQuantityFrom)
        : undefined,
      availableQuantityTo: availableQuantityTo
        ? Number(availableQuantityTo)
        : undefined,
      salePriceMXNFrom: salePriceMXNFrom ? Number(salePriceMXNFrom) : undefined,
      salePriceMXNTo: salePriceMXNTo ? Number(salePriceMXNTo) : undefined,
      provider,
    });
  } catch (error) {
    console.error(error);
    return [];
    // throw new Error("An internal error occurred");
  }
}

export async function getProductsForStore({
  q,
  page,
  filters,
  salePriceMXNTo,
  salePriceMXNFrom,
  isAdminRequest = false,
}: IProductSearchParams) {
  try {
    return await read({
      q,
      filters,
      isAdminRequest,
      page: page ? Number(page) : undefined,
      salePriceMXNTo: salePriceMXNTo ? Number(salePriceMXNTo) : undefined,
      salePriceMXNFrom: salePriceMXNFrom ? Number(salePriceMXNFrom) : undefined,
    });
  } catch (error) {
    console.error(error);
    return [];
    // throw new Error("An internal error occurred");
  }
}

export async function getProductsByCollection({
  q,
  page,
  filters,
  collection,
  salePriceMXNTo,
  salePriceMXNFrom,
}: IProductSearchParams) {
  try {
    return await read({
      q,
      filters,
      collection,
      page: page ? Number(page) : undefined,
      salePriceMXNTo: salePriceMXNTo ? Number(salePriceMXNTo) : undefined,
      salePriceMXNFrom: salePriceMXNFrom ? Number(salePriceMXNFrom) : undefined,
    });
  } catch (error) {
    console.error(error);
    return [];
  }
}

export async function getAllProducts() {
  try {
    return await read({
      allData: true,
    });
  } catch (error) {
    console.error(error);
    return [];
  }
}

export async function getTheNewestProducts({
  takeFromRequest = 6,
}: IProductSearchParams) {
  try {
    return await read({
      allData: true,
      takeFromRequest,
      orderBy: { createdAt: "desc" },
    });
  } catch (error) {
    console.error(error);
    return [];
  }
}

export async function getTheFavoritesProducts({
  takeFromRequest = 6,
}: IProductSearchParams) {
  try {
    return await read({
      takeFromRequest,
      isForFavorites: true,
    });
  } catch (error) {
    console.error(error);
    return [];
  }
}

export async function getTheBestReviews({
  takeFromRequest = 6,
}: IProductSearchParams) {
  try {
    return await read({
      takeFromRequest,
      isForBestReviews: true,
    });
  } catch (error) {
    console.error(error);
    return [];
  }
}

export async function getSimilarProducts({
  collectionLink,
}: {
  collectionLink: string;
}) {
  try {
    return await read({
      collection: collectionLink,
    });
  } catch (error) {
    console.error(error);
    return [];
  }
}

export async function getProductById({
  id,
  isAdminRequest = false,
}: {
  id: string;
  isAdminRequest?: boolean;
}) {
  try {
    return await read({ id, isAdminRequest });
  } catch (error) {
    console.error(error);
    return null;
  }
}

export async function getProductByKey({ key }: { key: string }) {
  try {
    return await read({ key });
  } catch (error) {
    console.error(error);
    return null;
  }
}

export async function createProduct(formData: FormData) {
  const data = {
    name: formData.get("name"),
    key: formData.get("productKey"),
    description: formData.get("description"),
    isCustomizable: formData.get("isCustomizable") === "on",
    minimumAcceptableQuantity: Number(
      formData.get("minimumAcceptableQuantity")
    ),
    quantityPerCarton: Number(formData.get("quantityPerCarton")),
    chinesePriceUSD: Number(formData.get("chinesePriceUSD")),
    dollarExchangeRate: Number(formData.get("dollarExchangeRate")),
    shippingCostMXN: Number(formData.get("shippingCostMXN")),
    salePriceMXN: Number(formData.get("salePriceMXN")),
    orderDate: new Date(formData.get("orderDate") as string),
    providerId: formData.get("providerId"),
  };

  const errors = validateSchema("create", data);

  if (Object.keys(errors).length !== 0)
    return {
      errors,
      success: false,
    };

  const pricePerCartonOrProductUSD =
    data.chinesePriceUSD * data.quantityPerCarton;
  const costMXN = data.chinesePriceUSD * data.dollarExchangeRate;
  const totalCostMXN = costMXN + data.shippingCostMXN;
  const margin = (data.salePriceMXN / totalCostMXN - 1) * 100;
  const salePerQuantity = data.salePriceMXN * data.quantityPerCarton;

  const {
    name,
    description,
    isCustomizable,
    key,
    providerId,
    minimumAcceptableQuantity,
    ...rest
  } = data;

  const updatedData = {
    name,
    name_normalized: normalizeString(name as string),
    key,
    description,
    isCustomizable,
    minimumAcceptableQuantity,
    availableQuantity: data.quantityPerCarton,
    salePriceMXN: data.salePriceMXN,
    providerId,
    history: {
      create: {
        ...rest,
        pricePerCartonOrProductUSD,
        costMXN,
        totalCostMXN,
        margin,
        salePerQuantity,
      },
    },
  };

  try {
    const product = await read({ key: data.key as string });

    if (product) {
      return {
        errors: { key: "Esta clave ya existe." },
        success: false,
      };
    }

    await create({ data: updatedData });
  } catch (error) {
    console.error(error);
    // throw new Error("An internal error occurred");
    return { message: "An internal error occurred", success: false };
  }
  const lng = cookies().get("i18next")?.value ?? "es";
  revalidatePath(`/${lng}/admin/products`);
  redirect(`/${lng}/admin/products`);
}

export async function createHistoryProduct(
  formData: FormData,
  productId: string
) {
  const data = {
    quantityPerCarton: Number(formData.get("quantityPerCarton")),
    chinesePriceUSD: Number(formData.get("chinesePriceUSD")),
    dollarExchangeRate: Number(formData.get("dollarExchangeRate")),
    shippingCostMXN: Number(formData.get("shippingCostMXN")),
    salePriceMXN: Number(formData.get("salePriceMXN")),
    orderDate: new Date(formData.get("orderDate") as string),
  };

  const errors = validateSchema("addProduct", data);

  if (Object.keys(errors).length !== 0)
    return {
      errors,
      success: false,
    };

  const pricePerCartonOrProductUSD =
    data.chinesePriceUSD * data.quantityPerCarton;
  const costMXN = data.chinesePriceUSD * data.dollarExchangeRate;
  const totalCostMXN = costMXN + data.shippingCostMXN;
  const margin = (data.salePriceMXN / totalCostMXN - 1) * 100;
  const salePerQuantity = data.salePriceMXN * data.quantityPerCarton;

  const updatedData = {
    ...data,
    pricePerCartonOrProductUSD,
    costMXN,
    totalCostMXN,
    margin,
    salePerQuantity,
    productId,
  };

  try {
    const product = (await read({ id: productId })) as unknown as IProduct;

    if (!product) {
      return {
        errors: { productId: "Producto no encontrado" },
        success: false,
      };
    }

    await createHistory({ data: updatedData });

    await update({
      id: productId,
      data: {
        availableQuantity: product.availableQuantity + data.quantityPerCarton,
        salePriceMXN: data.salePriceMXN,
      },
    });
  } catch (error) {
    console.error(error);
    // throw new Error("An internal error occurred");
    return { message: "An internal error occurred", success: false };
  }
  const lng = cookies().get("i18next")?.value ?? "es";
  revalidatePath(`/${lng}/admin/products`);
  redirect(`/${lng}/admin/products`);
}

export async function updateProduct(formData: FormData, productId: string) {
  const data = {
    name: formData.get("name"),
    key: formData.get("productKey"),
    description: formData.get("description"),
    isCustomizable: formData.get("isCustomizable") === "on",
    minimumAcceptableQuantity: Number(
      formData.get("minimumAcceptableQuantity")
    ),
    salePriceMXN: Number(formData.get("salePriceMXN")),
    availableQuantity: Number(formData.get("availableQuantity")),
    providerId: formData.get("providerId"),
  };

  const errors = validateSchema("update", data);

  if (Object.keys(errors).length !== 0)
    return {
      errors,
      success: false,
    };

  try {
    await update({
      id: productId,
      data: {
        ...data,
        name_normalized: normalizeString(data.name as string),
      },
    });
  } catch (error) {
    console.error(error);
    // throw new Error("An internal error occurred");
    return { message: "An internal error occurred", success: false };
  }
  const lng = cookies().get("i18next")?.value ?? "es";
  revalidatePath(`/${lng}/admin/products`);
  redirect(`/${lng}/admin/products`);
}

export async function updateHistoryProduct(
  productId: string,
  historyId: string,
  formData: FormData
) {
  const data = {
    quantityPerCarton: Number(formData.get("quantityPerCarton")),
    chinesePriceUSD: Number(formData.get("chinesePriceUSD")),
    dollarExchangeRate: Number(formData.get("dollarExchangeRate")),
    shippingCostMXN: Number(formData.get("shippingCostMXN")),
    salePriceMXN: Number(formData.get("salePriceMXN")),
    orderDate: new Date(formData.get("orderDate") as string),
  };

  const errors = validateSchema("updateProduct", data);

  if (Object.keys(errors).length !== 0)
    return {
      errors,
      success: false,
    };

  const pricePerCartonOrProductUSD =
    data.chinesePriceUSD * data.quantityPerCarton;
  const costMXN = data.chinesePriceUSD * data.dollarExchangeRate;
  const totalCostMXN = costMXN + data.shippingCostMXN;
  const margin = (data.salePriceMXN / totalCostMXN - 1) * 100;
  const salePerQuantity = data.salePriceMXN * data.quantityPerCarton;

  const updatedData = {
    ...data,
    pricePerCartonOrProductUSD,
    costMXN,
    totalCostMXN,
    margin,
    salePerQuantity,
  };

  try {
    const { quantityPerCarton } = (await readHistory({
      id: historyId,
    })) as unknown as IProductHistory;

    const newQuantity = data.quantityPerCarton - quantityPerCarton;

    const { availableQuantity } = (await read({
      id: productId,
    })) as unknown as IProduct;

    await update({
      id: productId,
      data: {
        availableQuantity: availableQuantity + newQuantity,
        salePriceMXN: data.salePriceMXN,
      },
    });

    await updateHistory({
      id: historyId,
      productId,
      data: updatedData,
    });
  } catch (error) {
    console.error(error);
    // throw new Error("An internal error occurred");
    return { message: "An internal error occurred", success: false };
  }
  const lng = cookies().get("i18next")?.value ?? "es";
  revalidatePath(`/${lng}/admin/products`);
  redirect(`/${lng}/admin/products`);
}

export async function deleteProduct(productId: string) {
  try {
    await deleteById({ id: productId });
  } catch (error) {
    console.error(error);
    // throw new Error("An internal error occurred");
    return { message: "An internal error occurred", success: false };
  }
  const lng = cookies().get("i18next")?.value ?? "es";
  revalidatePath(`/${lng}/admin/products`);
  redirect(`/${lng}/admin/products`);
}

export async function deleteMassiveProducts(ids: string[]) {
  try {
    await deleteMassive({ ids });
  } catch (error) {
    console.error(error);
    // throw new Error("An internal error occurred");
    return { message: "An internal error occurred", success: false };
  }
}

export async function deleteHistoryProduct(
  productId: string,
  historyId: string
) {
  try {
    const { quantityPerCarton } = (await readHistory({
      id: historyId,
    })) as unknown as IProductHistory;

    const { availableQuantity } = (await read({
      id: productId,
    })) as unknown as IProduct;

    await update({
      id: productId,
      data: {
        availableQuantity: availableQuantity - quantityPerCarton,
      },
    });

    await deleteHistoryById({ id: historyId, productId });
  } catch (error) {
    console.error(error);
    // throw new Error("An internal error occurred");
    return { message: "An internal error occurred", success: false };
  }
  const lng = cookies().get("i18next")?.value ?? "es";
  revalidatePath(`/${lng}/admin/products`);
  redirect(`/${lng}/admin/products`);
}

export async function deleteMassiveProductsHistory(
  productId: string,
  ids: string[]
) {
  try {
    await update({
      id: productId,
      data: {
        availableQuantity: 0,
      },
    });

    await deleteHistoryMassive({ productId, ids });
  } catch (error) {
    console.error(error);
    // throw new Error("An internal error occurred");
    return { message: "An internal error occurred", success: false };
  }
}

export async function updateAvailableQuantityProductById({
  id,
  availableQuantity,
}: {
  id: string;
  availableQuantity: number;
}) {
  try {
    const product = (await read({ id })) as IProduct;

    if (!product) {
      throw new Error("Product not found");
    }

    await update({
      id,
      data: {
        availableQuantity,
      },
    });
  } catch (error) {
    console.error(error);
    throw new Error("An internal error occurred");
  }
}

export async function updateAvailableQuantityProductByKey({
  key,
  availableQuantity,
}: {
  key: string;
  availableQuantity: number;
}) {
  try {
    const product = (await read({ key })) as IProduct;

    if (!product) {
      throw new Error("Product not found");
    }

    await update({
      id: product.id,
      data: {
        availableQuantity,
      },
    });
  } catch (error) {
    console.error(error);
    throw new Error("An internal error occurred");
  }
}

export async function getProductIdsByKeys(keys: string[]) {
  try {
    const productIds: string[] = [];

    for (const key of keys) {
      const product = (await read({ key, isAdminRequest: true })) as IProduct;

      if (product) {
        productIds.push(product.id);
      }
    }

    return productIds;
  } catch (error) {
    console.error(error);
    return [];
  }
}

export async function addFileToProduct(productId: string, fileKeys: string[]) {
  try {
    await isAdmin();

    await update({
      id: productId,
      data: {
        files: {
          create: fileKeys.map((file) => ({
            type: file.includes(".webp") ? "IMAGE" : "VIDEO",
            url: `https://${process.env.AWS_S3_BUCKET}.s3.${process.env.AWS_REGION}.amazonaws.com/Products/${productId}/${file}`,
          })),
        },
      },
    });

    return {
      success: true,
    };
  } catch (error) {
    console.error(error);
    return {
      success: false,
      message: "An internal error occurred",
    };
  }
}

export async function removeFileFromProduct(productId: string, fileId: string) {
  try {
    await isAdmin();

    const product = (await read({ id: productId })) as IProduct;

    if (!product) {
      return {
        success: false,
        message: "Producto no encontrado",
      };
    }

    const file = product.files.find((file) => file.id === fileId);

    if (!file) {
      return {
        success: false,
        message: "Archivo no encontrado",
      };
    }

    await update({
      id: productId,
      data: {
        files: {
          delete: {
            id: fileId,
          },
        },
      },
    });

    const urlObj = new URL(file.url);
    await deleteFile(urlObj.pathname.substring(1));

    return {
      success: true,
    };
  } catch (error) {
    console.error(error);
    return {
      success: false,
      message: "An internal error occurred",
    };
  }
}

export async function removeMassiveFilesFromProduct(
  productId: string,
  fileIds: string[]
) {
  try {
    await isAdmin();

    const product = (await read({ id: productId })) as IProduct;

    if (!product) {
      return {
        success: false,
        message: "Producto no encontrado",
      };
    }

    const files = product.files.filter((file) => fileIds.includes(file.id));

    if (files.length === 0) {
      return {
        success: false,
        message: "Archivos no encontrados",
      };
    }

    await update({
      id: productId,
      data: {
        files: {
          delete: files.map((file) => ({
            id: file.id,
          })),
        },
      },
    });

    for (const file of files) {
      const urlObj = new URL(file.url);
      await deleteFile(urlObj.pathname.substring(1));
    }

    return {
      success: true,
    };
  } catch (error) {
    console.error(error);
    return {
      success: false,
      message: "An internal error occurred",
    };
  }
}

export async function activateNDeactivateProduct(
  productId: string,
  isActive: boolean
) {
  try {
    await update({
      id: productId,
      data: {
        isActive,
      },
    });
  } catch (error) {
    console.error(error);
    return {
      success: false,
      message: "An internal error occurred",
    };
  }
}

export async function updateProductFileOrder({
  order,
  productId,
  fileId,
}: {
  order: number;
  productId: string;
  fileId: string;
}) {
  try {
    const product = (await read({ id: productId })) as IProduct;

    if (!product) {
      throw new Error("Product not found");
    }

    const file = product.files.find((file) => file.id === fileId);

    if (!file) {
      throw new Error("File not found");
    }

    await update({
      id: productId,
      data: {
        files: {
          update: {
            where: {
              id: fileId,
            },
            data: {
              order,
            },
          },
        },
      },
    });
  } catch (error) {
    console.error(error);
    return {
      success: false,
      message: "An internal error occurred",
    };
  }
}
