import { hexToBuffer, bufferToHex } from "@apibara/protocol";
import { Event } from "@apibara/starknet";
import { UPGRADED } from '../models/starknet/contract';
import { DEPOSIT, WITHDRAW } from '../models/starknet/offseter';
import { SNAPSHOT, VESTING } from '../models/starknet/yielder';

import logger from '../handlers/logger';

import Yielder from '../models/starknet/yielder';
import provider from '../models/starknet/client';
import prisma from '../models/database/client';

import projectController from './project.controller';
import vesterController from './vester.controller';
import snapshotController from './snapshot.controller'
import vestingController from './vesting.controller'

import { Request, Response, NextFunction } from 'express';
import { Prisma } from '@prisma/client';

const controller = {

    load(address: string) {
        return new Yielder(address, provider);
    },

    async create(address: string) {
        const model = controller.load(address);

        const [implementation, totalDeposited, totalAbsorption, snapshotedTime, projectAddress, vesterAddress] = await Promise.all([
            model.getImplementationHash(),
            model.getTotalDeposited(),
            model.getTotalAbsorption(),
            model.getSnapshotedTime(),
            model.getCarbonableProjectAddress(),
            model.getCarbonableVesterAddress(),
        ]);

        let project = await projectController.read({ address: projectAddress });
        if (!project) {
            project = await projectController.create(projectAddress);
        }

        let vester = await vesterController.read({ address: vesterAddress });
        if (!vester) {
            vester = await vesterController.create(vesterAddress);
        }

        const data = { address, implementation, totalDeposited, totalAbsorption, snapshotedTime, projectId: project.id, vesterId: vester.id };
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

    async handleEvent(event: Event) {
        const yielders = await prisma.yielder.findMany();
        const found = yielders.find(model => hexToBuffer(model.address, 32).equals(event.fromAddress));
        if (found && UPGRADED.equals(event.keys[0])) {
            controller.handleUpgraded(found.address);
        } else if (found && (DEPOSIT.equals(event.keys[0]) || WITHDRAW.equals(event.keys[0]))) {
            controller.handleDepositOrWithdraw(found.address);
        } else if (found && SNAPSHOT.equals(event.keys[0])) {
            // Remove first value and convert the rest
            const args = event.data.slice(1).map((row) => bufferToHex(Buffer.from(row)).toString());
            controller.handleSnapshot(found.address, args);
        } else if (found && VESTING.equals(event.keys[0])) {
            // Remove first value and convert the rest
            const args = event.data.slice(1).map((row) => bufferToHex(Buffer.from(row)).toString());
            controller.handleVesting(found.address, args);
        };
    },

    async handleUpgraded(address: string) {
        const where = { address };

        const model = controller.load(address);
        await model.sync();

        const implementation = await model.getImplementationHash();
        const data = { implementation };
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
        const yielder = await controller.read({ address });
        const data = {
            previousTime: new Date(Number(args[0]) * 1000),
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