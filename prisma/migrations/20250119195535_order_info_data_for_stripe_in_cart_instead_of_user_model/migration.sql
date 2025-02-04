/*
  Warnings:

  - You are about to drop the column `orderInfoDataForStripe` on the `User` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Cart" ADD COLUMN     "orderInfoDataForStripe" TEXT;

-- AlterTable
ALTER TABLE "User" DROP COLUMN "orderInfoDataForStripe";
