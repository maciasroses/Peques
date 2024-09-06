-- DropForeignKey
ALTER TABLE "ProductHistory" DROP CONSTRAINT "ProductHistory_productId_fkey";

-- AddForeignKey
ALTER TABLE "ProductHistory" ADD CONSTRAINT "ProductHistory_productId_fkey" FOREIGN KEY ("productId") REFERENCES "Product"("id") ON DELETE CASCADE ON UPDATE CASCADE;
