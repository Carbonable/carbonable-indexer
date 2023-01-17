/*
  Warnings:

  - A unique constraint covering the columns `[yielderId,time]` on the table `Snapshot` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[time]` on the table `Vesting` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[yielderId,time]` on the table `Vesting` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "Snapshot_yielderId_time_key" ON "Snapshot"("yielderId", "time");

-- CreateIndex
CREATE UNIQUE INDEX "Vesting_time_key" ON "Vesting"("time");

-- CreateIndex
CREATE UNIQUE INDEX "Vesting_yielderId_time_key" ON "Vesting"("yielderId", "time");
