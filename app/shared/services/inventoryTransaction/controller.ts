"use server";

import { create } from "./model";

interface ICreateInventoryTransaction {
  orderId: string;
  quantity: number;
  productId: string;
  description: string;
}

export async function createInventoryTransactionThroughStripeWebHook({
  orderId,
  quantity,
  productId,
  description,
}: ICreateInventoryTransaction) {
  try {
    return await create({
      data: {
        orderId,
        quantity,
        productId,
        description,
        type: "SALE",
      },
    });
  } catch (error) {
    console.error(error);
    throw new Error("Failed to create inventory transaction");
  }
}
