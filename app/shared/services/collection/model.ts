"use server";

import prisma from "@/app/shared/services/prisma";
import type { ICollectionSearchParams } from "@/app/shared/interfaces";

export async function create({
  data,
}: {
  data: (typeof prisma.collection.create)["arguments"]["data"];
}) {
  return await prisma.collection.create({
    data,
  });
}

export async function read({
  q,
  id,
  name,
  link,
  allData = false,
  orderBy = { createdAt: "desc" },
  isAdminRequest = false,
}: ICollectionSearchParams) {
  const globalInclude = {
    hero: {
      where: {
        isActive: isAdminRequest ? undefined : true,
      },
    },
    products: {
      include: {
        product: {
          include: {
            provider: isAdminRequest ? true : false,
          },
        },
      },
    },
  };

  if (allData) {
    return await prisma.collection.findMany({
      orderBy,
      where: {
        OR: isAdminRequest
          ? undefined
          : [{ hero: { isActive: true } }, { hero: null }],
      },
      include: globalInclude,
    });
  }

  if (id) {
    return await prisma.collection.findUnique({
      where: { id },
      include: globalInclude,
    });
  }

  if (name) {
    return await prisma.collection.findUnique({
      where: { name },
      include: globalInclude,
    });
  }

  if (link) {
    return await prisma.collection.findUnique({
      where: { link },
      include: globalInclude,
    });
  }

  interface Where {
    OR?: {
      [key: string]: { contains: string; mode: "insensitive" };
    }[];
  }

  const where: Where = {};

  if (q) {
    where.OR = [
      { name: { contains: q, mode: "insensitive" } },
      { link: { contains: q, mode: "insensitive" } },
    ];
  }

  return await prisma.collection.findMany({
    where,
    orderBy,
    include: globalInclude,
  });
}

export async function update({
  id,
  data,
}: {
  id: string;
  data: (typeof prisma.collection.update)["arguments"]["data"];
}) {
  return await prisma.collection.update({
    data,
    where: { id },
  });
}

export async function deleteById({ id }: { id: string }) {
  return await prisma.collection.delete({
    where: { id },
  });
}

export async function deleteMassive({ ids }: { ids: string[] }) {
  return await prisma.collection.deleteMany({
    where: { id: { in: ids } },
  });
}
