-- CreateTable
CREATE TABLE "Project" (
    "id" SERIAL NOT NULL,
    "address" TEXT NOT NULL,
    "implementation" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "symbol" TEXT NOT NULL,
    "totalSupply" INTEGER NOT NULL,
    "contractUri" TEXT NOT NULL,
    "owner" TEXT NOT NULL,
    "tonEquivalent" DOUBLE PRECISION NOT NULL,
    "times" TIMESTAMP(3)[],
    "absorptions" DOUBLE PRECISION[],

    CONSTRAINT "Project_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Payment" (
    "id" SERIAL NOT NULL,
    "address" TEXT NOT NULL,
    "decimals" INTEGER NOT NULL,

    CONSTRAINT "Payment_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Minter" (
    "id" SERIAL NOT NULL,
    "address" TEXT NOT NULL,
    "implementation" TEXT NOT NULL,
    "maxSupply" INTEGER NOT NULL,
    "reservedSupply" INTEGER NOT NULL,
    "preSaleOpen" BOOLEAN NOT NULL,
    "publicSaleOpen" BOOLEAN NOT NULL,
    "maxBuyPerTx" INTEGER NOT NULL,
    "unitPrice" INTEGER NOT NULL,
    "whitelistMerkleRoot" INTEGER NOT NULL,
    "soldOut" BOOLEAN NOT NULL,
    "totalValue" DOUBLE PRECISION NOT NULL,
    "Whitelist" JSONB,
    "projectId" INTEGER NOT NULL,
    "paymentId" INTEGER NOT NULL,

    CONSTRAINT "Minter_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Token" (
    "id" SERIAL NOT NULL,
    "token_id" INTEGER NOT NULL,
    "uri" TEXT NOT NULL,
    "owner" TEXT NOT NULL,
    "projectId" INTEGER NOT NULL,

    CONSTRAINT "Token_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Offseter" (
    "id" SERIAL NOT NULL,
    "address" TEXT NOT NULL,
    "implementation" TEXT NOT NULL,
    "totalDeposited" INTEGER NOT NULL,
    "totalClaimed" DOUBLE PRECISION NOT NULL,
    "totalClaimable" DOUBLE PRECISION NOT NULL,
    "minClaimable" DOUBLE PRECISION NOT NULL,
    "projectId" INTEGER NOT NULL,

    CONSTRAINT "Offseter_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Snapshot" (
    "id" SERIAL NOT NULL,
    "previous_time" TIMESTAMP(3) NOT NULL,
    "previous_project_absorption" INTEGER NOT NULL,
    "previous_offseter_absorption" INTEGER NOT NULL,
    "previous_yielder_absorption" INTEGER NOT NULL,
    "current_project_absorption" INTEGER NOT NULL,
    "current_offseter_absorption" INTEGER NOT NULL,
    "current_yielder_absorption" INTEGER NOT NULL,
    "project_absorption" INTEGER NOT NULL,
    "offseter_absorption" INTEGER NOT NULL,
    "yielder_absorption" INTEGER NOT NULL,
    "time" TIMESTAMP(3) NOT NULL,
    "yielderId" INTEGER NOT NULL,
    "projectId" INTEGER NOT NULL,

    CONSTRAINT "Snapshot_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Yielder" (
    "id" SERIAL NOT NULL,
    "address" TEXT NOT NULL,
    "implementation" TEXT NOT NULL,
    "totalDeposited" DOUBLE PRECISION NOT NULL,
    "totalAbsorption" DOUBLE PRECISION NOT NULL,
    "snapshotedTime" TIMESTAMP(3) NOT NULL,
    "projectId" INTEGER NOT NULL,

    CONSTRAINT "Yielder_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Vesting" (
    "id" SERIAL NOT NULL,
    "vesting_id" INTEGER NOT NULL,
    "claimable" INTEGER NOT NULL,
    "time" TIMESTAMP(3) NOT NULL,
    "user" TEXT NOT NULL,
    "yielderId" INTEGER NOT NULL,
    "vesterId" INTEGER NOT NULL,

    CONSTRAINT "Vesting_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Vester" (
    "id" SERIAL NOT NULL,
    "address" TEXT NOT NULL,
    "implementation" TEXT NOT NULL,
    "totalAmount" DOUBLE PRECISION NOT NULL,
    "withdrawableAmount" DOUBLE PRECISION NOT NULL,

    CONSTRAINT "Vester_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Project_address_key" ON "Project"("address");

-- CreateIndex
CREATE UNIQUE INDEX "Payment_address_key" ON "Payment"("address");

-- CreateIndex
CREATE UNIQUE INDEX "Minter_address_key" ON "Minter"("address");

-- CreateIndex
CREATE UNIQUE INDEX "Offseter_address_key" ON "Offseter"("address");

-- CreateIndex
CREATE UNIQUE INDEX "Yielder_address_key" ON "Yielder"("address");

-- CreateIndex
CREATE UNIQUE INDEX "Vester_address_key" ON "Vester"("address");

-- AddForeignKey
ALTER TABLE "Minter" ADD CONSTRAINT "Minter_projectId_fkey" FOREIGN KEY ("projectId") REFERENCES "Project"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Minter" ADD CONSTRAINT "Minter_paymentId_fkey" FOREIGN KEY ("paymentId") REFERENCES "Payment"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Token" ADD CONSTRAINT "Token_projectId_fkey" FOREIGN KEY ("projectId") REFERENCES "Project"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Offseter" ADD CONSTRAINT "Offseter_projectId_fkey" FOREIGN KEY ("projectId") REFERENCES "Project"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Snapshot" ADD CONSTRAINT "Snapshot_yielderId_fkey" FOREIGN KEY ("yielderId") REFERENCES "Yielder"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Snapshot" ADD CONSTRAINT "Snapshot_projectId_fkey" FOREIGN KEY ("projectId") REFERENCES "Project"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Yielder" ADD CONSTRAINT "Yielder_projectId_fkey" FOREIGN KEY ("projectId") REFERENCES "Project"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Vesting" ADD CONSTRAINT "Vesting_yielderId_fkey" FOREIGN KEY ("yielderId") REFERENCES "Yielder"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Vesting" ADD CONSTRAINT "Vesting_vesterId_fkey" FOREIGN KEY ("vesterId") REFERENCES "Vester"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
