import { FieldElement, FilterBuilder, v1alpha2 as starknet } from '@apibara/starknet'

import logger from '../handlers/logger';

import Offseter, { EVENTS } from '../models/starknet/offseter';
import provider from '../models/starknet/client';
import prisma from '../models/database/client';

import projectController from './project.controller';
import implementationController from './implementation.controller';

import { Request, Response, NextFunction } from 'express';
import { Prisma } from '@prisma/client';

const controller = {

    load(address: string) {
        return new Offseter(address, provider);
    },

    async create(address: string) {
        const model = controller.load(address);

        const [implementationAddress, minClaimable, totalDeposited, totalClaimed, totalClaimable, projectAddress] = await Promise.all([
            model.getImplementationHash(),
            model.getMinClaimable(),
            model.getTotalDeposited(),
            model.getTotalClaimed(),
            model.getTotalClaimable(),
            model.getCarbonableProjectAddress(),
        ]);

        let implementation = await implementationController.read({ address: implementationAddress });
        if (!implementation) {
            const abi = await model.getProxyAbi();
            implementation = await implementationController.create({ address: implementationAddress, abi });
        }

        let project = await projectController.read({ address: projectAddress });
        if (!project) {
            project = await projectController.create(projectAddress);
        }

        const data = { address, totalDeposited, totalClaimed, totalClaimable, minClaimable, projectId: project.id, implementationId: implementation.id };
        return await prisma.offseter.create({ data });
    },

    async read(where: { id?: number, address?: string }, include?: Prisma.OffseterInclude) {
        return await prisma.offseter.findUnique({ where, include });
    },

    async update(where: { id?: number, address?: string }, data: object) {
        return await prisma.offseter.update({ where, data });
    },

    async delete(where: { id?: number, address?: string }) {
        return await prisma.offseter.delete({ where });
    },

    async add(request: Request, response: Response, _next: NextFunction) {
        const where = { address: request.params.address };
        const offseter = await controller.read(where);

        if (offseter) {
            const message = 'offseter already exists';
            const code = 409;
            return response.status(code).json({ message, code });
        }

        try {
            const offseter = await controller.create(request.params.address);
            return response.status(201).json(offseter);
        } catch (error) {
            const code = 500;
            return response.status(code).json({ message: error.message, code });
        }
    },

    async remove(request: Request, response: Response, _next: NextFunction) {
        const where = { address: request.params.address };
        const offseter = await controller.read(where);

        if (!offseter) {
            const message = 'offseter not found';
            const code = 404;
            return response.status(code).json({ message, code });
        }

        try {
            await controller.delete({ id: offseter.id });
            const code = 200;
            return response.status(code).json({ code });
        } catch (error) {
            const code = 500;
            return response.status(code).json({ message: error.message, code });
        }
    },

    async getOne(request: Request, response: Response, _next: NextFunction) {
        const where = { id: Number(request.params.id) };
        const offseter = await controller.read(where);

        if (!offseter) {
            const message = 'offseter not found';
            const code = 404;
            return response.status(code).json({ message, code });
        }

        return response.status(200).json(offseter);
    },

    async getAll(_request: Request, response: Response, _next: NextFunction) {
        const offseters = await prisma.offseter.findMany();
        return response.status(200).json(offseters);
    },

    async getAbi(request: Request, response: Response, _next: NextFunction) {
        const where = { id: Number(request.params.id) };
        const include = { Implementation: true };
        const offseter = await controller.read(where, include);

        if (!offseter) {
            const message = 'offseter not found';
            const code = 404;
            return response.status(code).json({ message, code });
        }

        const implementation = await implementationController.read({ id: offseter.implementationId });
        return response.status(200).json(implementation);
    },

    async setFilter(filter: FilterBuilder) {
        const offseters = await prisma.offseter.findMany();
        offseters.forEach((offseter) => {
            const address = FieldElement.fromBigInt(offseter.address);
            Object.values(EVENTS).forEach((key) => {
                filter.addEvent((event) => event.withFromAddress(address).withKeys([key]));
            })
        })
    },

    async handleEvent(event: starknet.IEvent, key: string) {
        const offseters = await prisma.offseter.findMany();
        const found = offseters.find(model => model.address === FieldElement.toHex(event.fromAddress));
        if (found && [FieldElement.toHex(EVENTS.UPGRADED)].includes(key)) {
            await controller.handleUpgraded(found.address);
        } else if (found && [FieldElement.toHex(EVENTS.DEPOSIT), FieldElement.toHex(EVENTS.WITHDRAW)].includes(key)) {
            await controller.handleDepositOrWithdraw(found.address);
        } else if (found && [FieldElement.toHex(EVENTS.CLAIM)].includes(key)) {
            await controller.handleClaim(found.address);
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
        logger.offseter(`Upgraded (${address})`);
        await prisma.offseter.update({ where, data });
    },

    async handleDepositOrWithdraw(address: string) {
        const where = { address };

        const model = controller.load(address);
        await model.sync();

        const [totalDeposited] = await Promise.all([model.getTotalDeposited()]);
        const data = { totalDeposited };
        logger.offseter(`Deposit/Withdraw (${address})`);
        await prisma.offseter.update({ where, data });
    },

    async handleClaim(address: string) {
        const where = { address };

        const model = controller.load(address);
        await model.sync();

        const [totalClaimed] = await Promise.all([model.getTotalClaimed()]);
        const data = { totalClaimed };
        logger.offseter(`Claim (${address})`);
        await prisma.offseter.update({ where, data });
    },
}

export default controller;