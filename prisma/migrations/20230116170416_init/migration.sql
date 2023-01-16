/*
  Warnings:

  - You are about to drop the column `claimable` on the `Vesting` table. All the data in the column will be lost.
  - You are about to drop the column `user` on the `Vesting` table. All the data in the column will be lost.
  - You are about to drop the column `vestingId` on the `Vesting` table. All the data in the column will be lost.
  - Added the required column `amount` to the `Vesting` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Vesting" DROP COLUMN "claimable",
DROP COLUMN "user",
DROP COLUMN "vestingId",
ADD COLUMN     "amount" DOUBLE PRECISION NOT NULL;
