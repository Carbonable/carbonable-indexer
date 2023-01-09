import { Project } from '../models/externals/project';
import provider from '../models/externals/client';
import prisma from '../models/internals/client';

const project = {

    async load(address: string) {
        const model = new Project(address, provider);
        await model.init();

        const [name, symbol, totalSupply, contractUri, owner, ton_equivalent, times, absorptions] = await Promise.all([
            model.getName(),
            model.getSymbol(),
            model.getTotalSupply(),
            model.getContractUri(),
            model.getOwner(),
            model.getTonEquivalent(),
            model.getTimes(),
            model.getAbsorptions(),
        ]);
        return { address, name, symbol, totalSupply, contractUri, owner, ton_equivalent, times, absorptions, image: '' };
    },

    async create(address: string) {
        const data = await this.load(address);
        return await prisma.project.create({ data });
    },

    async findOne(where: object) {
        return await prisma.project.findUnique({ where });
    },

    async findMany(where: object) {
        return await prisma.project.findMany({ where });
    },

    async update(address: string, data: object) {
        await prisma.project.update({ where: { address }, data });
    },

    async delete(address: string) {
        await prisma.project.delete({ where: { address } });
    },
}

export default project;