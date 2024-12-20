"use server";

import * as XLSX from "xlsx";
import { validateSchema } from "./schema";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { read as readProvider } from "@/app/shared/services/provider/model";
import formatdateExcel from "@/app/shared/utils/formatdate-excel";
import {
  read,
  update,
  create,
  deleteById,
  deleteMassive,
  createHistory,
  updateHistory,
  readHistory,
  deleteHistoryById,
  deleteHistoryMassive,
} from "./model";
import type {
  IProduct,
  IProductHistory,
  IProvider,
} from "@/app/shared/interfaces";
import { cookies } from "next/headers";

interface SearchParams {
  q?: string;
  availableQuantityFrom?: string;
  availableQuantityTo?: string;
  salePriceMXNFrom?: string;
  salePriceMXNTo?: string;
  provider?: string;
}

export async function getProducts({
  q,
  availableQuantityFrom,
  availableQuantityTo,
  salePriceMXNFrom,
  salePriceMXNTo,
  provider,
}: SearchParams) {
  try {
    return await read({
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

export async function createProduct(formData: FormData) {
  const data = {
    name: formData.get("name"),
    key: formData.get("productKey"),
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

  const { name, key, providerId, minimumAcceptableQuantity, ...rest } = data;

  const updatedData = {
    name,
    key,
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
  revalidatePath(`${lng}/admin/products`);
  redirect(`${lng}/admin/products`);
}

export async function createMassiveProduct(formData: FormData) {
  try {
    // Obtener el archivo Excel
    const file = formData.get("products") as File;

    // Leer el archivo Excel
    const data = await file.arrayBuffer();
    const workbook = XLSX.read(data, { type: "array" });
    const sheetName = workbook.SheetNames[0];
    const worksheet = workbook.Sheets[sheetName];
    const jsonData: any[] = XLSX.utils.sheet_to_json(worksheet);

    // Variables para almacenar los datos válidos y los errores
    const validData = [];
    const errors: { [key: string]: string } = {};

    for (const [index, row] of jsonData.entries()) {
      try {
        // Convertir y validar los datos de la fila
        const data = {
          name: row["Nombre Producto"],
          key: row["Clave Producto"],
          minimumAcceptableQuantity: Number(row["Cantidad Mínima Aceptable"]),
          quantityPerCarton: Number(row["Cantidad"]),
          chinesePriceUSD: Number(row["Precio China (USD)"]),
          dollarExchangeRate: Number(row["Cambio Dolar"]),
          shippingCostMXN: Number(row["Costo de Envio (MXN)"]),
          salePriceMXN: Number(row["Precio de Venta (MXN)"]),
          orderDate: formatdateExcel(row["Fecha de Orden"]),
          providerAlias: row["Alias Proveedor"],
        };

        const rowErrors = validateSchema("massiveCreate", data);

        if (Object.keys(rowErrors).length !== 0) {
          // Mapeo de errores
          for (const [key, value] of Object.entries(rowErrors)) {
            errors[`Fila ${index + 2} - ${key}`] = value;
          }
          continue;
        }

        // Buscar el proveedor por su alias
        const provider = (await readProvider({
          alias: data.providerAlias,
        })) as IProvider;
        if (!provider) {
          errors[`Fila ${index + 2}`] = `Proveedor no encontrado`;
          continue;
        }

        // Comprobamos si la clave del producto existe
        const product = await read({ key: data.key });
        if (product) {
          errors[`Fila ${index + 2}`] = `Un producto ya tiene esta clave.`;
        }

        // Calcular los campos adicionales
        const pricePerCartonOrProductUSD =
          data.chinesePriceUSD * data.quantityPerCarton;
        const costMXN = data.chinesePriceUSD * data.dollarExchangeRate;
        const totalCostMXN = costMXN + data.shippingCostMXN;
        const margin = (data.salePriceMXN / totalCostMXN - 1) * 100;
        const salePerQuantity = data.salePriceMXN * data.quantityPerCarton;

        const { name, key, providerAlias, minimumAcceptableQuantity, ...rest } =
          data;

        const updatedData = {
          name,
          key,
          minimumAcceptableQuantity,
          availableQuantity: data.quantityPerCarton,
          salePriceMXN: data.salePriceMXN,
          providerId: provider.id,
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

        // Agregar a la lista de datos válidos
        validData.push(updatedData);
      } catch (error: any) {
        errors[`Row ${index + 2}`] = `Internal error: ${error.message}`;
      }
    }

    if (Object.keys(errors).length !== 0) {
      return {
        success: false,
        errors,
      };
    }

    if (validData.length > 0) {
      validData.forEach(async (data) => {
        await create({ data });
      });
    }
  } catch (error) {
    console.error(error);
    return { message: "An internal error occurred", success: false };
  }
  const lng = cookies().get("i18next")?.value ?? "es";
  revalidatePath(`${lng}/admin/products`);
  redirect(`${lng}/admin/products`);
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
  revalidatePath(`${lng}/admin/products`);
  redirect(`${lng}/admin/products`);
}

export async function updateProduct(formData: FormData, productId: string) {
  const data = {
    name: formData.get("name"),
    key: formData.get("productKey"),
    minimumAcceptableQuantity: Number(
      formData.get("minimumAcceptableQuantity")
    ),
    providerId: formData.get("providerId"),
  };

  const errors = validateSchema("update", data);

  if (Object.keys(errors).length !== 0)
    return {
      errors,
      success: false,
    };

  try {
    await update({ id: productId, data });
  } catch (error) {
    console.error(error);
    // throw new Error("An internal error occurred");
    return { message: "An internal error occurred", success: false };
  }
  const lng = cookies().get("i18next")?.value ?? "es";
  revalidatePath(`${lng}/admin/products`);
  redirect(`${lng}/admin/products`);
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
  revalidatePath(`${lng}/admin/products`);
  redirect(`${lng}/admin/products`);
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
  revalidatePath(`${lng}/admin/products`);
  redirect(`${lng}/admin/products`);
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
  revalidatePath(`${lng}/admin/products`);
  redirect(`${lng}/admin/products`);
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
