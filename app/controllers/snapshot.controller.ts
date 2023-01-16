import prisma from '../models/database/client';

import { Request, Response, NextFunction } from 'express';
import { Prisma } from '@prisma/client';

const controller = {

    async create(...args: string[]) {

        const data = {
            previousTime: new Date(args[0]),
            previousProjectAbsorption: Number(args[1]),
            previousOffseterAbsorption: Number(args[2]),
            previousYielderAbsorption: Number(args[3]),
            currentProjectAbsorption: Number(args[4]),
            currentOffseterAbsorption: Number(args[5]),
            currentYielderAbsorption: Number(args[6]),
            projectAbsorption: Number(args[7]),
            offseterAbsorption: Number(args[8]),
            yielderAbsorption: Number(args[9]),
            time: new Date(args[10]),
            yielderId: Number(args[11]),
        };
        return await prisma.snapshot.create({ data });
    },

    async read(where: { id?: number }, include?: Prisma.SnapshotInclude) {
        return await prisma.snapshot.findUnique({ where, include });
    },

    async update(where: { id?: number }, data: object) {
        return await prisma.snapshot.update({ where, data });
    },

    async delete(where: { id?: number }) {
        return await prisma.snapshot.delete({ where });
    },

    async getOne(request: Request, response: Response, _next: NextFunction) {
        const where = { id: Number(request.params.id) };
        const snapshot = await controller.read(where);

        if (!snapshot) {
            const message = 'Snapshot not found';
            const code = 404;
            return response.status(code).json({ message, code });
        }

        return response.status(200).json(snapshot);
    },

    async getAll(_request: Request, response: Response, _next: NextFunction) {
        const snapshots = await prisma.snapshot.findMany();
        return response.status(200).json(snapshots);
    },
}

export default controller;