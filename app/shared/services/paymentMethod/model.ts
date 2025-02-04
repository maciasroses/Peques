"use server";

import prisma from "@/app/shared/services/prisma";
import type { IPaymentMethodSearchParams } from "@/app/shared/interfaces";

export async function createPaymentMethod({
  data,
}: {
  data: (typeof prisma.paymentMethod.create)["arguments"]["data"];
}) {
  return await prisma.paymentMethod.create({
    data,
  });
}

export async function readPaymentMethod({
  id,
  userId,
  page = 1,
  limit = 6,
  allData,
  stripePaymentMethodId,
  isAdminRequest = false,
}: IPaymentMethodSearchParams) {
  if (allData) {
    return await prisma.paymentMethod.findMany();
  }

  if (id && userId) {
    return await prisma.paymentMethod.findUnique({
      where: { id, userId, isActive: isAdminRequest ? undefined : true },
    });
  }

  if (id) {
    return await prisma.paymentMethod.findUnique({
      where: { id, isActive: isAdminRequest ? undefined : true },
    });
  }

  if (stripePaymentMethodId) {
    return await prisma.paymentMethod.findUnique({
      where: {
        stripePaymentMethodId,
        isActive: isAdminRequest ? undefined : true,
      },
    });
  }

  const skip = (Number(page) - 1) * Number(limit);
  const take = Number(limit);

  if (userId) {
    const totalCount = await prisma.paymentMethod.count({
      where: {
        userId,
        isActive: isAdminRequest ? undefined : true,
      },
    });

    const totalPages = Math.ceil(totalCount / take);

    const paymentMethods = await prisma.paymentMethod.findMany({
      where: {
        userId,
        isActive: isAdminRequest ? undefined : true,
      },
      skip,
      take,
      orderBy: {
        createdAt: "desc",
      },
    });

    return {
      paymentMethods,
      totalPages,
    };
  }
}

export async function updatePaymentMethod({
  id,
  data,
}: {
  id: string;
  data: (typeof prisma.paymentMethod.update)["arguments"]["data"];
}) {
  return await prisma.paymentMethod.update({
    where: {
      id,
    },
    data,
  });
}

export async function updateManyPaymentMethods({
  userId,
  data,
}: {
  userId: string;
  data: (typeof prisma.paymentMethod.updateMany)["arguments"]["data"];
}) {
  return await prisma.paymentMethod.updateMany({
    where: {
      userId,
    },
    data,
  });
}

export async function deletePaymentMethod({ id }: { id: string }) {
  return await prisma.paymentMethod.delete({
    where: {
      id,
    },
  });
}
