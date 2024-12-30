"use server";

import { validateSchema } from "./schema";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { create, read, update, deleteById, deleteMassive } from "./model";
import { cookies } from "next/headers";

export async function getProviders({ q }: { q?: string }) {
  try {
    return await read({ q });
  } catch (error) {
    console.error(error);
    throw new Error("An internal error occurred");
  }
}

export async function createProvider(formData: FormData) {
  const data = {
    name: formData.get("name"),
    alias: formData.get("alias"),
  };

  const errors = validateSchema("create", data);

  if (Object.keys(errors).length !== 0)
    return {
      errors,
      success: false,
    };

  try {
    const provider = await read({ alias: data.alias as string });

    if (provider) {
      return {
        errors: { alias: "Este alias ya existe." },
        success: false,
      };
    }

    await create({ data });
  } catch (error) {
    console.error(error);
    // throw new Error("An internal error occurred");
    return { message: "An internal error occurred", success: false };
  }
  const lng = cookies().get("i18next")?.value ?? "es";
  revalidatePath(`/${lng}/admin/providers`);
  redirect(`/${lng}/admin/providers`);
}

export async function updateProvider(formData: FormData, providerId: string) {
  const data = {
    name: formData.get("name"),
    alias: formData.get("alias"),
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
  const lng = cookies().get("i18next")?.value ?? "es";
  revalidatePath(`/${lng}/admin/providers`);
  redirect(`/${lng}/admin/providers`);
}

export async function deleteProvider(providerId: string) {
  try {
    await deleteById({ id: providerId });
  } catch (error) {
    console.error(error);
    // throw new Error("An internal error occurred");
    return { message: "An internal error occurred", success: false };
  }
  const lng = cookies().get("i18next")?.value ?? "es";
  revalidatePath(`/${lng}/admin/providers`);
  redirect(`/${lng}/admin/providers`);
}

export async function deleteMassiveProviders(ids: string[]) {
  try {
    await deleteMassive({ ids });
  } catch (error) {
    console.error(error);
    return { message: "An internal error occurred", success: false };
  }
}
