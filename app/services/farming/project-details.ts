import prisma from '../../models/database/client';
import { getApr } from '../apr';
import { formatTon, getProjectAddressesFrom, loadOffseterModel, loadProjectModel, loadVesterModel, loadYielderModel } from '../index';

const DEFAULT_RESPONSE = {
    overview: {
        total_removal: 0,
        tvl: 0,
        current_apr: 0,
        total_yielded: 0,
        total_offseted: 0,
    },
    carbon_credits: {
        generated_credits: 0,
        to_be_generated: 0,
        yield: {
            total: 0,
            available: 0,
        },
        offset: {
            total: 0,
            available: 0,
        },
    },
    assets_allocation: {
        total: 0,
        yield: 0,
        offseted: 0,
        undeposited: 0,
    },
    contracts: {
        vester: '',
        yielder: '',
        offseter: '',
    },
};

export async function projectDetailedData(customerId: string, projectSlug: string) {
    let project = await prisma.project.findUnique({ where: { slug: projectSlug }, include: { Minter: { include: { Payment: true } } } });
    let projectAddresses = getProjectAddressesFrom(project.address);
    let response = { ...DEFAULT_RESPONSE };

    let projectMinter = project.Minter.pop();
    let projectPayment = projectMinter.Payment;
    let finalAbsorptions = project.absorptions.pop();
    response = {
        ...response,
        contracts: {
            vester: projectAddresses.vester,
            yielder: projectAddresses.yielder,
            offseter: projectAddresses.offseter,
        },
    }

    try {
        let { apr } = await getApr({ yielderAddress: projectAddresses.yielder, yielderId: null });
        response = {
            ...response,
            overview: {
                ...response.overview,
                current_apr: apr,
            },
        };
    } catch (err) {
        return response;
    }

    let [projectModel, vesterModel, yielderModel, offseterModel] = await Promise.all([
        loadProjectModel(project.address),
        loadVesterModel(projectAddresses.vester),
        loadYielderModel(projectAddresses.yielder),
        loadOffseterModel(projectAddresses.offseter),
    ]);

    try {
        let [balance, currentAbsorption, offseted, yielded, releasable, claimable, totalReleased, totalClaimed, totalOffseted, totalYielded] = await Promise.all([
            projectModel.getBalanceOf([customerId]),
            projectModel.getCurrentAbsorption(),
            offseterModel.getRegisteredTokensOf([customerId]),
            yielderModel.getRegisteredTokensOf([customerId]),
            offseterModel.getClaimableOf([customerId]),
            vesterModel.getReleasableOf([customerId]),
            offseterModel.getClaimedOf([customerId]),
            // total claimed
            0,
            offseterModel.getTotalDeposited(),
            yielderModel.getTotalDeposited(),
        ]);
        response = {
            ...response,
            overview: {
                ...response.overview,
                tvl: (projectMinter.unitPrice * Math.pow(10, -projectPayment.decimals)) * (totalOffseted + totalYielded),
                total_removal: formatTon(finalAbsorptions, project.tonEquivalent),
                total_yielded: totalYielded,
                total_offseted: totalOffseted,
            },
            carbon_credits: {
                generated_credits: formatTon((currentAbsorption / project.totalSupply) * balance, project.tonEquivalent),
                to_be_generated: formatTon(((finalAbsorptions - currentAbsorption) / project.totalSupply) * balance, project.tonEquivalent),
                yield: {
                    total: totalClaimed,
                    available: claimable,
                },
                offset: {
                    total: totalReleased,
                    available: releasable,
                }

            },
            assets_allocation: {
                ...response.assets_allocation,
                total: balance,
                yield: yielded.length,
                offseted: offseted.length,
                undeposited: balance - (yielded + offseted),
            }
        }
    } catch (err) {
        return response;
    }

    return response;
}
