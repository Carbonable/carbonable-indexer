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
        // Configure stream
        const filter = Filter.create().withHeader({ weak: false });

        await project.setFilter(filter);
        await minter.setFilter(filter);
        await vester.setFilter(filter);
        await offseter.setFilter(filter);
        await yielder.setFilter(filter);

        indexer.configure({
            filter: filter.encode(),
            batchSize: 1,
            finality: v1alpha2.DataFinality.DATA_STATUS_ACCEPTED,
        })

        for await (const message of indexer) {
            const batch = message.data?.data;
            if (batch) {
                main.handleBatch(batch);
            }
        }
    },

    async handleBatch(batch: Uint8Array[]) {
        for (const item of batch) {
            const block = starknet.Block.decode(item);
            await main.handleBlock(block);
        };
    },

    async handleBlock(block: starknet.Block) {
        // Loop over txs
        for await (const { event } of block.events) {
            const key = FieldElement.toHex(event.keys[0]);
            project.handleEvent(event, key);
            minter.handleEvent(event, key);
            vester.handleEvent(event, key);
            offseter.handleEvent(event, key);
            yielder.handleEvent(event, key);
        }

        // updated indexed block
        const blockNumber = Number(block.header?.blockNumber.toString());
        logger.block(blockNumber);
    },
}

export default main;