import { FieldElement, FilterBuilder, v1alpha2 as starknet } from '@apibara/starknet'

import logger from '../handlers/logger';

import Yielder, { EVENTS, ENTRIES } from '../models/starknet/yielder';
import provider from '../models/starknet/client';
import prisma from '../models/database/client';

import projectController from './project.controller';
import implementationController from './implementation.controller';
import vesterController from './vester.controller';
import snapshotController from './snapshot.controller'
import vestingController from './vesting.controller'

import { Request, Response } from 'express';
import { Prisma } from '@prisma/client';
import { getApr } from '../services/apr';


const controller = {

    load(address: string) {
        return new Yielder(address, provider);
    },

    async create(address: string) {
        const model = controller.load(address);

        const [implementationAddress, totalDeposited, totalAbsorption, snapshotedTime, projectAddress, vesterAddress] = await Promise.all([
            model.getImplementationHash(),
            model.getTotalDeposited(),
            model.getTotalAbsorption(),
            model.getSnapshotedTime(),
            model.getCarbonableProjectAddress(),
            model.getCarbonableVesterAddress(),
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

        let vester = await vesterController.read({ address: vesterAddress });
        if (!vester) {
            vester = await vesterController.create(vesterAddress);
        }

        const data = { address, totalDeposited, totalAbsorption, snapshotedTime, projectId: project.id, vesterId: vester.id, implementationId: implementation.id };
        return await prisma.yielder.create({ data });
    },

    async read(where: { id?: number, address?: string }, include?: Prisma.YielderInclude) {
        return await prisma.yielder.findUnique({ where, include });
    },

    async update(where: { id?: number, address?: string }, data: object) {
        return await prisma.yielder.update({ where, data });
    },

    async delete(where: { id?: number, address?: string }) {
        return await prisma.yielder.delete({ where });
    },

    async add(request: Request, response: Response) {
        const where = { address: request.params.address };
        const yielder = await controller.read(where);

        if (yielder) {
            const message = 'yielder already exists';
            const code = 409;
            return response.status(code).json({ message, code });
        }

        try {
            const yielder = await controller.create(request.params.address);
            return response.status(201).json(yielder);
        } catch (error) {
            const code = 500;
            return response.status(code).json({ message: error.message, code });
        }
    },

    async remove(request: Request, response: Response) {
        const where = { address: request.params.address };
        const yielder = await controller.read(where);

        if (!yielder) {
            const message = 'yielder not found';
            const code = 404;
            return response.status(code).json({ message, code });
        }

        try {
            await controller.delete({ id: yielder.id });
            const code = 200;
            return response.status(code).json({ code });
        } catch (error) {
            const code = 500;
            return response.status(code).json({ message: error.message, code });
        }
    },

    async getOne(request: Request, response: Response) {
        const where = { id: Number(request.params.id) };
        const yielder = await controller.read(where);

        if (!yielder) {
            const message = 'yielder not found';
            const code = 404;
            return response.status(code).json({ message, code });
        }

        return response.status(200).json(yielder);
    },

    async getAll(_request: Request, response: Response) {
        const yielders = await prisma.yielder.findMany();
        return response.status(200).json(yielders);
    },

    async getAbi(request: Request, response: Response) {
        const where = { id: Number(request.params.id) };
        const include = { Implementation: true };
        const yielder = await controller.read(where, include);

        if (!yielder) {
            const message = 'yielder not found';
            const code = 404;
            return response.status(code).json({ message, code });
        }

        const implementation = await implementationController.read({ id: yielder.implementationId });
        return response.status(200).json(implementation);
    },

    async getApr(request: Request, response: Response) {
        try {
            let { address, apr } = await getApr({ yielderId: Number(request.params.id), yielderAddress: null });
            return response.status(200).json({ address, apr });
        } catch (err) {
            return response.status(404).json({ message: err, code: 404 });
        }
    },

    async setFilter(filter: FilterBuilder) {
        const yielders = await prisma.yielder.findMany();
        yielders.forEach((yielder) => {
            const address = FieldElement.fromBigInt(yielder.address);
            Object.values(EVENTS).forEach((key) => {
                filter.addEvent((event) => event.withFromAddress(address).withKeys([key]));
            })
            filter.withStateUpdate((su) => su.addStorageDiff((st) => st.withContractAddress(address)))
        })
    },

    async handleEvent(event: starknet.IEvent, key: string) {
        const found = await prisma.yielder.findUnique({ where: { address: FieldElement.toHex(event.fromAddress) } });
        if (null === found) {
            return;
        }

        if (key === FieldElement.toHex(EVENTS.UPGRADED)) {
            await controller.handleUpgraded(found.address);
        }

        if ([FieldElement.toHex(EVENTS.DEPOSIT), FieldElement.toHex(EVENTS.WITHDRAW)].includes(key)) {
            await controller.handleDepositOrWithdraw(found.address);
        }

        if (key === FieldElement.toHex(EVENTS.SNAPSHOT)) {
            // Remove first value and convert the rest
            const args = event.data.slice(1).map((row) => FieldElement.toHex(row));
            await controller.handleSnapshot(found.address, args);
        }

        if (key === FieldElement.toHex(EVENTS.VESTING)) {
            // Remove first value and convert the rest
            const args = event.data.slice(1).map((row) => FieldElement.toHex(row));
            await controller.handleVesting(found.address, args);
        }
    },

    async handleEntry(contractAddress: string, entry: starknet.IStorageEntry) {
        const found = await prisma.yielder.findUnique({ where: { address: contractAddress } });
        if (found && [ENTRIES.SNAPSHOTED_TIME].includes(FieldElement.toBigInt(entry.key))) {
            await controller.handleSnapshotedTime(found.address);
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
        logger.yielder(`Upgraded (${address})`);
        await prisma.yielder.update({ where, data });
    },

    async handleDepositOrWithdraw(address: string) {
        const where = { address };

        const model = controller.load(address);
        await model.sync();

        const [totalDeposited] = await Promise.all([model.getTotalDeposited()]);
        const data = { totalDeposited };
        logger.yielder(`Deposit/Withdraw (${address})`);
        await prisma.yielder.update({ where, data });
    },

    async handleSnapshot(address: string, args: string[]) {
        const yielder = await controller.read({ address }, { Project: true });
        const project = await projectController.read({ id: yielder.projectId });
        const previousTime = Number(args[0]) ? new Date(Number(args[0]) * 1000) : project.times[0];
        const data = {
            previousTime,
            previousProjectAbsorption: Number(args[1]),
            previousOffseterAbsorption: Number(args[2]),
            previousYielderAbsorption: Number(args[3]),
            time: new Date(Number(args[4]) * 1000),
            currentProjectAbsorption: Number(args[5]),
            currentOffseterAbsorption: Number(args[6]),
            currentYielderAbsorption: Number(args[7]),
            projectAbsorption: Number(args[8]),
            offseterAbsorption: Number(args[9]),
            yielderAbsorption: Number(args[10]),
            yielderId: yielder.id,
        };

        logger.yielder(`Snapshot (${address})`);
        const where = { snapshotIdentifier: { time: data.time, yielderId: data.yielderId } };
        const snapshot = await snapshotController.read(where);
        if (!snapshot) {
            snapshotController.create(data);
        }
    },

    async handleVesting(address: string, args: string[]) {
        const yielder = await controller.read({ address });
        const data = {
            amount: Number(args[0]),
            time: new Date(Number(args[1]) * 1000),
            yielderId: yielder.id,
        };

        logger.yielder(`Vesting (${address})`);
        const where = { vestingIdentifier: { time: data.time, yielderId: data.yielderId } };
        const vesting = await vestingController.read(where);
        if (!vesting) {
            vestingController.create(data);
        }
    },

    async handleSnapshotedTime(address: string) {
        const where = { address };

        const model = controller.load(address);
        await model.sync();

        const [snapshotedTime] = await Promise.all([model.getSnapshotedTime()]);
        const data = { snapshotedTime };
        logger.yielder(`SnapshotedTime (${address})`);
        await prisma.yielder.update({ where, data });
    },
}

export default controller;
