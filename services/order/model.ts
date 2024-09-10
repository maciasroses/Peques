"use server";

import prisma from "@/services/prisma";

export async function create({
  data,
}: {
  data: (typeof prisma.order.create)["arguments"]["data"];
}) {
  return await prisma.order.create({
    data,
  });
}

// export async function createMassive({
//   data,
// }: {
//   data: (typeof prisma.order.createMany)["arguments"]["data"];
// }) {
//   return await prisma.order.createMany({
//     data,
//   });
// }

interface ISearchParams {
  id?: string;
  isPaid?: boolean;
  client?: string;
  deliveryStatus?: string;
  discountFrom?: number;
  discountTo?: number;
  subtotalFrom?: number;
  subtotalTo?: number;
  totalFrom?: number;
  totalTo?: number;
  isForGraph?: boolean;
  orderBy?: object;
  yearOfData?: number;
}

export async function read({
  id,
  isPaid,
  client,
  deliveryStatus,
  discountFrom,
  discountTo,
  subtotalFrom,
  subtotalTo,
  totalFrom,
  totalTo,
  isForGraph,
  orderBy,
  yearOfData,
}: ISearchParams) {
  if (id) {
    return await prisma.order.findUnique({
      where: { id },
      include: {
        products: { include: { product: true } },
      },
    });
  }

  interface Where {
    isPaid?: object;
    client?: object;
    deliveryStatus?: object;
    discount?: object;
    subtotal?: object;
    total?: object;
    createdAt?: object;
  }

  const where: Where = {};

  if (discountFrom || discountTo) {
    where.discount = { gte: discountFrom, lte: discountTo };
  }

  if (subtotalFrom || subtotalTo) {
    where.subtotal = { gte: subtotalFrom, lte: subtotalTo };
  }

  if (totalFrom || totalTo) {
    where.total = { gte: totalFrom, lte: totalTo };
  }

  if (deliveryStatus) where.deliveryStatus = { equals: deliveryStatus };

  if (isForGraph) where.deliveryStatus = { not: "CANCELLED" };

  if (yearOfData) {
    const startOfYear = new Date(
      yearOfData > 2000 && yearOfData < 3000
        ? yearOfData
        : new Date().getFullYear(),
      0,
      1
    );
    const endOfYear = new Date(
      yearOfData > 2000 && yearOfData < 3000
        ? yearOfData + 1
        : new Date().getFullYear() + 1,
      0,
      1
    );

    where.createdAt = {
      gte: startOfYear,
      lt: endOfYear,
    };
  }

  if (client) where.client = { contains: client, mode: "insensitive" };

  where.isPaid = { equals: isPaid };

  return await prisma.order.findMany({
    where,
    include: { products: { include: { product: { select: { name: true } } } } },
    orderBy,
  });
}

export async function update({
  id,
  data,
}: {
  id: string;
  data: (typeof prisma.order.update)["arguments"]["data"];
}) {
  return await prisma.order.update({
    where: { id },
    data,
  });
}

export async function updateMassive({
  ids,
  data,
}: {
  ids: string[];
  data: (typeof prisma.order.updateMany)["arguments"]["data"];
}) {
  return await prisma.order.updateMany({
    where: { id: { in: ids } },
    data,
  });
}

export async function deleteById({ id }: { id: string }) {
  return await prisma.order.delete({
    where: { id },
  });
}

export async function deleteMassive(ids: string[]) {
  return await prisma.order.deleteMany({
    where: { id: { in: ids } },
  });
}
