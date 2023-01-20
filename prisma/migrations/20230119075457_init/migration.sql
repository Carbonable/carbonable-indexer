-- CreateTable
CREATE TABLE "Transfer" (
    "id" SERIAL NOT NULL,
    "hash" TEXT NOT NULL,
    "from" TEXT NOT NULL,
    "to" TEXT NOT NULL,
    "time" TIMESTAMP(3) NOT NULL,
    "projectId" INTEGER NOT NULL,

    CONSTRAINT "Transfer_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Transfer_hash_key" ON "Transfer"("hash");

-- AddForeignKey
ALTER TABLE "Transfer" ADD CONSTRAINT "Transfer_projectId_fkey" FOREIGN KEY ("projectId") REFERENCES "Project"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
