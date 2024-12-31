"use server";

import { IUserSearchParams } from "@/app/shared/interfaces";
import { read } from "../model";
import { isAdmin } from "@/app/shared/services/auth";

export async function getUsers({ q, wantsNewsletter }: IUserSearchParams) {
  try {
    await isAdmin();

    return await read({
      q,
      wantsNewsletter: wantsNewsletter == "true" ? true : undefined,
      isAdminRequest: true,
    });
  } catch (error) {
    console.error(error);
    throw new Error("Failed to get users");
  }
}

export async function getUserById({ id }: { id: string }) {
  try {
    await isAdmin();

    const user = await read({ id });
    if (!user) {
      return null;
    }
    return user;
  } catch (error) {
    console.error(error);
    throw new Error("Failed to get user");
  }
}

export async function getUserByEmail({ email }: { email: string }) {
  try {
    await isAdmin();

    const user = await read({ email });
    if (!user) {
      return null;
    }
    return user;
  } catch (error) {
    console.error(error);
    throw new Error("Failed to get user");
  }
}
