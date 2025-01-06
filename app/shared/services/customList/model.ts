"use server";

import prisma from "@/app/shared/services/prisma";
import type { ICustomListSearchParams } from "@/app/shared/interfaces";

export async function createCustomList({
  data,
}: {
  data: (typeof prisma.customList.create)["arguments"]["data"];
}) {
  return await prisma.customList.create({
    data,
  });
}

export async function createCustomProductsList({
  data,
}: {
  data: (typeof prisma.customProductList.create)["arguments"]["data"];
}) {
  return await prisma.customProductList.create({
    data,
  });
}

interface IReadNDeleteCustomList {
  id?: string;
  name?: string;
  userId?: string;
}

interface IReadNDeleteCustomProductsList {
  userId?: string;
  productId?: string;
  customListId?: string;
}

export async function readCustomList({
  id,
  name,
  userId,
  page = 1,
  limit = 6,
  allData,
  isForFav,
}: ICustomListSearchParams) {
  const globalInclude = {
    products: {
      include: {
        product: {
          include: {
            files: true,
          },
        },
      },
    },
  };

  if (allData) {
    return await prisma.customList.findMany({
      include: globalInclude,
    });
  }

  if (id) {
    return await prisma.customList.findUnique({
      where: { id },
      include: globalInclude,
    });
  }

  if (userId && name) {
    return await prisma.customList.findUnique({
      where: {
        name_userId: {
          name: decodeURIComponent(name),
          userId,
        },
      },
      include: globalInclude,
    });
  }

  if (userId && isForFav) {
    return await prisma.customList.findMany({
      where: { userId },
      include: globalInclude,
      orderBy: {
        createdAt: "desc",
      },
    });
  }

  const skip = (Number(page) - 1) * Number(limit);
  const take = Number(limit);

  if (userId) {
    const totalCount = await prisma.customList.count({
      where: {
        userId,
      },
    });

    const totalPages = Math.ceil(totalCount / Number(limit));

    const customLists = await prisma.customList.findMany({
      where: { userId },
      skip,
      take,
      include: globalInclude,
      orderBy: {
        createdAt: "desc",
      },
    });

    return {
      customLists,
      totalPages,
    };
  }

  const totalCount = await prisma.customList.count();
  const totalPages = Math.ceil(totalCount / Number(limit));

  const customLists = await prisma.customList.findMany({
    skip,
    take,
    include: globalInclude,
    orderBy: {
      createdAt: "desc",
    },
  });

  return {
    customLists,
    totalPages,
  };
}

export async function readCustomProductsList({
  productId,
  customListId,
}: IReadNDeleteCustomProductsList) {
  const globalInclude = {
    product: true,
    customList: true,
  };

  if (productId && customListId) {
    return await prisma.customProductList.findUnique({
      where: {
        productId_customListId: {
          productId,
          customListId,
        },
      },
    });
  }

  if (productId) {
    return await prisma.customProductList.findMany({
      where: { productId },
      include: {
        customList: true,
      },
    });
  }

  if (customListId) {
    return await prisma.customProductList.findMany({
      where: { customListId },
      include: {
        product: true,
      },
    });
  }

  return await prisma.customProductList.findMany({
    include: globalInclude,
  });
}

export async function updateCustomList({
  id,
  data,
}: {
  id: string;
  data: (typeof prisma.customList.update)["arguments"]["data"];
}) {
  return await prisma.customList.update({ where: { id }, data });
}

export async function deleteCustomList({
  id,
  name,
  userId,
}: IReadNDeleteCustomList) {
  if (id) {
    return await prisma.customList.delete({
      where: { id },
    });
  }

  if (userId && name) {
    return await prisma.customList.delete({
      where: {
        name_userId: {
          name,
          userId,
        },
      },
    });
  }
}

export async function deleteCustomProductList({
  userId,
  productId,
  customListId,
}: IReadNDeleteCustomProductsList) {
  if (customListId && productId) {
    return await prisma.customProductList.delete({
      where: {
        productId_customListId: {
          productId,
          customListId,
        },
      },
    });
  }

  if (userId && productId) {
    return await prisma.customProductList.deleteMany({
      where: {
        productId,
        customList: {
          userId,
        },
      },
    });
  }

  return await prisma.customProductList.deleteMany({
    where: {
      productId,
      customListId,
    },
  });
}
