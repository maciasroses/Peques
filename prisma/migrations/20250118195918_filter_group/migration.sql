/*
  Warnings:

  - You are about to drop the column `group` on the `ProductFilter` table. All the data in the column will be lost.
  - Added the required column `groupId` to the `ProductFilter` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "ProductFilter" DROP COLUMN "group",
ADD COLUMN     "groupId" TEXT NOT NULL;

-- CreateTable
CREATE TABLE "FilterGroup" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "key" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "FilterGroup_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "FilterGroup_key_key" ON "FilterGroup"("key");

-- AddForeignKey
ALTER TABLE "ProductFilter" ADD CONSTRAINT "ProductFilter_groupId_fkey" FOREIGN KEY ("groupId") REFERENCES "FilterGroup"("id") ON DELETE CASCADE ON UPDATE CASCADE;
