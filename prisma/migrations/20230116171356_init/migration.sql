/*
  Warnings:

  - You are about to drop the column `vesterId` on the `Vesting` table. All the data in the column will be lost.
  - Added the required column `vesterId` to the `Yielder` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "Vesting" DROP CONSTRAINT "Vesting_vesterId_fkey";

-- AlterTable
ALTER TABLE "Vesting" DROP COLUMN "vesterId";

-- AlterTable
ALTER TABLE "Yielder" ADD COLUMN     "vesterId" INTEGER NOT NULL;

-- AddForeignKey
ALTER TABLE "Yielder" ADD CONSTRAINT "Yielder_vesterId_fkey" FOREIGN KEY ("vesterId") REFERENCES "Vester"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
