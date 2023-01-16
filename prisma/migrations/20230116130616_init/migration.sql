/*
  Warnings:

  - A unique constraint covering the columns `[name]` on the table `Block` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "Block_name_key" ON "Block"("name");
