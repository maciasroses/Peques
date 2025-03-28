"use server";

import prisma from "@/app/shared/services/prisma";
import type { IOrderSearchParams } from "@/app/shared/interfaces";

export async function create({
  data,
}: {
  data: (typeof prisma.order.create)["arguments"]["data"];
}) {
  return await prisma.order.create({
    data,
    include: {
      products: {
        include: {
          product: true, // Incluye los datos del producto relacionado.
        },
      },
      promotions: {
        include: {
          promotion: {
            include: {
              discountCodes: true, // Incluye los códigos de descuento de la promoción.
            },
          },
        },
      },
      address: true, // Incluye los detalles de la dirección.
      payment: true, // Incluye los detalles del pago.
    },
  });
}

export async function read({
  id,
  isPaid,
  client,
  page = 1,
  limit = 12,
  userId,
  allData = false,
  deliveryStatus,
  paymentMethod,
  discountFrom,
  discountTo,
  subtotalFrom,
  subtotalTo,
  totalFrom,
  totalTo,
  isForGraph,
  orderBy = { createdAt: "desc" },
  yearOfData,
  isAdminRequest = false,
}: IOrderSearchParams) {
  const globalInclude = {
    user: true,
    payment: true,
    address: true,
    products: {
      include: {
        product: {
          include: {
            files: true,
            reviews: true,
          },
        },
      },
    },
    promotions: {
      include: {
        promotion: {
          include: {
            discountCodes: {
              include: {
                users: {
                  include: {
                    user: true,
                  },
                },
              },
            },
          },
        },
      },
    },
  };

  if (allData) {
    return await prisma.order.findMany({
      include: globalInclude,
      orderBy,
    });
  }

  if (id && userId) {
    return await prisma.order.findUnique({
      where: { id, userId },
      include: globalInclude,
    });
  }

  if (id) {
    return await prisma.order.findUnique({
      where: { id },
      include: globalInclude,
    });
  }

  interface Where {
    isPaid?: object;
    client?: object;
    deliveryStatus?: object;
    paymentMethod?: object;
    discount?: object;
    subtotal?: object;
    total?: object;
    createdAt?: object;
  }

  const where: Where = {};

  if (paymentMethod)
    where.paymentMethod = { contains: paymentMethod, mode: "insensitive" };

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
    const startOfYear = new Date(yearOfData as number, 0, 1);
    const endOfYear = new Date((yearOfData as number) + 1, 0, 1);

    where.createdAt = {
      gte: startOfYear,
      lt: endOfYear,
    };
  }

  if (client) where.client = { contains: client, mode: "insensitive" };

  where.isPaid = { equals: isPaid };

  if (isAdminRequest) {
    return await prisma.order.findMany({
      where,
      orderBy,
      include: globalInclude,
    });
  } else {
    const take = Number(limit);
    const skip = (Number(page) - 1) * Number(limit);

    if (userId) {
      const totalCount = await prisma.order.count({
        where: {
          userId,
        },
      });
      const totalPages = Math.ceil(totalCount / Number(limit));

      const orders = await prisma.order.findMany({
        where: {
          userId,
        },
        orderBy,
        include: globalInclude,
        take,
        skip,
      });
      return {
        orders,
        totalPages,
      };
    }
  }
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
