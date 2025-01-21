-- CreateTable
CREATE TABLE "CollectionOnFilterGroup" (
    "collectionId" TEXT NOT NULL,
    "groupId" TEXT NOT NULL,

    CONSTRAINT "CollectionOnFilterGroup_pkey" PRIMARY KEY ("collectionId","groupId")
);

-- AddForeignKey
ALTER TABLE "CollectionOnFilterGroup" ADD CONSTRAINT "CollectionOnFilterGroup_collectionId_fkey" FOREIGN KEY ("collectionId") REFERENCES "Collection"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CollectionOnFilterGroup" ADD CONSTRAINT "CollectionOnFilterGroup_groupId_fkey" FOREIGN KEY ("groupId") REFERENCES "FilterGroup"("id") ON DELETE CASCADE ON UPDATE CASCADE;
