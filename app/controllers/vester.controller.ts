import { FieldElement, FilterBuilder, v1alpha2 as starknet } from '@apibara/starknet'
import { UPGRADED } from '../models/starknet/contract';

import logger from '../handlers/logger';

import Vester from '../models/starknet/vester';
import provider from '../models/starknet/client';
import prisma from '../models/database/client';

import implementationController from './implementation.controller';

import { Request, Response, NextFunction } from 'express';
import { Prisma } from '@prisma/client';


const controller = {

    load(address: string) {
        return new Vester(address, provider);
    },

    async create(address: string) {
        const model = controller.load(address);

        const [implementationAddress, totalAmount, withdrawableAmount] = await Promise.all([
            model.getImplementationHash(),
            model.getVestingTotalAmount(),
            model.getWithdrawableAmount(),
        ]);

        let implementation = await implementationController.read({ address: implementationAddress });
        if (!implementation) {
            const abi = await model.getProxyAbi();
            implementation = await implementationController.create({ address: implementationAddress, abi });
        }

        const data = { address, totalAmount, withdrawableAmount, implementationId: implementation.id };
        return await prisma.vester.create({ data });
    },

    async read(where: { id?: number, address?: string }, include?: Prisma.VesterInclude) {
        return await prisma.vester.findUnique({ where, include });
    },

    async update(where: { id?: number, address?: string }, data: object) {
        return await prisma.vester.update({ where, data });
    },

    async delete(where: { id?: number, address?: string }) {
        return await prisma.vester.delete({ where });
    },

    async add(request: Request, response: Response, _next: NextFunction) {
        const where = { address: request.params.address };
        const vester = await controller.read(where);

        if (vester) {
            const message = 'vester already exists';
            const code = 409;
            return response.status(code).json({ message, code });
        }

        try {
            const vester = await controller.create(request.params.address);
            return response.status(201).json(vester);
        } catch (error) {
            const code = 500;
            return response.status(code).json({ message: error.message, code });
        }
    },

    async remove(request: Request, response: Response, _next: NextFunction) {
        const where = { address: request.params.address };
        const vester = await controller.read(where);

        if (!vester) {
            const message = 'vester not found';
            const code = 404;
            return response.status(code).json({ message, code });
        }

        try {
            await controller.delete({ id: vester.id });
            const code = 200;
            return response.status(code).json({ code });
        } catch (error) {
            const code = 500;
            return response.status(code).json({ message: error.message, code });
        }
    },
    async getOne(request: Request, response: Response, _next: NextFunction) {
        const where = { id: Number(request.params.id) };
        const vester = await controller.read(where);

        if (!vester) {
            const message = 'vester not found';
            const code = 404;
            return response.status(code).json({ message, code });
        }

        return response.status(200).json(vester);
    },

    async getAll(_request: Request, response: Response, _next: NextFunction) {
        const vesters = await prisma.vester.findMany();
        return response.status(200).json(vesters);
    },

    async getAbi(request: Request, response: Response, _next: NextFunction) {
        const where = { id: Number(request.params.id) };
        const include = { Implementation: true };
        const vester = await controller.read(where, include);

        if (!vester) {
            const message = 'vester not found';
            const code = 404;
            return response.status(code).json({ message, code });
        }

        const implementation = await implementationController.read({ id: vester.implementationId });
        return response.status(200).json(implementation);
    },

    async getVestingCount(request: Request, response: Response, _next: NextFunction) {
        const where = { id: Number(request.params.id) };
        const vester = await controller.read(where);
        const model = controller.load(vester.address);
        const count = await model.getVestingCount([request.params.user, request.params.vesting_id]);
        return response.status(200).json({ address: vester.address, token_id: request.params.token_id, count });
    },

    async getVestingId(request: Request, response: Response, _next: NextFunction) {
        const where = { id: Number(request.params.id) };
        const vester = await controller.read(where);
        const model = controller.load(vester.address);
        const id = await model.getVestingId([request.params.user]);
        return response.status(200).json({ address: vester.address, user: request.params.user, id });
    },

    async getReleasableAmount(request: Request, response: Response, _next: NextFunction) {
        const where = { id: Number(request.params.id) };
        const vester = await controller.read(where);
        const model = controller.load(vester.address);
        const amount = await model.getReleasableAmount([request.params.vesting_id]);
        return response.status(200).json({ address: vester.address, vesting_id: request.params.vesting_id, amount });
    },

    async setFilter(filter: FilterBuilder) {
        const vesters = await prisma.vester.findMany();
        vesters.forEach((vester) => {
            const address = FieldElement.fromBigInt(vester.address);
            [UPGRADED].forEach((key) => {
                filter.addEvent((event) => event.withFromAddress(address).withKeys([key]));
            })
        })
    },

    async handleEvent(event: starknet.IEvent, key: string) {
        const vesters = await prisma.vester.findMany();
        const found = vesters.find(model => model.address === FieldElement.toHex(event.fromAddress));
        if (found && [FieldElement.toHex(UPGRADED)].includes(key)) {
            await controller.handleUpgraded(found.address);
        };
    },

    async handleUpgraded(address: string) {
        const where = { address };

        const model = controller.load(address);
        await model.sync();

        const implementationAddress = await model.getImplementationHash();
        let implementation = await implementationController.read({ address: implementationAddress });
        if (!implementation) {
            const abi = await model.getProxyAbi();
            implementation = await implementationController.create({ address: implementationAddress, abi });
        }

        const data = { implementationId: implementation.id };
        logger.vester(`Upgraded (${address})`);
        await prisma.vester.update({ where, data });
    },
}

export default controller;