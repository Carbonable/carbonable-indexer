import Offseter from '../models/starknet/offseter';
import provider from '../models/starknet/client';
import prisma from '../models/database/client';

import projectController from './project.controller';

import { Request, Response, NextFunction } from 'express';
import { Prisma } from '@prisma/client';

const controller = {

    load(address: string) {
        return new Offseter(address, provider);
    },

    async create(address: string) {
        const model = controller.load(address);

        const [implementation, totalDeposited, totalClaimed, totalClaimable, minClaimable, projectAddress] = await Promise.all([
            model.getImplementationHash(),
            model.getMinClaimable(),
            model.getTotalDeposited(),
            model.getTotalClaimed(),
            model.getTotalClaimable(),
            model.getCarbonableProjectAddress(),
        ]);

        let project = await projectController.read({ address: projectAddress });
        if (!project) {
            project = await projectController.create(projectAddress);
        }

        const data = { address, implementation, totalDeposited, totalClaimed, totalClaimable, minClaimable, projectId: project.id };
        return await prisma.offseter.create({ data });
    },

    async read(where: { id?: number, address?: string }, include?: Prisma.OffseterInclude) {
        return await prisma.offseter.findUnique({ where, include });
    },

    async update(where: { id?: number, address?: string }, data: object) {
        return await prisma.offseter.update({ where, data });
    },

    async delete(where: { id?: number, address?: string }) {
        return await prisma.offseter.delete({ where });
    },

    async getOne(request: Request, response: Response, _next: NextFunction) {
        const where = { id: Number(request.params.id) };
        const project = await controller.read(where);

        if (!project) {
            const message = 'Project not found';
            const code = 404;
            return response.status(code).json({ message, code });
        }

        return response.status(200).json(project);
    },

    async getAll(_request: Request, response: Response, _next: NextFunction) {
        const projects = await prisma.offseter.findMany();
        return response.status(200).json(projects);
    },

    async handleUpgraded(address: string) {
        const where = { address };

        const model = controller.load(address);
        await model.sync();

        const implementation = await model.getImplementationHash();
        const data = { implementation };
        console.log(`${address} > Sync offseter implementation`);
        await prisma.offseter.update({ where, data });
    },

    async handleDepositOrWithdraw(address: string) {
        const where = { address };

        const model = controller.load(address);
        await model.sync();

        const [totalDeposited] = await Promise.all([model.getTotalDeposited()]);
        const data = { totalDeposited };
        console.log(`${address} > Sync offseter total deposited`);
        await prisma.offseter.update({ where, data });
    },

    async handleClaim(address: string) {
        const where = { address };

        const model = controller.load(address);
        await model.sync();

        const [totalClaimed] = await Promise.all([model.getTotalClaimed()]);
        const data = { totalClaimed };
        console.log(`${address} > Sync offseter total claimed`);
        await prisma.offseter.update({ where, data });
    },
}

export default controller;