import prisma from '../models/database/client';

import { Request, Response } from 'express';
import { Prisma } from '@prisma/client';

const controller = {

    async create(data: { amount: number, time: Date, yielderId: number }) {
        return await prisma.vesting.create({ data });
    },

    async read(where: { id?: number, vestingIdentifier?: { time: Date, yielderId: number } }, include?: Prisma.VestingInclude) {
        return await prisma.vesting.findUnique({ where, include });
    },

    async update(where: { id?: number }, data: object) {
        return await prisma.vesting.update({ where, data });
    },

    async delete(where: { id?: number }) {
        return await prisma.vesting.delete({ where });
    },

    async getOne(request: Request, response: Response) {
        const where = { id: Number(request.params.id) };
        const vesting = await controller.read(where);

        if (!vesting) {
            const message = 'Vesting not found';
            const code = 404;
            return response.status(code).json({ message, code });
        }

        return response.status(200).json(vesting);
    },

    async getAll(_request: Request, response: Response) {
        const vestings = await prisma.vesting.findMany();
        return response.status(200).json(vestings);
    },
}

export default controller;