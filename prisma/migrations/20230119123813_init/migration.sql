/*
  Warnings:

  - You are about to drop the column `abi` on the `Payment` table. All the data in the column will be lost.
  - You are about to drop the column `abi` on the `Project` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Payment" DROP COLUMN "abi",
ADD COLUMN     "implementationId" INTEGER;

-- AlterTable
ALTER TABLE "Project" DROP COLUMN "abi";

-- AddForeignKey
ALTER TABLE "Payment" ADD CONSTRAINT "Payment_implementationId_fkey" FOREIGN KEY ("implementationId") REFERENCES "Implementation"("id") ON DELETE SET NULL ON UPDATE CASCADE;
