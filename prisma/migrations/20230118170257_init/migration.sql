/*
  Warnings:

  - Added the required column `abi` to the `Minter` table without a default value. This is not possible if the table is not empty.
  - Added the required column `abi` to the `Offseter` table without a default value. This is not possible if the table is not empty.
  - Added the required column `abi` to the `Payment` table without a default value. This is not possible if the table is not empty.
  - Added the required column `abi` to the `Project` table without a default value. This is not possible if the table is not empty.
  - Added the required column `abi` to the `Vester` table without a default value. This is not possible if the table is not empty.
  - Added the required column `abi` to the `Yielder` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Minter" ADD COLUMN     "abi" JSONB NOT NULL;

-- AlterTable
ALTER TABLE "Offseter" ADD COLUMN     "abi" JSONB NOT NULL;

-- AlterTable
ALTER TABLE "Payment" ADD COLUMN     "abi" JSONB NOT NULL;

-- AlterTable
ALTER TABLE "Project" ADD COLUMN     "abi" JSONB NOT NULL;

-- AlterTable
ALTER TABLE "Vester" ADD COLUMN     "abi" JSONB NOT NULL;

-- AlterTable
ALTER TABLE "Yielder" ADD COLUMN     "abi" JSONB NOT NULL;
