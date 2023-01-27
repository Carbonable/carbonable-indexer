import prisma from '../models/database/client';
import badgeController from './badge.controller';
import projectController from './project.controller';
import uriController from './uri.controller';

import { Request, Response } from 'express';

const controller = {

    async getOne(request: Request, response: Response) {
        // Global values
        const user = request.params.user;
        let total = 0;

        // Projects analysis
        const include = {
            Minter: {
                include: {
                    Payment: true
                }
            },
        }

        const dataProjects = await prisma.project.findMany({ include });
        const projects = (await Promise.all(dataProjects.map(async (project) => {
            const model = projectController.load(project.address);
            const balance = await model.getBalanceOf([user]);
            const indexes = Array.from(Array(balance).keys());
            const tokenIds = await Promise.all(indexes.map(async (index) => {
                return await model.getTokenOfOwnerByIndex([request.params.user, String(index), 0]);
            }));
            const tokens = await Promise.all(tokenIds.map(async (tokenId) => {
                const uri = await model.getTokenUri([tokenId, 0]);

                let tokenUri = await uriController.read({ uri });
                if (!tokenUri) {
                    try {
                        tokenUri = await uriController.create(uri);
                    } catch (_error) {
                        tokenUri = await uriController.read({ uri });
                    }
                }
                return ({ tokenId, image: tokenUri.data['image'], name: tokenUri.data['name'] });
            }));

            // Compute investment
            if (project.Minter.length !== 1) {
                const message = 'unexpected project minters count to compute value';
                throw Error(message);
            }

            const minter = project.Minter[0];
            const price = minter.unitPrice / 10 ** minter.Payment.decimals;
            total += tokens.length * price;

            return ({
                id: project.id,
                name: project.name,
                tokens
            });
        }))).filter((project) => project.tokens.length > 0);

        // Badges analysis
        const dataBadges = await prisma.badge.findMany();
        const badges = (await Promise.all(dataBadges.map(async (badge) => {
            const model = badgeController.load(badge.address);
            const tokenIds = await prisma.transferSingle.findMany({ distinct: ['tokenId'], select: { tokenId: true } });
            const tokens = await Promise.all(tokenIds.map(async ({ tokenId }) => {
                const uri = await model.getTokenUri([tokenId, 0]);

                let tokenUri = await uriController.read({ uri });
                if (!tokenUri) {
                    try {
                        tokenUri = await uriController.create(uri);
                    } catch (_error) {
                        tokenUri = await uriController.read({ uri });
                    }
                }
                return ({ tokenId, image: tokenUri.data['image'], name: tokenUri.data['name'] });
            }));
            return ({
                id: badge.id,
                name: badge.name,
                tokens
            });
        }))).filter((project) => project.tokens.length > 0);

        return response.status(200).json({
            global: { total },
            projects,
            badges,
        });
    }
}

export default controller;