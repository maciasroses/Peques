import { PrismaClient } from "@prisma/client";
import hashPassword from "@/app/shared/utils/hash-password";

const prisma = new PrismaClient();

async function main() {
  await prisma.user.create({
    data: {
      role: "ADMIN",
      username: "user",
      email: "user@mail.com",
      password: await hashPassword("secretpass"),
    },
  });

  const provider = await prisma.provider.create({
    data: {
      name: "Provider 1",
      alias: "provider1",
    },
  });

  const productEntries = [
    {
      key: "product1",
      name: "Product 1",
      availableQuantity: 10,
      minimumAcceptableQuantity: 5,
      salePriceMXN: 4000,
      providerId: provider.id,
      history: {
        create: {
          quantityPerCarton: 10,
          chinesePriceUSD: 10,
          dollarExchangeRate: 20,
          pricePerCartonOrProductUSD: 100,
          costMXN: 2000,
          shippingCostMXN: 1000,
          totalCostMXN: 3000,
          salePriceMXN: 4000,
          margin: 0.25,
          salePerQuantity: 10,
          orderDate: new Date(),
        },
      },
    },
    {
      key: "product2",
      name: "Product 2",
      availableQuantity: 10,
      minimumAcceptableQuantity: 5,
      salePriceMXN: 4000,
      providerId: provider.id,
      history: {
        create: {
          quantityPerCarton: 10,
          chinesePriceUSD: 10,
          dollarExchangeRate: 20,
          pricePerCartonOrProductUSD: 100,
          costMXN: 2000,
          shippingCostMXN: 1000,
          totalCostMXN: 3000,
          salePriceMXN: 4000,
          margin: 0.25,
          salePerQuantity: 10,
          orderDate: new Date(),
        },
      },
    },
  ];

  productEntries.forEach(async (entry) => {
    await prisma.product.create({
      data: entry,
    });
  });
}

main()
  .then(() => {
    console.log("Seeding finished.");
  })
  .catch((e) => {
    console.error("Seeding error: ", e);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
