"use server";

import { Resend } from "resend";
import { cookies } from "next/headers";
import { validateSchema } from "./schema";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { getSession } from "@/app/shared/services/auth";
import { read as xlsxRead, utils as xlsxUtils } from "xlsx";
import { getUserById } from "@/app/shared/services/user/controller";
import {
  read,
  create,
  update,
  deleteById,
  updateMassive,
  deleteMassive,
} from "./model";
import { getPaymentMethodByStripeId } from "@/app/shared/services/paymentMethod/controller";
import {
  getProducts,
  getProductByKey,
  updateAvailableQuantityProductByKey,
} from "@/app/shared/services/product/controller";
import {
  getDiscountCodeById,
  createDiscountCodeToUser,
  updateUsagesOfDiscountCode,
} from "@/app/shared/services/discountCode/controller";
import type {
  IUser,
  IProduct,
  IDiscountCode,
  IPaymentMethod,
  IOrderSearchParams,
  IOrder,
} from "@/app/shared/interfaces";
import React from "react";
import OrderStatus from "@/app/email/OrderStatus";
import prisma from "../prisma";

const resend = new Resend(process.env.RESEND_API_KEY as string);

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
}: IOrderSearchParams) {
  try {
    return await read({
      isAdminRequest: true,
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
}: IOrderSearchParams) {
  try {
    return await read({
      isAdminRequest: true,
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
  }
}

// const matchesSet = (
//   setKeys: string[],
//   products: string[],
//   productsQuantity: string[]
// ) => {
//   const productCounts: Record<string, number> = {};

//   setKeys.forEach((key) => {
//     products.forEach((product, index) => {
//       if (product.startsWith(key.toLowerCase())) {
//         if (!productCounts[key]) {
//           productCounts[key] = 0;
//         }
//         productCounts[key] += Number(productsQuantity[index]);
//       }
//     });
//   });

//   const quantities = Object.values(productCounts);
//   return (
//     quantities.length === setKeys.length &&
//     quantities.every((qty) => qty === quantities[0])
//   );
// };

// const applyDiscounts = (
//   discount: number,
//   productKey: string,
//   set: { [key: string]: number }
// ) => {
//   for (let key in set) {
//     if (productKey.startsWith(key.toLowerCase())) {
//       return set[key];
//     }
//   }
//   return discount;
// };

export async function createOrder(formData: FormData) {
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
      // let discount = Number(productsDiscount[i]) ?? 0;

      // if (matchesSet(Object.keys(SET_IDEAL), products, productsQuantity)) {
      //   discount = applyDiscounts(discount, products[i], SET_IDEAL);
      // } else if (
      //   matchesSet(Object.keys(SET_INTEGRAL), products, productsQuantity)
      // ) {
      //   discount = applyDiscounts(discount, products[i], SET_INTEGRAL);
      // } else if (
      //   matchesSet(Object.keys(COMFORT_SET), products, productsQuantity)
      // ) {
      //   discount = applyDiscounts(discount, products[i], COMFORT_SET);
      // }

      orderProducts[i] = {
        productKey: products[i],
        quantity: Number(productsQuantity[i]),
        discount: Number(productsDiscount[i]) ?? 0,
      };

      const { availableQuantity } = (await getProductByKey({
        key: products[i] as string,
      })) as IProduct;

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
      const { salePriceMXN, availableQuantity } = (await getProductByKey({
        key: product.productKey as string,
      })) as IProduct;

      const preTotal = Number(product.quantity) * salePriceMXN;
      total += preTotal;
      productsTotal += preTotal - (preTotal * product.discount) / 100;

      await updateAvailableQuantityProductByKey({
        key: product.productKey as string,
        availableQuantity: availableQuantity - product.quantity,
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

    const subtotal = total;
    total = productsTotal - (productsTotal * data.discount) / 100;

    const finalData = {
      ...data,
      subtotal,
      total,
      shippingCost: 190, // TODO: Change this to requested value
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
  const lng = cookies().get("i18next")?.value ?? "es";
  revalidatePath(`/${lng}/admin/orders`);
  redirect(`/${lng}/admin/orders`);
}

export async function createMassiveOrder(formData: FormData) {
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
          // let discount = Number(validatedDiscounts[i]) ?? 0;

          // if (
          //   matchesSet(
          //     Object.keys(SET_IDEAL),
          //     validatedProducts,
          //     validatedQuantities as unknown as string[]
          //   )
          // ) {
          //   discount = applyDiscounts(
          //     discount,
          //     validatedProducts[i],
          //     SET_IDEAL
          //   );
          // } else if (
          //   matchesSet(
          //     Object.keys(SET_INTEGRAL),
          //     validatedProducts,
          //     validatedQuantities as unknown as string[]
          //   )
          // ) {
          //   discount = applyDiscounts(
          //     discount,
          //     validatedProducts[i],
          //     SET_INTEGRAL
          //   );
          // } else if (
          //   matchesSet(
          //     Object.keys(COMFORT_SET),
          //     validatedProducts,
          //     validatedQuantities as unknown as string[]
          //   )
          // ) {
          //   discount = applyDiscounts(
          //     discount,
          //     validatedProducts[i],
          //     COMFORT_SET
          //   );
          // }

          orderProducts[i] = {
            quantity: validatedQuantities[i],
            productKey: validatedProducts[i],
            discount: Number(validatedDiscounts[i]) ?? 0,
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

          const product = (await getProductByKey({
            key: validatedProducts[i] as string,
          })) as IProduct;

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

        const subtotal = total;
        total = productsTotal - (productsTotal * data.discount) / 100;

        const finalData = {
          ...data,
          subtotal,
          total,
          shippingCost: 190, // TODO: Change this to requested value
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
        await updateAvailableQuantityProductByKey({
          key: product.product.connect.key,
          availableQuantity:
            localQuantitiesPerProduct[product.product.connect.key],
        });
      });
      await create({ data });
    });
  } catch (error) {
    console.error(error);
    return { message: "An internal error occurred", success: false };
  }
  const lng = cookies().get("i18next")?.value ?? "es";
  revalidatePath(`/${lng}/admin/orders`);
  redirect(`/${lng}/admin/orders`);
}

export async function updateDeliveryStatus(
  id: string,
  deliveryStatus: string,
  pathname: string,
  link?: string
) {
  try {
    const order = (await read({
      id,
      isAdminRequest: true,
    })) as IOrder;
    if (deliveryStatus === "CANCELLED") {
      order.products.forEach(async (product) => {
        await updateAvailableQuantityProductByKey({
          key: product.product.key,
          availableQuantity:
            product.product.availableQuantity + product.quantity,
        });
      });
    }

    await update({
      id,
      data: {
        deliveryStatus,
        trackingLink:
          deliveryStatus === "SHIPPED" && link ? link : order.trackingLink,
      },
    });

    if (order.user) {
      const { error } = await resend.emails.send({
        from: `Peques <${process.env.RESEND_EMAIL}>`,
        to: order.user.email,
        subject:
          deliveryStatus === "PENDING"
            ? "Tu pedido está pendiente"
            : deliveryStatus === "SHIPPED"
              ? "Tu pedido ha sido enviado"
              : deliveryStatus === "DELIVERED"
                ? "Tu pedido ha sido entregado"
                : deliveryStatus === "READY_FOR_PICKUP"
                  ? "Tu pedido está listo para ser recogido"
                  : deliveryStatus === "PICKED_UP"
                    ? "Tu pedido ha sido recogido"
                    : "Tu pedido ha sido cancelado",
        react: React.createElement(OrderStatus, {
          order,
          deliveryStatus,
          link,
        }),
      });
      if (error) {
        await prisma.log.create({
          data: {
            type: "ERROR",
            message: `❌ Error sending delivery status email: ${error}`,
            context: JSON.stringify(error),
            user_email: order.user.email,
          },
        });
      }
    }
  } catch (error) {
    console.error(error);
    throw new Error("An internal error occurred");
  }
  revalidatePath(`${pathname}`);
  redirect(`${pathname}`);
}

export async function updateMassiveDeliveryStatus(
  ids: string[],
  deliveryStatus: string,
  links?: string[]
) {
  try {
    if (deliveryStatus === "CANCELLED") {
      for (const id of ids) {
        const order = (await read({
          id,
          isAdminRequest: true,
        })) as IOrder;
        order.products.forEach(async (product) => {
          await updateAvailableQuantityProductByKey({
            key: product.product.key,
            availableQuantity:
              product.product.availableQuantity + product.quantity,
          });
        });
      }
    }

    for (const [i, id] of ids.entries()) {
      const order = (await read({
        id,
        isAdminRequest: true,
      })) as IOrder;

      await update({
        id,
        data: {
          deliveryStatus,
          trackingLink:
            deliveryStatus === "SHIPPED" && links
              ? links[i]
              : order.trackingLink,
        },
      });

      if (order.user) {
        const { error } = await resend.emails.send({
          from: `Peques <${process.env.RESEND_EMAIL}>`,
          to: order.user.email,
          subject:
            deliveryStatus === "PENDING"
              ? "Tu pedido está pendiente"
              : deliveryStatus === "SHIPPED"
                ? "Tu pedido ha sido enviado"
                : deliveryStatus === "DELIVERED"
                  ? "Tu pedido ha sido entregado"
                  : deliveryStatus === "READY_FOR_PICKUP"
                    ? "Tu pedido está listo para ser recogido"
                    : deliveryStatus === "PICKED_UP"
                      ? "Tu pedido ha sido recogido"
                      : "Tu pedido ha sido cancelado",
          react: React.createElement(OrderStatus, {
            order,
            deliveryStatus,
            link: links ? links[i] : undefined,
          }),
        });
        if (error) {
          await prisma.log.create({
            data: {
              type: "ERROR",
              message: `❌ Error sending delivery status email: ${error}`,
              context: JSON.stringify(error),
              user_email: order.user.email,
            },
          });
        }
      }
    }
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
  const lng = cookies().get("i18next")?.value ?? "es";
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

export async function deleteOrder(id: string, pathname: string) {
  try {
    const order = (await read({
      id,
      isAdminRequest: true,
    })) as IOrder;
    if (order.deliveryStatus !== "CANCELLED") {
      order.products.forEach(async (product) => {
        await updateAvailableQuantityProductByKey({
          key: product.product.key,
          availableQuantity:
            product.product.availableQuantity + product.quantity,
        });
      });
    }

    await deleteById({ id });
  } catch (error) {
    console.error(error);
    return { message: "An internal error occurred", success: false };
  }
  revalidatePath(`${pathname}`);
  redirect(`${pathname}`);
}

export async function deleteMassiveOrder(ids: string[]) {
  try {
    for (const id of ids) {
      const order = (await read({
        id,
        isAdminRequest: true,
      })) as IOrder;
      if (order.deliveryStatus !== "CANCELLED") {
        order.products.forEach(async (product) => {
          await updateAvailableQuantityProductByKey({
            key: product.product.key,
            availableQuantity:
              product.product.availableQuantity + product.quantity,
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

export async function getMyOrders({ page, limit }: IOrderSearchParams) {
  try {
    const session = await getSession();
    if (!session) throw new Error("Usuario no autenticado");
    return await read({
      page,
      limit,
      userId: session.userId as string,
    });
  } catch (error) {
    console.error(error);
    return [];
  }
}

export async function getMyOrderById({ id }: { id: string }) {
  try {
    const session = await getSession();
    if (!session) throw new Error("Usuario no autenticado");
    return await read({
      id,
      userId: session.userId as string,
    });
  } catch (error) {
    console.error(error);
    return null;
  }
}

interface ICreateOrderThroughStripWebHook {
  userId: string;
  amount: number;
  addressId: string | null;
  shippingCost: number;
  productsIds: string[];
  discountCodeId: string;
  paymentIntentId: string;
  productsPrices: number[];
  productsQuantities: number[];
  productsFinalPrices: number[];
  stripePaymentMethodId: string;
  paymentMethodFromStripe: string;
  promotionsIds: (string | undefined)[];
  productsCustomRequests: (string | null | undefined)[];
}

export async function createOrderThroughStripeWebHook({
  userId,
  amount,
  addressId,
  productsIds,
  shippingCost,
  promotionsIds,
  productsPrices,
  discountCodeId,
  paymentIntentId,
  productsQuantities,
  productsFinalPrices,
  stripePaymentMethodId,
  productsCustomRequests,
  paymentMethodFromStripe,
}: ICreateOrderThroughStripWebHook) {
  try {
    const user = (await getUserById({ id: userId })) as IUser;

    if (!user) throw new Error("User not found");

    const paymentMethod = (await getPaymentMethodByStripeId({
      isAdminRequest: true,
      stripePaymentMethodId,
    })) as IPaymentMethod;

    if (!paymentMethod) throw new Error("Payment method not found");

    const promotionsIdsForConnection = promotionsIds.filter(
      (promotionId) => promotionId !== undefined
    );

    if (discountCodeId) {
      const discountCodeForValidation = (await getDiscountCodeById(
        discountCodeId
      )) as IDiscountCode;

      if (!discountCodeForValidation) {
        throw new Error("Discount code promotion not found");
      }

      await updateUsagesOfDiscountCode(discountCodeId);

      await createDiscountCodeToUser(userId, discountCodeId);

      promotionsIdsForConnection.push(discountCodeForValidation.promotionId);
    }

    const finalPromotionsIds =
      promotionsIdsForConnection.length > 0
        ? {
            promotions: {
              create: promotionsIdsForConnection.map((promotionId) => ({
                promotion: {
                  connect: {
                    id: promotionId,
                  },
                },
              })),
            },
          }
        : {};

    const subtotal = productsPrices.reduce(
      (acc, price, index) => acc + price * productsQuantities[index],
      0
    );

    const percentagesDiscounts = productsFinalPrices.map(
      (finalPrice, index) => {
        return calculateDiscountPercentage(productsPrices[index], finalPrice);
      }
    );

    let discount = 0;
    if (discountCodeId) {
      discount = calculateDiscountPercentage(
        productsIds.reduce((acc, _, index) => {
          return (
            acc +
            productsPrices[index] *
              productsQuantities[index] *
              (1 - percentagesDiscounts[index] / 100)
          );
        }, 0),
        amount - shippingCost / 100
      );
    }

    return await create({
      data: {
        ...finalPromotionsIds,
        client:
          user.firstName || user.lastName
            ? `${user.firstName} ${user.lastName}`
            : user.username,
        discount,
        subtotal,
        shippingCost: shippingCost / 100,
        total: amount,
        shipmentType: "Compra desde e-commerce", // TODO: CHANGE THIS TO REQUESTED VALUE
        paymentMethod: paymentMethodFromStripe, // THIS IS THE OLD VALUE, NOT THE PAYMENT METHOD ID
        isPaid: true,
        products: {
          create: productsIds.map((productId, index) => ({
            costMXN: productsPrices[index],
            quantity: productsQuantities[index],
            discount: percentagesDiscounts[index],
            customRequest: productsCustomRequests[index],
            product: {
              connect: {
                key: productId,
              },
            },
          })),
        },
        userId,
        paymentId: paymentMethod.id,
        addressId,
        paymentIntentId,
      },
    });
  } catch (error) {
    console.error(error);
    throw new Error("Failed to create order");
  }
}

function calculateDiscountPercentage(price: number, finalPrice: number) {
  if (price <= 0 && finalPrice <= 0) {
    return 0;
  }

  if (price <= 0 && finalPrice !== 0) {
    return 100;
  }

  // if (price <= 0 || finalPrice < 0) {
  //   throw new Error("Los valores de precio deben ser positivos y válidos.");
  // }

  const discount = ((price - finalPrice) / price) * 100;
  return Math.round(discount * 100) / 100; // Redondea a 2 decimales
}
