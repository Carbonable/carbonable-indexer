/*
  Warnings:

  - Added the required column `block` to the `Transfer` table without a default value. This is not possible if the table is not empty.
  - Added the required column `block` to the `TransferSingle` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Transfer" ADD COLUMN     "block" INTEGER NOT NULL;

-- AlterTable
ALTER TABLE "TransferSingle" ADD COLUMN     "block" INTEGER NOT NULL;

-- CreateTable
CREATE TABLE "Buy" (
    "id" SERIAL NOT NULL,
    "hash" TEXT NOT NULL,
    "address" TEXT NOT NULL,
    "quantity" INTEGER NOT NULL,
    "time" TIMESTAMP(3) NOT NULL,
    "block" INTEGER NOT NULL,
    "minterId" INTEGER NOT NULL,

    CONSTRAINT "Buy_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Buy_minterId_hash_address_quantity_key" ON "Buy"("minterId", "hash", "address", "quantity");

-- AddForeignKey
ALTER TABLE "Buy" ADD CONSTRAINT "Buy_minterId_fkey" FOREIGN KEY ("minterId") REFERENCES "Minter"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
