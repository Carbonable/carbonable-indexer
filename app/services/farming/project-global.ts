import prisma from '../../models/database/client';
import { getProjectAddressesFrom, loadOffseterModel, loadProjectModel, loadVesterModel } from '../index';

export async function aggregateProjectCustomerGlobalData(customerId: string) {
    let projects = await prisma.project.findMany({ include: { Minter: { include: { Payment: true } } } });
    let customerProjects = await Promise.all(projects.map(async p => {
        let projectAddresses = getProjectAddressesFrom(p.address);

        let [projectModel, vesterModel, offseterModel] = await Promise.all([
            loadProjectModel(p.address),
            loadVesterModel(projectAddresses.vester),
            loadOffseterModel(projectAddresses.offseter),
        ]);

        let [balance, releasableAmount, claimableAmount] = await Promise.all([
            projectModel.getBalanceOf([customerId]),
            vesterModel.getReleasableOf([customerId]),
            offseterModel.getClaimableOf([customerId]),
        ]);

        let projectMinter = p.Minter.pop();

        return [balance, projectMinter.unitPrice, releasableAmount, claimableAmount];
    }));

    let res = customerProjects.reduce((acc, [balance, unitPrice, releasable, claimable], _) => {
        return {
            total_deposited: acc.total_deposited + (balance * unitPrice),
            total_releasable: acc.total_releasable + releasable,
            total_claimable: acc.total_claimable + claimable,
        };
    }, { total_deposited: 0, total_releasable: 0, total_claimable: 0 });

    return { data: res };
}
