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
        project.run();
    }
}

export default main;