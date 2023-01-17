import { proto, hexToBuffer, bufferToHex } from "@apibara/protocol";
import { Block, TransactionReceipt } from "@apibara/starknet";

import logger from "../handlers/logger";

import prisma from '../models/database/client';
import indexer, { START_BLOCK, INDEXER_NAME } from '../models/indexer/client';
import { UPGRADED } from '../models/starknet/contract';
import { DEPOSIT, WITHDRAW, CLAIM } from '../models/starknet/offseter';
import { SNAPSHOT, VESTING } from '../models/starknet/yielder';

import project from './project.controller';
import minter from './minter.controller';
import vester from './vester.controller';
import offseter from './offseter.controller';
import yielder from './yielder.controller';

// import data from '../models/database/mainnet.data.json';
import data from '../models/database/testnet.data.json';

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
            if (event && event.keys[0]) {
                project.handleEvent(event);
                minter.handleEvent(event);
                vester.handleEvent(event);
                offseter.handleEvent(event);
                yielder.handleEvent(event);
            }
        });
    },
}

export default main;