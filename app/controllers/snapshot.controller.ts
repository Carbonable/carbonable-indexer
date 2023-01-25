import prisma from '../models/database/client';

import { Request, Response } from 'express';
import { Prisma } from '@prisma/client';

const controller = {

    async create(data: {
        previousTime: Date,
        previousProjectAbsorption: number,
        previousOffseterAbsorption: number,
        previousYielderAbsorption: number,
        time: Date,
        currentProjectAbsorption: number,
        currentOffseterAbsorption: number,
        currentYielderAbsorption: number,
        projectAbsorption: number,
        offseterAbsorption: number,
        yielderAbsorption: number,
        yielderId: number,
    }) {
        return await prisma.snapshot.create({ data });
    },

    async read(where: { id?: number, snapshotIdentifier?: { time: Date, yielderId: number } }, include?: Prisma.SnapshotInclude) {
        return await prisma.snapshot.findUnique({ where, include });
    },

    async update(where: { id?: number }, data: object) {
        return await prisma.snapshot.update({ where, data });
    },

    async delete(where: { id?: number }) {
        return await prisma.snapshot.delete({ where });
    },

    async getOne(request: Request, response: Response) {
        const where = { id: Number(request.params.id) };
        const snapshot = await controller.read(where);

        if (!snapshot) {
            const message = 'snapshot not found';
            const code = 404;
            return response.status(code).json({ message, code });
        }

        return response.status(200).json(snapshot);
    },

    async getAll(_request: Request, response: Response) {
        const snapshots = await prisma.snapshot.findMany();
        return response.status(200).json(snapshots);
    },
}

export default controller;