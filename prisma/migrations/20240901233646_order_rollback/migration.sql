/*
  Warnings:

  - You are about to drop the column `quantity` on the `ProductOnOrder` table. All the data in the column will be lost.
  - You are about to drop the column `totalPrice` on the `ProductOnOrder` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "ProductOnOrder" DROP COLUMN "quantity",
DROP COLUMN "totalPrice";
