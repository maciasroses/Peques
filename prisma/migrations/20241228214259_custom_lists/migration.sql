-- CreateTable
CREATE TABLE "CustomList" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "userId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "CustomList_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "CustomProductList" (
    "productId" TEXT NOT NULL,
    "customListId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "CustomProductList_pkey" PRIMARY KEY ("productId","customListId")
);

-- CreateIndex
CREATE UNIQUE INDEX "CustomList_name_userId_key" ON "CustomList"("name", "userId");

-- AddForeignKey
ALTER TABLE "CustomList" ADD CONSTRAINT "CustomList_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CustomProductList" ADD CONSTRAINT "CustomProductList_productId_fkey" FOREIGN KEY ("productId") REFERENCES "Product"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CustomProductList" ADD CONSTRAINT "CustomProductList_customListId_fkey" FOREIGN KEY ("customListId") REFERENCES "CustomList"("id") ON DELETE CASCADE ON UPDATE CASCADE;
