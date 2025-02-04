/*
  Warnings:

  - A unique constraint covering the columns `[productId,userId]` on the table `ProductReview` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "ProductReview_productId_userId_key" ON "ProductReview"("productId", "userId");
