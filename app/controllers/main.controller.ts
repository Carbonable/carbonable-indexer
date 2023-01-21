import { v1alpha2 } from '@apibara/protocol'
import { FieldElement, Filter, StarkNetCursor, v1alpha2 as starknet } from '@apibara/starknet'

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

    async configure(
        cursor: v1alpha2.ICursor = StarkNetCursor.createWithBlockNumber(1),
        finality: v1alpha2.DataFinality = v1alpha2.DataFinality.DATA_STATUS_ACCEPTED
    ) {
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
            const batch = message.data?.data;
            if (batch) {
                await main.handleBatch(batch);
            }
        }
    },

    async restart(_request: Request, response: Response) {
        await main.configure();

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
        await Promise.all([
            main.handleEvents(block),
            main.handleEntries(block),
        ])
        const blockNumber = Number(block.header?.blockNumber.toString());
        logger.block(blockNumber);
    },

    async handleEvents(block: starknet.Block) {
        // https://github.com/apibara/typescript-sdk/blob/main/examples/simple-client/src/main.ts
        for (const { transaction, event } of block.events) {
            const hash = transaction?.meta?.hash
            if (!event || !event.data || !hash) {
                continue
            }
            const key = FieldElement.toHex(event.keys[0]);
            await Promise.all([
                project.handleEvent(block, transaction, event, key),
                minter.handleEvent(event, key),
                vester.handleEvent(event, key),
                offseter.handleEvent(event, key),
                yielder.handleEvent(event, key),
            ]);
        }
    },

    async handleEntries(block: starknet.Block) {
        // https://github.com/apibara/typescript-sdk/blob/main/examples/simple-client/src/main.ts
        const storageDiffs = block.stateUpdate?.stateDiff?.storageDiffs ?? []
        for (let diff of storageDiffs) {
            const contractAddress = FieldElement.toHex(diff.contractAddress);
            for (let entry of diff.storageEntries ?? []) {
                if (!entry.key || !entry.value) {
                    continue
                }
                await Promise.all([
                    project.handleEntry(contractAddress, entry),
                    minter.handleEntry(contractAddress, entry),
                    vester.handleEntry(contractAddress, entry),
                    offseter.handleEntry(contractAddress, entry),
                    yielder.handleEntry(contractAddress, entry),
                ]);
            }
        }
    },
}

export default main;