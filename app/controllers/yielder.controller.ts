import { FieldElement, FilterBuilder, v1alpha2 as starknet } from '@apibara/starknet'
import { UPGRADED } from '../models/starknet/contract';

import logger from '../handlers/logger';

import Yielder, { EVENTS } from '../models/starknet/yielder';
import provider from '../models/starknet/client';
import prisma from '../models/database/client';

import projectController from './project.controller';
import implementationController from './implementation.controller';
import vesterController from './vester.controller';
import snapshotController from './snapshot.controller'
import vestingController from './vesting.controller'

import { Request, Response, NextFunction } from 'express';
import { Minter, Prisma } from '@prisma/client';

const YEAR_SECONDS = 365.25 * 24 * 3600;

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
            const abi = await model.getProxyAbi();
            implementation = await implementationController.create({ address: implementationAddress, abi });
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

    async getOne(request: Request, response: Response, _next: NextFunction) {
        const where = { id: Number(request.params.id) };
        const yielder = await controller.read(where);

        if (!yielder) {
            const message = 'Yielder not found';
            const code = 404;
            return response.status(code).json({ message, code });
        }

        return response.status(200).json(yielder);
    },

    async getAll(_request: Request, response: Response, _next: NextFunction) {
        const yielders = await prisma.yielder.findMany();
        return response.status(200).json(yielders);
    },

    async getAbi(request: Request, response: Response, _next: NextFunction) {
        const where = { id: Number(request.params.id) };
        const include = { Implementation: true };
        const yielder = await controller.read(where, include);

        if (!yielder) {
            const message = 'Yielder not found';
            const code = 404;
            return response.status(code).json({ message, code });
        }

        const implementation = await implementationController.read({ id: yielder.implementationId });
        return response.status(200).json(implementation);
    },

    async getApr(request: Request, response: Response, _next: NextFunction) {
        const where = { id: Number(request.params.id) };
        const include = { vesting: true, snapshot: true, Project: { include: { Minter: true } } };
        const yielder = await controller.read(where, include);
        const vesting = yielder.vesting[yielder.vesting.length - 1];
        const snapshots = yielder.snapshot.filter((snapshot) => snapshot.time < vesting.time);
        const snapshot = snapshots[snapshots.length - 1];
        const total = yielder.Project['Minter'].reduce((total: number, minter: Minter) => total + minter.totalValue, 0);
        const dt = snapshot.time.getTime() - snapshot.previousTime.getTime();
        const apr = 100 * vesting.amount * YEAR_SECONDS / dt / total;
        return response.status(200).json({ address: yielder.address, apr });
    },

    async setFilter(filter: FilterBuilder) {
        const yielders = await prisma.yielder.findMany();
        yielders.forEach((yielder) => {
            const address = FieldElement.fromBigInt(yielder.address);
            Object.values(EVENTS).forEach((key) => {
                filter.addEvent((event) => event.withFromAddress(address).withKeys([key]));
            })
        })
    },

    async handleEvent(event: starknet.IEvent, key: string) {
        const yielders = await prisma.yielder.findMany();
        const found = yielders.find(model => model.address === FieldElement.toHex(event.fromAddress));
        if (found && [FieldElement.toHex(EVENTS.UPGRADED)].includes(key)) {
            await controller.handleUpgraded(found.address);
        } else if (found && [FieldElement.toHex(EVENTS.DEPOSIT), FieldElement.toHex(EVENTS.WITHDRAW)].includes(key)) {
            await controller.handleDepositOrWithdraw(found.address);
        } else if (found && [FieldElement.toHex(EVENTS.SNAPSHOT)].includes(key)) {
            // Remove first value and convert the rest
            const args = event.data.slice(1).map((row) => FieldElement.toHex(row));
            await controller.handleSnapshot(found.address, args);
        } else if (found && [FieldElement.toHex(EVENTS.VESTING)].includes(key)) {
            // Remove first value and convert the rest
            const args = event.data.slice(1).map((row) => FieldElement.toHex(row));
            await controller.handleVesting(found.address, args);
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
}

export default controller;