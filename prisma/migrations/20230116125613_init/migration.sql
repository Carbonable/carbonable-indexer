/*
  Warnings:

  - You are about to drop the column `blockId` on the `Block` table. All the data in the column will be lost.
  - Added the required column `number` to the `Block` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Block" DROP COLUMN "blockId",
ADD COLUMN     "number" INTEGER NOT NULL;
