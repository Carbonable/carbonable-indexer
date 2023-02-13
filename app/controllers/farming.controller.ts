import prisma from '../models/database/client';

import { Request, Response } from 'express';
import { aggregateProjectListData, aggregateProjectListDetailsData, aggregateProjectCustomerGlobalData, projectDetailedData, aggregateProjectUnconnected, getProjectList } from '../services/farming';

const controller = {

    async list(_req: Request, res: Response) {
        let projects = await getProjectList();
        return res.status(200).json({ data: [...projects] });
    },
    async customerProjects(req: Request, res: Response) {
        let { customerId } = req.params;
        let customerProjects = await aggregateProjectListData(customerId);
        return res.status(200).json({ data: customerProjects.filter(Boolean) });
    },
    async projectInformations(req: Request, res: Response) {
        let { customerId, projectSlug } = req.params;
        let informations = await aggregateProjectListDetailsData(customerId, projectSlug);
        if (null === informations) {
            return res.status(404).json({ message: 'Project not found' })
        }
        return res.status(200).json({ data: { ...informations } });
    },
    async projectListUnconnectedData(req: Request, res: Response) {
        let { projectSlug } = req.params;
        let informations = await aggregateProjectUnconnected(projectSlug);
        if (null === informations) {
            return res.status(404).json({ message: 'Project not found' })
        }
        return res.status(200).json({ data: { ...informations } });

    },
    async projectDetails(req: Request, res: Response) {
        let { projectSlug, customerId } = req.params;
        let data = await projectDetailedData(customerId, projectSlug);
        return res.status(200).json({ data });
    },
    async customerListGlobal(req: Request, res: Response) {
        let { customerId } = req.params;
        let data = await aggregateProjectCustomerGlobalData(customerId);
        return res.status(200).json({ data });
    },
}

export default controller;
