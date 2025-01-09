"use server";

import { getSession } from "@/app/shared/services/auth";
import { getProductByKey } from "@/app/shared/services/product/controller";
import {
  readCart,
  createCart,
  deleteCart,
  createCartItem,
  deleteCartItem,
  updateCartItem,
} from "../model";
import type { ICartItemForFrontend, IProduct } from "@/app/shared/interfaces";

export async function getMyCart() {
  try {
    const session = await getSession();
    if (!session) throw new Error("Usuario no autenticado");
    return await readCart({
      userId: session.userId as string,
    });
  } catch (error) {
    console.error(error);
    return null;
  }
}

export async function createMyNewCart() {
  try {
    const session = await getSession();
    if (!session) throw new Error("Usuario no autenticado");
    return await createCart({
      data: {
        userId: session.userId as string,
      },
    });
  } catch (error) {
    console.error(error);
    return null;
  }
}

export async function addToMyCart(item: ICartItemForFrontend) {
  try {
    const session = await getSession();
    if (!session) throw new Error("Usuario no autenticado");

    const cart = await getMyCart();
    if (!cart) throw new Error("Carrito no encontrado");

    const productItem = (await getProductByKey({ key: item.id })) as IProduct;
    if (!productItem) throw new Error("Producto no encontrado");

    const existingItem = cart.items.find(
      (cartItem) => cartItem.product.key === item.id
    );

    const totalQuantity =
      (existingItem ? existingItem.quantity : 0) + item.quantity;

    if (existingItem) {
      await updateCartItem({
        where: { id: existingItem.id },
        data: { quantity: totalQuantity },
      });
    } else {
      await createCartItem({
        data: {
          cart: { connect: { id: cart.id } },
          product: { connect: { id: productItem.id } },
          quantity: item.quantity,
          priceInCents: item.price * 100, // Convert to cents
        },
      });
    }
  } catch (error) {
    console.error("Error al agregar al carrito:", error);
    return null;
  }
}

export async function deleteFromMyCart(itemId: string) {
  try {
    const session = await getSession();
    if (!session) throw new Error("Usuario no autenticado");

    const cart = await getMyCart();
    if (!cart) throw new Error("Carrito no encontrado");

    const productItem = (await getProductByKey({ key: itemId })) as IProduct;
    if (!productItem) throw new Error("Producto no encontrado");

    await deleteCartItem({
      where: {
        productId_cartId: {
          productId: productItem.id,
          cartId: cart.id,
        },
      },
    });
  } catch (error) {
    console.error("Error al eliminar del carrito:", error);
    return null;
  }
}

export async function clearMyCart() {
  try {
    const session = await getSession();
    if (!session) throw new Error("Usuario no autenticado");

    await deleteCart({
      where: { userId: session.userId as string },
    });
  } catch (error) {
    console.error("Error al limpiar el carrito:", error);
    return null;
  }
}

export async function mergeCarts(localCart: ICartItemForFrontend[]) {
  try {
    const session = await getSession();
    if (!session) throw new Error("Usuario no autenticado");

    const remoteCart = await getMyCart();
    if (!remoteCart) throw new Error("Carrito remoto no encontrado");

    for (const localItem of localCart) {
      const product = (await getProductByKey({
        key: localItem.id,
      })) as IProduct;
      if (!product)
        throw new Error(`Producto con key ${localItem.id} no encontrado`);

      const remoteItem = remoteCart.items.find(
        (remoteCartItem) => remoteCartItem.product.key === localItem.id
      );

      const totalQuantity =
        (remoteItem ? remoteItem.quantity : 0) + localItem.quantity;

      if (remoteItem) {
        await updateCartItem({
          where: { id: remoteItem.id },
          data: { quantity: totalQuantity },
        });
      } else {
        await createCartItem({
          data: {
            cart: { connect: { id: remoteCart.id } },
            product: { connect: { id: product.id } },
            quantity: localItem.quantity,
            priceInCents: product.salePriceMXN * 100, // Convert to cents
          },
        });
      }
    }
  } catch (error) {
    console.error("Error al fusionar el carrito:", error);
    return null;
  }
}
