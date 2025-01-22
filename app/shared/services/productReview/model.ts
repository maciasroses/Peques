"use server";

import prisma from "../prisma";

export async function create({
  data,
}: {
  data: (typeof prisma.productReview.create)["arguments"]["data"];
}) {
  return await prisma.productReview.create({
    data,
  });
}

interface IRead {
  id?: string;
  userId?: string;
  productId?: string;
}

export async function read({ id, userId, productId }: IRead) {
  const globalInclude = {
    user: true,
    product: true,
  };

  if (id) {
    return await prisma.productReview.findUnique({
      where: { id },
      include: globalInclude,
    });
  }

  if (userId && productId) {
    return await prisma.productReview.findUnique({
      where: { productId_userId: { userId, productId } },
      include: globalInclude,
    });
  }

  if (userId) {
    return await prisma.productReview.findMany({
      where: { userId },
      include: globalInclude,
    });
  }

  if (productId) {
    return await prisma.productReview.findMany({
      where: { productId },
      include: globalInclude,
    });
  }

  return await prisma.productReview.findMany({
    include: globalInclude,
  });
}

export async function update({
  id,
  data,
}: {
  id: string;
  data: (typeof prisma.productReview.update)["arguments"]["data"];
}) {
  return await prisma.productReview.update({
    where: { id },
    data,
  });
}

export async function remove({ id }: { id: string }) {
  return await prisma.productReview.delete({
    where: { id },
  });
}
