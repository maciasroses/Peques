-- AlterEnum
-- This migration adds more than one value to an enum.
-- With PostgreSQL versions 11 and earlier, this is not possible
-- in a single migration. This can be worked around by creating
-- multiple migrations, each migration adding only one value to
-- the enum.


ALTER TYPE "DeliveryStatus" ADD VALUE 'SHIPPED';
ALTER TYPE "DeliveryStatus" ADD VALUE 'READY_FOR_PICKUP';
ALTER TYPE "DeliveryStatus" ADD VALUE 'PICKED_UP';

-- AlterTable
ALTER TABLE "Collection" ADD COLUMN     "order" INTEGER NOT NULL DEFAULT 1;
