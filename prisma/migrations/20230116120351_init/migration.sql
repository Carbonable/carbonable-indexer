-- CreateTable
CREATE TABLE "Block" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "blockId" INTEGER NOT NULL,

    CONSTRAINT "Block_pkey" PRIMARY KEY ("id")
);
