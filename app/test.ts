import { Provider, number, uint256 } from "starknet";

import { Project } from "./models/externals/project";

import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {

  const address = '0x5a85cf2c715955a5d8971e01d1d98e04c31d919b6d59824efb32cc72ae90e63';
  const url = 'https://starknet-goerli.infura.io/v3/f46a67c22ae24d98a6dde83028e735c0';
  const provider = new Provider({ rpc: { nodeUrl: url } });

  const model = new Project(address, provider);
  await model.init();

  const name = await model.getName();
  const symbol = await model.getSymbol();
  const totalSupply = await model.getTotalSupply();
  const contractUri = await model.getContractUri();
  const owner = await model.getOwner();

  const project = await prisma.project.create({
    data: {
      address: address,
      name: name,
      symbol: symbol,
      totalSupply: totalSupply,
      contractUri: contractUri,
      image: '',
      owner: owner,
    },
  })
  console.log(project)
}

main()
  .then(async () => {
    await prisma.$disconnect()
  })
  .catch(async (e) => {
    console.error(e)
    await prisma.$disconnect()
    process.exit(1)
  })
