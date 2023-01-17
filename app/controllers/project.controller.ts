import { hexToBuffer } from "@apibara/protocol";
import { Event } from "@apibara/starknet";
import { UPGRADED } from '../models/starknet/contract';
import { ABSORPTION_UPDATE } from '../models/starknet/project';

import logger from "../handlers/logger";

import Project from '../models/starknet/project';
import provider from '../models/starknet/client';
import prisma from '../models/database/client';

import { Request, Response, NextFunction } from 'express';
import { Prisma } from '@prisma/client';

const controller = {
    load(address: string) {
        return new Project(address, provider);
    },

    async create(address: string) {
        const model = controller.load(address);
        await model.sync();

        const [implementation, name, symbol, totalSupply, contractUri, owner, tonEquivalent, times, absorptions] = await Promise.all([
            model.getImplementationHash(),
            model.getName(),
            model.getSymbol(),
            model.getTotalSupply(),
            model.getContractUri(),
            model.getOwner(),
            model.getTonEquivalent(),
            model.getTimes(),
            model.getAbsorptions(),
        ]);

        const data = { address, implementation, name, symbol, totalSupply, contractUri, owner, tonEquivalent, times, absorptions };
        return await prisma.project.create({ data });
    },

    async read(where: { id?: number, address?: string }, include?: Prisma.ProjectInclude) {
        return await prisma.project.findUnique({ where, include });
    },

    async update(where: { id?: number, address?: string }, data: object) {
        return await prisma.project.update({ where, data });
    },

    async delete(where: { id?: number, address?: string }) {
        return await prisma.project.delete({ where });
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
        const projects = await prisma.project.findMany();
        return response.status(200).json(projects);
    },

    async getBalanceOf(request: Request, response: Response, _next: NextFunction) {
        const where = { id: Number(request.params.id) };
        const project = await controller.read(where);
        const model = controller.load(project.address);
        const balance = await model.getBalanceOf([request.params.user]);
        return response.status(200).json({ address: project.address, user: request.params.user, balance });
    },

    async getOwnerOf(request: Request, response: Response, _next: NextFunction) {
        const where = { id: Number(request.params.id) };
        const project = await controller.read(where);
        const model = controller.load(project.address);
        const owner = await model.getOwnerOf([request.params.token_id, 0]);
        return response.status(200).json({ address: project.address, token_id: request.params.token_id, owner });
    },

    async getTokenUri(request: Request, response: Response, _next: NextFunction) {
        const where = { id: Number(request.params.id) };
        const project = await controller.read(where);
        const model = controller.load(project.address);
        const uri = await model.getTokenUri([request.params.token_id, 0]);
        return response.status(200).json({ address: project.address, token_id: request.params.token_id, uri });
    },

    async handleEvent(event: Event) {
        const projects = await prisma.project.findMany();
        const found = projects.find(model => hexToBuffer(model.address, 32).equals(event.fromAddress));
        if (found && UPGRADED.equals(event.keys[0])) {
            controller.handleUpgraded(found.address);
        } else if (found && ABSORPTION_UPDATE.equals(event.keys[0])) {
            controller.handleAbsorptionUpdate(found.address);
        };
    },

    async handleUpgraded(address: string) {
        const where = { address };

        const model = controller.load(address);
        await model.sync();

        const implementation = await model.getImplementationHash();
        const data = { implementation };
        logger.project(`Upgraded (${address})`);
        await prisma.project.update({ where, data });
    },

    async handleMint(address: string) {
        const where = { address };

        const model = controller.load(address);
        await model.sync();

        const totalSupply = await model.getTotalSupply();
        const data = { totalSupply };
        logger.project(`Mint (${address})`);
        await prisma.project.update({ where, data });
    },

    async handleAbsorptionUpdate(address: string) {
        const where = { address };

        const model = controller.load(address);
        await model.sync();

        const [tonEquivalent, times, absorptions] = await Promise.all([
            model.getTonEquivalent(),
            model.getTimes(),
            model.getAbsorptions(),
        ]);
        const data = { tonEquivalent, times, absorptions };
        logger.project(`AbsorptionUpdate (${address})`);
        await prisma.project.update({ where, data });
    }
}

export default controller;