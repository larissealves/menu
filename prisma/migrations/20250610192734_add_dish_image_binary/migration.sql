-- CreateTable
CREATE TABLE "DishImageBinary" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "dishImageId" INTEGER NOT NULL,
    "binaryData" BLOB NOT NULL,
    CONSTRAINT "DishImageBinary_dishImageId_fkey" FOREIGN KEY ("dishImageId") REFERENCES "DishImage" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateIndex
CREATE UNIQUE INDEX "DishImageBinary_dishImageId_key" ON "DishImageBinary"("dishImageId");
