/*
  Warnings:

  - Changed the type of `contractUri` on the `Project` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- AlterTable
ALTER TABLE "Project" DROP COLUMN "contractUri",
ADD COLUMN     "contractUri" JSONB NOT NULL;
