"use server";

import prisma from "@/app/shared/services/prisma";
import { getMe } from "@/app/shared/services/user/controller";
import formatCurrency from "@/app/shared/utils/format-currency";
import {
  readStockReservation,
  createStockReservation,
  deleteStockReservation,
  updateStockReservation,
} from "./model";
import {
  getProductById,
  getProductByKey,
  updateAvailableQuantityProductById,
} from "@/app/shared/services/product/controller";
import type {
  IUser,
  IProduct,
  IPromotion,
  ICartItemForFrontend,
  IStockReservation,
} from "@/app/shared/interfaces";
import { COMFORT_SET, SET_IDEAL, SET_INTEGRAL } from "../../constants";

const matchesSet = (
  setKeys: string[],
  products: string[],
  productsQuantity: string[]
) => {
  const productCounts: Record<string, number> = {};

  setKeys.forEach((key) => {
    products.forEach((product, index) => {
      if (product.startsWith(key.toLowerCase())) {
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
    if (productKey.startsWith(key.toLowerCase())) {
      return set[key];
    }
  }
  return discount;
};

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

export async function checkNUpdateStock(cart: ICartItemForFrontend[]) {
  try {
    const updateCart: ICartItemForFrontend[] = [];
    const expiredReservations = (await readStockReservation({
      expired: true,
    })) as IStockReservation[];

    for (const reservation of expiredReservations) {
      await deleteStockReservation(reservation.id);

      const { availableQuantity } = (await getProductById({
        id: reservation.productId,
      })) as IProduct;

      await updateAvailableQuantityProductById({
        id: reservation.productId,
        availableQuantity: availableQuantity + reservation.quantity,
      });
    }

    const me = (await getMe()) as IUser;
    if (!me) {
      throw new Error("Failed to get user");
    }

    for (const item of cart) {
      const product = (await getProductByKey({ key: item.id })) as IProduct;

      const reservation = (await readStockReservation({
        userId: me.id,
        productId: product.id,
      })) as IStockReservation;

      if (!product || (product.availableQuantity === 0 && !reservation)) {
        continue;
      }

      const totalAvailable =
        product.availableQuantity + (reservation?.quantity || 0);

      let updatedItem = { ...item };

      // Actualiza la cantidad en el carrito si hay cambios en el stock
      if (totalAvailable < item.quantity) {
        updatedItem.quantity = totalAvailable;
      }

      // Verifica la promoción asociada al producto
      if (item.promotionId) {
        const promotion = await prisma.promotion.findUnique({
          where: {
            id: item.promotionId,
          },
        });

        if (!promotion) {
          updatedItem = {
            ...updatedItem,
            discount: null,
            promotionId: null,
            finalPrice: item.price,
          };
        } else {
          const currentDate = new Date();
          const isPromotionValid =
            promotion &&
            promotion.isActive &&
            new Date(promotion.startDate) <= currentDate &&
            new Date(promotion.endDate) >= currentDate;

          if (!isPromotionValid) {
            updatedItem = {
              ...updatedItem,
              discount: null,
              promotionId: null,
              finalPrice: item.price,
            };
          }
        }
      } else {
        const applicablePromotions = [
          ...product.promotions
            .map((promotion) => promotion.promotion)
            .filter(
              (promo) =>
                promo.isActive &&
                new Date(promo.startDate) <= new Date() &&
                new Date(promo.endDate) >= new Date()
            ),
          ...product.collections.flatMap((collection) =>
            collection.collection.promotions
              .map((promotion) => promotion.promotion)
              .filter(
                (promo) =>
                  promo.isActive &&
                  new Date(promo.startDate) <= new Date() &&
                  new Date(promo.endDate) >= new Date()
              )
          ),
        ];

        // Selecciona la mejor promoción basada en el descuento total
        const selectedPromotion =
          applicablePromotions.reduce<IPromotion | null>((bestPromo, promo) => {
            const calculateEffectiveDiscount = (promotion: IPromotion) => {
              if (promotion.discountType === "PERCENTAGE") {
                return (promotion.discountValue / 100) * product.salePriceMXN;
              }
              if (promotion.discountType === "FIXED") {
                return promotion.discountValue;
              }
              return 0; // No discount
            };

            const currentDiscount = calculateEffectiveDiscount(promo);
            const bestDiscount = bestPromo
              ? calculateEffectiveDiscount(bestPromo)
              : 0;

            if (!bestPromo || currentDiscount > bestDiscount) {
              return promo;
            }

            return bestPromo;
          }, null);

        // Calculate the price with discount (if applicable)
        const discountedPrice = selectedPromotion
          ? product.salePriceMXN -
            (selectedPromotion.discountType === "PERCENTAGE"
              ? (selectedPromotion.discountValue / 100) * product.salePriceMXN
              : selectedPromotion.discountValue <= 0
                ? 0
                : selectedPromotion.discountValue)
          : product.salePriceMXN;

        const discountDescription = selectedPromotion
          ? selectedPromotion.discountType === "PERCENTAGE"
            ? `${selectedPromotion.discountValue}% de descuento`
            : `Descuento de ${formatCurrency(selectedPromotion.discountValue, "MXN")}`
          : null;

        updatedItem = {
          ...updatedItem,
          discount: discountDescription,
          promotionId: selectedPromotion?.id || null,
          finalPrice: discountedPrice,
        };
      }

      let discount = calculateDiscountPercentage(item.price, item.finalPrice);

      if (
        matchesSet(
          Object.keys(SET_IDEAL),
          cart.map((product) => product.id),
          cart.map((product) => product.quantity.toString())
        )
      ) {
        const discountApplied = applyDiscounts(
          discount,
          updatedItem.id,
          SET_IDEAL
        );
        updatedItem = {
          ...updatedItem,
          finalPrice:
            updatedItem.price - (updatedItem.price * discountApplied) / 100,
        };
        updatedItem.discount =
          updatedItem.finalPrice === updatedItem.price
            ? null
            : "Descuento de Set Ideal";
      } else if (
        matchesSet(
          Object.keys(SET_INTEGRAL),
          cart.map((product) => product.id),
          cart.map((product) => product.quantity.toString())
        )
      ) {
        const discountApplied = applyDiscounts(
          discount,
          updatedItem.id,
          SET_INTEGRAL
        );
        updatedItem = {
          ...updatedItem,
          finalPrice:
            updatedItem.price - (updatedItem.price * discountApplied) / 100,
        };
        updatedItem.discount =
          updatedItem.finalPrice === updatedItem.price
            ? null
            : "Descuento de Set Integral";
      } else if (
        matchesSet(
          Object.keys(COMFORT_SET),
          cart.map((product) => product.id),
          cart.map((product) => product.quantity.toString())
        )
      ) {
        const discountApplied = applyDiscounts(
          discount,
          updatedItem.id,
          COMFORT_SET
        );
        updatedItem = {
          ...updatedItem,
          finalPrice:
            updatedItem.price - (updatedItem.price * discountApplied) / 100,
        };
        updatedItem.discount =
          updatedItem.finalPrice === updatedItem.price
            ? null
            : "Descuento de Set Comfort";
      } else {
        updatedItem = {
          ...updatedItem,
          discount: null,
          finalPrice: updatedItem.price,
        };
      }

      updateCart.push(updatedItem);
    }
    return updateCart;
  } catch (error) {
    console.error(error);
    throw new Error("Failed to check and update stock");
  }
}

export async function reserverStock(cart: ICartItemForFrontend[]) {
  try {
    const me = (await getMe()) as IUser;
    if (!me) {
      throw new Error("Failed to get user");
    }

    const reservations = await prisma.$transaction(async () => {
      const stockReservations = [];

      for (const item of cart) {
        const { id } = (await getProductByKey({ key: item.id })) as IProduct;

        const existingReservation = (await readStockReservation({
          userId: me.id,
          productId: id,
        })) as IStockReservation;

        if (existingReservation) {
          const updatedReservation = await updateStockReservation({
            id: existingReservation.id,
            data: {
              quantity: item.quantity,
              expiresAt: new Date(Date.now() + 1000 * 60 * 15),
            },
          });

          const { availableQuantity } = (await getProductById({
            id,
          })) as IProduct;

          await updateAvailableQuantityProductById({
            id,
            availableQuantity:
              availableQuantity -
              (item.quantity - existingReservation.quantity),
          });

          stockReservations.push(updatedReservation);
        } else {
          const reservation = await createStockReservation({
            userId: me.id,
            productId: id,
            quantity: item.quantity,
          });

          const { availableQuantity } = (await getProductById({
            id,
          })) as IProduct;

          await updateAvailableQuantityProductById({
            id,
            availableQuantity: availableQuantity - item.quantity,
          });

          stockReservations.push(reservation);
        }
      }
      return stockReservations;
    });
    return reservations;
  } catch (error) {
    console.error(error);
    throw new Error("Failed to reserve stock");
  }
}

export async function getStockReservationByUserIdNProductId({
  userId,
  productId,
}: {
  userId: string;
  productId: string;
}) {
  try {
    return await readStockReservation({
      userId,
      productId,
      isForSripeWebHook: true,
    });
  } catch (error) {
    console.error(error);
    throw new Error("Failed to get stock reservation by user and product id");
  }
}

export async function deleteStockReservationById(id: string) {
  try {
    return await deleteStockReservation(id);
  } catch (error) {
    console.error(error);
    throw new Error("Failed to delete stock reservation by id");
  }
}
