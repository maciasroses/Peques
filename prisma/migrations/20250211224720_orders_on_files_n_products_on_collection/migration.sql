-- AlterTable
ALTER TABLE "ProductFile" ADD COLUMN     "order" INTEGER NOT NULL DEFAULT 1;

-- AlterTable
ALTER TABLE "ProductOnCollection" ADD COLUMN     "order" INTEGER NOT NULL DEFAULT 1;
