import prisma from '../models/database/client';

import { Request, Response } from 'express';
import { Prisma } from '@prisma/client';

const controller = {

    async create(data: { hash: string, from: string, to: string, tokenId: number, time: Date, projectId: number }) {
        return await prisma.transfer.create({ data });
    },

    async read(where: { id?: number, transferIdentifier?: { hash: string, from: string, to: string, tokenId: number, projectId: number } }, include?: Prisma.TransferInclude) {
        return await prisma.transfer.findUnique({ where, include });
    },

    async update(where: { id?: number }, data: object) {
        return await prisma.transfer.update({ where, data });
    },

    async delete(where: { id?: number }) {
        return await prisma.transfer.delete({ where });
    },

    async getOne(request: Request, response: Response) {
        const where = { id: Number(request.params.id) };
        const transfer = await controller.read(where);

        if (!transfer) {
            const message = 'transfer not found';
            const code = 404;
            return response.status(code).json({ message, code });
        }

        return response.status(200).json(transfer);
    },

    async getAll(_request: Request, response: Response) {
        const transfers = await prisma.transfer.findMany();
        return response.status(200).json(transfers);
    },
}

export default controller;