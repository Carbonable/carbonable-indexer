/*
  Warnings:

  - A unique constraint covering the columns `[projectId,hash,from,to,tokenId]` on the table `Transfer` will be added. If there are existing duplicate values, this will fail.

*/
-- DropIndex
DROP INDEX "Transfer_hash_key";

-- CreateIndex
CREATE UNIQUE INDEX "Transfer_projectId_hash_from_to_tokenId_key" ON "Transfer"("projectId", "hash", "from", "to", "tokenId");
