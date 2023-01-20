/*
  Warnings:

  - A unique constraint covering the columns `[address]` on the table `Implementation` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `address` to the `Implementation` table without a default value. This is not possible if the table is not empty.

*/
-- DropIndex
DROP INDEX "Implementation_abi_key";

-- AlterTable
ALTER TABLE "Implementation" ADD COLUMN     "address" TEXT NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "Implementation_address_key" ON "Implementation"("address");
