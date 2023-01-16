
import { proto, hexToBuffer, bufferToHex } from "@apibara/protocol";
import { hash } from 'starknet';
import { Project } from '../models/starknet/project';
import provider from '../models/starknet/client';
import prisma from '../models/database/client';
import indexer from '../models/indexer/client';

import { Request, Response, NextFunction } from 'express';
import { Prisma } from '@prisma/client';
import { Block, TransactionReceipt, Event } from "@apibara/starknet";

const INDEXER_NAME = 'project';
const START_BLOCK = 18_610;
const ABSORPTION_UPDATE = hexToBuffer(hash.getSelectorFromName('AbsorptionUpdate'), 32);

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

    async run() {
        // Read or create indexer
        let block = await prisma.block.findUnique({ where: { name: INDEXER_NAME } });
        if (!block) {
            const data = { name: INDEXER_NAME, number: START_BLOCK }
            block = await prisma.block.create({ data })
        }

        // Run stream
        const messages = indexer.streamMessages({ startingSequence: block.number });
        messages.on("data", controller.handleData);
        return new Promise((resolve, reject) => {
            messages.on("end", resolve);
            messages.on("error", reject);
        });
    },

    async handleData(message: proto.StreamMessagesResponse__Output) {
        if (message.data) {
            if (!message.data.data.value) {
                throw new Error("received invalid data");
            }
            const block = Block.decode(message.data.data.value);
            const projects = await prisma.project.findMany();
            const addresses = projects.map(({ address }) => hexToBuffer(address, 32));
            await controller.handleBlock(addresses, block);
        } else if (message.invalidate) {
            console.log(message.invalidate);
        }
    },

    async handleBlock(addresses: Buffer[], block: Block) {
        // Loop over txs in the chronological order
        block.transactionReceipts.forEach((receipt) => {
            controller.handleTransaction(addresses, receipt);
        })

        // updated indexed block
        await prisma.block.update({
            where: { name: INDEXER_NAME },
            data: { number: block.blockNumber }
        });
    },

    async handleTransaction(addresses: Buffer[], receipt: TransactionReceipt) {
        // Loop over tx events
        receipt.events.forEach((event) => {
            const address = addresses.find(address => address.equals(event.fromAddress));
            if (!address) {
                return;
            };
            if (ABSORPTION_UPDATE.equals(event.keys[0])) {
                controller.handleAbsorptionUpdateEvent(address);
                return;
            };
        });
    },

    async handleAbsorptionUpdateEvent(address: Buffer) {
        const where = { address: bufferToHex(address) };

        const model = controller.load(where.address);
        await model.sync();

        const [tonEquivalent, times, absorptions] = await Promise.all([
            model.getTonEquivalent(),
            model.getTimes(),
            model.getAbsorptions(),
        ]);
        const data = { tonEquivalent, times, absorptions };
        console.log(`${where.address} > Sync project absorptions`);
        await prisma.project.update({ where, data });
    }
}

export default controller;