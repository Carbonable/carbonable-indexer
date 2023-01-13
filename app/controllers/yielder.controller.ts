import { Yielder } from '../models/starknet/yielder';
import provider from '../models/starknet/client';
import prisma from '../models/database/client';

import projectController from './project.controller';

import { Request, Response, NextFunction } from 'express';
import { Prisma } from '@prisma/client';

const controller = {

    load(address: string) {
        return new Yielder(address, provider);
    },

    async create(address: string) {
        const model = controller.load(address);

        const [implementation, totalDeposited, totalAbsorption, snapshotedTime, projectAddress] = await Promise.all([
            model.getImplementationHash(),
            model.getTotalDeposited(),
            model.getTotalAbsorption(),
            model.getSnapshotedTime(),
            model.getCarbonableProjectAddress(),
        ]);

        let project = await projectController.read({ address: projectAddress });
        if (!project) {
            project = await projectController.create(projectAddress);
        }

        const data = { address, implementation, totalDeposited, totalAbsorption, snapshotedTime, projectId: project.id };
        return await prisma.yielder.create({ data });
    },

    async read(where: { id?: number, address?: string }, include?: Prisma.YielderInclude) {
        return await prisma.yielder.findUnique({ where, include });
    },

    async update(where: { id?: number, address?: string }, data: object) {
        return await prisma.yielder.update({ where, data });
    },

    async delete(where: { id?: number, address?: string }) {
        return await prisma.yielder.delete({ where });
    },

    async getOne(request: Request, response: Response, _next: NextFunction) {
        const where = { id: Number(request.params.id) };
        const project = await controller.read(where);

        if (!project) {
            const message = 'Project not found';
            const code = 404;
            return response.status(code).json({ message, code });
        }

        return response.status(200).json(project);
    },

    async getAll(_request: Request, response: Response, _next: NextFunction) {
        const projects = await prisma.yielder.findMany();
        return response.status(200).json(projects);
    },
}

export default controller;