"use server";

import { cookies } from "next/headers";
import { validateSchema } from "./schema";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { isAdmin } from "@/app/shared/services/auth";
import { create, deleteById, read, update } from "./model";
import { deleteFile, uploadFile } from "@/app/shared/services/aws/s3";
import type { IHero } from "@/app/shared/interfaces";
import { generateFileKey } from "../../utils/generateFileKey";

export async function getHeroes({
  isAdminRequest,
}: {
  isAdminRequest?: boolean;
}) {
  try {
    return await read({ isAdminRequest });
  } catch (error) {
    console.error(error);
    throw new Error("Failed to get heroes");
  }
}

export async function getHeroById({ id }: { id: string }) {
  try {
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
    imageUrl: formData.get("imageUrl"),
    buttonLink: formData.get("buttonLink"),
    description: formData.get("description"),
    collectionId: formData.get("collectionId"),
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

    const fileKey = generateFileKey(imageUrl as File);
    const url = await uploadFile({
      file: imageUrl as File,
      fileKey: `Heroes/${fileKey}`,
    });

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
  const lng = cookies().get("i18next")?.value ?? "es";
  revalidatePath(`/${lng}/admin/hero`);
  redirect(`/${lng}/admin/hero`);
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
    imageUrl: formData.get("imageUrl"),
    subtitle: formData.get("subtitle"),
    buttonLink: formData.get("buttonLink"),
    description: formData.get("description"),
    collectionId: formData.get("collectionId"),
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
      throw new Error("Hero not found");
    }

    if ((dataToValidate.imageUrl as File).size > 0) {
      const { imageUrl, ...rest } = dataToValidate;

      const fileKey = generateFileKey(imageUrl as File);
      const url = await uploadFile({
        file: imageUrl as File,
        fileKey: `Heroes/${fileKey}`,
      });

      const finalData = {
        ...rest,
        imageUrl: url,
      };

      await update({ id, data: finalData });

      const urlObj = new URL(prevHero.imageUrl);
      await deleteFile(urlObj.pathname.substring(1));
    } else {
      const { imageUrl, ...rest } = dataToValidate;

      const finalData = {
        ...rest,
        imageUrl: prevHero.imageUrl,
      };

      await update({ id, data: finalData });
    }
  } catch (error) {
    console.error(error);
    throw new Error("Failed to update hero");
  }
  const lng = cookies().get("i18next")?.value ?? "es";
  revalidatePath(`/${lng}/admin/hero`);
  redirect(`/${lng}/admin/hero`);
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
  const lng = cookies().get("i18next")?.value ?? "es";
  revalidatePath(`/${lng}/admin/hero`);
  redirect(`/${lng}/admin/hero`);
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
  const lng = cookies().get("i18next")?.value ?? "es";
  revalidatePath(`/${lng}/admin/hero`);
  redirect(`/${lng}/admin/hero`);
}

export async function deleteHero({ id }: { id: string }) {
  try {
    await isAdmin();
    const hero = (await read({ id })) as IHero;
    if (!hero) {
      return null;
    }
    await deleteById({ id });

    const urlObj = new URL(hero.imageUrl);
    await deleteFile(urlObj.pathname.substring(1));
  } catch (error) {
    console.error(error);
    throw new Error("Failed to delete hero");
  }
  const lng = cookies().get("i18next")?.value ?? "es";
  revalidatePath(`/${lng}/admin/hero`);
  redirect(`/${lng}/admin/hero`);
}
