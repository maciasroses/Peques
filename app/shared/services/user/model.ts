"use server";

import prisma from "@/app/shared/services/prisma";
import hashPassword from "@/app/shared/utils/hash-password";
import { IUserSearchParams } from "../../interfaces";

export async function create({
  data,
}: {
  data: (typeof prisma.user.create)["arguments"]["data"];
}) {
  const password = data.password;
  const hashedPassword = await hashPassword(password);
  return await prisma.user.create({
    data: { ...data, password: hashedPassword },
  });
}

export async function read({
  q,
  id,
  email,
  allData = false,
  orderBy = { updatedAt: "desc" },
  username,
  isAdminRequest = false,
  wantsNewsletter,
  resetPasswordToken,
}: IUserSearchParams) {
  const globalInclude = {
    orders: true,
    customLists: true,
    addresses: isAdminRequest ? true : false,
    reviews: isAdminRequest ? true : false,
    paymentMethods: isAdminRequest ? true : false,
    stockReservations: isAdminRequest ? true : false,
  };

  if (allData) {
    return await prisma.user.findMany({
      include: globalInclude,
      orderBy,
    });
  }

  if (id) {
    return await prisma.user.findUnique({
      where: { id },
      include: globalInclude,
    });
  }

  if (email) {
    return await prisma.user.findUnique({
      where: { email },
      include: globalInclude,
    });
  }

  if (username) {
    return await prisma.user.findUnique({
      where: { username },
      include: globalInclude,
    });
  }

  if (resetPasswordToken) {
    return await prisma.user.findFirst({
      where: { resetPasswordToken, resetPasswordExpires: { gte: new Date() } },
    });
  }

  interface Where {
    OR?: {
      [key: string]: { contains: string; mode: "insensitive" };
    }[];
    wantsNewsletter?: boolean;
  }

  const where: Where = {};

  if (wantsNewsletter) {
    where.wantsNewsletter = Boolean(wantsNewsletter);
  }

  if (q) {
    where.OR = [
      { email: { contains: q, mode: "insensitive" } },
      { username: { contains: q, mode: "insensitive" } },
      { firstName: { contains: q, mode: "insensitive" } },
      { lastName: { contains: q, mode: "insensitive" } },
    ];
  }

  return await prisma.user.findMany({
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
  data: (typeof prisma.user.update)["arguments"]["data"];
}) {
  return await prisma.user.update({ where: { id }, data });
}

export async function deleteById({ id }: { id: string }) {
  return await prisma.user.delete({ where: { id } });
}
