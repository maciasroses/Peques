-- CreateEnum
CREATE TYPE "FileType" AS ENUM ('IMAGE', 'VIDEO');

-- CreateEnum
CREATE TYPE "DiscountType" AS ENUM ('PERCENTAGE', 'FIXED');

-- AlterTable
ALTER TABLE "Order" ADD COLUMN     "discountCodeId" TEXT,
ADD COLUMN     "promotionId" TEXT,
ADD COLUMN     "userId" TEXT;

-- AlterTable
ALTER TABLE "Product" ADD COLUMN     "category" TEXT,
ADD COLUMN     "description" TEXT;

-- CreateTable
CREATE TABLE "CartItem" (
    "id" TEXT NOT NULL,
    "quantity" INTEGER NOT NULL,
    "priceInCents" INTEGER NOT NULL,
    "cartId" TEXT NOT NULL,
    "productId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "CartItem_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Cart" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Cart_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ProductFile" (
    "id" TEXT NOT NULL,
    "url" TEXT NOT NULL,
    "type" "FileType" NOT NULL,
    "productId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ProductFile_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ProductReview" (
    "id" TEXT NOT NULL,
    "rating" INTEGER NOT NULL,
    "content" TEXT,
    "likesCount" INTEGER DEFAULT 0,
    "productId" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ProductReview_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "StockReservation" (
    "id" TEXT NOT NULL,
    "quantity" INTEGER NOT NULL,
    "userId" TEXT NOT NULL,
    "productId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "StockReservation_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "InventoryTransaction" (
    "id" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "quantity" INTEGER NOT NULL,
    "description" TEXT,
    "productId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "InventoryTransaction_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Promotion" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "endDate" TIMESTAMP(3) NOT NULL,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "startDate" TIMESTAMP(3) NOT NULL,
    "description" TEXT NOT NULL,
    "discountType" "DiscountType" NOT NULL,
    "discountValue" DOUBLE PRECISION NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Promotion_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "DiscountCode" (
    "id" TEXT NOT NULL,
    "code" TEXT NOT NULL,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "timesUsed" INTEGER NOT NULL DEFAULT 0,
    "usageLimit" INTEGER,
    "promotionId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "DiscountCode_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "CartItem_productId_cartId_key" ON "CartItem"("productId", "cartId");

-- CreateIndex
CREATE UNIQUE INDEX "Cart_userId_key" ON "Cart"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "StockReservation_userId_productId_key" ON "StockReservation"("userId", "productId");

-- CreateIndex
CREATE UNIQUE INDEX "DiscountCode_code_key" ON "DiscountCode"("code");

-- AddForeignKey
ALTER TABLE "CartItem" ADD CONSTRAINT "CartItem_cartId_fkey" FOREIGN KEY ("cartId") REFERENCES "Cart"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CartItem" ADD CONSTRAINT "CartItem_productId_fkey" FOREIGN KEY ("productId") REFERENCES "Product"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Cart" ADD CONSTRAINT "Cart_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ProductFile" ADD CONSTRAINT "ProductFile_productId_fkey" FOREIGN KEY ("productId") REFERENCES "Product"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ProductReview" ADD CONSTRAINT "ProductReview_productId_fkey" FOREIGN KEY ("productId") REFERENCES "Product"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ProductReview" ADD CONSTRAINT "ProductReview_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "StockReservation" ADD CONSTRAINT "StockReservation_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "StockReservation" ADD CONSTRAINT "StockReservation_productId_fkey" FOREIGN KEY ("productId") REFERENCES "Product"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Order" ADD CONSTRAINT "Order_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Order" ADD CONSTRAINT "Order_promotionId_fkey" FOREIGN KEY ("promotionId") REFERENCES "Promotion"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Order" ADD CONSTRAINT "Order_discountCodeId_fkey" FOREIGN KEY ("discountCodeId") REFERENCES "DiscountCode"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "InventoryTransaction" ADD CONSTRAINT "InventoryTransaction_productId_fkey" FOREIGN KEY ("productId") REFERENCES "Product"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "DiscountCode" ADD CONSTRAINT "DiscountCode_promotionId_fkey" FOREIGN KEY ("promotionId") REFERENCES "Promotion"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
