/*
  Warnings:

  - You are about to drop the column `categoryId` on the `Product` table. All the data in the column will be lost.
  - You are about to drop the `ProductCategory` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `ProductCategoryOnPromotion` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "Product" DROP CONSTRAINT "Product_categoryId_fkey";

-- DropForeignKey
ALTER TABLE "ProductCategoryOnPromotion" DROP CONSTRAINT "ProductCategoryOnPromotion_productCategoryId_fkey";

-- DropForeignKey
ALTER TABLE "ProductCategoryOnPromotion" DROP CONSTRAINT "ProductCategoryOnPromotion_promotionId_fkey";

-- AlterTable
ALTER TABLE "Product" DROP COLUMN "categoryId";

-- DropTable
DROP TABLE "ProductCategory";

-- DropTable
DROP TABLE "ProductCategoryOnPromotion";

-- CreateTable
CREATE TABLE "ProductFilter" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "key" TEXT NOT NULL,
    "group" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ProductFilter_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ProductFilterOnProduct" (
    "productId" TEXT NOT NULL,
    "filterId" TEXT NOT NULL,

    CONSTRAINT "ProductFilterOnProduct_pkey" PRIMARY KEY ("productId","filterId")
);

-- CreateTable
CREATE TABLE "CollectionOnPromotion" (
    "collectionId" TEXT NOT NULL,
    "promotionId" TEXT NOT NULL,

    CONSTRAINT "CollectionOnPromotion_pkey" PRIMARY KEY ("collectionId","promotionId")
);

-- CreateIndex
CREATE UNIQUE INDEX "ProductFilter_key_key" ON "ProductFilter"("key");

-- AddForeignKey
ALTER TABLE "ProductFilterOnProduct" ADD CONSTRAINT "ProductFilterOnProduct_productId_fkey" FOREIGN KEY ("productId") REFERENCES "Product"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ProductFilterOnProduct" ADD CONSTRAINT "ProductFilterOnProduct_filterId_fkey" FOREIGN KEY ("filterId") REFERENCES "ProductFilter"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CollectionOnPromotion" ADD CONSTRAINT "CollectionOnPromotion_collectionId_fkey" FOREIGN KEY ("collectionId") REFERENCES "Collection"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CollectionOnPromotion" ADD CONSTRAINT "CollectionOnPromotion_promotionId_fkey" FOREIGN KEY ("promotionId") REFERENCES "Promotion"("id") ON DELETE CASCADE ON UPDATE CASCADE;
