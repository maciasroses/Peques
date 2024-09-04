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
  isPaid: boolean;
  client?: string;
  deliveryStatus?: string;
}

export async function read({
  id,
  isPaid,
  client,
  deliveryStatus,
}: ISearchParams) {
  if (id) {
    return await prisma.order.findUnique({ where: { id } });
  }

  interface Where {
    isPaid?: object;
    client?: object;
    deliveryStatus?: object;
  }

  const where: Where = {};

  if (deliveryStatus) where.deliveryStatus = { equals: deliveryStatus };

  if (client) where.client = { contains: client, mode: "insensitive" };

  where.isPaid = { equals: isPaid };

  return await prisma.order.findMany({
    where,
    include: { products: { include: { product: { select: { name: true } } } } },
    orderBy: { updatedAt: "desc" },
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
