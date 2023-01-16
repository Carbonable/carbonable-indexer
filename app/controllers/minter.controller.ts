import logger from "../handlers/logger";

import Minter from '../models/starknet/minter';
import provider from '../models/starknet/client';
import prisma from '../models/database/client';

import projectController from './project.controller';
import paymentController from './payment.controller';

import { Request, Response, NextFunction } from 'express';
import { Prisma } from '@prisma/client';

const controller = {

    load(address: string) {
        return new Minter(address, provider);
    },

    async create(address: string, whitelist?: object) {
        const model = controller.load(address);

        const [implementation, maxSupply, reservedSupply, preSaleOpen, publicSaleOpen, maxBuyPerTx, unitPrice, whitelistMerkleRoot, soldOut, totalValue, projectAddress, paymentAddress] = await Promise.all([
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

        let project = await projectController.read({ address: projectAddress });
        if (!project) {
            project = await projectController.create(projectAddress);
        }

        let payment = await paymentController.read({ address: paymentAddress });
        if (!payment) {
            try {
                payment = await paymentController.create(paymentAddress);
            } catch (_error) {
                // Could be a collision since several minters refer to the same payment contract, then just re-read
                payment = await paymentController.read({ address: paymentAddress });
            }
        }

        const data = { address, implementation, maxSupply, reservedSupply, preSaleOpen, publicSaleOpen, maxBuyPerTx, unitPrice, whitelistMerkleRoot, soldOut, totalValue, whitelist, projectId: project.id, paymentId: payment.id };
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

    async getOne(request: Request, response: Response, _next: NextFunction) {
        const where = { id: Number(request.params.id) };
        const include: Prisma.MinterInclude = { Payment: true }
        const project = await controller.read(where, include);

        if (!project) {
            const message = 'Project not found';
            const code = 404;
            return response.status(code).json({ message, code });
        }

        return response.status(200).json(project);
    },

    async getAll(_request: Request, response: Response, _next: NextFunction) {
        const projects = await prisma.minter.findMany({ include: { Payment: true } });
        return response.status(200).json(projects);
    },

    async getWhitelistedSlots(request: Request, response: Response, _next: NextFunction) {
        const minter = await controller.read({ id: Number(request.params.id) });
        const model = controller.load(minter.address);
        const balance = await model.getWhitelistedSlots([]);
        return response.status(200).json({ address: minter.address, user: request.params.user, balance });
    },

    async getClaimedSlots(request: Request, response: Response, _next: NextFunction) {
        const minter = await controller.read({ id: Number(request.params.id) });
        const model = controller.load(minter.address);
        const slots = await model.getClaimedSlots([request.params.user]);
        return response.status(200).json({ address: minter.address, user: request.params.user, slots });
    },

    async handleUpgraded(address: string) {
        const where = { address };

        const model = controller.load(address);
        await model.sync();

        const implementation = await model.getImplementationHash();
        const data = { implementation };
        logger.minter(`Upgraded (${address})`);
        await prisma.minter.update({ where, data });
    },

    async handlePreSale(address: string) {
        const where = { address };

        const model = controller.load(address);
        await model.sync();

        const [preSaleOpen] = await Promise.all([model.isPreSaleOpen()]);
        const data = { preSaleOpen };
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
}

export default controller;