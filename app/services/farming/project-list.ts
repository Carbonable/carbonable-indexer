import prisma from '../../models/database/client';
import { getApr } from '../apr';
import { formatTon, getProjectAddressesFrom, loadOffseterModel, loadProjectModel, loadVesterModel, loadYielderModel } from '../index';

function isProjectComingSoon(projectAddresses: any): boolean {
    return !projectAddresses.hasOwnProperty('vester') && !projectAddresses.hasOwnProperty('yielder') && !projectAddresses.hasOwnProperty('offseter');
}

function getProjectStatus(p: { address: string, absorptions: number[], times: Date[] }, projectAddresses): string {
    if (isProjectComingSoon(projectAddresses) || 0 === p.times.length && 0 === p.absorptions.length) {
        return "Upcoming";
    }

    if (new Date() > p.times.pop()) {
        return "Ended";
    }

    return "Live";
}

export async function getProjectList(search: { where?: any } = {}) {
    let query = { select: { id: true, address: true, name: true, slug: true, Uri: { select: { uri: true, data: true } } } };
    if (search.hasOwnProperty('where')) {
        // @ts-ignore
        query.where = search.where;
    }
    let projects = await prisma.project.findMany(query);
    return await withTokenMetadata(projects);
}

export async function aggregateProjectListData(customerId: string) {
    let projects = await prisma.project.findMany({ select: { address: true, slug: true, absorptions: true, times: true } });
    let customerProjects = await Promise.all(projects.map(async p => {
        let projectAddresses = getProjectAddressesFrom(p.address);
        let isComingSoon = isProjectComingSoon(projectAddresses);
        let projectModel = loadProjectModel(p.address);
        let balance = await projectModel.getBalanceOf([customerId]);

        if (0 === balance) {
            return null;
        }

        return {
            address: p.address,
            slug: p.slug,
            balance: balance,
            is_coming_soon: isComingSoon,
            status: getProjectStatus(p, projectAddresses),
        };
    }));

    return customerProjects;
}

export async function withTokenMetadata(projects: Array<{ id: number, address: string, slug: string, name: string, Uri: { uri: string, data: any } }>): Promise<Array<{ id: number, address: string, slug: string, name: string, Uri: { uri: string, data: any } }>> {
    return await Promise.all(projects.map(async (p) => {
        let projectModel = loadProjectModel(p.address);
        if (!p.Uri.data.hasOwnProperty('attributes')) {
            let uri = await projectModel.getContractUri();
            if (null !== uri || undefined !== uri) {
                uri = uri.replace('ipfs://', process.env.IPFS_GATEWAY);
            }

            let response = await fetch(uri);
            let metadata = { attributes: {} };
            if (response.ok) {
                metadata = await response.json();
                p.Uri.data.attributes = metadata.attributes;
            }

        }

        return p;
    }));

}

export async function aggregateProjectUnconnected(projectSlug: string) {
    let project = await prisma.project.findUnique({
        where: { slug: projectSlug }, include: {
            Minter: {
                include: { Payment: true }
            }
        }
    });

    if (null === project) {
        return null;
    }

    let projectAddresses = getProjectAddressesFrom(project.address);

    let [yielderModel, offseterModel] = await Promise.all([
        loadYielderModel(projectAddresses.yielder),
        loadOffseterModel(projectAddresses.offseter),
    ]);

    let [totalOffsetDeposited, totalYieldDeposited] = await Promise.all([
        offseterModel.getTotalDeposited(),
        yielderModel.getTotalDeposited(),
    ]);

    let projectMinter = project.Minter.pop();
    let projectPayment = projectMinter.Payment;
    let apr: number | string = 'n/a';
    try {
        let { apr: computedApr } = await getApr({ yielderAddress: projectAddresses.yielder, yielderId: null });
        apr = computedApr;
    } catch (_) { }


    return {
        apr,
        status: getProjectStatus(project, projectAddresses),
        tvl: (projectMinter.unitPrice * (totalOffsetDeposited + totalYieldDeposited) / Math.pow(10, -projectPayment.decimals)),
        total_removal: formatTon(project.absorptions.pop() ?? 0, project.tonEquivalent),
    };
}

export async function aggregateProjectListDetailsData(customerId: string, projectSlug: string) {
    let project = await prisma.project.findUnique({
        where: { slug: projectSlug }, include: {
            Minter: {
                include: { Payment: true }
            }
        }
    });
    if (null === project) {
        return null;
    }

    let projectAddresses = getProjectAddressesFrom(project.address);

    let [projectModel, vesterModel, yielderModel, offseterModel] = await Promise.all([
        loadProjectModel(project.address),
        loadVesterModel(projectAddresses.vester),
        loadYielderModel(projectAddresses.yielder),
        loadOffseterModel(projectAddresses.offseter),
    ]);

    let [balance, releasable, claimable, offsetedTokensList, yieldedTokenList, minToClaim] = await Promise.all([
        projectModel.getBalanceOf([customerId]),
        vesterModel.getReleasableOf([customerId]),
        offseterModel.getClaimableOf([customerId]),
        offseterModel.getRegisteredTokensOf([customerId]),
        yielderModel.getRegisteredTokensOf([customerId]),
        offseterModel.getMinClaimable(),
    ]);

    let projectMinter = project.Minter.pop();
    let projectPayment = projectMinter.Payment;
    let customerStake = (projectMinter.unitPrice * (offsetedTokensList.length + yieldedTokenList.length) / projectPayment.decimals);

    return {
        customer_stake: customerStake,
        vesting_to_claim: claimable,
        absorption_to_claim: formatTon(releasable, project.tonEquivalent),
        undeposited: balance - (offsetedTokensList.length + yieldedTokenList.length),
        min_to_claim: minToClaim,
        contracts: {
            vester: projectAddresses.vester,
            yielder: projectAddresses.yielder,
            offseter: projectAddresses.offseter,
        },
    };
}

