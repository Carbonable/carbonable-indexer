-- AlterTable
ALTER TABLE "Minter" ADD COLUMN     "implementationId" INTEGER;

-- AlterTable
ALTER TABLE "Offseter" ADD COLUMN     "implementationId" INTEGER;

-- AlterTable
ALTER TABLE "Project" ADD COLUMN     "implementationId" INTEGER;

-- AlterTable
ALTER TABLE "Vester" ADD COLUMN     "implementationId" INTEGER;

-- AlterTable
ALTER TABLE "Yielder" ADD COLUMN     "implementationId" INTEGER;

-- CreateTable
CREATE TABLE "Implementation" (
    "id" SERIAL NOT NULL,
    "abi" JSONB NOT NULL,

    CONSTRAINT "Implementation_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Implementation_abi_key" ON "Implementation"("abi");

-- AddForeignKey
ALTER TABLE "Project" ADD CONSTRAINT "Project_implementationId_fkey" FOREIGN KEY ("implementationId") REFERENCES "Implementation"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Minter" ADD CONSTRAINT "Minter_implementationId_fkey" FOREIGN KEY ("implementationId") REFERENCES "Implementation"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Offseter" ADD CONSTRAINT "Offseter_implementationId_fkey" FOREIGN KEY ("implementationId") REFERENCES "Implementation"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Yielder" ADD CONSTRAINT "Yielder_implementationId_fkey" FOREIGN KEY ("implementationId") REFERENCES "Implementation"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Vester" ADD CONSTRAINT "Vester_implementationId_fkey" FOREIGN KEY ("implementationId") REFERENCES "Implementation"("id") ON DELETE SET NULL ON UPDATE CASCADE;
