import { FieldElement, FilterBuilder, v1alpha2 as starknet } from '@apibara/starknet'

import logger from "../handlers/logger";

import Project, { EVENTS, ENTRIES } from '../models/starknet/project';
import provider from '../models/starknet/client';
import prisma from '../models/database/client';

import transferController from './transfer.controller';
import implementationController from './implementation.controller';
import uriController from './uri.controller';

import { Request, Response } from 'express';
import { Prisma, Project as PrismaProject, Uri } from '@prisma/client';

const controller = {
    load(address: string) {
        return new Project(address, provider);
    },

    async create(address: string) {
        const model = controller.load(address);
        await model.sync();

        const [implementationAddress, name, symbol, totalSupply, contractUri, owner, tonEquivalent, times, absorptions, setup] = await Promise.all([
            model.getImplementationHash(),
            model.getName(),
            model.getSymbol(),
            model.getTotalSupply(),
            model.getContractUri(),
            model.getOwner(),
            model.getTonEquivalent(),
            model.getTimes(),
            model.getAbsorptions(),
            model.isSetup(),
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
        let slug = controller.getSlugFromMetadata(uri);

        const data = { address, name, slug, symbol, totalSupply, owner, tonEquivalent, times, absorptions, setup, implementationId: implementation.id, uriId: uri.id };
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

    async add(request: Request, response: Response) {
        const where = { address: request.params.address };
        const project = await controller.read(where);

        if (project) {
            const message = 'project already exists';
            const code = 409;
            return response.status(code).json({ message, code });
        }

        try {
            const project = await controller.create(request.params.address);
            return response.status(201).json(project);
        } catch (error) {
            const code = 500;
            return response.status(code).json({ message: error.message, code });
        }
    },

    async remove(request: Request, response: Response) {
        const where = { address: request.params.address };
        const project = await controller.read(where);

        if (!project) {
            const message = 'project not found';
            const code = 404;
            return response.status(code).json({ message, code });
        }

        try {
            await controller.delete({ id: project.id });
            const code = 200;
            return response.status(code).json({ code });
        } catch (error) {
            const code = 500;
            return response.status(code).json({ message: error.message, code });
        }
    },

    async getOne(request: Request, response: Response) {
        const include = { Uri: true };
        const where = { id: Number(request.params.id) };
        const project = await controller.read(where, include);

        if (!project) {
            const message = 'project not found';
            const code = 404;
            return response.status(code).json({ message, code });
        }

        return response.status(200).json(project);
    },

    async getAll(_request: Request, response: Response) {
        const include = { Uri: true };
        const projects = await prisma.project.findMany({ include });
        return response.status(200).json(projects);
    },

    async getMinters(request: Request, response: Response) {
        const include = { Minter: true };
        const where = { id: Number(request.params.id) };
        const project = await controller.read(where, include);

        if (!project) {
            const message = 'project not found';
            const code = 404;
            return response.status(code).json({ message, code });
        }

        return response.status(200).json(project.Minter);
    },

    async getOffseters(request: Request, response: Response) {
        const include = { Offseter: true };
        const where = { id: Number(request.params.id) };
        const project = await controller.read(where, include);

        if (!project) {
            const message = 'project not found';
            const code = 404;
            return response.status(code).json({ message, code });
        }

        return response.status(200).json(project.Offseter);
    },

    async getYielders(request: Request, response: Response) {
        const include = { Yielder: true };
        const where = { id: Number(request.params.id) };
        const project = await controller.read(where, include);

        if (!project) {
            const message = 'project not found';
            const code = 404;
            return response.status(code).json({ message, code });
        }

        return response.status(200).json(project.Yielder);
    },

    async getAbi(request: Request, response: Response) {
        const where = { id: Number(request.params.id) };
        const include = { Implementation: true };
        const project = await controller.read(where, include);

        if (!project) {
            const message = 'project not found';
            const code = 404;
            return response.status(code).json({ message, code });
        }

        const implementation = await implementationController.read({ id: project.implementationId });
        return response.status(200).json(implementation);
    },

    async getTokenByIndex(request: Request, response: Response) {
        const where = { id: Number(request.params.id) };
        const project = await controller.read(where);

        if (!project) {
            const message = 'project not found';
            const code = 404;
            return response.status(code).json({ message, code });
        }

        const index = Number(request.params.index);

        if (index >= project.totalSupply) {
            const message = 'Index exceeds the token supply';
            const code = 400;
            return response.status(code).json({ message, code });
        }

        const model = controller.load(project.address);
        const tokenId = await model.getTokenByIndex([request.params.index, 0]);
        const owner = await model.getOwnerOf([tokenId, 0]);
        const uri = await model.getTokenUri([tokenId, 0]);

        let tokenUri = await uriController.read({ uri });
        if (!tokenUri) {
            tokenUri = await uriController.create(uri);
        }
        return response.status(200).json({ address: project.address, owner, tokenId, uri: tokenUri });
    },

    async getTokens(request: Request, response: Response) {
        const where = { id: Number(request.params.id) };
        const project = await controller.read(where);

        if (!project) {
            const message = 'project not found';
            const code = 404;
            return response.status(code).json({ message, code });
        }

        const indexes = Array.from(Array(project.totalSupply).keys());
        const model = controller.load(project.address);
        const tokens = await Promise.all(indexes.map(async (index) => {
            const tokenId = await model.getTokenByIndex([String(index), 0]);
            const owner = await model.getOwnerOf([tokenId, 0]);
            const uri = await model.getTokenUri([tokenId, 0]);

            let tokenUri = await uriController.read({ uri });
            if (!tokenUri) {
                try {
                    tokenUri = await uriController.create(uri);
                } catch (_error) {
                    tokenUri = await uriController.read({ uri });
                }
            }

            return { owner, tokenId, uri: tokenUri };
        }));

        return response.status(200).json({ address: project.address, tokens });
    },

    async getTokenByIndexOf(request: Request, response: Response) {
        const where = { id: Number(request.params.id) };
        const project = await controller.read(where);

        if (!project) {
            const message = 'project not found';
            const code = 404;
            return response.status(code).json({ message, code });
        }

        const model = controller.load(project.address);
        const balance = await model.getBalanceOf([request.params.user]);
        const index = Number(request.params.index);

        if (index >= balance) {
            const message = 'index exceeds the user balance';
            const code = 400;
            return response.status(code).json({ message, code });
        }

        const tokenId = await model.getTokenOfOwnerByIndex([request.params.user, request.params.index, 0]);
        return response.status(200).json({ address: project.address, user: request.params.user, tokenId });
    },

    async getTokensOf(request: Request, response: Response) {
        const where = { id: Number(request.params.id) };
        const project = await controller.read(where);

        if (!project) {
            const message = 'project not found';
            const code = 404;
            return response.status(code).json({ message, code });
        }

        const model = controller.load(project.address);
        const balance = await model.getBalanceOf([request.params.user]);
        const indexes = Array.from(Array(balance).keys());
        const tokenIds = await Promise.all(indexes.map(async (index) => {
            return await model.getTokenOfOwnerByIndex([request.params.user, String(index), 0]);
        }));

        return response.status(200).json({ address: project.address, user: request.params.user, tokenIds });
    },

    async getBalanceOf(request: Request, response: Response) {
        const where = { id: Number(request.params.id) };
        const project = await controller.read(where);

        if (!project) {
            const message = 'project not found';
            const code = 404;
            return response.status(code).json({ message, code });
        }

        const model = controller.load(project.address);
        const balance = await model.getBalanceOf([request.params.user]);
        return response.status(200).json({ address: project.address, user: request.params.user, balance });
    },

    async getOwnerOf(request: Request, response: Response) {
        const where = { id: Number(request.params.id) };
        const project = await controller.read(where);

        if (!project) {
            const message = 'project not found';
            const code = 404;
            return response.status(code).json({ message, code });
        }

        const model = controller.load(project.address);
        const owner = await model.getOwnerOf([request.params.token_id, 0]);
        return response.status(200).json({ address: project.address, token_id: request.params.token_id, owner });
    },

    async getTokenUri(request: Request, response: Response) {
        const where = { id: Number(request.params.id) };
        const project = await controller.read(where);

        if (!project) {
            const message = 'project not found';
            const code = 404;
            return response.status(code).json({ message, code });
        }

        const model = controller.load(project.address);
        const uri = await model.getTokenUri([request.params.token_id, 0]);
        let tokenUri = await uriController.read({ uri });
        if (!tokenUri) {
            tokenUri = await uriController.create(uri);
        }

        return response.status(200).json({ address: project.address, token_id: request.params.token_id, uri });
    },

    async getTransfers(request: Request, response: Response) {
        const where = { id: Number(request.params.id) };
        const include = { Transfer: true };
        const project = await controller.read(where, include);

        if (!project) {
            const message = 'project not found';
            const code = 404;
            return response.status(code).json({ message, code });
        }

        return response.status(200).json(project.Transfer);
    },

    async setFilter(filter: FilterBuilder) {
        const projects = await prisma.project.findMany();
        projects.forEach((project) => {
            const address = FieldElement.fromBigInt(project.address);
            Object.values(EVENTS).forEach((key) => {
                filter.addEvent((event) => event.withFromAddress(address).withKeys([key]));
            })
            filter.withStateUpdate((su) => su.addStorageDiff((st) => st.withContractAddress(address)))
        })
    },

    async handleEvent(block: starknet.Block, transaction: starknet.ITransaction, event: starknet.IEvent, key: string) {
        const projects = await prisma.project.findMany();
        const found = projects.find(model => model.address === FieldElement.toHex(event.fromAddress));
        if (found && [FieldElement.toHex(EVENTS.UPGRADED)].includes(key)) {
            await controller.handleUpgraded(found.address);
        } else if (found && [FieldElement.toHex(EVENTS.ABSORPTION_UPDATE)].includes(key)) {
            await controller.handleAbsorptionUpdate(found.address);
        } else if (found && [FieldElement.toHex(EVENTS.TRANSFER)].includes(key)) {
            await controller.handleTransfer(found, block, transaction, event);
        };
    },

    async handleEntry(contractAddress: string, entry: starknet.IStorageEntry) {
        const projects = await prisma.project.findMany();
        const found = projects.find(model => model.address === contractAddress);
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
        let uri = await controller.getUriData(address);
        let slug = controller.getSlugFromMetadata(uri);

        const data = { implementationId: implementation.id, slug };
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

    async handleTransfer(project: PrismaProject, block: starknet.Block, transaction: starknet.ITransaction, event: starknet.IEvent) {
        const transferIdentifier = {
            hash: FieldElement.toHex(transaction.meta.hash),
            from: FieldElement.toHex(event.data[0]),
            to: FieldElement.toHex(event.data[1]),
            tokenId: Number(FieldElement.toBigInt(event.data[2])),
            projectId: project.id,
        }
        const transfer = await transferController.read({ transferIdentifier })
        if (!transfer) {
            const data = {
                ...transferIdentifier,
                time: new Date(Number(block.header.timestamp.seconds.toString()) * 1000),
                block: Number(block.header.blockNumber.toString()),
            };
            await transferController.create(data);

            if (0 === parseInt(transferIdentifier.from, 16)) {
                await controller.handleMint(project.address);
            }
        }

        logger.project(`Transfer (${project.address})`);
    },

    async handleAbsorptionUpdate(address: string) {
        const where = { address };

        const model = controller.load(address);
        await model.sync();

        const [tonEquivalent, times, absorptions, setup] = await Promise.all([
            model.getTonEquivalent(),
            model.getTimes(),
            model.getAbsorptions(),
            model.isSetup(),
        ]);
        const data = { tonEquivalent, times, absorptions, setup };
        logger.project(`AbsorptionUpdate (${address})`);
        await prisma.project.update({ where, data });
    },

    async handleMetadataUpdate(address: string) {
        const where = { address };

        let uri = await controller.getUriData(address);
        let slug = controller.getSlugFromMetadata(uri);

        const data = { uriId: uri.id, slug };
        logger.project(`MetadataUpdate (${address})`);
        await prisma.project.update({ where, data });
    },

    async getUriData(address: string): Promise<Uri> {
        const model = controller.load(address);
        await model.sync();

        const [contractUri] = await Promise.all([
            model.getContractUri(),
        ]);

        let uri = await uriController.read({ uri: contractUri });
        if (!uri) {
            uri = await uriController.create(contractUri);
        }

        return uri;
    },

    getSlugFromMetadata(metadata: Uri): string {
        // We assume that we always have an external_url set.
        let externalUrl = metadata.data['external_url'];
        if (externalUrl.endsWith('/')) {
            externalUrl = externalUrl.substring(0, externalUrl.length - 1);
        }
        return externalUrl.split('/').pop();
    }
}

export default controller;
