/*
  Warnings:

  - You are about to drop the column `chinesePriceUSD` on the `Product` table. All the data in the column will be lost.
  - You are about to drop the column `costMXN` on the `Product` table. All the data in the column will be lost.
  - You are about to drop the column `dollarExchangeRate` on the `Product` table. All the data in the column will be lost.
  - You are about to drop the column `margin` on the `Product` table. All the data in the column will be lost.
  - You are about to drop the column `orderDate` on the `Product` table. All the data in the column will be lost.
  - You are about to drop the column `pricePerCartonOrProductUSD` on the `Product` table. All the data in the column will be lost.
  - You are about to drop the column `quantityPerCarton` on the `Product` table. All the data in the column will be lost.
  - You are about to drop the column `salePerQuantity` on the `Product` table. All the data in the column will be lost.
  - You are about to drop the column `salePriceMXN` on the `Product` table. All the data in the column will be lost.
  - You are about to drop the column `shippingCostMXN` on the `Product` table. All the data in the column will be lost.
  - You are about to drop the column `totalCostMXN` on the `Product` table. All the data in the column will be lost.
  - Added the required column `subtotal` to the `Order` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Order" ADD COLUMN     "subtotal" DOUBLE PRECISION NOT NULL;

-- AlterTable
ALTER TABLE "Product" DROP COLUMN "chinesePriceUSD",
DROP COLUMN "costMXN",
DROP COLUMN "dollarExchangeRate",
DROP COLUMN "margin",
DROP COLUMN "orderDate",
DROP COLUMN "pricePerCartonOrProductUSD",
DROP COLUMN "quantityPerCarton",
DROP COLUMN "salePerQuantity",
DROP COLUMN "salePriceMXN",
DROP COLUMN "shippingCostMXN",
DROP COLUMN "totalCostMXN";

-- CreateTable
CREATE TABLE "ProductHistory" (
    "id" TEXT NOT NULL,
    "quantityPerCarton" INTEGER NOT NULL,
    "chinesePriceUSD" DOUBLE PRECISION NOT NULL,
    "dollarExchangeRate" DOUBLE PRECISION NOT NULL,
    "pricePerCartonOrProductUSD" DOUBLE PRECISION NOT NULL,
    "costMXN" DOUBLE PRECISION NOT NULL,
    "shippingCostMXN" DOUBLE PRECISION NOT NULL,
    "totalCostMXN" DOUBLE PRECISION NOT NULL,
    "salePriceMXN" DOUBLE PRECISION NOT NULL,
    "margin" DOUBLE PRECISION NOT NULL,
    "salePerQuantity" DOUBLE PRECISION NOT NULL,
    "orderDate" TIMESTAMP(3) NOT NULL,
    "productId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ProductHistory_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "ProductHistory" ADD CONSTRAINT "ProductHistory_productId_fkey" FOREIGN KEY ("productId") REFERENCES "Product"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
