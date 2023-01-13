/*
  Warnings:

  - You are about to drop the column `min_claimable` on the `Offseter` table. All the data in the column will be lost.
  - You are about to drop the column `total_deposited` on the `Offseter` table. All the data in the column will be lost.
  - Added the required column `minClaimable` to the `Offseter` table without a default value. This is not possible if the table is not empty.
  - Added the required column `totalClaimable` to the `Offseter` table without a default value. This is not possible if the table is not empty.
  - Added the required column `totalClaimed` to the `Offseter` table without a default value. This is not possible if the table is not empty.
  - Added the required column `totalDeposited` to the `Offseter` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Offseter" DROP COLUMN "min_claimable",
DROP COLUMN "total_deposited",
ADD COLUMN     "minClaimable" DOUBLE PRECISION NOT NULL,
ADD COLUMN     "totalClaimable" DOUBLE PRECISION NOT NULL,
ADD COLUMN     "totalClaimed" DOUBLE PRECISION NOT NULL,
ADD COLUMN     "totalDeposited" INTEGER NOT NULL;
