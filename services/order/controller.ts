"use server";

import * as XLSX from "xlsx";
import { validateSchema } from "./schema";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import {
  read as readProduct,
  update as updateProduct,
} from "@/services/product/model";
import { read, create, update, updateMassive } from "./model";

interface ISearchParams {
  client?: string;
  deliveryStatus?: string;
}

export async function getOrders({ client, deliveryStatus }: ISearchParams) {
  try {
    return await read({ client, deliveryStatus, isPaid: false });
  } catch (error) {
    console.error(error);
    throw new Error("An internal error occurred");
  }
}

export async function getSales({ client, deliveryStatus }: ISearchParams) {
  try {
    return await read({ client, deliveryStatus, isPaid: true });
  } catch (error) {
    console.error(error);
    throw new Error("An internal error occurred");
  }
}

export async function createOrder(formData: FormData) {
  interface IOrderErrors {
    order: {};
    products: {
      productKey?: string;
      quantity?: string;
    }[];
  }

  const orderErrors: IOrderErrors = {
    order: {},
    products: [],
  };
  const orderProducts = [];

  const data = {
    client: formData.get("client") as string,
    shipmentType: formData.get("shipmentType") as string,
  };

  const errors = validateSchema("create", data);

  if (Object.keys(errors).length !== 0) {
    orderErrors.order = errors;
  }

  const products = formData.getAll("product");
  const productsQuantity = formData.getAll("productQuantity");

  try {
    for (let i = 0; i < products.length; i++) {
      orderProducts[i] = {
        productKey: products[i],
        quantity: Number(productsQuantity[i]),
      };

      const { quantityPerCarton } = (await readProduct({
        key: products[i] as string,
      })) as { quantityPerCarton: number };

      if (Number(productsQuantity[i]) > quantityPerCarton) {
        orderErrors.products[i] = {
          quantity: `La cantidad máxima permitida para este producto es ${quantityPerCarton}`,
        };
      }

      const errors = validateSchema("products", orderProducts[i]);

      if (Object.keys(errors).length !== 0) {
        orderErrors.products[i] = errors;
      }
    }

    if (
      Object.keys(orderErrors.products).length !== 0 ||
      Object.keys(orderErrors.order).length !== 0
    ) {
      return { errors: orderErrors, success: false };
    }

    let total = 0;
    const discount = Number(formData.get("discount")) ?? 0;
    const finalProducts: {
      product: {
        connect: {
          key: string;
        };
      };
      quantity: number;
    }[] = [];

    const productPromise = orderProducts.map(async (product) => {
      const { salePriceMXN } = (await readProduct({
        key: product.productKey as string,
      })) as { salePriceMXN: number };

      total += Number(product.quantity) * salePriceMXN;

      const { quantityPerCarton } = (await readProduct({
        key: product.productKey as string,
      })) as { quantityPerCarton: number };

      await updateProduct({
        key: product.productKey as string,
        data: {
          quantityPerCarton: quantityPerCarton - product.quantity,
        },
      });

      finalProducts.push({
        product: {
          connect: {
            key: product.productKey as string,
          },
        },
        quantity: product.quantity,
      });
    });

    await Promise.all(productPromise);

    total = total - (total * discount) / 100;

    const finalData = {
      ...data,
      total,
      discount,
      isPaid: discount === 100,
      products: {
        create: finalProducts,
      },
    };

    await create({ data: finalData });
  } catch (error) {
    console.error(error);
    // throw new Error("An internal error occurred");
    return { message: "An internal error occurred", success: false };
  }
  revalidatePath("/admin/orders");
  redirect("/admin/orders");
}

export async function createMassiveOrder(formData: FormData) {
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
          client: row["Nombre Cliente"],
          shipmentType: row["Tipo de Envio"],
          // discount: Number(row["Descuento"]) ?? 0
        };

        const rowErrors = validateSchema("create", data);

        if (Object.keys(rowErrors).length !== 0) {
          for (const key in rowErrors) {
            errors[`Fila ${index + 2}`] = rowErrors[key];
          }
          continue;
        }
      } catch (error: any) {
        errors[`Row ${index + 2}`] = `Internal error: ${error.message}`;
      }

      if (Object.keys(errors).length !== 0) {
        return { errors, success: false };
      }

      // await create({ data: validData });
    }
  } catch (error) {
    console.error(error);
    return { message: "An internal error occurred", success: false };
  }
  revalidatePath("/admin/orders");
  redirect("/admin/orders");
}

export async function updateDeliveryStatus(id: string, deliveryStatus: string) {
  try {
    await update({
      id,
      data: {
        deliveryStatus,
      },
    });
  } catch (error) {
    console.error(error);
    throw new Error("An internal error occurred");
  }
  revalidatePath("/admin/orders");
  redirect("/admin/orders");
}

export async function updateMassiveDeliveryStatus(
  ids: string[],
  deliveryStatus: string
) {
  try {
    await updateMassive({
      ids,
      data: {
        deliveryStatus,
      },
    });
  } catch (error) {
    console.error(error);
    throw new Error("An internal error occurred");
  }
}

export async function markAsPaid(id: string) {
  try {
    await update({
      id,
      data: {
        isPaid: true,
      },
    });
  } catch (error) {
    console.error(error);
    throw new Error("An internal error occurred");
  }
  revalidatePath("/admin/orders");
  redirect("/admin/orders");
}

export async function markMassiveAsPaid(ids: string[]) {
  try {
    await updateMassive({
      ids,
      data: {
        isPaid: true,
      },
    });
  } catch (error) {
    console.error(error);
    throw new Error("An internal error occurred");
  }
}
