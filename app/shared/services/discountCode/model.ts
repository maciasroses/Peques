"use server";

import prisma from "@/app/shared/services/prisma";

export async function create({
  data,
}: {
  data: (typeof prisma.discountCode.create)["arguments"]["data"];
}) {
  return await prisma.discountCode.create({
    data,
  });
}

interface IRead {
  id?: string;
  code?: string;
  userId?: string;
}

export async function read({ id, code, userId }: IRead) {
  const globalInclude = {
    orders: true,
    promotion: true,
    users: {
      include: {
        user: true,
      },
    },
  };

  if (id && userId) {
    return await prisma.discountCodeOnUser.findUnique({
      where: {
        discountCodeId_userId: {
          discountCodeId: id,
          userId,
        },
      },
    });
  }

  if (id) {
    return await prisma.discountCode.findUnique({
      where: {
        id,
      },
      include: globalInclude,
    });
  }

  if (code) {
    return await prisma.discountCode.findUnique({
      where: {
        code,
      },
      include: globalInclude,
    });
  }

  return await prisma.discountCode.findMany({
    include: globalInclude,
  });
}

export async function update({
  id,
  data,
}: {
  id: string;
  data: (typeof prisma.discountCode.update)["arguments"]["data"];
}) {
  return await prisma.discountCode.update({
    where: {
      id,
    },
    data,
  });
}

export async function remove({ id }: { id: string }) {
  return await prisma.discountCode.delete({
    where: {
      id,
    },
  });
}
