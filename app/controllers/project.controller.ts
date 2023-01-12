import { Project } from '../models/externals/project';
import provider from '../models/externals/client';
import prisma from '../models/internals/client';

import { Request, Response, NextFunction } from 'express';

const controller = {

    load(address: string) {
        return new Project(address, provider);
    },

    async create(address: string) {
        const model = controller.load(address);

        const [name, symbol, totalSupply, contractUri, owner, tonEquivalent, times, absorptions] = await Promise.all([
            model.getName(),
            model.getSymbol(),
            model.getTotalSupply(),
            model.getContractUri(),
            model.getOwner(),
            model.getTonEquivalent(),
            model.getTimes(),
            model.getAbsorptions(),
        ]);

        const data = { address, name, symbol, totalSupply, contractUri, owner, tonEquivalent, times, absorptions };
        return await prisma.project.create({ data });
    },

    async read(where: { id?: number, address?: string }) {
        return await prisma.project.findUnique({ where });
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
        const balance = await model.getBalanceOf([request.params.owner]);
        return response.status(200).json({ address: project.address, owner: request.params.owner, balance });
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
}

export default controller;