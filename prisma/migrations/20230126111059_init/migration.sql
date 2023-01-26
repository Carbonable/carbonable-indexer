/*
  Warnings:

  - Added the required column `amount` to the `Buy` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Buy" ADD COLUMN     "amount" DOUBLE PRECISION NOT NULL;

-- CreateTable
CREATE TABLE "Airdrop" (
    "id" SERIAL NOT NULL,
    "hash" TEXT NOT NULL,
    "address" TEXT NOT NULL,
    "quantity" INTEGER NOT NULL,
    "time" TIMESTAMP(3) NOT NULL,
    "block" INTEGER NOT NULL,
    "minterId" INTEGER NOT NULL,

    CONSTRAINT "Airdrop_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Airdrop_minterId_hash_address_quantity_key" ON "Airdrop"("minterId", "hash", "address", "quantity");

-- AddForeignKey
ALTER TABLE "Airdrop" ADD CONSTRAINT "Airdrop_minterId_fkey" FOREIGN KEY ("minterId") REFERENCES "Minter"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
