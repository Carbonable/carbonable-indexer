import badge from './badge.controller';
import project from './project.controller';
import minter from './minter.controller';
import vester from './vester.controller';
import offseter from './offseter.controller';
import yielder from './yielder.controller';

import { Request, Response } from 'express';

const controller = {

    async create(request: Request, response: Response) {
        const json = [];

        const isBadge = request.params.badge !== 'undefined' ? await badge.read({ address: request.params.badge }) : true;
        if (!isBadge) {
            const model = await badge.create(request.params.badge);
            json.push({ code: 201, response: model });
        } else if (isBadge !== true) {
            json.push({ code: 209, message: 'badge already exsits' });
        }

        const isProject = request.params.project !== 'undefined' ? await project.read({ address: request.params.project }) : true;
        if (!isProject) {
            const model = await project.create(request.params.project);
            json.push({ code: 201, response: model });
        } else if (isBadge !== true) {
            json.push({ code: 209, message: 'project already exsits' });
        }

        const isMinter = request.params.minter !== 'undefined' ? await minter.read({ address: request.params.minter }) : true;
        if (!isMinter) {
            const model = await minter.create(request.params.minter);
            json.push({ code: 201, response: model });
        } else if (isBadge !== true) {
            json.push({ code: 209, message: 'minter already exsits' });
        }

        const isVester = request.params.vester !== 'undefined' ? await vester.read({ address: request.params.vester }) : true;
        if (!isVester) {
            const model = await vester.create(request.params.vester);
            json.push({ code: 201, response: model });
        } else if (isBadge !== true) {
            json.push({ code: 209, message: 'vester already exsits' });
        }

        const isOffseter = request.params.offseter !== 'undefined' ? await offseter.read({ address: request.params.offseter }) : true;
        if (!isOffseter) {
            const model = await offseter.create(request.params.offseter);
            json.push({ code: 201, response: model });
        } else if (isBadge !== true) {
            json.push({ code: 209, message: 'offseter already exsits' });
        }

        const isYielder = request.params.yielder !== 'undefined' ? await yielder.read({ address: request.params.yielder }) : true;
        if (!isYielder) {
            const model = await yielder.create(request.params.yielder);
            json.push({ code: 201, response: model });
        } else if (isBadge !== true) {
            json.push({ code: 209, message: 'yielder already exsits' });
        }

        const code = 200;
        response.status(code).json(json)
    },
}

export default controller;