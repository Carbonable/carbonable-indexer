import prisma from '../models/database/client';
import Vester from '../models/starknet/vester';
import Offseter from '../models/starknet/offseter';
import Yielder from '../models/starknet/yielder';
import provider from '../models/starknet/client';

import { Request, Response } from 'express';
import { aggregateProjectListData } from '../services/farming';
import { aggregateProjectListDetailsData } from '../services/farming/project-list';

const controller = {

    async list(_req: Request, res: Response) {
        let projects = await prisma.project.findMany({ select: { id: true, address: true, name: true, Uri: { select: { uri: true, data: true } } } });
        return res.status(200).json({ projects });
    },
    async customerProjects(req: Request, res: Response) {
        let { customerId } = req.params;
        let customerProjects = await aggregateProjectListData(customerId);
        return res.status(200).json({ customerProjects: customerProjects.filter(Boolean) });
    },
    async projectInformations(req: Request, res: Response) {
        let { customerId, projectId } = req.params;
        let informations = await aggregateProjectListDetailsData(customerId, projectId);
        if (null === informations) {
            return res.status(404).json({ message: 'Project not found' })
        }
        return res.status(200).json({ informations });
    },
    async projectDetails(req: Request, res: Response) {
        console.log(req, res);
        return res.status(200).json({ body: 'Ok' });
    }
}

export default controller;
