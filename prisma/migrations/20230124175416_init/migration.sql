-- CreateTable
CREATE TABLE "Badge" (
    "id" SERIAL NOT NULL,
    "address" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "owner" TEXT NOT NULL,
    "implementationId" INTEGER,
    "uriId" INTEGER,

    CONSTRAINT "Badge_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Badge_address_key" ON "Badge"("address");

-- AddForeignKey
ALTER TABLE "Badge" ADD CONSTRAINT "Badge_implementationId_fkey" FOREIGN KEY ("implementationId") REFERENCES "Implementation"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Badge" ADD CONSTRAINT "Badge_uriId_fkey" FOREIGN KEY ("uriId") REFERENCES "Uri"("id") ON DELETE SET NULL ON UPDATE CASCADE;
