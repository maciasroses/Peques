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

export async function read({ id, q }: { id?: string; q?: string }) {
  if (id) {
    return await prisma.provider.findUnique({ where: { id } });
  }

  interface Where {
    name?: object;
  }

  const where: Where = {};

  if (q) where.name = { contains: q, mode: "insensitive" };

  return await prisma.provider.findMany({
    where,
    orderBy: { updatedAt: "desc" },
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
