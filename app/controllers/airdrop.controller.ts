import prisma from '../models/database/client';

import { Request, Response } from 'express';
import { Prisma } from '@prisma/client';

const controller = {

    async create(data: { hash: string, address: string, quantity: number, time: Date, block: number, minterId: number }) {
        return await prisma.airdrop.create({ data });
    },

    async read(where: { id?: number, airdropIdentifier?: { hash: string, address: string, quantity: number, minterId: number } }, include?: Prisma.AirdropInclude) {
        return await prisma.airdrop.findUnique({ where, include });
    },

    async update(where: { id?: number }, data: object) {
        return await prisma.airdrop.update({ where, data });
    },

    async delete(where: { id?: number }) {
        return await prisma.airdrop.delete({ where });
    },

    async getOne(request: Request, response: Response) {
        const where = { id: Number(request.params.id) };
        const airdrop = await controller.read(where);

        if (!airdrop) {
            const message = 'airdrop not found';
            const code = 404;
            return response.status(code).json({ message, code });
        }

        return response.status(200).json(airdrop);
    },

    async getAll(_request: Request, response: Response) {
        const airdrops = await prisma.airdrop.findMany();
        return response.status(200).json(airdrops);
    },
}

export default controller;