/*
  Warnings:

  - You are about to drop the column `withdrawable` on the `Vester` table. All the data in the column will be lost.
  - Added the required column `withdrawableAmount` to the `Vester` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Vester" DROP COLUMN "withdrawable",
ADD COLUMN     "withdrawableAmount" DOUBLE PRECISION NOT NULL;
