import Payment from '../models/starknet/payment';
import provider from '../models/starknet/client';
import prisma from '../models/database/client';

import implementationController from './implementation.controller';

import { Request, Response } from 'express';
import { Prisma } from '@prisma/client';

const controller = {

    load(address: string) {
        return new Payment(address, provider);
    },

    async create(address: string) {
        const model = controller.load(address);

        const [name, symbol, decimals] = await Promise.all([
            model.getName(),
            model.getSymbol(),
            model.getDecimals(),
        ]);

        let implementation = await implementationController.read({ address });
        if (!implementation) {
            const abi = await model.getAbi();
            implementation = await implementationController.create({ address, abi });
        }

        const data = { address, name, symbol, decimals, implementationId: implementation.id };
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

    async getOne(request: Request, response: Response) {
        const where = { id: Number(request.params.id) };
        const project = await controller.read(where);

        if (!project) {
            const message = 'payment not found';
            const code = 404;
            return response.status(code).json({ message, code });
        }

        return response.status(200).json(project);
    },

    async getAll(_request: Request, response: Response) {
        const projects = await prisma.payment.findMany();
        return response.status(200).json(projects);
    },

    async getAbi(request: Request, response: Response) {
        const where = { id: Number(request.params.id) };
        const include = { Implementation: true };
        const payment = await controller.read(where, include);

        if (!payment) {
            const message = 'payment not found';
            const code = 404;
            return response.status(code).json({ message, code });
        }

        const implementation = await implementationController.read({ id: payment.implementationId });
        return response.status(200).json(implementation);
    },

    async getAllowance(request: Request, response: Response) {
        const where = { id: Number(request.params.id) };
        const project = await controller.read(where);
        const model = controller.load(project.address);
        const balance = await model.getAllowance([request.params.user]);
        return response.status(200).json({ address: project.address, user: request.params.owner, balance });
    },
}

export default controller;