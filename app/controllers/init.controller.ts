import project from './project.controller';

import data from '../models/internals/mainnet.data.json';

const initialize = async () => {
    data.forEach(async (content: { project: string; }) => {
        const found = await project.read({ address: content.project })
        if (!found) {
            project.create(content.project);
        }
    });
}

export default initialize;