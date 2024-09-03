"use server";

import * as XLSX from "xlsx";
import { validateSchema } from "./schema";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { read as readProvider } from "@/services/provider/model";
import formatdateExcel from "@/utils/formatdate-excel";
import {
  read,
  update,
  create,
  deleteById,
  createMassive,
  deleteMassive,
} from "./model";
import type { IProvider } from "@/interfaces";

interface SearchParams {
  q?: string;
  quantityPerCartonFrom?: string;
  quantityPerCartonTo?: string;
  orderDateFrom?: string;
  orderDateTo?: string;
}

export async function getProducts({
  q,
  quantityPerCartonFrom,
  quantityPerCartonTo,
  orderDateFrom,
  orderDateTo,
}: SearchParams) {
  try {
    return await read({
      q,
      quantityPerCartonFrom: quantityPerCartonFrom
        ? Number(quantityPerCartonFrom)
        : undefined,
      quantityPerCartonTo: quantityPerCartonTo
        ? Number(quantityPerCartonTo)
        : undefined,
      orderDateFrom: orderDateFrom ? new Date(orderDateFrom) : undefined,
      orderDateTo: orderDateTo ? new Date(orderDateTo) : undefined,
    });
  } catch (error) {
    console.error(error);
    throw new Error("An internal error occurred");
  }
}

export async function createProduct(formData: FormData) {
  const data = {
    dollarExchangeRate: Number(formData.get("dollarExchangeRate")),
    name: formData.get("name"),
    key: formData.get("productKey"),
    quantityPerCarton: Number(formData.get("quantityPerCarton")),
    chinesePriceUSD: Number(formData.get("chinesePriceUSD")),
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

  const { dollarExchangeRate, ...rest } = data;

  const updatedData = {
    ...rest,
    pricePerCartonOrProductUSD,
    costMXN,
    totalCostMXN,
    margin,
    salePerQuantity,
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
  revalidatePath("/admin/products");
  redirect("/admin/products");
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
          dollarExchangeRate: Number(row["Cambio Dolar"]),
          name: row["Nombre Producto"],
          key: row["Clave Producto"],
          quantityPerCarton: Number(row["Cantidad"]),
          chinesePriceUSD: Number(row["Precio China (USD)"]),
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
        const providerId = (await readProvider({
          alias: data.providerAlias,
        })) as IProvider;
        if (!providerId) {
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

        const { dollarExchangeRate, providerAlias, ...rest } = data;

        const updatedData = {
          ...rest,
          providerId: providerId.id,
          pricePerCartonOrProductUSD,
          costMXN,
          totalCostMXN,
          margin,
          salePerQuantity,
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
      // Crear productos válidos en la base de datos
      await createMassive({ data: validData });
    }
  } catch (error) {
    console.error(error);
    return { message: "An internal error occurred", success: false };
  }
  revalidatePath("/admin/products");
  redirect("/admin/products");
}

export async function updateProduct(formData: FormData, productId: string) {
  const data = {
    dollarExchangeRate: Number(formData.get("dollarExchangeRate")),
    name: formData.get("name"),
    key: formData.get("productKey"),
    quantityPerCarton: Number(formData.get("quantityPerCarton")),
    chinesePriceUSD: Number(formData.get("chinesePriceUSD")),
    shippingCostMXN: Number(formData.get("shippingCostMXN")),
    salePriceMXN: Number(formData.get("salePriceMXN")),
    orderDate: new Date(formData.get("orderDate") as string),
    providerId: formData.get("providerId"),
  };

  const errors = validateSchema("update", data);

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

  const { dollarExchangeRate, ...rest } = data;

  const updatedData = {
    ...rest,
    pricePerCartonOrProductUSD,
    costMXN,
    totalCostMXN,
    margin,
    salePerQuantity,
  };

  try {
    await update({ id: productId, data: updatedData });
  } catch (error) {
    console.error(error);
    // throw new Error("An internal error occurred");
    return { message: "An internal error occurred", success: false };
  }
  revalidatePath("/admin/products");
  redirect("/admin/products");
}

export async function deleteProduct(productId: string) {
  try {
    await deleteById({ id: productId });
  } catch (error) {
    console.error(error);
    // throw new Error("An internal error occurred");
    return { message: "An internal error occurred", success: false };
  }
  revalidatePath("/admin/products");
  redirect("/admin/products");
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
