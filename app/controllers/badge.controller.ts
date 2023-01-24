import { FieldElement, FilterBuilder, v1alpha2 as starknet } from '@apibara/starknet'

import logger from "../handlers/logger";

import badge, { EVENTS, ENTRIES } from '../models/starknet/badge';
import provider from '../models/starknet/client';
import prisma from '../models/database/client';

import transferController from './transferSingle.controller';
import implementationController from './implementation.controller';
import uriController from './uri.controller';

import { Request, Response, NextFunction } from 'express';
import { Prisma, Badge as PrismaBadge } from '@prisma/client';

const controller = {
    load(address: string) {
        return new badge(address, provider);
    },

    async create(address: string) {
        const model = controller.load(address);
        await model.sync();

        const [implementationAddress, name, contractUri, owner] = await Promise.all([
            model.getImplementationHash(),
            model.getName(),
            model.getContractUri(),
            model.getOwner(),
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

        let uri = await uriController.read({ uri: contractUri });
        if (!uri) {
            uri = await uriController.create(contractUri);
        }

        const data = { address, name, owner, implementationId: implementation.id, uriId: uri.id };
        return await prisma.badge.create({ data });
    },

    async read(where: { id?: number, address?: string }, include?: Prisma.BadgeInclude) {
        return await prisma.badge.findUnique({ where, include });
    },

    async update(where: { id?: number, address?: string }, data: object) {
        return await prisma.badge.update({ where, data });
    },

    async delete(where: { id?: number, address?: string }) {
        return await prisma.badge.delete({ where });
    },

    async add(request: Request, response: Response, _next: NextFunction) {
        const where = { address: request.params.address };
        const badge = await controller.read(where);

        if (badge) {
            const message = 'badge already exists';
            const code = 409;
            return response.status(code).json({ message, code });
        }

        try {
            const badge = await controller.create(request.params.address);
            return response.status(201).json(badge);
        } catch (error) {
            const code = 500;
            return response.status(code).json({ message: error.message, code });
        }
    },

    async remove(request: Request, response: Response, _next: NextFunction) {
        const where = { address: request.params.address };
        const badge = await controller.read(where);

        if (!badge) {
            const message = 'badge not found';
            const code = 404;
            return response.status(code).json({ message, code });
        }

        try {
            await controller.delete({ id: badge.id });
            const code = 200;
            return response.status(code).json({ code });
        } catch (error) {
            const code = 500;
            return response.status(code).json({ message: error.message, code });
        }
    },

    async getOne(request: Request, response: Response, _next: NextFunction) {
        const where = { id: Number(request.params.id) };
        const badge = await controller.read(where);

        if (!badge) {
            const message = 'badge not found';
            const code = 404;
            return response.status(code).json({ message, code });
        }

        return response.status(200).json(badge);
    },

    async getAll(_request: Request, response: Response, _next: NextFunction) {
        const badges = await prisma.badge.findMany();
        return response.status(200).json(badges);
    },

    async getAbi(request: Request, response: Response, _next: NextFunction) {
        const where = { id: Number(request.params.id) };
        const include = { Implementation: true };
        const badge = await controller.read(where, include);

        if (!badge) {
            const message = 'badge not found';
            const code = 404;
            return response.status(code).json({ message, code });
        }

        const implementation = await implementationController.read({ id: badge.implementationId });
        return response.status(200).json(implementation);
    },

    async getBalanceOf(request: Request, response: Response, _next: NextFunction) {
        const where = { id: Number(request.params.id) };
        const badge = await controller.read(where);

        if (!badge) {
            const message = 'badge not found';
            const code = 404;
            return response.status(code).json({ message, code });
        }

        const model = controller.load(badge.address);
        const balance = await model.getBalanceOf([request.params.user]);
        return response.status(200).json({ address: badge.address, user: request.params.user, balance });
    },

    async getTokenUri(request: Request, response: Response, _next: NextFunction) {
        const where = { id: Number(request.params.id) };
        const badge = await controller.read(where);

        if (!badge) {
            const message = 'badge not found';
            const code = 404;
            return response.status(code).json({ message, code });
        }

        const model = controller.load(badge.address);
        const uri = await model.getTokenUri([request.params.token_id, 0]);
        let tokenUri = await uriController.read({ uri });
        if (!tokenUri) {
            tokenUri = await uriController.create(uri);
        }

        return response.status(200).json({ address: badge.address, token_id: request.params.token_id, uri });
    },

    async getTransfers(request: Request, response: Response, _next: NextFunction) {
        const where = { id: Number(request.params.id) };
        const include = { TransferSingle: true };
        const badge = await controller.read(where, include);

        if (!badge) {
            const message = 'badge not found';
            const code = 404;
            return response.status(code).json({ message, code });
        }

        return response.status(200).json(badge.TransferSingle);
    },

    async setFilter(filter: FilterBuilder) {
        const badges = await prisma.badge.findMany();
        badges.forEach((badge) => {
            const address = FieldElement.fromBigInt(badge.address);
            Object.values(EVENTS).forEach((key) => {
                filter.addEvent((event) => event.withFromAddress(address).withKeys([key]));
            })
            filter.withStateUpdate((su) => su.addStorageDiff((st) => st.withContractAddress(address)))
        })
    },

    async handleEvent(block: starknet.Block, transaction: starknet.ITransaction, event: starknet.IEvent, key: string) {
        const badges = await prisma.badge.findMany();
        const found = badges.find(model => model.address === FieldElement.toHex(event.fromAddress));
        if (found && [FieldElement.toHex(EVENTS.UPGRADED)].includes(key)) {
            await controller.handleUpgraded(found.address);
        } else if (found && [FieldElement.toHex(EVENTS.TRANSFER_SINGLE)].includes(key)) {
            await controller.handleTransfer(found, block, transaction, event);
        };
    },

    async handleEntry(contractAddress: string, entry: starknet.IStorageEntry) {
        const badges = await prisma.badge.findMany();
        const found = badges.find(model => model.address === contractAddress);
        if (found && [ENTRIES.METADATA].includes(FieldElement.toBigInt(entry.key))) {
            await controller.handleMetadataUpdate(found.address);
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
        logger.badge(`Upgraded (${address})`);
        await prisma.badge.update({ where, data });
    },

    async handleTransfer(badge: PrismaBadge, block: starknet.Block, transaction: starknet.ITransaction, event: starknet.IEvent) {
        const transferSingleIdentifier = {
            hash: FieldElement.toHex(transaction.meta.hash),
            from: FieldElement.toHex(event.data[1]),
            to: FieldElement.toHex(event.data[2]),
            tokenId: Number(FieldElement.toBigInt(event.data[3])),
            badgeId: badge.id,
        }
        const transfer = await transferController.read({ transferSingleIdentifier })
        if (!transfer) {
            const data = {
                ...transferSingleIdentifier,
                time: new Date(Number(block.header.timestamp.seconds.toString()) * 1000)
            };
            await transferController.create(data);
        }
        logger.badge(`Transfer (${badge.address})`);
    },

    async handleMetadataUpdate(address: string) {
        const where = { address };

        const model = controller.load(address);
        await model.sync();

        const [contractUri] = await Promise.all([
            model.getContractUri(),
        ]);

        let uri = await uriController.read({ uri: contractUri });
        if (!uri) {
            uri = await uriController.create(contractUri);
        }

        const data = { uriId: uri.id };
        logger.project(`MetadataUpdate (${address})`);
        await prisma.project.update({ where, data });
    },
}

export default controller;