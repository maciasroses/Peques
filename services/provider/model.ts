"use server";

import prisma from "@/services/prisma";

export async function create({
  data,
}: {
  data: (typeof prisma.provider.create)["arguments"]["data"];
}) {
  return await prisma.provider.create({
    data,
  });
}

interface IRead {
  id?: string;
  alias?: string;
  q?: string;
}

export async function read({ id, alias, q }: IRead) {
  if (id) return await prisma.provider.findUnique({ where: { id } });

  if (alias) return await prisma.provider.findUnique({ where: { alias } });

  interface Where {
    OR?: {
      [key: string]: { contains: string; mode: "insensitive" };
    }[];
  }

  const where: Where = {};

  if (q) {
    where.OR = [
      { name: { contains: q, mode: "insensitive" } },
      { alias: { contains: q, mode: "insensitive" } },
    ];
  }

  return await prisma.provider.findMany({
    where,
    orderBy: { updatedAt: "desc" },
    include: { _count: { select: { products: true } } },
  });
}

export async function update({
  id,
  data,
}: {
  id: string;
  data: (typeof prisma.provider.update)["arguments"]["data"];
}) {
  return await prisma.provider.update({ where: { id }, data });
}

export async function deleteById({ id }: { id: string }) {
  return await prisma.provider.delete({ where: { id } });
}

export async function deleteMassive({ ids }: { ids: string[] }) {
  return await prisma.provider.deleteMany({ where: { id: { in: ids } } });
}
