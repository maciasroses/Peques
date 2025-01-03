/*
  Warnings:

  - You are about to drop the column `link` on the `Hero` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[link]` on the table `Collection` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[collectionId]` on the table `Hero` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `link` to the `Collection` table without a default value. This is not possible if the table is not empty.
  - Added the required column `collectionId` to the `Hero` table without a default value. This is not possible if the table is not empty.

*/
-- DropIndex
DROP INDEX "Hero_link_key";

-- AlterTable
ALTER TABLE "Collection" ADD COLUMN     "link" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "Hero" DROP COLUMN "link",
ADD COLUMN     "collectionId" TEXT NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "Collection_link_key" ON "Collection"("link");

-- CreateIndex
CREATE UNIQUE INDEX "Hero_collectionId_key" ON "Hero"("collectionId");

-- AddForeignKey
ALTER TABLE "Hero" ADD CONSTRAINT "Hero_collectionId_fkey" FOREIGN KEY ("collectionId") REFERENCES "Collection"("id") ON DELETE CASCADE ON UPDATE CASCADE;
