import { FieldElement, FilterBuilder, v1alpha2 as starknet } from '@apibara/starknet'

import logger from '../handlers/logger';

import Vester, { EVENTS, ENTRIES } from '../models/starknet/vester';
import provider from '../models/starknet/client';
import prisma from '../models/database/client';

import implementationController from './implementation.controller';

import { Request, Response } from 'express';
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
            try {
                const abi = await model.getProxyAbi();
                implementation = await implementationController.create({ address: implementationAddress, abi });
            } catch (_error) {
                implementation = await implementationController.read({ address: implementationAddress });
            }
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

    async add(request: Request, response: Response) {
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

    async remove(request: Request, response: Response) {
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
    async getOne(request: Request, response: Response) {
        const where = { id: Number(request.params.id) };
        const vester = await controller.read(where);

        if (!vester) {
            const message = 'vester not found';
            const code = 404;
            return response.status(code).json({ message, code });
        }

        return response.status(200).json(vester);
    },

    async getAll(_request: Request, response: Response) {
        const vesters = await prisma.vester.findMany();
        return response.status(200).json(vesters);
    },

    async getAbi(request: Request, response: Response) {
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

    async getVestingCount(request: Request, response: Response) {
        const where = { id: Number(request.params.id) };
        const vester = await controller.read(where);
        const model = controller.load(vester.address);
        const count = await model.getVestingCount([request.params.user, request.params.vesting_id]);
        return response.status(200).json({ address: vester.address, token_id: request.params.token_id, count });
    },

    async getVestingId(request: Request, response: Response) {
        const where = { id: Number(request.params.id) };
        const vester = await controller.read(where);
        const model = controller.load(vester.address);
        const id = await model.getVestingId([request.params.user]);
        return response.status(200).json({ address: vester.address, user: request.params.user, id });
    },

    async getReleasableAmount(request: Request, response: Response) {
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
            Object.values(EVENTS).forEach((key) => {
                filter.addEvent((event) => event.withFromAddress(address).withKeys([key]));
            })
            filter.withStateUpdate((su) => su.addStorageDiff((st) => st.withContractAddress(address)))
        })
    },

    async handleEvent(event: starknet.IEvent, key: string) {
        const found = await prisma.vester.findUnique({ where: { address: FieldElement.toHex(event.fromAddress) } });

        if (found && key === FieldElement.toHex(EVENTS.UPGRADED)) {
            await controller.handleUpgraded(found.address);
        }
    },

    async handleEntry(contractAddress: string, entry: starknet.IStorageEntry) {
        const found = await prisma.vester.findUnique({ where: { address: contractAddress } });
        if (found && FieldElement.toBigInt(entry.key) === ENTRIES.TOTAL_AMOUNT) {
            await controller.handleTotalAmount(found.address);
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

    async handleTotalAmount(address: string) {
        const where = { address };

        const model = controller.load(address);
        await model.sync();

        const totalAmount = await model.getVestingTotalAmount();

        const data = { totalAmount };
        logger.vester(`TotalAmount (${address})`);
        await prisma.vester.update({ where, data });
    },
}

export default controller;
