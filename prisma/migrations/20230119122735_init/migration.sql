/*
  Warnings:

  - You are about to drop the column `abi` on the `Minter` table. All the data in the column will be lost.
  - You are about to drop the column `implementation` on the `Minter` table. All the data in the column will be lost.
  - You are about to drop the column `abi` on the `Offseter` table. All the data in the column will be lost.
  - You are about to drop the column `implementation` on the `Offseter` table. All the data in the column will be lost.
  - You are about to drop the column `implementation` on the `Project` table. All the data in the column will be lost.
  - You are about to drop the column `abi` on the `Vester` table. All the data in the column will be lost.
  - You are about to drop the column `implementation` on the `Vester` table. All the data in the column will be lost.
  - You are about to drop the column `abi` on the `Yielder` table. All the data in the column will be lost.
  - You are about to drop the column `implementation` on the `Yielder` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Minter" DROP COLUMN "abi",
DROP COLUMN "implementation";

-- AlterTable
ALTER TABLE "Offseter" DROP COLUMN "abi",
DROP COLUMN "implementation";

-- AlterTable
ALTER TABLE "Project" DROP COLUMN "implementation",
ADD COLUMN     "uriId" INTEGER;

-- AlterTable
ALTER TABLE "Vester" DROP COLUMN "abi",
DROP COLUMN "implementation";

-- AlterTable
ALTER TABLE "Yielder" DROP COLUMN "abi",
DROP COLUMN "implementation";

-- CreateTable
CREATE TABLE "Uri" (
    "id" SERIAL NOT NULL,
    "uri" TEXT NOT NULL,
    "data" JSONB NOT NULL,

    CONSTRAINT "Uri_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Uri_uri_key" ON "Uri"("uri");

-- AddForeignKey
ALTER TABLE "Project" ADD CONSTRAINT "Project_uriId_fkey" FOREIGN KEY ("uriId") REFERENCES "Uri"("id") ON DELETE SET NULL ON UPDATE CASCADE;
