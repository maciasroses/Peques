"use server";

import prisma from "../prisma";

export async function create({
  data,
}: {
  data: (typeof prisma.promotion.create)["arguments"]["data"];
}) {
  return await prisma.promotion.create({
    data,
  });
}

interface IRead {
  id?: string;
}

export async function read({ id }: IRead) {
  const globalInclude = {
    cartItems: {
      include: {
        cart: {
          include: {
            user: true,
          },
        },
        product: true,
      },
    },
    discountCodes: {
      include: {
        orders: true,
        users: {
          include: {
            user: true,
          },
        },
      },
    },
    orders: {
      include: {
        order: true,
      },
    },
    products: {
      include: {
        product: true,
      },
    },
    collections: {
      include: {
        collection: true,
      },
    },
  };

  if (id) {
    return await prisma.promotion.findUnique({
      where: { id },
      include: globalInclude,
    });
  }

  return await prisma.promotion.findMany({
    include: globalInclude,
  });
}

export async function update({
  id,
  data,
}: {
  id: string;
  data: (typeof prisma.promotion.update)["arguments"]["data"];
}) {
  return await prisma.promotion.update({
    where: { id },
    data,
  });
}

export async function remove({ id }: IRead) {
  return await prisma.promotion.delete({
    where: { id },
  });
}
