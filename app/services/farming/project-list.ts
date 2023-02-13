import prisma from '../../models/database/client';
import { formatMoney, formatTon, getProjectAddressesFrom, loadMinterModel, loadOffseterModel, loadPaymentModel, loadProjectModel, loadVesterModel, loadYielderModel } from '../index';
import { data } from '../../models/database/client';
import { Project } from '@prisma/client';

function isProjectComingSoon(projectAddresses: any): boolean {
    return !projectAddresses.hasOwnProperty('vester') && !projectAddresses.hasOwnProperty('yielder') && !projectAddresses.hasOwnProperty('offseter');
}

function getProjectStatus(p: { address: string, absorptions: number[], times: Date[] }, projectAddresses): string {
    if (isProjectComingSoon(projectAddresses)) {
        return "Coming Soon";
    }

    if (0 === p.times.length && 0 === p.absorptions.length) {
        return "Funding";
    }

    if (new Date() > p.times.pop()) {
        return "Ended";
    }

    return "Live";
}


// coming soon -> no absorptions
// live -> absorption list is not empty
// ended -> si now > getFinalTime
// stopped -> project stopped (no fetching method atm)
// on hold -> paused (no fetching method atm)

export async function aggregateProjectListData(customerId: string) {
    let projects = await prisma.project.findMany({ select: { address: true, absorptions: true, times: true } });
    let customerProjects = await Promise.all(projects.map(async p => {
        let projectAddresses = data.filter(project => project.project === p.address).pop();
        let isComingSoon = isProjectComingSoon(projectAddresses);
        let projectModel = loadProjectModel(p.address);
        let balance = await projectModel.getBalanceOf([customerId]);

        if (0 === balance) {
            return null;
        }

        return {
            address: p.address,
            balance: balance,
            is_coming_soon: isComingSoon,
            status: getProjectStatus(p, projectAddresses),
        };
    }));

    return customerProjects;
}

export async function aggregateProjectListDetailsData(customerId: string, projectAddress: string) {
    let project = await prisma.project.findUnique({
        where: { address: projectAddress }, include: {
            Minter: {
                include: { Payment: true }
            }
        }
    });
    if (null === project) {
        return null;
    }
    let projectAddresses = getProjectAddressesFrom(projectAddress);
    let [vesterModel, yielderModel, offseterModel] = await Promise.all([
        loadVesterModel(projectAddresses.vester),
        loadYielderModel(projectAddresses.yielder),
        loadOffseterModel(projectAddresses.offseter),
    ]);

    let [releasable, claimable, offsetedTokensList, yieldedTokenList, totalOffsetDeposited, totalYieldDeposited] = await Promise.all([
        vesterModel.getReleasableOf([customerId]),
        offseterModel.getClaimableOf([customerId]),
        offseterModel.getRegisteredTokensOf([customerId]),
        yielderModel.getRegisteredTokensOf([customerId]),
        offseterModel.getTotalDeposited(),
        yielderModel.getTotalDeposited(),
    ]);

    let projectMinter = project.Minter.pop();
    let projectPayment = projectMinter.Payment;
    let customerStake = (projectMinter.unitPrice * (offsetedTokensList.length + yieldedTokenList.length) / projectPayment.decimals);

    return {
        ends_at: project.times.pop(),
        total_value_locked: (projectMinter.unitPrice * (totalOffsetDeposited + totalYieldDeposited) / projectPayment.decimals),
        total_removal: formatTon(project.absorptions.pop() ?? 0, project.tonEquivalent),
        customer_stake: customerStake,
        vesting_to_claim: claimable,
        absorption_to_claim: formatTon(releasable, project.tonEquivalent),
    }
}
