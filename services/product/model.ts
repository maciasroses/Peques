"use server";

import prisma from "@/services/prisma";

export async function create({
  data,
}: {
  data: (typeof prisma.product.create)["arguments"]["data"];
}) {
  return await prisma.product.create({
    data,
  });
}

export async function createMassive({
  data,
}: {
  data: (typeof prisma.product.createMany)["arguments"]["data"];
}) {
  return await prisma.product.createMany({
    data,
  });
}

interface SearchParams {
  id?: string;
  key?: string;
  q?: string;
  quantityPerCartonFrom?: number;
  quantityPerCartonTo?: number;
  orderDateFrom?: Date;
  orderDateTo?: Date;
}

export async function read({
  id,
  key,
  q,
  quantityPerCartonFrom,
  quantityPerCartonTo,
  orderDateFrom,
  orderDateTo,
}: SearchParams) {
  if (id) {
    return await prisma.product.findUnique({ where: { id } });
  }

  if (key) {
    return await prisma.product.findUnique({ where: { key } });
  }

  interface Where {
    name?: object;
    quantityPerCarton?: object;
    orderDate?: object;
  }

  const where: Where = {};

  if (q) where.name = { contains: q, mode: "insensitive" };

  if (quantityPerCartonFrom || quantityPerCartonTo)
    where.quantityPerCarton = {
      gte: quantityPerCartonFrom,
      lte: quantityPerCartonTo,
    };

  if (orderDateFrom || orderDateTo)
    where.orderDate = { gte: orderDateFrom, lte: orderDateTo };

  return await prisma.product.findMany({
    where,
    include: { provider: true, _count: { select: { orders: true } } },
    orderBy: { updatedAt: "desc" },
  });
}

export async function update({
  id,
  key,
  data,
}: {
  id?: string;
  key?: string;
  data: (typeof prisma.product.update)["arguments"]["data"];
}) {
  return await prisma.product.update({
    where: {
      id: id || undefined,
      key: key || undefined,
    },
    data,
  });
}

export async function updateMassive({
  ids,
  data,
}: {
  ids: string[];
  data: (typeof prisma.product.updateMany)["arguments"]["data"];
}) {
  return await prisma.product.updateMany({
    where: { id: { in: ids } },
    data,
  });
}

export async function deleteById({ id }: { id: string }) {
  return await prisma.product.delete({
    where: { id },
  });
}

export async function deleteMassive({ ids }: { ids: string[] }) {
  return await prisma.product.deleteMany({
    where: { id: { in: ids } },
  });
}
