"use server";

import { cookies } from "next/headers";
import { validateSchema } from "./schema";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { isAdmin } from "@/app/shared/services/auth";
import { deleteFile, uploadFile } from "@/app/shared/services/aws/s3";
import { create, deleteById, deleteMassive, read, update } from "./model";
import { getProductIdsByKeys } from "@/app/shared/services/product/controller";
import type {
  ICollection,
  ICollectionSearchParams,
} from "@/app/shared/interfaces";
import { generateFileKey } from "../../utils/generateFileKey";

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

export async function getAllCollections() {
  try {
    return await read({ allData: true });
  } catch (error) {
    console.error(error);
    throw new Error("Failed to get all collections");
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

  const products = formData.getAll("product") as string[];

  if (!products.length) {
    return {
      success: false,
      message: "No hay productos para agregar",
    };
  }

  if (products.some((productId) => productId === "")) {
    return {
      success: false,
      message: "Seleccione los productos válidos",
    };
  }

  try {
    await isAdmin();

    const collectionExistsByName = await read({
      name: dataToValidate.name as string,
    });
    if (collectionExistsByName) {
      return {
        success: false,
        message: "La colección con ese nombre ya existe",
      };
    }

    const collectionExistsByLink = await read({
      link: dataToValidate.link as string,
    });
    if (collectionExistsByLink) {
      return {
        success: false,
        message: "La colección con ese link ya existe",
      };
    }

    const { imageUrl, ...rest } = dataToValidate;

    const fileKey = generateFileKey(imageUrl as File);
    const url = await uploadFile({
      file: imageUrl as File,
      fileKey: `Collections/${fileKey}`,
    });

    const productIds = await getProductIdsByKeys(products);

    if (productIds.length !== products.length) {
      return {
        success: false,
        message: "Algunos productos no se encontraron",
      };
    }

    const finalData = {
      ...rest,
      imageUrl: url,
      products: {
        create: productIds.map((product) => ({
          productId: product,
        })),
      },
    };

    await create({ data: finalData });
  } catch (error) {
    console.error(error);
    // throw new Error("Failed to create collection");
    return {
      success: false,
      message: "Ha ocurrido un error al crear la colección",
    };
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

    const collections = (await read({})) as ICollection[];

    const collectionsWithoutCurrent = collections.filter((c) => c.id !== id);

    const collectionExistsByName = collectionsWithoutCurrent.find(
      (c) => c.name === dataToValidate.name
    );
    if (collectionExistsByName) {
      return {
        success: false,
        message: "La colección con ese nombre ya existe",
      };
    }

    const collectionExistsByLink = collectionsWithoutCurrent.find(
      (c) => c.link === dataToValidate.link
    );
    if (collectionExistsByLink) {
      return {
        success: false,
        message: "La colección con ese link ya existe",
      };
    }

    if ((dataToValidate.imageUrl as File).size > 0) {
      const { imageUrl, ...rest } = dataToValidate;

      const fileKey = generateFileKey(imageUrl as File);
      const url = await uploadFile({
        file: imageUrl as File,
        fileKey: `Collections/${fileKey}`,
      });

      const finalData = {
        ...rest,
        imageUrl: url,
      };

      await update({ id, data: finalData });

      const urlObj = new URL(collection.imageUrl);
      await deleteFile(urlObj.pathname.substring(1));
    } else {
      const { imageUrl, ...rest } = dataToValidate;

      const finalData = {
        ...rest,
        imageUrl: collection.imageUrl,
      };

      await update({ id, data: finalData });
    }
  } catch (error) {
    console.error(error);
    // throw new Error("Failed to update collection");
    return {
      success: false,
      message: "Ha ocurrido un error al actualizar la colección",
    };
  }
  const lng = cookies().get("i18next")?.value ?? "es";
  revalidatePath(`/${lng}/admin/collections`);
  redirect(`/${lng}/admin/collections`);
}

export async function updateCollectionOrderById({
  id,
  order,
}: {
  id: string;
  order: number;
}) {
  try {
    await isAdmin();

    await update({ id, data: { order } });
  } catch (error) {
    console.error(error);
    return {
      success: false,
      message: "Ha ocurrido un error al actualizar el orden de la colección",
    };
  }
}

export async function updateProductOnCollectionOrder({
  order,
  productId,
  collectionId,
}: {
  order: number;
  productId: string;
  collectionId: string;
}) {
  try {
    await isAdmin();

    const collection = (await read({ id: collectionId })) as ICollection;
    if (!collection) {
      throw new Error("Collection not found");
    }

    const product = collection.products.find(
      (product) => product.productId === productId
    );
    if (!product) {
      throw new Error("Product not found");
    }

    await update({
      id: collectionId,
      data: {
        products: {
          update: [
            {
              where: {
                productId_collectionId: {
                  collectionId,
                  productId,
                },
              },
              data: {
                order,
              },
            },
          ],
        },
      },
    });
  } catch (error) {
    console.error(error);
    return {
      success: false,
      message: "Ha ocurrido un error al actualizar el orden del producto",
    };
  }
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
        message: "No hay productos para agregar",
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
      throw new Error("Colección no encontrada");
    }

    const productIds = await getProductIdsByKeys(products);

    if (productIds.length !== products.length) {
      return {
        success: false,
        message: "Algunos productos no se encontraron",
      };
    }

    await update({
      id,
      data: {
        products: {
          create: productIds.map((product) => ({
            productId: product,
          })),
        },
      },
    });
  } catch (error) {
    console.error(error);
    // throw new Error("Failed to add products to collection");
    return {
      success: false,
      message: "Ha ocurrido un error al agregar productos a la colección",
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
        message: "No hay productos para remover",
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
      throw new Error("Colección no encontrada");
    }

    const productIds = await getProductIdsByKeys(products);

    if (productIds.length !== products.length) {
      return {
        success: false,
        message: "Algunos productos no se encontraron",
      };
    }

    await update({
      id,
      data: {
        products: {
          deleteMany: productIds.map((product) => ({
            productId: product,
          })),
        },
      },
    });
  } catch (error) {
    console.error(error);
    // throw new Error("Failed to remove products from collection");
    return {
      success: false,
      message: "Ha ocurrido un error al remover productos de la colección",
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

    const urlObj = new URL(collection.imageUrl);
    await deleteFile(urlObj.pathname.substring(1));
  } catch (error) {
    console.error(error);
    // throw new Error("Failed to delete collection");
    return {
      success: false,
      message: "Ha ocurrido un error al eliminar la colección",
    };
  }
  const lng = cookies().get("i18next")?.value ?? "es";
  revalidatePath(`/${lng}/admin/collections`);
  redirect(`/${lng}/admin/collections`);
}

export async function deleteMassiveCollections({ ids }: { ids: string[] }) {
  try {
    await isAdmin();

    const collectionImages: string[] = [];

    for (const id of ids) {
      const { imageUrl } = (await read({ id })) as ICollection;
      collectionImages.push(imageUrl);
    }

    await deleteMassive({ ids });
    await Promise.all(
      collectionImages.map((image) => {
        const urlObj = new URL(image);
        return deleteFile(urlObj.pathname.substring(1));
      })
    );
  } catch (error) {
    console.error(error);
    return {
      success: false,
      message: "Ha ocurrido un error al eliminar las colecciones",
    };
  }
  const lng = cookies().get("i18next")?.value ?? "es";
  revalidatePath(`/${lng}/admin/collections`);
  redirect(`/${lng}/admin/collections`);
}
