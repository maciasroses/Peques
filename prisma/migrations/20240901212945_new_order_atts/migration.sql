/*
  Warnings:

  - Added the required column `quantity` to the `ProductOnOrder` table without a default value. This is not possible if the table is not empty.
  - Added the required column `totalPrice` to the `ProductOnOrder` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "ProductOnOrder" ADD COLUMN     "quantity" INTEGER NOT NULL,
ADD COLUMN     "totalPrice" DOUBLE PRECISION NOT NULL;