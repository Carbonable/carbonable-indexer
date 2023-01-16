/*
  Warnings:

  - You are about to drop the column `current_offseter_absorption` on the `Snapshot` table. All the data in the column will be lost.
  - You are about to drop the column `current_project_absorption` on the `Snapshot` table. All the data in the column will be lost.
  - You are about to drop the column `current_yielder_absorption` on the `Snapshot` table. All the data in the column will be lost.
  - You are about to drop the column `offseter_absorption` on the `Snapshot` table. All the data in the column will be lost.
  - You are about to drop the column `previous_offseter_absorption` on the `Snapshot` table. All the data in the column will be lost.
  - You are about to drop the column `previous_project_absorption` on the `Snapshot` table. All the data in the column will be lost.
  - You are about to drop the column `previous_time` on the `Snapshot` table. All the data in the column will be lost.
  - You are about to drop the column `previous_yielder_absorption` on the `Snapshot` table. All the data in the column will be lost.
  - You are about to drop the column `projectId` on the `Snapshot` table. All the data in the column will be lost.
  - You are about to drop the column `project_absorption` on the `Snapshot` table. All the data in the column will be lost.
  - You are about to drop the column `yielder_absorption` on the `Snapshot` table. All the data in the column will be lost.
  - You are about to drop the column `vesting_id` on the `Vesting` table. All the data in the column will be lost.
  - You are about to drop the `Token` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `currentOffseterAbsorption` to the `Snapshot` table without a default value. This is not possible if the table is not empty.
  - Added the required column `currentProjectAbsorption` to the `Snapshot` table without a default value. This is not possible if the table is not empty.
  - Added the required column `currentYielderAbsorption` to the `Snapshot` table without a default value. This is not possible if the table is not empty.
  - Added the required column `offseterAbsorption` to the `Snapshot` table without a default value. This is not possible if the table is not empty.
  - Added the required column `previousOffseterAbsorption` to the `Snapshot` table without a default value. This is not possible if the table is not empty.
  - Added the required column `previousProjectAbsorption` to the `Snapshot` table without a default value. This is not possible if the table is not empty.
  - Added the required column `previousTime` to the `Snapshot` table without a default value. This is not possible if the table is not empty.
  - Added the required column `previousYielderAbsorption` to the `Snapshot` table without a default value. This is not possible if the table is not empty.
  - Added the required column `projectAbsorption` to the `Snapshot` table without a default value. This is not possible if the table is not empty.
  - Added the required column `yielderAbsorption` to the `Snapshot` table without a default value. This is not possible if the table is not empty.
  - Added the required column `vestingId` to the `Vesting` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "Snapshot" DROP CONSTRAINT "Snapshot_projectId_fkey";

-- DropForeignKey
ALTER TABLE "Token" DROP CONSTRAINT "Token_projectId_fkey";

-- AlterTable
ALTER TABLE "Block" ALTER COLUMN "number" SET DATA TYPE DOUBLE PRECISION;

-- AlterTable
ALTER TABLE "Offseter" ALTER COLUMN "totalDeposited" SET DATA TYPE DOUBLE PRECISION;

-- AlterTable
ALTER TABLE "Snapshot" DROP COLUMN "current_offseter_absorption",
DROP COLUMN "current_project_absorption",
DROP COLUMN "current_yielder_absorption",
DROP COLUMN "offseter_absorption",
DROP COLUMN "previous_offseter_absorption",
DROP COLUMN "previous_project_absorption",
DROP COLUMN "previous_time",
DROP COLUMN "previous_yielder_absorption",
DROP COLUMN "projectId",
DROP COLUMN "project_absorption",
DROP COLUMN "yielder_absorption",
ADD COLUMN     "currentOffseterAbsorption" DOUBLE PRECISION NOT NULL,
ADD COLUMN     "currentProjectAbsorption" DOUBLE PRECISION NOT NULL,
ADD COLUMN     "currentYielderAbsorption" DOUBLE PRECISION NOT NULL,
ADD COLUMN     "offseterAbsorption" DOUBLE PRECISION NOT NULL,
ADD COLUMN     "previousOffseterAbsorption" DOUBLE PRECISION NOT NULL,
ADD COLUMN     "previousProjectAbsorption" DOUBLE PRECISION NOT NULL,
ADD COLUMN     "previousTime" TIMESTAMP(3) NOT NULL,
ADD COLUMN     "previousYielderAbsorption" DOUBLE PRECISION NOT NULL,
ADD COLUMN     "projectAbsorption" DOUBLE PRECISION NOT NULL,
ADD COLUMN     "yielderAbsorption" DOUBLE PRECISION NOT NULL;

-- AlterTable
ALTER TABLE "Vesting" DROP COLUMN "vesting_id",
ADD COLUMN     "vestingId" DOUBLE PRECISION NOT NULL,
ALTER COLUMN "claimable" SET DATA TYPE DOUBLE PRECISION;

-- DropTable
DROP TABLE "Token";
