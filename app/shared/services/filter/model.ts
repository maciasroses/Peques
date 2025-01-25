"use server";

import prisma from "@/app/shared/services/prisma";

export async function create({
  data,
}: {
  data: (typeof prisma.filterGroup.create)["arguments"]["data"];
}) {
  return await prisma.filterGroup.create({
    data,
  });
}

export async function createProductFilter({
  data,
}: {
  data: (typeof prisma.productFilter.create)["arguments"]["data"];
}) {
  return await prisma.productFilter.create({
    data,
  });
}

interface IRead {
  q?: string;
  id?: string;
  key?: string;
  orderBy?: object;
}

export async function read({
  q,
  id,
  key,
  orderBy = { createdAt: "desc" },
}: IRead) {
  const globalInclude = {
    filters: {
      include: {
        products: {
          include: {
            product: {
              include: {
                files: true,
                provider: true,
              },
            },
          },
        },
      },
    },
    collections: {
      include: {
        collection: true,
      },
    },
  };

  if (id) {
    return await prisma.filterGroup.findUnique({
      where: { id },
      include: globalInclude,
    });
  }

  if (key) {
    return await prisma.filterGroup.findFirst({
      where: { key },
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
      { key: { contains: q, mode: "insensitive" } },
      { name: { contains: q, mode: "insensitive" } },
    ];
  }

  return await prisma.filterGroup.findMany({
    where,
    orderBy,
    include: globalInclude,
  });
}

interface IProductFilterRead {
  q?: string;
  id?: string;
  key?: string;
  orderBy?: object;
}

export async function readProductFilter({
  q,
  id,
  key,
  orderBy = { createdAt: "desc" },
}: IProductFilterRead) {
  const globalInclude = {
    products: {
      include: {
        product: true,
      },
    },
  };

  if (id) {
    return await prisma.productFilter.findUnique({
      where: { id },
      include: globalInclude,
    });
  }

  if (key) {
    return await prisma.productFilter.findFirst({
      where: { key },
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
      { key: { contains: q, mode: "insensitive" } },
      { name: { contains: q, mode: "insensitive" } },
    ];
  }

  return await prisma.productFilter.findMany({
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
  data: (typeof prisma.filterGroup.update)["arguments"]["data"];
}) {
  return await prisma.filterGroup.update({
    where: { id },
    data,
  });
}

export async function updateProductFilter({
  id,
  data,
}: {
  id: string;
  data: (typeof prisma.productFilter.update)["arguments"]["data"];
}) {
  return await prisma.productFilter.update({
    where: { id },
    data,
  });
}

export async function remove({ id }: { id: string }) {
  return await prisma.filterGroup.delete({
    where: { id },
  });
}

export async function removeProductFilter({ id }: { id: string }) {
  return await prisma.productFilter.delete({
    where: { id },
  });
}
