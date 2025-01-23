/*
  Warnings:

  - You are about to drop the column `likesCount` on the `ProductReview` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "ProductReview" DROP COLUMN "likesCount";

-- CreateTable
CREATE TABLE "ProductReviewLikeOnUser" (
    "userId" TEXT NOT NULL,
    "reviewId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- CreateIndex
CREATE UNIQUE INDEX "ProductReviewLikeOnUser_userId_reviewId_key" ON "ProductReviewLikeOnUser"("userId", "reviewId");

-- AddForeignKey
ALTER TABLE "ProductReviewLikeOnUser" ADD CONSTRAINT "ProductReviewLikeOnUser_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ProductReviewLikeOnUser" ADD CONSTRAINT "ProductReviewLikeOnUser_reviewId_fkey" FOREIGN KEY ("reviewId") REFERENCES "ProductReview"("id") ON DELETE CASCADE ON UPDATE CASCADE;
