import prisma from '../models/database/client';

import { Request, Response } from 'express';
import { Prisma } from '@prisma/client';

const controller = {

    async create(data: { hash: string, address: string, amount: number, quantity: number, time: Date, block: number, minterId: number }) {
        return await prisma.buy.create({ data });
    },

    async read(where: { id?: number, buyIdentifier?: { hash: string, address: string, quantity: number, minterId: number } }, include?: Prisma.BuyInclude) {
        return await prisma.buy.findUnique({ where, include });
    },

    async update(where: { id?: number }, data: object) {
        return await prisma.buy.update({ where, data });
    },

    async delete(where: { id?: number }) {
        return await prisma.buy.delete({ where });
    },

    async getOne(request: Request, response: Response) {
        const where = { id: Number(request.params.id) };
        const buy = await controller.read(where);

        if (!buy) {
            const message = 'buy not found';
            const code = 404;
            return response.status(code).json({ message, code });
        }

        return response.status(200).json(buy);
    },

    async getAll(_request: Request, response: Response) {
        const buys = await prisma.buy.findMany();
        return response.status(200).json(buys);
    },
}

export default controller;