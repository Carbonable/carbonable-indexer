/*
  Warnings:

  - You are about to drop the column `jwt` on the `Authentication` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[token]` on the table `Authentication` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `token` to the `Authentication` table without a default value. This is not possible if the table is not empty.

*/
-- DropIndex
DROP INDEX "Authentication_jwt_key";

-- AlterTable
ALTER TABLE "Authentication" DROP COLUMN "jwt",
ADD COLUMN     "token" TEXT NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "Authentication_token_key" ON "Authentication"("token");
