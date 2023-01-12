/*
  Warnings:

  - Changed the type of `ton_equivalent` on the `Project` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- AlterTable
ALTER TABLE "Project" DROP COLUMN "ton_equivalent",
ADD COLUMN     "ton_equivalent" INTEGER NOT NULL;
