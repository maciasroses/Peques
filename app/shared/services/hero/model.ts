"use server";

import prisma from "@/app/shared/services/prisma";

export async function create({
  data,
}: {
  data: (typeof prisma.hero.create)["arguments"]["data"];
}) {
  return await prisma.hero.create({
    data,
  });
}

interface IHeroRead {
  id?: string;
  orderBy?: object;
  isAdminRequest?: boolean;
}

export async function read({
  id,
  orderBy = { order: "asc" },
  isAdminRequest = false,
}: IHeroRead) {
  const globalInclude = {
    collection: true,
  };

  if (id) {
    return await prisma.hero.findUnique({
      where: { id },
      include: globalInclude,
    });
  }

  return await prisma.hero.findMany({
    orderBy,
    where: {
      isActive: isAdminRequest ? undefined : true,
    },
    include: globalInclude,
  });
}

export async function update({
  id,
  data,
}: {
  id: string;
  data: (typeof prisma.hero.update)["arguments"]["data"];
}) {
  return await prisma.hero.update({
    data,
    where: { id },
  });
}

export async function deleteById({ id }: IHeroRead) {
  return await prisma.hero.delete({
    where: { id },
  });
}
