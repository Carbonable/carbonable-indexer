import prisma from '../models/database/client';

import { Request, Response } from 'express';
import { Prisma } from '@prisma/client';

const controller = {

    async create(data: { address: string, abi: object }) {
        return await prisma.implementation.create({ data });
    },

    async read(where: { id?: number, address?: string }, include?: Prisma.ImplementationInclude) {
        return await prisma.implementation.findUnique({ where, include });
    },

    async update(where: { id?: number }, data: object) {
        return await prisma.implementation.update({ where, data });
    },

    async delete(where: { id?: number }) {
        return await prisma.implementation.delete({ where });
    },

    async getOne(request: Request, response: Response) {
        const where = { id: Number(request.params.id) };
        const implementation = await controller.read(where);

        if (!implementation) {
            const message = 'implementation not found';
            const code = 404;
            return response.status(code).json({ message, code });
        }

        return response.status(200).json(implementation);
    },

    async getAll(_request: Request, response: Response) {
        const implementations = await prisma.implementation.findMany();
        return response.status(200).json(implementations);
    },
}

export default controller;