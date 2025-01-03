/*
  Warnings:

  - You are about to drop the column `description` on the `Collection` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[link]` on the table `Hero` will be added. If there are existing duplicate values, this will fail.
  - Made the column `imageUrl` on table `Collection` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "Collection" DROP COLUMN "description",
ALTER COLUMN "imageUrl" SET NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "Hero_link_key" ON "Hero"("link");
