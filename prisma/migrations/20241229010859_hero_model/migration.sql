-- CreateTable
CREATE TABLE "Hero" (
    "id" TEXT NOT NULL,
    "title" TEXT,
    "subtitle" TEXT,
    "description" TEXT,
    "imageUrl" TEXT NOT NULL,
    "link" TEXT NOT NULL,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Hero_pkey" PRIMARY KEY ("id")
);
