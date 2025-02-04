/*
  Warnings:

  - You are about to drop the column `createdAt` on the `ProductOnOrder` table. All the data in the column will be lost.
  - You are about to drop the column `updatedAt` on the `ProductOnOrder` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "ProductOnOrder" DROP COLUMN "createdAt",
DROP COLUMN "updatedAt";
