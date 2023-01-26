/*
  Warnings:

  - You are about to drop the column `hash` on the `Authentication` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[jwt]` on the table `Authentication` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `jwt` to the `Authentication` table without a default value. This is not possible if the table is not empty.

*/
-- DropIndex
DROP INDEX "Authentication_hash_key";

-- AlterTable
ALTER TABLE "Authentication" DROP COLUMN "hash",
ADD COLUMN     "jwt" TEXT NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "Authentication_jwt_key" ON "Authentication"("jwt");
