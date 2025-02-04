/*
  Warnings:

  - You are about to drop the column `promotionId` on the `DiscountCode` table. All the data in the column will be lost.
  - You are about to drop the column `promotionId` on the `Order` table. All the data in the column will be lost.
  - Added the required column `orderId` to the `InventoryTransaction` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "DiscountCode" DROP CONSTRAINT "DiscountCode_promotionId_fkey";

-- DropForeignKey
ALTER TABLE "Order" DROP CONSTRAINT "Order_promotionId_fkey";

-- AlterTable
ALTER TABLE "DiscountCode" DROP COLUMN "promotionId";

-- AlterTable
ALTER TABLE "InventoryTransaction" ADD COLUMN     "orderId" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "Order" DROP COLUMN "promotionId";

-- CreateTable
CREATE TABLE "OrderOnPromotion" (
    "orderId" TEXT NOT NULL,
    "promotionId" TEXT NOT NULL,

    CONSTRAINT "OrderOnPromotion_pkey" PRIMARY KEY ("orderId","promotionId")
);

-- AddForeignKey
ALTER TABLE "InventoryTransaction" ADD CONSTRAINT "InventoryTransaction_orderId_fkey" FOREIGN KEY ("orderId") REFERENCES "Order"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "OrderOnPromotion" ADD CONSTRAINT "OrderOnPromotion_orderId_fkey" FOREIGN KEY ("orderId") REFERENCES "Order"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "OrderOnPromotion" ADD CONSTRAINT "OrderOnPromotion_promotionId_fkey" FOREIGN KEY ("promotionId") REFERENCES "Promotion"("id") ON DELETE CASCADE ON UPDATE CASCADE;
