"use server";

import prisma from "@/app/shared/services/prisma";
import { IProductSearchParams } from "../../interfaces";

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

export async function read({
  q,
  id,
  key,
  page = 1,
  limit = 12,
  allData = false,
  orderBy = { updatedAt: "desc" },
  provider,
  category,
  collection,
  salePriceMXNTo,
  isAdminRequest = false,
  salePriceMXNFrom,
  availableQuantityTo,
  availableQuantityFrom,
}: IProductSearchParams) {
  const globalInclude = {
    files: true,
    reviews: true,
    provider: true,
    orders: isAdminRequest ? true : false,
    history: isAdminRequest ? true : false,
    _count: isAdminRequest
      ? { select: { orders: true, history: true } }
      : undefined,
  };

  if (allData) {
    return await prisma.product.findMany({
      include: globalInclude,
      orderBy: { updatedAt: "desc" },
    });
  }

  if (id) {
    return await prisma.product.findUnique({
      where: { id },
      include: globalInclude,
    });
  }

  if (key) {
    return await prisma.product.findUnique({
      where: { key },
      include: globalInclude,
    });
  }

  interface Where {
    OR?: {
      [key: string]: { contains: string; mode: "insensitive" };
    }[];
    provider?: object;
    category?: object;
    collections?: object;
    salePriceMXN?: object;
    availableQuantity?: object;
  }

  const where: Where = {};

  if (provider) where.provider = { alias: provider };

  if (category) where.category = { alias: category };

  if (salePriceMXNFrom || salePriceMXNTo)
    where.salePriceMXN = { gte: salePriceMXNFrom, lte: salePriceMXNTo };

  if (availableQuantityFrom || availableQuantityTo)
    where.availableQuantity = {
      gte: availableQuantityFrom,
      lte: availableQuantityTo,
    };

  if (collection)
    where.collections = {
      some: {
        collection: {
          name: collection,
        },
      },
    };

  if (q) {
    where.OR = [
      { key: { contains: q, mode: "insensitive" } },
      { name: { contains: q, mode: "insensitive" } },
      { description: { contains: q, mode: "insensitive" } },
    ];
  }

  const take = Number(limit);
  const skip = (Number(page) - 1) * Number(limit);
  const totalCount = await prisma.product.count({ where });
  const totalPages = Math.ceil(totalCount / Number(limit));

  if (isAdminRequest) {
    return await prisma.product.findMany({
      where,
      orderBy,
      include: globalInclude,
    });
  } else {
    const products = await prisma.product.findMany({
      take,
      skip,
      where,
      orderBy,
      include: globalInclude,
    });
    return {
      products,
      totalPages,
    };
  }
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
