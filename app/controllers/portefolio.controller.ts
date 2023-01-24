import prisma from '../models/database/client';
import projectController from './project.controller';

import { Request, Response, NextFunction } from 'express';

const controller = {

    async getOne(request: Request, response: Response, _next: NextFunction) {
        const user = request.params.user;
        const include = {
            Minter: {
                include: {
                    Payment: true
                }
            },
        }
        const projects = [...await prisma.project.findMany({ include })];

        const data = await Promise.all(projects.map(async (project) => {
            const model = projectController.load(project.address);
            const balance = await model.getBalanceOf([user]);
            const indexes = Array.from(Array(balance).keys());
            const tokenIds = await Promise.all(indexes.map(async (index) => {
                return await model.getTokenOfOwnerByIndex([request.params.user, String(index), 0]);
            }));
            const tokens = await Promise.all(tokenIds.map(async (tokenId) => {
                const uri = await model.getTokenUri([tokenId, 0]);
                return ({ tokenId, uri });
            }));
            return ({ ...project, tokens });
        }));

        return response.status(200).json(data);
    }
}

export default controller;