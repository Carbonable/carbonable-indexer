/*
  Warnings:

  - Added the required column `finalAbsorption` to the `Project` table without a default value. This is not possible if the table is not empty.
  - Added the required column `finalTime` to the `Project` table without a default value. This is not possible if the table is not empty.
  - Added the required column `startTime` to the `Project` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Project" ADD COLUMN     "finalAbsorption" DOUBLE PRECISION NOT NULL,
ADD COLUMN     "finalTime" TIMESTAMP(3) NOT NULL,
ADD COLUMN     "startTime" TIMESTAMP(3) NOT NULL;
