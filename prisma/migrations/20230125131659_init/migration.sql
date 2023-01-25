/*
  Warnings:

  - You are about to drop the column `Whitelist` on the `Minter` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Minter" DROP COLUMN "Whitelist",
ADD COLUMN     "whitelist" JSONB;
