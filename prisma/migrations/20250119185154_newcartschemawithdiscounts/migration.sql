/*
  Warnings:

  - Added the required column `finalPriceMXN` to the `CartItem` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "CartItem" ADD COLUMN     "discount" TEXT,
ADD COLUMN     "finalPriceMXN" DOUBLE PRECISION NOT NULL;
