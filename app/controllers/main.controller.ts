import { v1alpha2 } from '@apibara/protocol'
import { FieldElement, Filter, v1alpha2 as starknet } from '@apibara/starknet'

import logger from "../handlers/logger";

import { data } from '../models/database/client';
import indexer from '../models/indexer/client';

import project from './project.controller';
import minter from './minter.controller';
import vester from './vester.controller';
import offseter from './offseter.controller';
import yielder from './yielder.controller';
import { Request, Response } from 'express';

const main = {
    cursor: undefined,

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

    async configure(cursor?: v1alpha2.ICursor, finality: v1alpha2.DataFinality = v1alpha2.DataFinality.DATA_STATUS_ACCEPTED) {
        const filter = Filter.create().withHeader({ weak: true });

        await project.setFilter(filter);
        await minter.setFilter(filter);
        await vester.setFilter(filter);
        await offseter.setFilter(filter);
        await yielder.setFilter(filter);

        indexer.configure({
            filter: filter.encode(),
            batchSize: 1,
            cursor,
            finality,
        })
    },

    async run() {
        // Configure stream
        await main.configure();

        for await (const message of indexer) {
            // Initialize the cursor at the first cursor to restart from it
            if (!main.cursor) {
                main.cursor = message.data?.endCursor;
            }
            const batch = message.data?.data;
            if (batch) {
                await main.handleBatch(batch);
            }
        }
    },

    async restart(_request: Request, response: Response) {
        await main.configure(main.cursor);

        const message = 'Indexer restarted from the initial cursor';
        const code = 200;
        return response.status(code).json({ message, code });
    },

    async handleBatch(batch: Uint8Array[]) {
        for (const item of batch) {
            const block = starknet.Block.decode(item);
            await main.handleBlock(block);
        };
    },

    async handleBlock(block: starknet.Block) {
        // Loop over txs
        for await (const { transaction, event } of block.events) {
            const key = FieldElement.toHex(event.keys[0]);
            project.handleEvent(block, transaction, event, key);
            minter.handleEvent(event, key);
            vester.handleEvent(event, key);
            offseter.handleEvent(event, key);
            yielder.handleEvent(event, key);
        }
        // console.log(block.transactions)
        // for await (const { transaction } of block.transactions) {
        //     console.log(transaction)
        //     const entrypoint = FieldElement.toHex(transaction.invokeV0.entryPointSelector);
        //     project.handleTransaction(block, transaction, entrypoint);
        // }

        // updated indexed block
        const blockNumber = Number(block.header?.blockNumber.toString());
        logger.block(blockNumber);
    },
}

export default main;