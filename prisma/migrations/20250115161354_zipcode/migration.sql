/*
  Warnings:

  - Changed the type of `zipCode` on the `Address` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- AlterTable
ALTER TABLE "Address" DROP COLUMN "zipCode",
ADD COLUMN     "zipCode" INTEGER NOT NULL;
