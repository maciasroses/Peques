"use server";

// import { cookies } from "next/headers";
import { del, put } from "@vercel/blob";
import { validateSchema } from "./schema";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { isAdmin } from "@/app/shared/services/auth";
import { create, deleteById, read, update } from "./model";
import type { IHero } from "@/app/shared/interfaces";

export async function getHeroes() {
  try {
    await isAdmin();
    return await read({});
  } catch (error) {
    console.error(error);
    throw new Error("Failed to get heroes");
  }
}

export async function getHeroById({ id }: { id: string }) {
  try {
    await isAdmin();
    const hero = await read({ id });
    if (!hero) {
      return null;
    }
    return hero;
  } catch (error) {
    console.error(error);
    throw new Error("Failed to get hero");
  }
}

export async function createHero(formData: FormData) {
  const dataToValidate = {
    title: formData.get("title"),
    subtitle: formData.get("subtitle"),
    description: formData.get("description"),
    imageUrl: formData.get("imageUrl"),
    link: formData.get("link"),
  };

  const errors = validateSchema("create", dataToValidate);

  if (Object.keys(errors).length !== 0) {
    return {
      errors,
      success: false,
    };
  }

  try {
    await isAdmin();

    const heroesCount = (await read({})) as IHero[];

    const { imageUrl, ...rest } = dataToValidate;

    const { url } = await put(
      `Heroes/${(imageUrl as File).name.split(".")[0]}-${new Date().getTime()}.webp`,
      imageUrl as File,
      {
        access: "public",
        contentType: "image/webp",
      }
    );

    const finalData = {
      ...rest,
      imageUrl: url,
      order: heroesCount.length,
    };

    await create({ data: finalData });
  } catch (error) {
    console.error(error);
    throw new Error("Failed to create hero");
  }
  // const lng = cookies().get("i18next")?.value ?? "es";
  // revalidatePath(`/${lng}/admin/hero`);
  // redirect(`/${lng}/admin/hero`);
  revalidatePath("/admin/hero");
  redirect("/admin/hero");
}

export async function updateHeroById({
  id,
  formData,
}: {
  id: string;
  formData: FormData;
}) {
  const dataToValidate = {
    title: formData.get("title"),
    subtitle: formData.get("subtitle"),
    description: formData.get("description"),
    imageUrl: formData.get("imageUrl"),
    link: formData.get("link"),
  };

  const errors = validateSchema("update", dataToValidate);

  if (Object.keys(errors).length !== 0) {
    return {
      errors,
      success: false,
    };
  }

  try {
    await isAdmin();

    const prevHero = (await read({ id })) as IHero;

    if (!prevHero) {
      return null;
    }

    const { imageUrl, ...rest } = dataToValidate;

    const { url } = await put(
      `Heroes/${(imageUrl as File).name.split(".")[0]}-${new Date().getTime()}.webp`,
      imageUrl as File,
      {
        access: "public",
        contentType: "image/webp",
      }
    );

    const finalData = {
      ...rest,
      imageUrl: url,
    };

    await update({ id, data: finalData });
    await del(prevHero.imageUrl);
  } catch (error) {
    console.error(error);
    throw new Error("Failed to update hero");
  }
  // const lng = cookies().get("i18next")?.value ?? "es";
  // revalidatePath(`/${lng}/admin/hero`);
  // redirect(`/${lng}/admin/hero`);
  revalidatePath("/admin/hero");
  redirect("/admin/hero");
}

export async function updateHeroesOrder({ heroes }: { heroes: IHero[] }) {
  try {
    await isAdmin();
    for (const hero of heroes) {
      await update({
        id: hero.id,
        data: { order: hero.order },
      });
    }
  } catch (error) {
    console.error(error);
    throw new Error("Failed to update heroes order");
  }
  // const lng = cookies().get("i18next")?.value ?? "es";
  // revalidatePath(`/${lng}/admin/hero`);
  // redirect(`/${lng}/admin/hero`);
  revalidatePath("/admin/hero");
  redirect("/admin/hero");
}

export async function switchHeroVisibility({ id }: { id: string }) {
  try {
    await isAdmin();
    const hero = (await read({ id })) as IHero;
    if (!hero) {
      return null;
    }
    await update({
      id,
      data: { isActive: !hero.isActive },
    });
  } catch (error) {
    console.error(error);
    throw new Error("Failed to switch hero visibility");
  }
  // const lng = cookies().get("i18next")?.value ?? "es";
  // revalidatePath(`/${lng}/admin/hero`);
  // redirect(`/${lng}/admin/hero`);
  revalidatePath("/admin/hero");
  redirect("/admin/hero");
}

export async function deleteHero({ id }: { id: string }) {
  try {
    await isAdmin();
    const hero = (await read({ id })) as IHero;
    if (!hero) {
      return null;
    }
    await deleteById({ id });
    await del(hero.imageUrl);
  } catch (error) {
    console.error(error);
    throw new Error("Failed to delete hero");
  }
  // const lng = cookies().get("i18next")?.value ?? "es";
  // revalidatePath(`/${lng}/admin/hero`);
  // redirect(`/${lng}/admin/hero`);
  revalidatePath("/admin/hero");
  redirect("/admin/hero");
}
