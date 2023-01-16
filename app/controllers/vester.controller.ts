import logger from '../handlers/logger';

import Vester from '../models/starknet/vester';
import provider from '../models/starknet/client';
import prisma from '../models/database/client';

import { Request, Response, NextFunction } from 'express';
import { Prisma } from '@prisma/client';


const controller = {

    load(address: string) {
        return new Vester(address, provider);
    },

    async create(address: string) {
        const model = controller.load(address);

        const [implementation, totalAmount, withdrawableAmount] = await Promise.all([
            model.getImplementationHash(),
            model.getVestingTotalAmount(),
            model.getWithdrawableAmount(),
        ]);

        const data = { address, implementation, totalAmount, withdrawableAmount };
        return await prisma.vester.create({ data });
    },

    async read(where: { id?: number, address?: string }, include?: Prisma.VesterInclude) {
        return await prisma.vester.findUnique({ where, include });
    },

    async update(where: { id?: number, address?: string }, data: object) {
        return await prisma.vester.update({ where, data });
    },

    async delete(where: { id?: number, address?: string }) {
        return await prisma.vester.delete({ where });
    },

    async getOne(request: Request, response: Response, _next: NextFunction) {
        const where = { id: Number(request.params.id) };
        const vester = await controller.read(where);

        if (!vester) {
            const message = 'vester not found';
            const code = 404;
            return response.status(code).json({ message, code });
        }

        return response.status(200).json(vester);
    },

    async getAll(_request: Request, response: Response, _next: NextFunction) {
        const projects = await prisma.vester.findMany();
        return response.status(200).json(projects);
    },

    async getVestingCount(request: Request, response: Response, _next: NextFunction) {
        const where = { id: Number(request.params.id) };
        const vester = await controller.read(where);
        const model = controller.load(vester.address);
        const count = await model.getVestingCount([request.params.user, request.params.vesting_id]);
        return response.status(200).json({ address: vester.address, token_id: request.params.token_id, count });
    },

    async getVestingId(request: Request, response: Response, _next: NextFunction) {
        const where = { id: Number(request.params.id) };
        const vester = await controller.read(where);
        const model = controller.load(vester.address);
        const id = await model.getVestingId([request.params.user]);
        return response.status(200).json({ address: vester.address, user: request.params.user, id });
    },

    async getReleasableAmount(request: Request, response: Response, _next: NextFunction) {
        const where = { id: Number(request.params.id) };
        const vester = await controller.read(where);
        const model = controller.load(vester.address);
        const amount = await model.getReleasableAmount([request.params.vesting_id]);
        return response.status(200).json({ address: vester.address, vesting_id: request.params.vesting_id, amount });
    },

    async handleUpgraded(address: string) {
        const where = { address };

        const model = controller.load(address);
        await model.sync();

        const implementation = await model.getImplementationHash();
        const data = { implementation };
        logger.vester(`Upgraded (${address})`);
        await prisma.vester.update({ where, data });
    },
}

export default controller;