"use server";

import prisma from "../prisma";
import { cookies } from "next/headers";
import { del, put } from "@vercel/blob";
import { validateSchema } from "./schema";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { isAdmin } from "@/app/shared/services/auth";
import { create, deleteById, deleteMassive, read, update } from "./model";
import type {
  ICollection,
  ICollectionSearchParams,
} from "@/app/shared/interfaces";

export async function getCollections({ q }: ICollectionSearchParams) {
  try {
    const isAdminRequest = await isAdmin();
    return await read({
      q,
      isAdminRequest: isAdminRequest ? true : false,
    });
  } catch (error) {
    console.error(error);
    throw new Error("Failed to get collections");
  }
}

export async function getCollectionById({ id }: { id: string }) {
  try {
    return await read({ id });
  } catch (error) {
    console.error(error);
    throw new Error("Failed to get collection by id");
  }
}

export async function getCollectionByName({ name }: { name: string }) {
  try {
    return await read({ name });
  } catch (error) {
    console.error(error);
    throw new Error("Failed to get collection by name");
  }
}

export async function getCollectionByLink({ link }: { link: string }) {
  try {
    return await read({ link });
  } catch (error) {
    console.error(error);
    throw new Error("Failed to get collection by link");
  }
}

export async function createCollection(formData: FormData) {
  const dataToValidate = {
    name: formData.get("name"),
    link: formData.get("link"),
    imageUrl: formData.get("imageUrl"),
  };

  const errors = validateSchema("create", dataToValidate);

  if (Object.keys(errors).length !== 0) {
    return {
      errors,
      success: false,
    };
  }

  try {
    await isAdmin();

    const { imageUrl, ...rest } = dataToValidate;

    const { url } = await put(
      `Collections/${(imageUrl as File).name.split(".")[0]}-${new Date().getTime()}.webp`,
      imageUrl as File,
      {
        access: "public",
        contentType: "image/webp",
      }
    );

    const finalData = {
      ...rest,
      imageUrl: url,
    };

    await create({ data: finalData });
  } catch (error) {
    console.error(error);
    throw new Error("Failed to create collection");
  }
  const lng = cookies().get("i18next")?.value ?? "es";
  revalidatePath(`/${lng}/admin/collections`);
  redirect(`/${lng}/admin/collections`);
}

export async function updateCollection({
  id,
  formData,
}: {
  id: string;
  formData: FormData;
}) {
  const dataToValidate = {
    name: formData.get("name"),
    link: formData.get("link"),
    imageUrl: formData.get("imageUrl"),
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

    const collection = (await read({ id })) as ICollection;
    if (!collection) {
      throw new Error("Collection not found");
    }

    const { imageUrl, ...rest } = dataToValidate;

    const { url } = await put(
      `Collections/${(imageUrl as File).name.split(".")[0]}-${new Date().getTime()}.webp`,
      imageUrl as File,
      {
        access: "public",
        contentType: "image/webp",
      }
    );

    const finalData = {
      ...rest,
      imageUrl: url,
    };

    await update({ id, data: rest });
    await del(collection.imageUrl);
  } catch (error) {
    console.error(error);
    throw new Error("Failed to update collection");
  }
  const lng = cookies().get("i18next")?.value ?? "es";
  revalidatePath(`/${lng}/admin/collections`);
  redirect(`/${lng}/admin/collections`);
}

export async function addProductsToCollection({
  id,
  products,
}: {
  id: string;
  products: string[];
}) {
  try {
    await isAdmin();

    if (!products.length) {
      return {
        success: false,
        message: "No products to add",
      };
    }

    if (products.some((productId) => productId === "")) {
      return {
        success: false,
        message: "Seleccione productos válidos",
      };
    }

    const collection = (await read({ id })) as ICollection;
    if (!collection) {
      throw new Error("Collection not found");
    }

    const productsIds = await prisma.product.findMany({
      where: {
        key: {
          in: products,
        },
      },
      select: { id: true },
    });

    if (productsIds.length !== products.length) {
      return {
        success: false,
        message: "Some products not found",
      };
    }

    await update({
      id,
      data: {
        products: {
          create: productsIds.map((product) => ({
            productId: product.id,
          })),
        },
      },
    });
  } catch (error) {
    console.error(error);
    // throw new Error("Failed to add products to collection");
    return {
      success: false,
      message: "Failed to add products to collection",
    };
  }
  const lng = cookies().get("i18next")?.value ?? "es";
  revalidatePath(`/${lng}/admin/collections`);
  redirect(`/${lng}/admin/collections`);
}

export async function removeProductsFromCollection({
  id,
  products,
}: {
  id: string;
  products: string[];
}) {
  try {
    await isAdmin();

    if (!products.length) {
      return {
        success: false,
        message: "No products to remove",
      };
    }

    if (products.some((productId) => productId === "")) {
      return {
        success: false,
        message: "Seleccione productos válidos",
      };
    }

    const collection = (await read({ id })) as ICollection;
    if (!collection) {
      throw new Error("Collection not found");
    }

    const productsIds = await prisma.product.findMany({
      where: {
        key: {
          in: products,
        },
      },
      select: { id: true },
    });

    if (productsIds.length !== products.length) {
      return {
        success: false,
        message: "Some products not found",
      };
    }

    await update({
      id,
      data: {
        products: {
          deleteMany: productsIds.map((product) => ({
            productId: product.id,
          })),
        },
      },
    });
  } catch (error) {
    console.error(error);
    // throw new Error("Failed to remove products from collection");
    return {
      success: false,
      message: "Failed to remove products from collection",
    };
  }
  const lng = cookies().get("i18next")?.value ?? "es";
  revalidatePath(`/${lng}/admin/collections`);
  redirect(`/${lng}/admin/collections`);
}

export async function deleteCollection({ id }: { id: string }) {
  try {
    await isAdmin();

    const collection = (await read({ id })) as ICollection;
    if (!collection) {
      return null;
    }

    await deleteById({ id });
    await del(collection.imageUrl);
  } catch (error) {
    console.error(error);
    throw new Error("Failed to delete collection");
  }
  const lng = cookies().get("i18next")?.value ?? "es";
  revalidatePath(`/${lng}/admin/collections`);
  redirect(`/${lng}/admin/collections`);
}

export async function deleteMassiveCollections({ ids }: { ids: string[] }) {
  try {
    await isAdmin();
    await deleteMassive({ ids });
  } catch (error) {
    console.error(error);
    throw new Error("Failed to delete massive collections");
  }
  const lng = cookies().get("i18next")?.value ?? "es";
  revalidatePath(`/${lng}/admin/collections`);
  redirect(`/${lng}/admin/collections`);
}
