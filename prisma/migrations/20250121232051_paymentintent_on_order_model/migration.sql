/*
  Warnings:

  - You are about to drop the column `discountCodeId` on the `Order` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "Order" DROP CONSTRAINT "Order_discountCodeId_fkey";

-- AlterTable
ALTER TABLE "Order" DROP COLUMN "discountCodeId",
ADD COLUMN     "paymentIntentId" TEXT;
