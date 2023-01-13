/*
  Warnings:

  - The `absorptions` column on the `Project` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - Changed the type of `totalValue` on the `Minter` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- AlterTable
ALTER TABLE "Minter" DROP COLUMN "totalValue",
ADD COLUMN     "totalValue" DOUBLE PRECISION NOT NULL;

-- AlterTable
ALTER TABLE "Project" ALTER COLUMN "tonEquivalent" SET DATA TYPE DOUBLE PRECISION,
DROP COLUMN "absorptions",
ADD COLUMN     "absorptions" DOUBLE PRECISION[];
