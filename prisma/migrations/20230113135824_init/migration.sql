/*
  Warnings:

  - You are about to drop the column `total_deposited` on the `Yielder` table. All the data in the column will be lost.
  - Added the required column `snapshotedTime` to the `Yielder` table without a default value. This is not possible if the table is not empty.
  - Added the required column `totalAbsorption` to the `Yielder` table without a default value. This is not possible if the table is not empty.
  - Added the required column `totalDeposited` to the `Yielder` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Yielder" DROP COLUMN "total_deposited",
ADD COLUMN     "snapshotedTime" TIMESTAMP(3) NOT NULL,
ADD COLUMN     "totalAbsorption" DOUBLE PRECISION NOT NULL,
ADD COLUMN     "totalDeposited" DOUBLE PRECISION NOT NULL;
