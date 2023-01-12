/*
  Warnings:

  - A unique constraint covering the columns `[address]` on the table `Minter` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[address]` on the table `Payment` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `address` to the `Minter` table without a default value. This is not possible if the table is not empty.
  - Added the required column `address` to the `Payment` table without a default value. This is not possible if the table is not empty.
  - Added the required column `ton_equivalent` to the `Project` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "Minter" DROP CONSTRAINT "Minter_paymentId_fkey";

-- DropForeignKey
ALTER TABLE "Minter" DROP CONSTRAINT "Minter_projectId_fkey";

-- AlterTable
ALTER TABLE "Minter" ADD COLUMN     "address" TEXT NOT NULL,
ALTER COLUMN "projectId" DROP NOT NULL,
ALTER COLUMN "paymentId" DROP NOT NULL;

-- AlterTable
ALTER TABLE "Payment" ADD COLUMN     "address" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "Project" ADD COLUMN     "absorptions" INTEGER[],
ADD COLUMN     "times" TIMESTAMP(3)[],
ADD COLUMN     "ton_equivalent" INTEGER NOT NULL;

-- CreateTable
CREATE TABLE "Token" (
    "id" SERIAL NOT NULL,
    "token_id" INTEGER NOT NULL,
    "uri" TEXT NOT NULL,
    "projectId" INTEGER NOT NULL,
    "userId" INTEGER,

    CONSTRAINT "Token_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "User" (
    "id" SERIAL NOT NULL,
    "address" TEXT NOT NULL,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Whitelist" (
    "id" SERIAL NOT NULL,
    "proofs" JSONB NOT NULL,

    CONSTRAINT "Whitelist_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Offseter" (
    "id" SERIAL NOT NULL,
    "address" TEXT NOT NULL,
    "total_deposited" INTEGER NOT NULL,
    "min_claimable" INTEGER NOT NULL,
    "projectId" INTEGER,

    CONSTRAINT "Offseter_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Snapshot" (
    "id" SERIAL NOT NULL,
    "previous_time" TIMESTAMP(3) NOT NULL,
    "previous_project_absorption" INTEGER NOT NULL,
    "previous_offseter_absorption" INTEGER NOT NULL,
    "previous_yielder_absorption" INTEGER NOT NULL,
    "current_project_absorption" INTEGER NOT NULL,
    "current_offseter_absorption" INTEGER NOT NULL,
    "current_yielder_absorption" INTEGER NOT NULL,
    "project_absorption" INTEGER NOT NULL,
    "offseter_absorption" INTEGER NOT NULL,
    "yielder_absorption" INTEGER NOT NULL,
    "time" TIMESTAMP(3) NOT NULL,
    "yielderId" INTEGER,
    "projectId" INTEGER,

    CONSTRAINT "Snapshot_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Yielder" (
    "id" SERIAL NOT NULL,
    "address" TEXT NOT NULL,
    "total_deposited" INTEGER NOT NULL,
    "projectId" INTEGER,

    CONSTRAINT "Yielder_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Vesting" (
    "id" SERIAL NOT NULL,
    "vesting_id" INTEGER NOT NULL,
    "claimable" INTEGER NOT NULL,
    "time" TIMESTAMP(3) NOT NULL,
    "yielderId" INTEGER,
    "vesterId" INTEGER,
    "userId" INTEGER,

    CONSTRAINT "Vesting_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Vester" (
    "id" SERIAL NOT NULL,
    "address" TEXT NOT NULL,

    CONSTRAINT "Vester_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "_UserToWhitelist" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL
);

-- CreateTable
CREATE TABLE "_UserToYielder" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL
);

-- CreateTable
CREATE TABLE "_OffseterToUser" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "User_address_key" ON "User"("address");

-- CreateIndex
CREATE UNIQUE INDEX "Offseter_address_key" ON "Offseter"("address");

-- CreateIndex
CREATE UNIQUE INDEX "Yielder_address_key" ON "Yielder"("address");

-- CreateIndex
CREATE UNIQUE INDEX "Vester_address_key" ON "Vester"("address");

-- CreateIndex
CREATE UNIQUE INDEX "_UserToWhitelist_AB_unique" ON "_UserToWhitelist"("A", "B");

-- CreateIndex
CREATE INDEX "_UserToWhitelist_B_index" ON "_UserToWhitelist"("B");

-- CreateIndex
CREATE UNIQUE INDEX "_UserToYielder_AB_unique" ON "_UserToYielder"("A", "B");

-- CreateIndex
CREATE INDEX "_UserToYielder_B_index" ON "_UserToYielder"("B");

-- CreateIndex
CREATE UNIQUE INDEX "_OffseterToUser_AB_unique" ON "_OffseterToUser"("A", "B");

-- CreateIndex
CREATE INDEX "_OffseterToUser_B_index" ON "_OffseterToUser"("B");

-- CreateIndex
CREATE UNIQUE INDEX "Minter_address_key" ON "Minter"("address");

-- CreateIndex
CREATE UNIQUE INDEX "Payment_address_key" ON "Payment"("address");

-- AddForeignKey
ALTER TABLE "Minter" ADD CONSTRAINT "Minter_projectId_fkey" FOREIGN KEY ("projectId") REFERENCES "Project"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Minter" ADD CONSTRAINT "Minter_paymentId_fkey" FOREIGN KEY ("paymentId") REFERENCES "Payment"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Token" ADD CONSTRAINT "Token_projectId_fkey" FOREIGN KEY ("projectId") REFERENCES "Project"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Token" ADD CONSTRAINT "Token_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Offseter" ADD CONSTRAINT "Offseter_projectId_fkey" FOREIGN KEY ("projectId") REFERENCES "Project"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Snapshot" ADD CONSTRAINT "Snapshot_yielderId_fkey" FOREIGN KEY ("yielderId") REFERENCES "Yielder"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Snapshot" ADD CONSTRAINT "Snapshot_projectId_fkey" FOREIGN KEY ("projectId") REFERENCES "Project"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Yielder" ADD CONSTRAINT "Yielder_projectId_fkey" FOREIGN KEY ("projectId") REFERENCES "Project"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Vesting" ADD CONSTRAINT "Vesting_yielderId_fkey" FOREIGN KEY ("yielderId") REFERENCES "Yielder"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Vesting" ADD CONSTRAINT "Vesting_vesterId_fkey" FOREIGN KEY ("vesterId") REFERENCES "Vester"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Vesting" ADD CONSTRAINT "Vesting_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_UserToWhitelist" ADD CONSTRAINT "_UserToWhitelist_A_fkey" FOREIGN KEY ("A") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_UserToWhitelist" ADD CONSTRAINT "_UserToWhitelist_B_fkey" FOREIGN KEY ("B") REFERENCES "Whitelist"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_UserToYielder" ADD CONSTRAINT "_UserToYielder_A_fkey" FOREIGN KEY ("A") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_UserToYielder" ADD CONSTRAINT "_UserToYielder_B_fkey" FOREIGN KEY ("B") REFERENCES "Yielder"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_OffseterToUser" ADD CONSTRAINT "_OffseterToUser_A_fkey" FOREIGN KEY ("A") REFERENCES "Offseter"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_OffseterToUser" ADD CONSTRAINT "_OffseterToUser_B_fkey" FOREIGN KEY ("B") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
