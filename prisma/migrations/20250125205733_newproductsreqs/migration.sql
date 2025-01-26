-- AlterTable
ALTER TABLE "Product" ADD COLUMN     "isCustomizable" BOOLEAN NOT NULL DEFAULT false;

-- AlterTable
ALTER TABLE "ProductOnOrder" ADD COLUMN     "customRequest" TEXT;
