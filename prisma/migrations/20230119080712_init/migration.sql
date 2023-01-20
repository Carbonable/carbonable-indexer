/*
  Warnings:

  - You are about to drop the column `token_id` on the `Transfer` table. All the data in the column will be lost.
  - Added the required column `tokenId` to the `Transfer` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Transfer" DROP COLUMN "token_id",
ADD COLUMN     "tokenId" DOUBLE PRECISION NOT NULL;
