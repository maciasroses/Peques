"use server";

import prisma from "@/app/shared/services/prisma";

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
  q?: string;
  id?: string;
  orderBy?: object;
}

export async function read({ q, id, orderBy = { createdAt: "desc" } }: IRead) {
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

  interface Where {
    OR?: {
      [key: string]: { contains: string; mode: "insensitive" };
    }[];
  }

  const where: Where = {};

  if (q) {
    where.OR = [
      { title: { contains: q, mode: "insensitive" } },
      { description: { contains: q, mode: "insensitive" } },
    ];
  }

  return await prisma.promotion.findMany({
    where,
    orderBy,
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
