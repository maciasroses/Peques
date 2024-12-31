"use server";

import { cookies } from "next/headers";
import { validateSchema } from "./schema";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { read as xlsxRead, utils as xlsxUtils } from "xlsx";
import { COMFORT_SET, SET_IDEAL, SET_INTEGRAL } from "@/app/shared/constants";
import {
  read as readProduct,
  update as updateProduct,
} from "@/app/shared/services/product/model";
import {
  read,
  create,
  update,
  updateMassive,
  deleteById,
  deleteMassive,
} from "./model";
import { getProducts } from "../product/controller";
import type { IProduct } from "@/app/shared/interfaces";

interface ISearchParams {
  client?: string;
  deliveryStatus?: string;
  paymentMethod?: string;
  discountFrom?: string;
  discountTo?: string;
  subtotalFrom?: string;
  subtotalTo?: string;
  totalFrom?: string;
  totalTo?: string;
  isForGraph?: boolean;
  orderBy?: object;
  yearOfData?: string;
}

export async function getOrders({
  client,
  deliveryStatus,
  paymentMethod,
  discountFrom,
  discountTo,
  subtotalFrom,
  subtotalTo,
  totalFrom,
  totalTo,
}: ISearchParams) {
  try {
    return await read({
      client,
      deliveryStatus,
      paymentMethod: paymentMethod ? paymentMethod : undefined,
      isPaid: false,
      discountFrom: discountFrom ? Number(discountFrom) : undefined,
      discountTo: discountTo ? Number(discountTo) : undefined,
      subtotalFrom: subtotalFrom ? Number(subtotalFrom) : undefined,
      subtotalTo: subtotalTo ? Number(subtotalTo) : undefined,
      totalFrom: totalFrom ? Number(totalFrom) : undefined,
      totalTo: totalTo ? Number(totalTo) : undefined,
    });
  } catch (error) {
    console.error(error);
    throw new Error("An internal error occurred");
  }
}

export async function getSales({
  client,
  deliveryStatus,
  paymentMethod,
  discountFrom,
  discountTo,
  subtotalFrom,
  subtotalTo,
  totalFrom,
  totalTo,
  isForGraph = false,
  orderBy = { createdAt: "desc" },
  yearOfData,
}: ISearchParams) {
  try {
    return await read({
      client,
      deliveryStatus,
      paymentMethod: paymentMethod ? paymentMethod : undefined,
      isPaid: true,
      discountFrom: discountFrom ? Number(discountFrom) : undefined,
      discountTo: discountTo ? Number(discountTo) : undefined,
      subtotalFrom: subtotalFrom ? Number(subtotalFrom) : undefined,
      subtotalTo: subtotalTo ? Number(subtotalTo) : undefined,
      totalFrom: totalFrom ? Number(totalFrom) : undefined,
      totalTo: totalTo ? Number(totalTo) : undefined,
      isForGraph,
      orderBy,
      yearOfData: yearOfData
        ? Number(yearOfData)
        : isForGraph
          ? new Date().getFullYear()
          : undefined,
    });
  } catch (error) {
    console.error(error);
    return [];
    // throw new Error("An internal error occurred");
  }
}

const matchesSet = (
  setKeys: string[],
  products: string[],
  productsQuantity: string[]
) => {
  const productCounts: Record<string, number> = {};

  setKeys.forEach((key) => {
    products.forEach((product, index) => {
      if (product.startsWith(key)) {
        if (!productCounts[key]) {
          productCounts[key] = 0;
        }
        productCounts[key] += Number(productsQuantity[index]);
      }
    });
  });

  const quantities = Object.values(productCounts);
  return (
    quantities.length === setKeys.length &&
    quantities.every((qty) => qty === quantities[0])
  );
};

const applyDiscounts = (
  discount: number,
  productKey: string,
  set: { [key: string]: number }
) => {
  for (let key in set) {
    if (productKey.startsWith(key)) {
      return set[key];
    }
  }
  return discount;
};

export async function createOrder(formData: FormData) {
  const lng = cookies().get("i18next")?.value ?? "es";
  interface IOrderErrors {
    order: {};
    products: {
      productKey?: string;
      quantity?: string;
      discount?: string;
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
    discount: Number(formData.get("discount")) ?? 0,
    paymentMethod: formData.get("paymentMethod") as string,
  };

  const errors = validateSchema("create", data);

  if (Object.keys(errors).length !== 0) {
    orderErrors.order = errors;
  }

  const products = formData.getAll("product") as string[];
  const productsQuantity = formData.getAll("productQuantity") as string[];
  const productsDiscount = formData.getAll("productDiscount") as string[];

  try {
    for (let i = 0; i < products.length; i++) {
      let discount = Number(productsDiscount[i]) ?? 0;

      if (matchesSet(Object.keys(SET_IDEAL), products, productsQuantity)) {
        discount = applyDiscounts(discount, products[i], SET_IDEAL);
      } else if (
        matchesSet(Object.keys(SET_INTEGRAL), products, productsQuantity)
      ) {
        discount = applyDiscounts(discount, products[i], SET_INTEGRAL);
      } else if (
        matchesSet(Object.keys(COMFORT_SET), products, productsQuantity)
      ) {
        discount = applyDiscounts(discount, products[i], COMFORT_SET);
      }

      orderProducts[i] = {
        discount,
        productKey: products[i],
        quantity: Number(productsQuantity[i]),
      };

      const { availableQuantity } = (await readProduct({
        key: products[i] as string,
      })) as unknown as IProduct;

      if (Number(productsQuantity[i]) > availableQuantity) {
        orderErrors.products[i] = {
          quantity: `La cantidad máxima permitida para este producto es ${availableQuantity}`,
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
    let productsTotal = 0;
    const finalProducts: {
      product: {
        connect: {
          key: string;
        };
      };
      quantity: number;
      discount: number;
      costMXN: number;
    }[] = [];

    const productPromise = orderProducts.map(async (product) => {
      const { salePriceMXN, availableQuantity } = (await readProduct({
        key: product.productKey as string,
      })) as unknown as IProduct;

      const preTotal = Number(product.quantity) * salePriceMXN;
      total += preTotal;
      productsTotal += preTotal - (preTotal * product.discount) / 100;

      await updateProduct({
        key: product.productKey as string,
        data: {
          availableQuantity: availableQuantity - product.quantity,
        },
      });

      finalProducts.push({
        product: {
          connect: {
            key: product.productKey as string,
          },
        },
        quantity: product.quantity,
        discount: product.discount,
        costMXN: salePriceMXN,
      });
    });

    await Promise.all(productPromise);

    const subtotal = productsTotal;
    total = productsTotal - (productsTotal * data.discount) / 100;

    const finalData = {
      ...data,
      subtotal,
      total,
      isPaid:
        data.discount === 100 ||
        finalProducts.every((product) => product.discount === 100),
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
  revalidatePath(`/${lng}/admin/orders`);
  redirect(`/${lng}/admin/orders`);
}

export async function createMassiveOrder(formData: FormData) {
  const lng = cookies().get("i18next")?.value ?? "es";
  try {
    // Obtener el archivo Excel
    const file = formData.get("products") as File;

    // Leer el archivo Excel
    const data = await file.arrayBuffer();
    const workbook = xlsxRead(data, { type: "array" });
    const sheetName = workbook.SheetNames[0];
    const worksheet = workbook.Sheets[sheetName];
    const jsonData: any[] = xlsxUtils.sheet_to_json(worksheet);

    // Variables para almacenar los datos válidos y los errores
    const validData = [];
    const errors: { [key: string]: string } = {};
    const localProductsStock = (await getProducts({})) as unknown as IProduct[];
    const localQuantitiesPerProduct: { [key: string]: number } =
      localProductsStock.reduce(
        (acc, product) => {
          acc[product.key] = product.availableQuantity;
          return acc;
        },
        {} as { [key: string]: number }
      );

    for (const [index, row] of jsonData.entries()) {
      try {
        const data = {
          client: row["Nombre Cliente"],
          discount: row["Descuento"] ? Number(row["Descuento"]) : 0,
          shipmentType: row["Tipo de Envio"],
          paymentMethod: row["Método de Pago"],
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
        const discounts =
          typeof row["Descuento por Producto"] === "string"
            ? row["Descuento por Producto"].split(",").map(Number)
            : Number(row["Descuento por Producto"]) ||
              row["Productos"].split(",").map(() => 0);

        const validatedProducts = products.filter(Boolean);
        const validatedQuantities = quantities.filter(Boolean);
        interface IValidatedDiscounts {
          (val: number | null | undefined): boolean;
        }
        const validatedDiscounts: number[] = discounts.filter(
          ((val: number | null | undefined) =>
            val !== null &&
            val !== undefined &&
            !isNaN(val)) as IValidatedDiscounts
        );

        if (
          validatedProducts.length !== validatedQuantities.length ||
          validatedProducts.length !== validatedDiscounts.length ||
          validatedQuantities.length !== validatedDiscounts.length
        ) {
          errors[`Fila ${index + 2}`] =
            "La cantidad de productos, cantidades y descuentos por producto no coinciden";
          continue;
        }

        let total = 0;
        let productsTotal = 0;
        const processedProducts = new Set<string>();
        const orderProducts = [];
        const productsData: {
          product: {
            connect: {
              key: string;
            };
          };
          quantity: number;
          discount: number;
          costMXN: number;
        }[] = [];

        for (let i = 0; i < validatedProducts.length; i++) {
          let discount = Number(validatedDiscounts[i]) ?? 0;

          if (
            matchesSet(
              Object.keys(SET_IDEAL),
              validatedProducts,
              validatedQuantities as unknown as string[]
            )
          ) {
            discount = applyDiscounts(
              discount,
              validatedProducts[i],
              SET_IDEAL
            );
          } else if (
            matchesSet(
              Object.keys(SET_INTEGRAL),
              validatedProducts,
              validatedQuantities as unknown as string[]
            )
          ) {
            discount = applyDiscounts(
              discount,
              validatedProducts[i],
              SET_INTEGRAL
            );
          } else if (
            matchesSet(
              Object.keys(COMFORT_SET),
              validatedProducts,
              validatedQuantities as unknown as string[]
            )
          ) {
            discount = applyDiscounts(
              discount,
              validatedProducts[i],
              COMFORT_SET
            );
          }

          orderProducts[i] = {
            discount,
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

          const currentProduct = orderProducts[i].productKey;

          if (processedProducts.has(currentProduct)) {
            errors[`Fila ${index + 2} - Producto ${i + 1}`] =
              `Este producto (${currentProduct}) ya se consideró en esta orden`;
            continue; // Saltar a la siguiente iteración
          }

          processedProducts.add(currentProduct);

          const product = (await readProduct({
            key: validatedProducts[i] as string,
          })) as unknown as IProduct;

          if (!product) {
            errors[`Fila ${index + 2} - Producto ${i + 1}`] =
              `Producto no encontrado`;
            continue;
          }

          if (
            orderProducts[i].quantity >
            localQuantitiesPerProduct[orderProducts[i].productKey]
          ) {
            errors[`Fila ${index + 2} - Producto ${i + 1}`] =
              `La cantidad máxima permitida para este producto (${
                validatedProducts[i]
              }) es ${localQuantitiesPerProduct[validatedProducts[i]]}`;
            continue;
          }

          localQuantitiesPerProduct[orderProducts[i].productKey] -=
            orderProducts[i].quantity;

          const preTotal = orderProducts[i].quantity * product.salePriceMXN;
          total += preTotal;
          productsTotal +=
            preTotal - (preTotal * orderProducts[i].discount) / 100;

          productsData.push({
            product: {
              connect: {
                key: orderProducts[i].productKey,
              },
            },
            quantity: orderProducts[i].quantity,
            discount: orderProducts[i].discount,
            costMXN: orderProducts[i].quantity * product.salePriceMXN,
          });
        }

        const subtotal = productsTotal;
        total = productsTotal - (productsTotal * data.discount) / 100;

        const finalData = {
          ...data,
          subtotal,
          total,
          isPaid:
            data.discount === 100 ||
            productsData.every((p) => p.discount === 100),
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
            availableQuantity:
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
  revalidatePath(`/${lng}/admin/orders`);
  redirect(`/${lng}/admin/orders`);
}

interface IOrderForUpdateDeliveryStatus {
  products: {
    product: {
      id: string;
      name: string;
      key: string;
      availableQuantity: number;
      salePriceMXN: number;
      providerId: string;
      createdAt: Date;
      updatedAt: Date;
    };
    productId: string;
    orderId: string;
    quantity: number;
  }[];
  id: string;
  client: string;
  discount: number | null;
  subtotal: number;
  total: number;
  shipmentType: string;
  isPaid: boolean;
  deliveryStatus: string;
  pendingPayment: number | null;
  createdAt: Date;
  updatedAt: Date;
}

export async function updateDeliveryStatus(
  id: string,
  deliveryStatus: string,
  _pathname: string
) {
  const lng = cookies().get("i18next")?.value ?? "es";
  try {
    if (deliveryStatus === "CANCELLED") {
      const order = (await read({ id })) as IOrderForUpdateDeliveryStatus;
      order.products.forEach(async (product) => {
        await updateProduct({
          key: product.product.key,
          data: {
            availableQuantity:
              product.product.availableQuantity + product.quantity,
          },
        });
      });
    }
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
  revalidatePath(`/${lng}/admin/orders`);
  redirect(`/${lng}/admin/orders`);
}

export async function updateMassiveDeliveryStatus(
  ids: string[],
  deliveryStatus: string
) {
  try {
    if (deliveryStatus === "CANCELLED") {
      for (const id of ids) {
        const order = (await read({ id })) as IOrderForUpdateDeliveryStatus;
        order.products.forEach(async (product) => {
          await updateProduct({
            key: product.product.key,
            data: {
              availableQuantity:
                product.product.availableQuantity + product.quantity,
            },
          });
        });
      }
    }
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
  const lng = cookies().get("i18next")?.value ?? "es";
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
  revalidatePath(`/${lng}/admin/orders`);
  redirect(`/${lng}/admin/orders`);
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

export async function deleteOrder(id: string, _pathname: string) {
  const lng = cookies().get("i18next")?.value ?? "es";
  try {
    const order = (await read({ id })) as IOrderForUpdateDeliveryStatus;
    if (order.deliveryStatus !== "CANCELLED") {
      order.products.forEach(async (product) => {
        await updateProduct({
          key: product.product.key,
          data: {
            availableQuantity:
              product.product.availableQuantity + product.quantity,
          },
        });
      });
    }

    await deleteById({ id });
  } catch (error) {
    console.error(error);
    return { message: "An internal error occurred", success: false };
  }
  revalidatePath(`/${lng}/admin/orders`);
  redirect(`/${lng}/admin/orders`);
}

export async function deleteMassiveOrder(ids: string[]) {
  try {
    for (const id of ids) {
      const order = (await read({ id })) as IOrderForUpdateDeliveryStatus;
      if (order.deliveryStatus !== "CANCELLED") {
        order.products.forEach(async (product) => {
          await updateProduct({
            key: product.product.key,
            data: {
              availableQuantity:
                product.product.availableQuantity + product.quantity,
            },
          });
        });
      }
    }

    await deleteMassive(ids);
  } catch (error) {
    console.error(error);
    // throw new Error("An internal error occurred");
    return { message: "An internal error occurred", success: false };
  }
}
