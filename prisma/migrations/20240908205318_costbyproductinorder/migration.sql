/*
  Warnings:

  - Added the required column `costMXN` to the `ProductOnOrder` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "ProductOnOrder" ADD COLUMN     "costMXN" DOUBLE PRECISION NOT NULL;
