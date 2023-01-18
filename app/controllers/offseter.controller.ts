import { FieldElement, FilterBuilder, v1alpha2 as starknet } from '@apibara/starknet'
import { UPGRADED } from '../models/starknet/contract';
import { DEPOSIT, WITHDRAW, CLAIM } from '../models/starknet/offseter';

import logger from '../handlers/logger';

import Offseter from '../models/starknet/offseter';
import provider from '../models/starknet/client';
import prisma from '../models/database/client';

import projectController from './project.controller';

import { Request, Response, NextFunction } from 'express';
import { Prisma } from '@prisma/client';

const controller = {

    load(address: string) {
        return new Offseter(address, provider);
    },

    async create(address: string) {
        const model = controller.load(address);

        const [abi, implementation, totalDeposited, totalClaimed, totalClaimable, minClaimable, projectAddress] = await Promise.all([
            model.getProxyAbi(),
            model.getImplementationHash(),
            model.getMinClaimable(),
            model.getTotalDeposited(),
            model.getTotalClaimed(),
            model.getTotalClaimable(),
            model.getCarbonableProjectAddress(),
        ]);

        let project = await projectController.read({ address: projectAddress });
        if (!project) {
            project = await projectController.create(projectAddress);
        }

        const data = { address, abi, implementation, totalDeposited, totalClaimed, totalClaimable, minClaimable, projectId: project.id };
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

    async getOne(request: Request, response: Response, _next: NextFunction) {
        const where = { id: Number(request.params.id) };
        const offseter = await controller.read(where);

        if (!offseter) {
            const message = 'Offseter not found';
            const code = 404;
            return response.status(code).json({ message, code });
        }

        return response.status(200).json(offseter);
    },

    async getAll(_request: Request, response: Response, _next: NextFunction) {
        const offseters = await prisma.offseter.findMany();
        return response.status(200).json(offseters);
    },

    async setFilter(filter: FilterBuilder) {
        const offseters = await prisma.offseter.findMany();
        const events = [UPGRADED, DEPOSIT, WITHDRAW, CLAIM];
        offseters.forEach((offseter) => {
            const address = FieldElement.fromBigInt(offseter.address);
            events.forEach((key) => {
                filter.addEvent((event) => event.withFromAddress(address).withKeys([key]));
            })
        })
    },

    async handleEvent(event: starknet.IEvent, key: string) {
        const offseters = await prisma.offseter.findMany();
        const found = offseters.find(model => model.address === FieldElement.toHex(event.fromAddress));
        if (found && [FieldElement.toHex(UPGRADED)].includes(key)) {
            await controller.handleUpgraded(found.address);
        } else if (found && [FieldElement.toHex(DEPOSIT), FieldElement.toHex(WITHDRAW)].includes(key)) {
            await controller.handleDepositOrWithdraw(found.address);
        } else if (found && [FieldElement.toHex(CLAIM)].includes(key)) {
            await controller.handleClaim(found.address);
        };
    },

    async handleUpgraded(address: string) {
        const where = { address };

        const model = controller.load(address);
        await model.sync();

        const implementation = await model.getImplementationHash();
        const data = { implementation };
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