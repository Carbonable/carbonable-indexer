-- DropForeignKey
ALTER TABLE "Snapshot" DROP CONSTRAINT "Snapshot_yielderId_fkey";

-- DropForeignKey
ALTER TABLE "Vesting" DROP CONSTRAINT "Vesting_yielderId_fkey";

-- AddForeignKey
ALTER TABLE "Snapshot" ADD CONSTRAINT "Snapshot_yielderId_fkey" FOREIGN KEY ("yielderId") REFERENCES "Yielder"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Vesting" ADD CONSTRAINT "Vesting_yielderId_fkey" FOREIGN KEY ("yielderId") REFERENCES "Yielder"("id") ON DELETE CASCADE ON UPDATE CASCADE;
