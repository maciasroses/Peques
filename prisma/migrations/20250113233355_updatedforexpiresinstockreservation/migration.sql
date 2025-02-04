/*
  Warnings:

  - You are about to drop the column `updatedAt` on the `StockReservation` table. All the data in the column will be lost.
  - Added the required column `expiresAt` to the `StockReservation` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "StockReservation" DROP COLUMN "updatedAt",
ADD COLUMN     "expiresAt" TIMESTAMP(3) NOT NULL;
