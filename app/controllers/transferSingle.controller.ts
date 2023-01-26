import prisma from '../models/database/client';

import { Request, Response } from 'express';
import { Prisma } from '@prisma/client';

const controller = {

    async create(data: { hash: string, from: string, to: string, tokenId: number, time: Date, block: number, badgeId: number }) {
        return await prisma.transferSingle.create({ data });
    },

    async read(where: { id?: number, transferSingleIdentifier?: { hash: string, from: string, to: string, tokenId: number, badgeId: number } }, include?: Prisma.TransferSingleInclude) {
        return await prisma.transferSingle.findUnique({ where, include });
    },

    async update(where: { id?: number }, data: object) {
        return await prisma.transferSingle.update({ where, data });
    },

    async delete(where: { id?: number }) {
        return await prisma.transferSingle.delete({ where });
    },

    async getOne(request: Request, response: Response) {
        const where = { id: Number(request.params.id) };
        const transferSingle = await controller.read(where);

        if (!transferSingle) {
            const message = 'transferSingle not found';
            const code = 404;
            return response.status(code).json({ message, code });
        }

        return response.status(200).json(transferSingle);
    },

    async getAll(_request: Request, response: Response) {
        const transferSingles = await prisma.transferSingle.findMany();
        return response.status(200).json(transferSingles);
    },
}

export default controller;