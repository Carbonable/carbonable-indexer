import { FieldElement, FilterBuilder, v1alpha2 as starknet } from '@apibara/starknet'

import logger from "../handlers/logger";

import Minter, { EVENTS, ENTRIES } from '../models/starknet/minter';
import provider from '../models/starknet/client';
import prisma from '../models/database/client';

import projectController from './project.controller';
import implementationController from './implementation.controller';
import paymentController from './payment.controller';
import airdropController from './airdrop.controller';
import buyController from './buy.controller';

import { Request, Response } from 'express';
import { Prisma, Minter as PrismaMinter } from '@prisma/client';

const controller = {

    load(address: string) {
        return new Minter(address, provider);
    },

    async create(address: string, whitelist?: object) {
        const model = controller.load(address);

        const [implementationAddress, maxSupply, reservedSupply, preSaleOpen, publicSaleOpen, maxBuyPerTx, unitPrice, whitelistMerkleRoot, soldOut, totalValue, projectAddress, paymentAddress] = await Promise.all([
            model.getImplementationHash(),
            model.getMaxSupply(),
            model.getReservedSupply(),
            model.isPreSaleOpen(),
            model.isPublicSaleOpen(),
            model.getMaxBuyPerTx(),
            model.getUnitPrice(),
            model.getWhitelistMerkleRoot(),
            model.isSoldOut(),
            model.getTotalValue(),
            model.getCarbonableProjectAddress(),
            model.getPaymentTokenAddress(),
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

        let project = await projectController.read({ address: projectAddress });
        if (!project) {
            project = await projectController.create(projectAddress);
        }

        let payment = await paymentController.read({ address: paymentAddress });
        if (!payment) {
            try {
                payment = await paymentController.create(paymentAddress);
            } catch (_error) {
                // Could have collided since several minters refer to the same payment contract, then just re-read
                payment = await paymentController.read({ address: paymentAddress });
            }
        }

        const data = { address, maxSupply, reservedSupply, preSaleOpen, publicSaleOpen, maxBuyPerTx, unitPrice, whitelistMerkleRoot, soldOut, totalValue, whitelist, projectId: project.id, paymentId: payment.id, implementationId: implementation.id };
        return await prisma.minter.create({ data });
    },

    async read(where: { id?: number, address?: string }, include?: Prisma.MinterInclude) {
        return await prisma.minter.findUnique({ where, include });
    },

    async update(where: { id?: number, address?: string }, data: object) {
        return await prisma.minter.update({ where, data });
    },

    async delete(where: { id?: number, address?: string }) {
        return await prisma.minter.delete({ where });
    },

    async add(request: Request, response: Response) {
        const where = { address: request.params.address };
        const minter = await controller.read(where);

        if (minter) {
            const message = 'minter already exists';
            const code = 409;
            return response.status(code).json({ message, code });
        }

        try {
            const minter = await controller.create(request.params.address);
            return response.status(201).json(minter);
        } catch (error) {
            const code = 500;
            return response.status(code).json({ message: error.message, code });
        }
    },

    async remove(request: Request, response: Response) {
        const where = { address: request.params.address };
        const minter = await controller.read(where);

        if (!minter) {
            const message = 'minter not found';
            const code = 404;
            return response.status(code).json({ message, code });
        }

        try {
            await controller.delete({ id: minter.id });
            const code = 200;
            return response.status(code).json({ code });
        } catch (error) {
            const code = 500;
            return response.status(code).json({ message: error.message, code });
        }
    },

    async getOne(request: Request, response: Response) {
        const where = { id: Number(request.params.id) };
        const include: Prisma.MinterInclude = { Payment: true }
        const minter = await controller.read(where, include);

        if (!minter) {
            const message = 'minter not found';
            const code = 404;
            return response.status(code).json({ message, code });
        }

        return response.status(200).json(minter);
    },

    async getAll(_request: Request, response: Response) {
        const minters = await prisma.minter.findMany({ include: { Payment: true } });
        return response.status(200).json(minters);
    },

    async getAbi(request: Request, response: Response) {
        const where = { id: Number(request.params.id) };
        const include = { Implementation: true };
        const minter = await controller.read(where, include);

        if (!minter) {
            const message = 'minter not found';
            const code = 404;
            return response.status(code).json({ message, code });
        }

        const implementation = await implementationController.read({ id: minter.implementationId });
        return response.status(200).json(implementation);
    },

    async getWhitelist(request: Request, response: Response) {
        const minter = await controller.read({ id: Number(request.params.id) });
        if (!minter) {
            const message = 'minter not found';
            const code = 404;
            return response.status(code).json({ message, code });
        }
        return response.status(200).json(minter.whitelist);
    },

    async setWhitelist(request: Request, response: Response) {
        const where = { id: Number(request.params.id) };
        const minter = await controller.read(where);
        if (!minter) {
            const message = 'minter not found';
            const code = 404;
            return response.status(code).json({ message, code });
        }
        const whitelist = request.body;
        if (!whitelist) {
            const message = 'whitelist input is missing';
            const code = 422;
            return response.status(code).json({ message, code });
        }
        const data = { whitelist };
        const updated = await prisma.minter.update({ where, data });
        return response.status(200).json(updated.whitelist);
    },

    async getWhitelistedSlots(request: Request, response: Response) {
        const minter = await controller.read({ id: Number(request.params.id) });
        if (!minter) {
            const message = 'minter not found';
            const code = 404;
            return response.status(code).json({ message, code });
        }

        if (!minter.whitelist) {
            const message = 'minter whitelist not found';
            const code = 404;
            return response.status(code).json({ message, code });
        }

        const whitelist = minter.whitelist['leaves'].find((item: { address: string }) => item.address === request.params.user);
        if (!whitelist) {
            const message = 'user not found in whitelist';
            const code = 404;
            return response.status(code).json({ message, code });
        }

        return response.status(200).json(whitelist);
    },

    async getClaimedSlots(request: Request, response: Response) {
        const minter = await controller.read({ id: Number(request.params.id) });
        const model = controller.load(minter.address);
        const slots = await model.getClaimedSlots([request.params.user]);
        return response.status(200).json({ address: minter.address, user: request.params.user, slots });
    },

    async getAirdrops(request: Request, response: Response) {
        const where = { id: Number(request.params.id) };
        const include = { Airdrop: true };
        const minter = await controller.read(where, include);

        if (!minter) {
            const message = 'minter not found';
            const code = 404;
            return response.status(code).json({ message, code });
        }

        return response.status(200).json(minter.Airdrop);
    },

    async getBuys(request: Request, response: Response) {
        const where = { id: Number(request.params.id) };
        const include = { Buy: true };
        const minter = await controller.read(where, include);

        if (!minter) {
            const message = 'minter not found';
            const code = 404;
            return response.status(code).json({ message, code });
        }

        return response.status(200).json(minter.Buy);
    },

    async setFilter(filter: FilterBuilder) {
        const minters = await prisma.minter.findMany();
        minters.forEach((minter) => {
            const address = FieldElement.fromBigInt(minter.address);
            Object.values(EVENTS).forEach((key) => {
                filter.addEvent((event) => event.withFromAddress(address).withKeys([key]));
            })
            filter.withStateUpdate((su) => su.addStorageDiff((st) => st.withContractAddress(address)))
        })
    },

    async handleEvent(block: starknet.Block, transaction: starknet.ITransaction, event: starknet.IEvent, key: string) {
        const found = await prisma.minter.findUnique({ where: { address: FieldElement.toHex(event.fromAddress) } });

        if (null === found) {
            return;
        }

        if (key === FieldElement.toHex(EVENTS.UPGRADED)) {
            await controller.handleUpgraded(found.address);
        }
        if (key === FieldElement.toHex(EVENTS.AIRDROP)) {
            await controller.handleAirdrop(found, block, transaction, event);
        }
        if (key === FieldElement.toHex(EVENTS.BUY)) {
            await controller.handleBuy(found, block, transaction, event);
        }
        if ([FieldElement.toHex(EVENTS.PRE_SALE_OPEN), FieldElement.toHex(EVENTS.PRE_SALE_CLOSE)].includes(key)) {
            await controller.handlePreSale(found.address);
        }
        if ([FieldElement.toHex(EVENTS.PUBLIC_SALE_OPEN), FieldElement.toHex(EVENTS.PUBLIC_SALE_CLOSE)].includes(key)) {
            await controller.handlePublicSale(found.address);
        }
        if (key === FieldElement.toHex(EVENTS.SOLD_OUT)) {
            await controller.handleSoldOut(found.address);
        }
    },

    async handleEntry(contractAddress: string, entry: starknet.IStorageEntry) {
        const found = await prisma.minter.findUnique({ where: { address: contractAddress } });

        if (null === found) {
            return;
        }

        if (FieldElement.toBigInt(entry.key) === ENTRIES.MAX_BUY) {
            await controller.handleMaxBuy(found.address);
        }
        if (FieldElement.toBigInt(entry.key) === ENTRIES.UNIT_PRICE) {
            await controller.handleUnitPrice(found.address);
        }
        if (FieldElement.toBigInt(entry.key) === ENTRIES.RESERVED_SUPPLY) {
            await controller.handleReservedSupply(found.address);
        }
        if (FieldElement.toBigInt(entry.key) === ENTRIES.MERKLE_ROOT) {
            await controller.handleMerkleRoot(found.address);
        }
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
        logger.minter(`Upgraded (${address})`);
        await prisma.minter.update({ where, data });
    },

    async handleAirdrop(minter: PrismaMinter, block: starknet.Block, transaction: starknet.ITransaction, event: starknet.IEvent) {
        const airdropIdentifier = {
            hash: FieldElement.toHex(transaction.meta.hash),
            address: FieldElement.toHex(event.data[0]),
            quantity: Number(FieldElement.toBigInt(event.data[1])),
            minterId: minter.id,
        }
        const airdrop = await airdropController.read({ airdropIdentifier })
        if (!airdrop) {
            const data = {
                ...airdropIdentifier,
                time: new Date(Number(block.header.timestamp.seconds.toString()) * 1000),
                block: Number(block.header.blockNumber.toString()),
            };
            await airdropController.create(data);
        }
        logger.minter(`Airdrop (${minter.address})`);
    },

    async handleBuy(minter: PrismaMinter, block: starknet.Block, transaction: starknet.ITransaction, event: starknet.IEvent) {
        const buyIdentifier = {
            hash: FieldElement.toHex(transaction.meta.hash),
            address: FieldElement.toHex(event.data[0]),
            quantity: Number(FieldElement.toBigInt(event.data[3])),
            minterId: minter.id,
        }
        const buy = await buyController.read({ buyIdentifier })
        if (!buy) {
            const data = {
                ...buyIdentifier,
                amount: Number(FieldElement.toBigInt(event.data[2])),
                time: new Date(Number(block.header.timestamp.seconds.toString()) * 1000),
                block: Number(block.header.blockNumber.toString()),
            };
            await buyController.create(data);
        }
        logger.minter(`Buy (${minter.address})`);
    },

    async handlePreSale(address: string) {
        const where = { address };

        const model = controller.load(address);
        await model.sync();

        const [preSaleOpen, whitelistMerkleRoot] = await Promise.all([
            model.isPreSaleOpen(),
            model.getWhitelistMerkleRoot(),
        ]);
        const data = { preSaleOpen, whitelistMerkleRoot };
        logger.minter(`PreSaleOpen/Close (${address})`);
        await prisma.minter.update({ where, data });
    },

    async handlePublicSale(address: string) {
        const where = { address };

        const model = controller.load(address);
        await model.sync();

        const [publicSaleOpen] = await Promise.all([model.isPublicSaleOpen()]);
        const data = { publicSaleOpen };
        logger.minter(`PublicSaleOpen/Close (${address})`);
        await prisma.minter.update({ where, data });
    },

    async handleSoldOut(address: string) {
        const where = { address };

        const model = controller.load(address);
        await model.sync();

        const [soldOut] = await Promise.all([model.isSoldOut()]);
        const data = { soldOut };
        logger.minter(`SoldOut (${address})`);
        await prisma.minter.update({ where, data });
    },

    async handleMaxBuy(address: string) {
        const where = { address };

        const model = controller.load(address);
        await model.sync();

        const [maxBuyPerTx] = await Promise.all([model.getMaxBuyPerTx()]);
        const data = { maxBuyPerTx };
        logger.minter(`MaxBuyUpdate (${address})`);
        await prisma.minter.update({ where, data });
    },

    async handleUnitPrice(address: string) {
        const where = { address };

        const model = controller.load(address);
        await model.sync();

        const [unitPrice] = await Promise.all([model.getUnitPrice()]);
        const data = { unitPrice };
        logger.minter(`UnitPriceUpdate (${address})`);
        await prisma.minter.update({ where, data });
    },

    async handleReservedSupply(address: string) {
        const where = { address };

        const model = controller.load(address);
        await model.sync();

        const [reservedSupply] = await Promise.all([model.getReservedSupply()]);
        const data = { reservedSupply };
        logger.minter(`ReservedSupplyUpdate (${address})`);
        await prisma.minter.update({ where, data });
    },

    async handleMerkleRoot(address: string) {
        const where = { address };

        const model = controller.load(address);
        await model.sync();

        const [whitelistMerkleRoot] = await Promise.all([model.getWhitelistMerkleRoot()]);
        const data = { whitelistMerkleRoot };
        logger.minter(`WhitelistMerkleRootUpdate (${address})`);
        await prisma.minter.update({ where, data });
    },
}

export default controller;
