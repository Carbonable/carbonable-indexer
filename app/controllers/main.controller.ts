import { proto, hexToBuffer } from "@apibara/protocol";
import { Block, TransactionReceipt } from "@apibara/starknet";

import logger from "../handlers/logger";

import prisma from '../models/database/client';
import indexer, { START_BLOCK, INDEXER_NAME } from '../models/indexer/client';
import { UPGRADED } from '../models/starknet/contract';
import { ABSORPTION_UPDATE } from '../models/starknet/project';
import { PRE_SALE_OPEN, PRE_SALE_CLOSE, PUBLIC_SALE_OPEN, PUBLIC_SALE_CLOSE, SOLD_OUT } from '../models/starknet/minter';
import { DEPOSIT, WITHDRAW, CLAIM } from '../models/starknet/offseter';
import { SNAPSHOT, VESTING } from '../models/starknet/yielder';

import project from './project.controller';
import minter from './minter.controller';
import vester from './vester.controller';
import offseter from './offseter.controller';
import yielder from './yielder.controller';

import data from '../models/database/mainnet.data.json';

const main = {

    async init() {
        data.forEach(async (content: { project: string, minter: string, vester: string, offseter: string, yielder: string }) => {
            const isProject = await project.read({ address: content.project })
            if (!isProject) {
                await project.create(content.project);
            }

            const isMinter = await minter.read({ address: content.minter })
            if (!isMinter) {
                await minter.create(content.minter);
            }

            const isVester = await vester.read({ address: content.vester })
            if (!isVester) {
                await vester.create(content.vester);
            }

            const isOffseter = await offseter.read({ address: content.offseter })
            if (!isOffseter) {
                await offseter.create(content.offseter);
            }

            const isYielder = await yielder.read({ address: content.yielder })
            if (!isYielder) {
                await yielder.create(content.yielder);
            }
        });
    },

    async run() {
        // Read or create indexer
        let block = await prisma.block.findUnique({ where: { name: INDEXER_NAME } });
        if (!block) {
            const data = { name: INDEXER_NAME, number: START_BLOCK }
            block = await prisma.block.create({ data })
        }

        // Run stream
        const messages = indexer.streamMessages({ startingSequence: START_BLOCK || block.number }); // TODO: remove
        return new Promise((resolve, reject) => {
            messages.on("end", resolve);
            messages.on("error", reject);
            messages.on("data", main.handleData);
        });
    },

    async handleData(message: proto.StreamMessagesResponse__Output) {
        if (message.data) {
            if (!message.data.data.value) {
                throw new Error("received invalid data");
            }
            const block = Block.decode(message.data.data.value);
            await main.handleBlock(block);
        } else if (message.invalidate) {
            logger.error(String(message.invalidate));
        }
    },

    async handleBlock(block: Block) {
        // Loop over txs
        block.transactionReceipts.forEach(async (receipt) => {
            main.handleTransaction(receipt);
        });

        // updated indexed block
        logger.block(block.blockNumber);
        await prisma.block.update({
            where: { name: INDEXER_NAME },
            data: { number: block.blockNumber }
        });
    },

    async handleTransaction(receipt: TransactionReceipt) {
        // Loop over tx events
        receipt.events.forEach(async (event) => {
            let found: { address?: string };

            const projects = await prisma.project.findMany();
            found = projects.find(model => hexToBuffer(model.address, 32).equals(event.fromAddress));
            if (found) {
                if (UPGRADED.equals(event.keys[0])) {
                    project.handleUpgraded(found.address);
                } else if (ABSORPTION_UPDATE.equals(event.keys[0])) {
                    project.handleAbsorptionUpdate(found.address);
                };
                return;
            };

            const minters = await prisma.minter.findMany();
            found = minters.find(model => hexToBuffer(model.address, 32).equals(event.fromAddress));
            if (found) {
                if (UPGRADED.equals(event.keys[0])) {
                    minter.handleUpgraded(found.address);
                } else if (PRE_SALE_OPEN.equals(event.keys[0]) || PRE_SALE_CLOSE.equals(event.keys[0])) {
                    minter.handlePreSale(found.address);
                } else if (PUBLIC_SALE_OPEN.equals(event.keys[0]) || PUBLIC_SALE_CLOSE.equals(event.keys[0])) {
                    minter.handlePublicSale(found.address);
                } else if (SOLD_OUT.equals(event.keys[0])) {
                    minter.handleSoldOut(found.address);
                };
                return;
            };

            const vesters = await prisma.vester.findMany();
            found = vesters.find(model => hexToBuffer(model.address, 32).equals(event.fromAddress));
            if (found) {
                if (UPGRADED.equals(event.keys[0])) {
                    vester.handleUpgraded(found.address);
                };
                return;
            };

            const offseters = await prisma.offseter.findMany();
            found = offseters.find(model => hexToBuffer(model.address, 32).equals(event.fromAddress));
            if (found) {
                if (UPGRADED.equals(event.keys[0])) {
                    offseter.handleUpgraded(found.address);
                } else if (DEPOSIT.equals(event.keys[0]) || WITHDRAW.equals(event.keys[0])) {
                    offseter.handleDepositOrWithdraw(found.address);
                } else if (CLAIM.equals(event.keys[0])) {
                    offseter.handleClaim(found.address);
                };
                return;
            };

            const yielders = await prisma.yielder.findMany();
            found = yielders.find(model => hexToBuffer(model.address, 32).equals(event.fromAddress));
            if (found) {
                if (UPGRADED.equals(event.keys[0])) {
                    yielder.handleUpgraded(found.address);
                } else if (DEPOSIT.equals(event.keys[0]) || WITHDRAW.equals(event.keys[0])) {
                    yielder.handleDepositOrWithdraw(found.address);
                } else if (SNAPSHOT.equals(event.keys[0])) {
                    // Remove first value and convert the rest
                    const args = event.data.slice(1).map((row) => Buffer.from(row).toString());
                    yielder.handleSnapshot(found.address, args);
                } else if (VESTING.equals(event.keys[0])) {
                    // Remove first value and convert the rest
                    const args = event.data.slice(1).map((row) => Buffer.from(row).toString());
                    yielder.handleVesting(found.address, args);
                };
                return;
            };
        });
    },
}

export default main;