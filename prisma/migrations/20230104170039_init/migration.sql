-- CreateTable
CREATE TABLE "Project" (
    "id" SERIAL NOT NULL,
    "address" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "symbol" TEXT NOT NULL,
    "totalSupply" INTEGER NOT NULL,
    "contractUri" TEXT NOT NULL,
    "image" TEXT NOT NULL,
    "owner" TEXT NOT NULL,

    CONSTRAINT "Project_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Payment" (
    "id" SERIAL NOT NULL,
    "decimal" INTEGER NOT NULL,

    CONSTRAINT "Payment_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Minter" (
    "id" SERIAL NOT NULL,
    "maxSupply" INTEGER NOT NULL,
    "reservedSupply" INTEGER NOT NULL,
    "whitelistedSaleOpen" BOOLEAN NOT NULL,
    "publicSaleOpen" BOOLEAN NOT NULL,
    "maxBuyPerTx" INTEGER NOT NULL,
    "unitPrice" INTEGER NOT NULL,
    "whitelistMerkleRoot" INTEGER NOT NULL,
    "soldOut" BOOLEAN NOT NULL,
    "projectId" INTEGER NOT NULL,
    "paymentId" INTEGER NOT NULL,

    CONSTRAINT "Minter_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Project_address_key" ON "Project"("address");

-- AddForeignKey
ALTER TABLE "Minter" ADD CONSTRAINT "Minter_projectId_fkey" FOREIGN KEY ("projectId") REFERENCES "Project"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Minter" ADD CONSTRAINT "Minter_paymentId_fkey" FOREIGN KEY ("paymentId") REFERENCES "Payment"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
