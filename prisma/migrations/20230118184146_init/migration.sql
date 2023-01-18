/*
  Warnings:

  - You are about to drop the column `finalAbsorption` on the `Project` table. All the data in the column will be lost.
  - You are about to drop the column `finalTime` on the `Project` table. All the data in the column will be lost.
  - You are about to drop the column `startTime` on the `Project` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Project" DROP COLUMN "finalAbsorption",
DROP COLUMN "finalTime",
DROP COLUMN "startTime";
