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
import { getProducts } from "../product/controller";
import { IProduct } from "@/interfaces";

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
    const localProductsStock = (await getProducts({})) as unknown as IProduct[];
    const localQuantitiesPerProduct: { [key: string]: number } =
      localProductsStock.reduce((acc, product) => {
        acc[product.key] = product.quantityPerCarton;
        return acc;
      }, {} as { [key: string]: number });

    for (const [index, row] of jsonData.entries()) {
      try {
        const data = {
          client: row["Nombre Cliente"],
          discount: row["Descuento"] ? Number(row["Descuento"]) : 0,
          shipmentType: row["Tipo de Envio"],
        };

        const rowErrors = validateSchema("create", data);

        if (Object.keys(rowErrors).length !== 0) {
          // Mapeo de errores
          for (const [key, value] of Object.entries(rowErrors)) {
            errors[`Fila ${index + 2} - ${key}`] = value;
          }
          continue;
        }

        const products =
          typeof row["Productos"] === "string"
            ? row["Productos"].split(",")
            : [row["Productos"]];
        const quantities =
          typeof row["Cantidad"] === "string"
            ? row["Cantidad"].split(",").map(Number)
            : [Number(row["Cantidad"])];

        // Filtrar valores nulos o no válidos en productos y cantidades
        const validatedProducts = products.filter(Boolean);
        // console.log(validatedProducts);
        const validatedQuantities = quantities.filter(Boolean);
        // console.log(validatedQuantities);

        // Verificar si la cantidad de productos y cantidades es la misma
        if (validatedProducts.length !== validatedQuantities.length) {
          errors[`Fila ${index + 2}`] =
            "La cantidad de productos y cantidades no coincide";
          continue;
        }

        let total = 0;
        const processedProducts = new Set<string>();
        const orderProducts = [];
        // const discount = row["Descuento"] ? Number(row["Descuento"]) : 0;
        const productsData: {
          product: {
            connect: {
              key: string;
            };
          };
          quantity: number;
        }[] = [];

        for (let i = 0; i < validatedProducts.length; i++) {
          orderProducts[i] = {
            productKey: validatedProducts[i],
            quantity: validatedQuantities[i],
          };

          const orderProductErrors = validateSchema(
            "products",
            orderProducts[i]
          );

          if (Object.keys(orderProductErrors).length !== 0) {
            errors[`Fila ${index + 2} - Producto ${i + 1}`] =
              JSON.stringify(orderProductErrors);
            continue;
          }

          const currentProduct = validatedProducts[i] as string;

          // Comprobar si el producto ya fue procesado
          if (processedProducts.has(currentProduct)) {
            errors[
              `Fila ${index + 2} - Producto ${i + 1}`
            ] = `Este producto (${currentProduct}) ya se consideró en esta orden`;
            continue; // Saltar a la siguiente iteración
          }

          // Agregar el producto al conjunto de productos procesados
          processedProducts.add(currentProduct);

          const product = (await readProduct({
            key: validatedProducts[i] as string,
          })) as unknown as IProduct;

          if (!product) {
            errors[
              `Fila ${index + 2} - Producto ${i + 1}`
            ] = `Producto no encontrado`;
            continue;
          }

          if (
            validatedQuantities[i] >
            localQuantitiesPerProduct[validatedProducts[i]]
          ) {
            errors[
              `Fila ${index + 2} - Producto ${i + 1}`
            ] = `La cantidad máxima permitida para este producto (${
              validatedProducts[i]
            }) es ${localQuantitiesPerProduct[validatedProducts[i]]}`;
            continue;
          }

          localQuantitiesPerProduct[validatedProducts[i]] -=
            validatedQuantities[i];

          total += validatedQuantities[i] * product.salePriceMXN;

          productsData.push({
            product: {
              connect: {
                key: validatedProducts[i] as string,
              },
            },
            quantity: validatedQuantities[i],
          });
        }

        total = total - (total * data.discount) / 100;

        const finalData = {
          ...data,
          total,
          isPaid: data.discount === 100,
          products: {
            create: productsData,
          },
        };

        validData.push(finalData);
      } catch (error: any) {
        errors[`Row ${index + 2}`] = `Internal error: ${error.message}`;
      }
    }

    if (Object.keys(errors).length !== 0) return { errors, success: false };

    validData.forEach(async (data) => {
      data.products.create.forEach(async (product) => {
        await updateProduct({
          key: product.product.connect.key,
          data: {
            quantityPerCarton:
              localQuantitiesPerProduct[product.product.connect.key],
          },
        });
      });
      await create({ data });
    });
  } catch (error) {
    console.error(error);
    return { message: "An internal error occurred", success: false };
  }
  console.log("Orders created successfully");
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
