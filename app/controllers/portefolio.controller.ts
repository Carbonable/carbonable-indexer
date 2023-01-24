import prisma from '../models/database/client';
import badgeController from './badge.controller';
import projectController from './project.controller';
import uriController from './uri.controller';

import { Request, Response, NextFunction } from 'express';

const controller = {

    async getOne(request: Request, response: Response, _next: NextFunction) {
        const user = request.params.user;

        // Projects analysis
        const include = {
            Minter: {
                include: {
                    Payment: true
                }
            },
        }
        const projects = await prisma.project.findMany({ include });
        const projectData = await Promise.all(projects.map(async (project) => {
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
                return ({ tokenId, image: tokenUri.data['image'] });
            }));
            return ({
                id: project.id,
                name: project.name,
                minter: project.Minter,
                tokens
            });
        }));

        // Badges analysis
        const badges = await prisma.badge.findMany();
        const badgeData = await Promise.all(badges.map(async (badge) => {
            const model = badgeController.load(badge.address);
            // FIXME: To test token ids = 0-10, fix after contract implements enumerable
            const rangeIds = Array.from(Array(10).keys());
            const tokenIds = (await Promise.all(rangeIds.map(async (tokenId) => {
                const balance = await model.getBalanceOf([user, tokenId, 0]);
                return balance > 0 ? tokenId : null;
            }))).filter((tokenId) => tokenId !== null);
            console.log(tokenIds);
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
                return ({ tokenId, image: tokenUri.data['image'] });
            }));
            return ({
                id: badge.id,
                name: badge.name,
                tokens
            });
        }));

        return response.status(200).json({ projectData, badgeData });
    }
}

export default controller;