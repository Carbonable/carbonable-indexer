/*
  Warnings:

  - Added the required column `token_id` to the `Transfer` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Transfer" ADD COLUMN     "token_id" DOUBLE PRECISION NOT NULL;
