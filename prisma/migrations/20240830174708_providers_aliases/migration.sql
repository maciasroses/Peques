/*
  Warnings:

  - A unique constraint covering the columns `[alias]` on the table `Provider` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `alias` to the `Provider` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Provider" ADD COLUMN     "alias" TEXT NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "Provider_alias_key" ON "Provider"("alias");
