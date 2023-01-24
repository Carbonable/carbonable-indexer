-- CreateTable
CREATE TABLE "Implementation" (
    "id" SERIAL NOT NULL,
    "address" TEXT NOT NULL,
    "abi" JSONB NOT NULL,

    CONSTRAINT "Implementation_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Uri" (
    "id" SERIAL NOT NULL,
    "uri" TEXT NOT NULL,
    "data" JSONB NOT NULL,

    CONSTRAINT "Uri_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Project" (
    "id" SERIAL NOT NULL,
    "address" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "symbol" TEXT NOT NULL,
    "totalSupply" INTEGER NOT NULL,
    "owner" TEXT NOT NULL,
    "tonEquivalent" DOUBLE PRECISION NOT NULL,
    "times" TIMESTAMP(3)[],
    "absorptions" DOUBLE PRECISION[],
    "setup" BOOLEAN NOT NULL,
    "implementationId" INTEGER,
    "uriId" INTEGER,

    CONSTRAINT "Project_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Payment" (
    "id" SERIAL NOT NULL,
    "address" TEXT NOT NULL,
    "decimals" INTEGER NOT NULL,
    "implementationId" INTEGER,

    CONSTRAINT "Payment_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Minter" (
    "id" SERIAL NOT NULL,
    "address" TEXT NOT NULL,
    "maxSupply" INTEGER NOT NULL,
    "reservedSupply" INTEGER NOT NULL,
    "preSaleOpen" BOOLEAN NOT NULL,
    "publicSaleOpen" BOOLEAN NOT NULL,
    "maxBuyPerTx" INTEGER NOT NULL,
    "unitPrice" DOUBLE PRECISION NOT NULL,
    "whitelistMerkleRoot" TEXT NOT NULL,
    "soldOut" BOOLEAN NOT NULL,
    "totalValue" DOUBLE PRECISION NOT NULL,
    "Whitelist" JSONB,
    "projectId" INTEGER NOT NULL,
    "paymentId" INTEGER NOT NULL,
    "implementationId" INTEGER,

    CONSTRAINT "Minter_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Offseter" (
    "id" SERIAL NOT NULL,
    "address" TEXT NOT NULL,
    "totalDeposited" DOUBLE PRECISION NOT NULL,
    "totalClaimed" DOUBLE PRECISION NOT NULL,
    "totalClaimable" DOUBLE PRECISION NOT NULL,
    "minClaimable" DOUBLE PRECISION NOT NULL,
    "projectId" INTEGER NOT NULL,
    "implementationId" INTEGER,

    CONSTRAINT "Offseter_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Snapshot" (
    "id" SERIAL NOT NULL,
    "previousTime" TIMESTAMP(3) NOT NULL,
    "previousProjectAbsorption" DOUBLE PRECISION NOT NULL,
    "previousOffseterAbsorption" DOUBLE PRECISION NOT NULL,
    "previousYielderAbsorption" DOUBLE PRECISION NOT NULL,
    "currentProjectAbsorption" DOUBLE PRECISION NOT NULL,
    "currentOffseterAbsorption" DOUBLE PRECISION NOT NULL,
    "currentYielderAbsorption" DOUBLE PRECISION NOT NULL,
    "projectAbsorption" DOUBLE PRECISION NOT NULL,
    "offseterAbsorption" DOUBLE PRECISION NOT NULL,
    "yielderAbsorption" DOUBLE PRECISION NOT NULL,
    "time" TIMESTAMP(3) NOT NULL,
    "yielderId" INTEGER NOT NULL,

    CONSTRAINT "Snapshot_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Yielder" (
    "id" SERIAL NOT NULL,
    "address" TEXT NOT NULL,
    "totalDeposited" DOUBLE PRECISION NOT NULL,
    "totalAbsorption" DOUBLE PRECISION NOT NULL,
    "snapshotedTime" TIMESTAMP(3) NOT NULL,
    "projectId" INTEGER NOT NULL,
    "vesterId" INTEGER NOT NULL,
    "implementationId" INTEGER,

    CONSTRAINT "Yielder_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Vesting" (
    "id" SERIAL NOT NULL,
    "amount" DOUBLE PRECISION NOT NULL,
    "time" TIMESTAMP(3) NOT NULL,
    "yielderId" INTEGER NOT NULL,

    CONSTRAINT "Vesting_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Vester" (
    "id" SERIAL NOT NULL,
    "address" TEXT NOT NULL,
    "totalAmount" DOUBLE PRECISION NOT NULL,
    "withdrawableAmount" DOUBLE PRECISION NOT NULL,
    "implementationId" INTEGER,

    CONSTRAINT "Vester_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Transfer" (
    "id" SERIAL NOT NULL,
    "hash" TEXT NOT NULL,
    "from" TEXT NOT NULL,
    "to" TEXT NOT NULL,
    "tokenId" DOUBLE PRECISION NOT NULL,
    "time" TIMESTAMP(3) NOT NULL,
    "projectId" INTEGER NOT NULL,

    CONSTRAINT "Transfer_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Implementation_address_key" ON "Implementation"("address");

-- CreateIndex
CREATE UNIQUE INDEX "Uri_uri_key" ON "Uri"("uri");

-- CreateIndex
CREATE UNIQUE INDEX "Project_address_key" ON "Project"("address");

-- CreateIndex
CREATE UNIQUE INDEX "Payment_address_key" ON "Payment"("address");

-- CreateIndex
CREATE UNIQUE INDEX "Minter_address_key" ON "Minter"("address");

-- CreateIndex
CREATE UNIQUE INDEX "Offseter_address_key" ON "Offseter"("address");

-- CreateIndex
CREATE UNIQUE INDEX "Snapshot_yielderId_time_key" ON "Snapshot"("yielderId", "time");

-- CreateIndex
CREATE UNIQUE INDEX "Yielder_address_key" ON "Yielder"("address");

-- CreateIndex
CREATE UNIQUE INDEX "Vesting_time_key" ON "Vesting"("time");

-- CreateIndex
CREATE UNIQUE INDEX "Vesting_yielderId_time_key" ON "Vesting"("yielderId", "time");

-- CreateIndex
CREATE UNIQUE INDEX "Vester_address_key" ON "Vester"("address");

-- CreateIndex
CREATE UNIQUE INDEX "Transfer_projectId_hash_from_to_tokenId_key" ON "Transfer"("projectId", "hash", "from", "to", "tokenId");

-- AddForeignKey
ALTER TABLE "Project" ADD CONSTRAINT "Project_implementationId_fkey" FOREIGN KEY ("implementationId") REFERENCES "Implementation"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Project" ADD CONSTRAINT "Project_uriId_fkey" FOREIGN KEY ("uriId") REFERENCES "Uri"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Payment" ADD CONSTRAINT "Payment_implementationId_fkey" FOREIGN KEY ("implementationId") REFERENCES "Implementation"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Minter" ADD CONSTRAINT "Minter_projectId_fkey" FOREIGN KEY ("projectId") REFERENCES "Project"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Minter" ADD CONSTRAINT "Minter_paymentId_fkey" FOREIGN KEY ("paymentId") REFERENCES "Payment"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Minter" ADD CONSTRAINT "Minter_implementationId_fkey" FOREIGN KEY ("implementationId") REFERENCES "Implementation"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Offseter" ADD CONSTRAINT "Offseter_projectId_fkey" FOREIGN KEY ("projectId") REFERENCES "Project"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Offseter" ADD CONSTRAINT "Offseter_implementationId_fkey" FOREIGN KEY ("implementationId") REFERENCES "Implementation"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Snapshot" ADD CONSTRAINT "Snapshot_yielderId_fkey" FOREIGN KEY ("yielderId") REFERENCES "Yielder"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Yielder" ADD CONSTRAINT "Yielder_projectId_fkey" FOREIGN KEY ("projectId") REFERENCES "Project"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Yielder" ADD CONSTRAINT "Yielder_vesterId_fkey" FOREIGN KEY ("vesterId") REFERENCES "Vester"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Yielder" ADD CONSTRAINT "Yielder_implementationId_fkey" FOREIGN KEY ("implementationId") REFERENCES "Implementation"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Vesting" ADD CONSTRAINT "Vesting_yielderId_fkey" FOREIGN KEY ("yielderId") REFERENCES "Yielder"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Vester" ADD CONSTRAINT "Vester_implementationId_fkey" FOREIGN KEY ("implementationId") REFERENCES "Implementation"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Transfer" ADD CONSTRAINT "Transfer_projectId_fkey" FOREIGN KEY ("projectId") REFERENCES "Project"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
