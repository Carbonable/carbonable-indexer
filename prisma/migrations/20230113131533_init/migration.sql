/*
  Warnings:

  - Added the required column `totalAmount` to the `Vester` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Vester" ADD COLUMN     "totalAmount" DOUBLE PRECISION NOT NULL;
