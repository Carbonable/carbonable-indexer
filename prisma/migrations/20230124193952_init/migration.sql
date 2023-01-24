-- CreateTable
CREATE TABLE "TransferSingle" (
    "id" SERIAL NOT NULL,
    "hash" TEXT NOT NULL,
    "from" TEXT NOT NULL,
    "to" TEXT NOT NULL,
    "tokenId" DOUBLE PRECISION NOT NULL,
    "time" TIMESTAMP(3) NOT NULL,
    "badgeId" INTEGER NOT NULL,

    CONSTRAINT "TransferSingle_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "TransferSingle_badgeId_hash_from_to_tokenId_key" ON "TransferSingle"("badgeId", "hash", "from", "to", "tokenId");

-- AddForeignKey
ALTER TABLE "TransferSingle" ADD CONSTRAINT "TransferSingle_badgeId_fkey" FOREIGN KEY ("badgeId") REFERENCES "Badge"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
