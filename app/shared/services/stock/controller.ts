"use server";

import prisma from "@/app/shared/services/prisma";
import { getMe } from "@/app/shared/services/user/controller";
import {
  read as readProduct,
  update as updateProduct,
} from "@/app/shared/services/product/model";
import {
  readStockReservation,
  createStockReservation,
  deleteStockReservation,
  updateStockReservation,
} from "./model";
import type {
  IUser,
  IProduct,
  ICartItemForFrontend,
  IStockReservation,
} from "@/app/shared/interfaces";

export async function checkNUpdateStock(cart: ICartItemForFrontend[]) {
  try {
    const updateCart: ICartItemForFrontend[] = [];
    const expiredReservations = (await readStockReservation({
      expired: true,
    })) as IStockReservation[];

    for (const reservation of expiredReservations) {
      await deleteStockReservation(reservation.id);
      await updateProduct({
        id: reservation.productId,
        data: {
          availableQuantity: {
            increment: reservation.quantity,
          },
        },
      });
    }

    const me = (await getMe()) as IUser;
    if (!me) {
      throw new Error("Failed to get user");
    }

    for (const item of cart) {
      const product = (await readProduct({ key: item.id })) as IProduct;

      const reservation = (await readStockReservation({
        userId: me.id,
        productId: product.id,
      })) as IStockReservation;

      if (!product || (product.availableQuantity === 0 && !reservation)) {
        continue;
      }

      const totalAvailable =
        product.availableQuantity + (reservation?.quantity || 0);

      if (totalAvailable < item.quantity) {
        updateCart.push({ ...item, quantity: totalAvailable });
      } else {
        updateCart.push(item);
      }
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
        const { id } = (await readProduct({ key: item.id })) as IProduct;

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

          await updateProduct({
            id,
            data: {
              availableQuantity: {
                decrement: item.quantity - existingReservation.quantity,
              },
            },
          });

          stockReservations.push(updatedReservation);
        } else {
          const reservation = await createStockReservation({
            userId: me.id,
            productId: id,
            quantity: item.quantity,
          });

          await updateProduct({
            id,
            data: {
              availableQuantity: {
                decrement: item.quantity,
              },
            },
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
