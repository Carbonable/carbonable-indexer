import prisma from '../models/database/client';

import { Request, Response, NextFunction } from 'express';
import { Prisma } from '@prisma/client';

const controller = {

    async create(...args: string[]) {

        const data = {
            amount: Number(args[9]),
            time: new Date(args[10]),
            yielderId: Number(args[11]),
        };
        return await prisma.vesting.create({ data });
    },

    async read(where: { id?: number }, include?: Prisma.VestingInclude) {
        return await prisma.vesting.findUnique({ where, include });
    },

    async update(where: { id?: number }, data: object) {
        return await prisma.vesting.update({ where, data });
    },

    async delete(where: { id?: number }) {
        return await prisma.vesting.delete({ where });
    },

    async getOne(request: Request, response: Response, _next: NextFunction) {
        const where = { id: Number(request.params.id) };
        const vesting = await controller.read(where);

        if (!vesting) {
            const message = 'Vesting not found';
            const code = 404;
            return response.status(code).json({ message, code });
        }

        return response.status(200).json(vesting);
    },

    async getAll(_request: Request, response: Response, _next: NextFunction) {
        const vestings = await prisma.vesting.findMany();
        return response.status(200).json(vestings);
    },
}

export default controller;