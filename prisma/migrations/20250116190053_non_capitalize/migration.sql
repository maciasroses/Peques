/*
  Warnings:

  - You are about to drop the column `OrderInfoDataForStripe` on the `User` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "User" DROP COLUMN "OrderInfoDataForStripe",
ADD COLUMN     "orderInfoDataForStripe" TEXT;
