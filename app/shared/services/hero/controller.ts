"use server";

import { cookies } from "next/headers";
import { validateSchema } from "./schema";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { isAdmin } from "@/app/shared/services/auth";
import { deleteFile } from "@/app/shared/services/aws/s3";
import { create, deleteById, read, update } from "./model";
import type { IHero } from "@/app/shared/interfaces";

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

export async function createHero(data: {
  imageKey: string;
  collectionId: string;
  title?: string | null;
  subtitle?: string | null;
  buttonLink?: string | null;
  description?: string | null;
}) {
  try {
    await isAdmin();

    const heroesCount = (await read({})) as IHero[];

    const { imageKey, ...rest } = data;

    await create({
      data: {
        ...rest,
        imageUrl: `https://${process.env.AWS_S3_BUCKET}.s3.${process.env.AWS_REGION}.amazonaws.com/Heroes/${imageKey}`,
        order: heroesCount.length,
      },
    });
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
  data,
}: {
  id: string;
  data: {
    collectionId: string;
    title?: string | null;
    imageKey?: string | null;
    subtitle?: string | null;
    buttonLink?: string | null;
    description?: string | null;
    prevHeroImageUrl?: string | null;
  };
}) {
  try {
    await isAdmin();

    if (data.imageKey && data.prevHeroImageUrl) {
      await update({
        id,
        data: {
          title: data.title,
          subtitle: data.subtitle,
          buttonLink: data.buttonLink,
          description: data.description,
          collectionId: data.collectionId,
          imageUrl: `https://${process.env.AWS_S3_BUCKET}.s3.${process.env.AWS_REGION}.amazonaws.com/Heroes/${data.imageKey}`,
        },
      });
      const urlObj = new URL(data.prevHeroImageUrl);
      await deleteFile(urlObj.pathname.substring(1));
    } else {
      await update({
        id,
        data: {
          title: data.title,
          subtitle: data.subtitle,
          buttonLink: data.buttonLink,
          description: data.description,
          collectionId: data.collectionId,
        },
      });
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
