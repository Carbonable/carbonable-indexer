import Payment from '../models/starknet/payment';
import provider from '../models/starknet/client';
import prisma from '../models/database/client';

import { Request, Response, NextFunction } from 'express';
import { Prisma } from '@prisma/client';

const controller = {

    load(address: string) {
        return new Payment(address, provider);
    },

    async create(address: string) {
        const model = controller.load(address);

        const [decimals] = await Promise.all([
            model.getDecimals(),
        ]);

        const data = { address, decimals };
        return await prisma.payment.create({ data });
    },

    async read(where: { id?: number, address?: string }, include?: Prisma.PaymentInclude) {
        return await prisma.payment.findUnique({ where, include });
    },

    async update(where: { id?: number, address?: string }, data: object) {
        return await prisma.payment.update({ where, data });
    },

    async delete(where: { id?: number, address?: string }) {
        return await prisma.payment.delete({ where });
    },

    async getOne(request: Request, response: Response, _next: NextFunction) {
        const where = { id: Number(request.params.id) };
        const project = await controller.read(where);

        if (!project) {
            const message = 'Payment not found';
            const code = 404;
            return response.status(code).json({ message, code });
        }

        return response.status(200).json(project);
    },

    async getAll(_request: Request, response: Response, _next: NextFunction) {
        const projects = await prisma.payment.findMany();
        return response.status(200).json(projects);
    },

    async getAllowance(request: Request, response: Response, _next: NextFunction) {
        const where = { id: Number(request.params.id) };
        const project = await controller.read(where);
        const model = controller.load(project.address);
        const balance = await model.getAllowance([request.params.user]);
        return response.status(200).json({ address: project.address, user: request.params.owner, balance });
    },
}

export default controller;