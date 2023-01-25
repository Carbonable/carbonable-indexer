import ipfs from '../models/ipfs/client';

import prisma from '../models/database/client';

import { Request, Response } from 'express';
import { Prisma } from '@prisma/client';

const controller = {

    async create(uri: string) {
        const data = await ipfs.load(uri);
        return await prisma.uri.create({ data: { uri, data } });
    },

    async read(where: { id?: number, uri?: string }, include?: Prisma.UriInclude) {
        return await prisma.uri.findUnique({ where, include });
    },

    async update(where: { id?: number }, data: object) {
        return await prisma.uri.update({ where, data });
    },

    async delete(where: { id?: number }) {
        return await prisma.uri.delete({ where });
    },

    async getOne(request: Request, response: Response) {
        const where = { id: Number(request.params.id) };
        const uri = await controller.read(where);

        if (!uri) {
            const message = 'uri not found';
            const code = 404;
            return response.status(code).json({ message, code });
        }

        return response.status(200).json(uri);
    },

    async getAll(_request: Request, response: Response) {
        const uris = await prisma.uri.findMany();
        return response.status(200).json(uris);
    },
}

export default controller;