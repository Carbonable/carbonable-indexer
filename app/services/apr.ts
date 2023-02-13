import { Minter } from '@prisma/client';
import prisma from '../models/database/client';

export const YEAR_SECONDS = 365.25 * 24 * 3600;

export async function getApr({ yielderAddress, yielderId }: { yielderAddress: string | null, yielderId: number | null }): Promise<{ address: string, apr: number }> {
    if (null === yielderAddress && null === yielderId) {
        throw new Error("You must provide at least one parameter");
    }

    let where = {};
    if (null !== yielderAddress) {
        where = { address: yielderAddress };
    }
    if (null !== yielderId) {
        where = { id: yielderId };
    }

    let yielder = await prisma.yielder.findUnique({ where, include: { vesting: true, snapshot: true, Project: { include: { Minter: true } } } })

    if (null === yielder) {
        throw new Error("Yielder not found");
    }

    if (0 === yielder.snapshot.length) {
        throw new Error("Yielder snapshots not found");
    }
    if (0 === yielder.vesting.length) {
        throw new Error("Yielder vesting not found");
    }

    const vesting = yielder.vesting[yielder.vesting.length - 1];
    const snapshots = yielder.snapshot.filter((snapshot) => snapshot.time < vesting.time);
    const snapshot = snapshots[snapshots.length - 1];
    const total = yielder.Project['Minter'].reduce((total: number, minter: Minter) => total + minter.totalValue, 0);
    const dt = snapshot.time.getTime() - snapshot.previousTime.getTime();

    return { address: yielder.address, apr: 100 * vesting.amount * YEAR_SECONDS / dt / total };
}
