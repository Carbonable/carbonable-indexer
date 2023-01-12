/*
  Warnings:

  - You are about to drop the column `ton_equivalent` on the `Project` table. All the data in the column will be lost.
  - Added the required column `tonEquivalent` to the `Project` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Project" DROP COLUMN "ton_equivalent",
ADD COLUMN     "tonEquivalent" INTEGER NOT NULL;
