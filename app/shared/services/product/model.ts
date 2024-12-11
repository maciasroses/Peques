"use server";

import prisma from "@/app/shared/services/prisma";

export async function create({
  data,
}: {
  data: (typeof prisma.product.create)["arguments"]["data"];
}) {
  return await prisma.product.create({
    data,
  });
}

export async function createHistory({
  data,
}: {
  data: (typeof prisma.productHistory.create)["arguments"]["data"];
}) {
  return await prisma.productHistory.create({
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
  availableQuantityFrom?: number;
  availableQuantityTo?: number;
  salePriceMXNFrom?: number;
  salePriceMXNTo?: number;
  provider?: string;
}

export async function read({
  id,
  key,
  q,
  availableQuantityFrom,
  availableQuantityTo,
  salePriceMXNFrom,
  salePriceMXNTo,
  provider,
}: SearchParams) {
  if (id) {
    return await prisma.product.findUnique({
      where: { id },
      include: {
        orders: true,
        history: true,
        provider: true,
        _count: { select: { orders: true, history: true } },
      },
    });
  }

  if (key) {
    return await prisma.product.findUnique({
      where: { key },
      include: {
        orders: true,
        history: true,
        provider: true,
        _count: { select: { orders: true, history: true } },
      },
    });
  }

  interface Where {
    OR?: {
      [key: string]: { contains: string; mode: "insensitive" };
    }[];
    availableQuantity?: object;
    salePriceMXN?: object;
    provider?: object;
  }

  const where: Where = {};

  if (q) {
    where.OR = [
      { name: { contains: q, mode: "insensitive" } },
      { key: { contains: q, mode: "insensitive" } },
    ];
  }

  if (availableQuantityFrom || availableQuantityTo)
    where.availableQuantity = {
      gte: availableQuantityFrom,
      lte: availableQuantityTo,
    };

  if (salePriceMXNFrom || salePriceMXNTo)
    where.salePriceMXN = { gte: salePriceMXNFrom, lte: salePriceMXNTo };

  if (provider) where.provider = { alias: provider };

  return await prisma.product.findMany({
    where,
    include: {
      orders: true,
      history: true,
      provider: true,
      _count: { select: { orders: true, history: true } },
    },
    orderBy: { updatedAt: "desc" },
  });
}

export async function readHistory({
  id,
  productId,
}: {
  id?: string;
  productId?: string;
}) {
  if (id) {
    return await prisma.productHistory.findUnique({ where: { id } });
  }

  return await prisma.productHistory.findMany({
    where: { productId },
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

export async function updateHistory({
  id,
  productId,
  data,
}: {
  id: string;
  productId: string;
  data: (typeof prisma.productHistory.update)["arguments"]["data"];
}) {
  return await prisma.productHistory.update({
    where: { id, AND: { productId: productId } },
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

export async function deleteHistoryById({
  id,
  productId,
}: {
  id: string;
  productId: string;
}) {
  return await prisma.productHistory.delete({
    where: { id, AND: { productId } },
  });
}

export async function deleteMassive({ ids }: { ids: string[] }) {
  return await prisma.product.deleteMany({
    where: { id: { in: ids } },
  });
}

export async function deleteHistoryMassive({
  ids,
  productId,
}: {
  ids: string[];
  productId: string;
}) {
  return await prisma.productHistory.deleteMany({
    where: { id: { in: ids }, AND: { productId } },
  });
}
