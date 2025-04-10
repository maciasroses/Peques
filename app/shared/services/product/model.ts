"use server";

import prisma from "@/app/shared/services/prisma";
import type { IProduct, IProductSearchParams } from "@/app/shared/interfaces";
import { normalizeString } from "../../utils/normalize-string";

export async function create({
  data,
}: {
  data: (typeof prisma.product.create)["arguments"]["data"];
}) {
  return await prisma.product.create({
    data,
  });
}

export async function createHistory({
  data,
}: {
  data: (typeof prisma.productHistory.create)["arguments"]["data"];
}) {
  return await prisma.productHistory.create({
    data,
  });
}

export async function createMassive({
  data,
}: {
  data: (typeof prisma.product.createMany)["arguments"]["data"];
}) {
  return await prisma.product.createMany({
    data,
  });
}

export async function read({
  q,
  id,
  key,
  page = 1,
  limit = 12,
  filters,
  allData = false,
  orderBy = { updatedAt: "desc" },
  provider,
  collection,
  salePriceMXNTo,
  isAdminRequest = false,
  isForFavorites = false,
  takeFromRequest = undefined,
  isForBestReviews = false,
  salePriceMXNFrom,
  availableQuantityTo,
  availableQuantityFrom,
}: IProductSearchParams) {
  const whereIsForBestReviews = isForBestReviews
    ? {
        content: { not: null },
      }
    : {};

  const globalInclude = {
    files: true,
    reviews: {
      where: whereIsForBestReviews,
      take: isForBestReviews ? 1 : undefined,
      include: {
        user: true,
        likes: {
          include: {
            user: true,
          },
        },
      },
    },
    provider: true,
    promotions: {
      include: {
        promotion: true,
      },
    },
    collections: {
      include: {
        collection: {
          include: {
            promotions: {
              include: {
                promotion: true,
              },
            },
          },
        },
      },
    },
    orders: isAdminRequest ? true : false,
    history: isAdminRequest ? true : false,
    _count: isAdminRequest
      ? { select: { orders: true, history: true } }
      : undefined,
  };

  if (allData) {
    return await prisma.product.findMany({
      include: globalInclude,
      orderBy,
      where: {
        isActive: isAdminRequest ? undefined : true,
      },
      take: takeFromRequest,
    });
  }

  if (isForFavorites || isForBestReviews) {
    const productsWithBestRatings = await prisma.productReview.groupBy({
      by: ["productId"],
      _avg: { rating: true },
      orderBy: { _avg: { rating: "desc" } },
      take: takeFromRequest,
    });

    const productIds = productsWithBestRatings.map((item) => item.productId);

    const products = await prisma.product.findMany({
      where: {
        id,
        isActive: isAdminRequest ? undefined : true,
      },
      include: globalInclude,
    });

    if (isForFavorites) {
      const orderedProducts = productIds.map((id) =>
        products.find((product) => product.id === id)
      );

      return orderedProducts;
    }

    // For best reviews
    const productsWithReviews = products.filter(
      (product) => product.reviews.length > 0
    );

    const orderedProducts = productsWithReviews
      .map((product) => ({
        ...product,
        avgRating:
          product.reviews.reduce(
            (sum, review) => sum + (review.rating || 0),
            0
          ) / product.reviews.length,
      }))
      .sort((a, b) => b.avgRating - a.avgRating)
      .slice(0, takeFromRequest);

    return orderedProducts;
  }

  if (id) {
    return await prisma.product.findUnique({
      where: {
        id,
        isActive: isAdminRequest ? undefined : true,
      },
      include: globalInclude,
    });
  }

  if (key) {
    return await prisma.product.findUnique({
      where: { key, isActive: isAdminRequest ? undefined : true },
      include: globalInclude,
    });
  }

  interface WhereCondition {
    [key: string]:
      | { contains: string; mode: "insensitive" }
      | { equals: string }
      | { in: string[] }
      | { some: WhereCondition }
      | WhereCondition[];
  }

  interface Where {
    OR?: WhereCondition[];
    AND?: WhereCondition[];
    isActive?: boolean;
    provider?: object;
    category?: object;
    collections?: object;
    salePriceMXN?: object;
    availableQuantity?: object;
  }

  const where: Where = {};
  where.isActive = isAdminRequest ? undefined : true;

  if (filters) {
    const filtersSplitted = filters.split(",").map((filter) => {
      const [key, value] = filter.split("_");
      return { group: key, filter: value };
    });

    where.AND = filtersSplitted.map((filter) => ({
      filters: {
        some: {
          filter: {
            key: filter.filter,
            group: {
              key: filter.group,
            },
          },
        },
      },
    })) as unknown as WhereCondition[];
  }

  if (provider) where.provider = { alias: provider };

  if (salePriceMXNFrom || salePriceMXNTo)
    where.salePriceMXN = { gte: salePriceMXNFrom, lte: salePriceMXNTo };

  if (availableQuantityFrom || availableQuantityTo)
    where.availableQuantity = {
      gte: availableQuantityFrom,
      lte: availableQuantityTo,
    };

  if (collection)
    where.collections = {
      some: {
        collection: {
          link: collection,
        },
      },
    };

  if (q) {
    const searchQuery = normalizeString(q);
    where.OR = [
      { key: { contains: q, mode: "insensitive" } },
      { name: { contains: q, mode: "insensitive" } },
      { description: { contains: q, mode: "insensitive" } },
      { name_normalized: { contains: searchQuery, mode: "insensitive" } },
    ];
  }

  const take = Number(limit);
  const skip = (Number(page) - 1) * Number(limit);

  if (isAdminRequest) {
    return await prisma.product.findMany({
      where,
      orderBy,
      include: globalInclude,
    });
  } else {
    if (collection) {
      const whereClauses: string[] = [];
      const params: any[] = [];

      whereClauses.push(`c.link = $${params.length + 1}`);
      params.push(collection);

      if (!isAdminRequest) {
        whereClauses.push(`p."isActive" = $${params.length + 1}`);
        params.push(true);
      }

      if (filters) {
        const filtersSplitted = filters.split(",").map((filter) => {
          const [key, value] = filter.split("_");
          return { group: key, filter: value };
        });

        filtersSplitted.forEach((filter) => {
          whereClauses.push(`
            EXISTS (
              SELECT 1 
              FROM "ProductFilterOnProduct" pfop
              JOIN "ProductFilter" pf ON pfop."filterId" = pf.id
              JOIN "FilterGroup" fg ON pf."groupId" = fg.id
              WHERE pfop."productId" = p.id
              AND pf.key = $${params.length + 1}
              AND fg.key = $${params.length + 2}
            )
          `);
          params.push(filter.filter, filter.group);
        });
      }

      if (salePriceMXNFrom || salePriceMXNTo) {
        whereClauses.push(
          `p."salePriceMXN" BETWEEN $${params.length + 1} AND $${params.length + 2}`
        );
        params.push(salePriceMXNFrom ?? 0, salePriceMXNTo ?? 100000000);
      }

      const whereSQL = whereClauses.length
        ? `WHERE ${whereClauses.join(" AND ")}`
        : "";

      const totalCount = await prisma.$queryRawUnsafe<{ count: number }[]>(
        `SELECT COUNT(*) as count
        FROM "Product" p
        JOIN "ProductOnCollection" pc ON p.id = pc."productId"
        JOIN "Collection" c ON pc."collectionId" = c.id
        ${whereSQL};`,
        ...params
      );
      const totalPages = Math.ceil(Number(totalCount[0].count) / Number(limit));

      const rawProducts = await prisma.$queryRawUnsafe<IProduct[]>(
        `SELECT p.*
        FROM "Product" p
        JOIN "ProductOnCollection" pc ON p.id = pc."productId"
        JOIN "Collection" c ON pc."collectionId" = c.id
        ${whereSQL}
        ORDER BY pc."order" ASC, p.id ASC
        LIMIT $${params.length + 1} OFFSET $${params.length + 2};`,
        ...params,
        take,
        skip
      );

      const productIds = rawProducts.map((product) => product.id);

      const allProducts = await prisma.product.findMany({
        where: {
          id: { in: productIds },
        },
        include: globalInclude,
      });

      const productIndexMap = new Map(
        rawProducts.map((product, index) => [product.id, index])
      );

      const enrichedProducts = allProducts
        .map((product) => ({
          ...rawProducts.find((p) => p.id === product.id),
          ...product,
        }))
        .sort(
          (a, b) =>
            (productIndexMap.get(a.id) ?? 0) - (productIndexMap.get(b.id) ?? 0)
        );

      return {
        products: enrichedProducts,
        totalPages,
        totalCount: Number((totalCount as { count: number }[])[0].count),
      };
    } else {
      const totalCount = await prisma.product.count({ where });
      const totalPages = Math.ceil(totalCount / Number(limit));

      const products = await prisma.product.findMany({
        take,
        skip,
        where,
        orderBy,
        include: globalInclude,
      });
      return {
        products,
        totalPages,
        totalCount,
      };
    }
  }
}

export async function readHistory({
  id,
  productId,
}: {
  id?: string;
  productId?: string;
}) {
  if (id) {
    return await prisma.productHistory.findUnique({ where: { id } });
  }

  return await prisma.productHistory.findMany({
    where: { productId },
    orderBy: { updatedAt: "desc" },
  });
}

export async function update({
  id,
  key,
  data,
}: {
  id?: string;
  key?: string;
  data: (typeof prisma.product.update)["arguments"]["data"];
}) {
  return await prisma.product.update({
    where: {
      id: id || undefined,
      key: key || undefined,
    },
    data,
  });
}

export async function updateHistory({
  id,
  productId,
  data,
}: {
  id: string;
  productId: string;
  data: (typeof prisma.productHistory.update)["arguments"]["data"];
}) {
  return await prisma.productHistory.update({
    where: { id, AND: { productId: productId } },
    data,
  });
}

export async function updateMassive({
  ids,
  data,
}: {
  ids: string[];
  data: (typeof prisma.product.updateMany)["arguments"]["data"];
}) {
  return await prisma.product.updateMany({
    where: { id: { in: ids } },
    data,
  });
}

export async function deleteById({ id }: { id: string }) {
  return await prisma.product.delete({
    where: { id },
  });
}

export async function deleteHistoryById({
  id,
  productId,
}: {
  id: string;
  productId: string;
}) {
  return await prisma.productHistory.delete({
    where: { id, AND: { productId } },
  });
}

export async function deleteMassive({ ids }: { ids: string[] }) {
  return await prisma.product.deleteMany({
    where: { id: { in: ids } },
  });
}

export async function deleteHistoryMassive({
  ids,
  productId,
}: {
  ids: string[];
  productId: string;
}) {
  return await prisma.productHistory.deleteMany({
    where: { id: { in: ids }, AND: { productId } },
  });
}
