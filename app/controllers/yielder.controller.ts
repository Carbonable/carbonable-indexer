import Yielder from '../models/starknet/yielder';
import provider from '../models/starknet/client';
import prisma from '../models/database/client';

import projectController from './project.controller';
import vesterController from './vester.controller';
import snapshotController from './snapshot.controller'
import vestingController from './vesting.controller'

import { Request, Response, NextFunction } from 'express';
import { Prisma } from '@prisma/client';

const controller = {

    load(address: string) {
        return new Yielder(address, provider);
    },

    async create(address: string) {
        const model = controller.load(address);

        const [implementation, totalDeposited, totalAbsorption, snapshotedTime, projectAddress, vesterAddress] = await Promise.all([
            model.getImplementationHash(),
            model.getTotalDeposited(),
            model.getTotalAbsorption(),
            model.getSnapshotedTime(),
            model.getCarbonableProjectAddress(),
            model.getCarbonableVesterAddress(),
        ]);

        let project = await projectController.read({ address: projectAddress });
        if (!project) {
            project = await projectController.create(projectAddress);
        }

        let vester = await vesterController.read({ address: vesterAddress });
        if (!vester) {
            vester = await vesterController.create(vesterAddress);
        }

        const data = { address, implementation, totalDeposited, totalAbsorption, snapshotedTime, projectId: project.id, vesterId: vester.id };
        return await prisma.yielder.create({ data });
    },

    async read(where: { id?: number, address?: string }, include?: Prisma.YielderInclude) {
        return await prisma.yielder.findUnique({ where, include });
    },

    async update(where: { id?: number, address?: string }, data: object) {
        return await prisma.yielder.update({ where, data });
    },

    async delete(where: { id?: number, address?: string }) {
        return await prisma.yielder.delete({ where });
    },

    async getOne(request: Request, response: Response, _next: NextFunction) {
        const where = { id: Number(request.params.id) };
        const yielder = await controller.read(where);

        if (!yielder) {
            const message = 'Yielder not found';
            const code = 404;
            return response.status(code).json({ message, code });
        }

        return response.status(200).json(yielder);
    },

    async getAll(_request: Request, response: Response, _next: NextFunction) {
        const yielders = await prisma.yielder.findMany();
        return response.status(200).json(yielders);
    },

    async handleUpgraded(address: string) {
        const where = { address };

        const model = controller.load(address);
        await model.sync();

        const implementation = await model.getImplementationHash();
        const data = { implementation };
        console.log(`${address} > Sync yielder implementation`);
        await prisma.yielder.update({ where, data });
    },

    async handleDepositOrWithdraw(address: string) {
        const where = { address };

        const model = controller.load(address);
        await model.sync();

        const [totalDeposited] = await Promise.all([model.getTotalDeposited()]);
        const data = { totalDeposited };
        console.log(`${address} > Sync yielder total deposited`);
        await prisma.offseter.update({ where, data });
    },

    async handleSnapshot(address: string, args: string[]) {
        const where = { address };
        const yielder = await controller.read(where);
        args.push(String(yielder.id));
        console.log(`${yielder.address} > New snapshot`);
        snapshotController.create(...args);
    },

    async handleVesting(address: string, args: string[]) {
        const where = { address };
        const yielder = await controller.read(where);
        args.push(String(yielder.id));
        console.log(`${yielder.address} > New vesting`);
        vestingController.create(...args);
    },
}

export default controller;