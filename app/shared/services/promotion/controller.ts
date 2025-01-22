"use server";

import { read } from "./model";

export async function getPromotionById({ id }: { id: string }) {
  try {
    return await read({
      id,
    });
  } catch (error) {
    console.error(error);
    throw new Error("Failed to get discount code");
  }
}
