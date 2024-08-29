"use server";

import { validateSchema } from "./schema";
import { redirect, RedirectType } from "next/navigation";
import { revalidatePath } from "next/cache";
import { create, read, update, deleteById, deleteMassive } from "./model";

export async function getProviders({ q }: { q?: string }) {
  try {
    // await new Promise((resolve) => setTimeout(resolve, 10000));
    return await read({ q });
  } catch (error) {
    console.error(error);
    throw new Error("An internal error occurred");
  }
}

export async function createProvider(formData: FormData) {
  const data = {
    name: formData.get("name"),
  };

  const errors = validateSchema("create", data);

  if (Object.keys(errors).length !== 0)
    return {
      errors,
      success: false,
    };

  try {
    await create({ data });
  } catch (error) {
    console.error(error);
    // throw new Error("An internal error occurred");
    return { message: "An internal error occurred", success: false };
  }
  revalidatePath("/admin/providers");
  redirect("/admin/providers");
}

export async function updateProvider(formData: FormData, providerId: string) {
  const data = {
    name: formData.get("name"),
  };

  const errors = validateSchema("update", data);

  if (Object.keys(errors).length !== 0)
    return {
      errors,
      success: false,
    };

  try {
    await update({ id: providerId, data });
  } catch (error) {
    console.error(error);
    // throw new Error("An internal error occurred");
    return { message: "An internal error occurred", success: false };
  }
  revalidatePath("/admin/providers");
  redirect("/admin/providers");
}

export async function deleteProvider(providerId: string) {
  try {
    await deleteById({ id: providerId });
  } catch (error) {
    console.error(error);
    // throw new Error("An internal error occurred");
    return { message: "An internal error occurred", success: false };
  }
  revalidatePath("/admin/providers");
  redirect("/admin/providers");
}

export async function deleteMassiveProviders(ids: string[]) {
  try {
    await deleteMassive({ ids });
  } catch (error) {
    console.error(error);
    // throw new Error("An internal error occurred");
    return { message: "An internal error occurred", success: false };
  }
  // revalidatePath("/admin/providers");
  // redirect("/admin/providers");
}
