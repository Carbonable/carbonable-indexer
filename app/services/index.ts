import Project from '../models/starknet/project';
import Vester from '../models/starknet/vester';
import Offseter from '../models/starknet/offseter';
import Yielder from '../models/starknet/yielder';
import provider from '../models/starknet/client';

import { data } from '../models/database/client';
import Minter from '../models/starknet/minter';
import Payment from '../models/starknet/payment';

const moneyFormatter = new Intl.NumberFormat('en-US', { currency: 'USD', style: 'currency' });

export function loadProjectModel(address: string): Project {
    return new Project(address, provider);
}

export async function syncedProjectModel(address: string): Promise<Project> {
    let project = loadProjectModel(address);
    await project.sync();
    return project;
}

export function loadVesterModel(vesterAddress: string): Vester {
    let vester = new Vester(vesterAddress, provider);
    return vester;
}
export async function syncedVesterModel(address: string): Promise<Vester> {
    let vester = loadVesterModel(address);
    await vester.sync();
    return vester;
}

export function loadYielderModel(yielderAddress: string): Yielder {
    let yielder = new Yielder(yielderAddress, provider);
    return yielder;
}
export async function syncedYielderModel(address: string): Promise<Yielder> {
    let yielder = loadYielderModel(address);
    await yielder.sync();
    return yielder;
}

export function loadOffseterModel(offseterAddress: string): Offseter {
    let offsetter = new Offseter(offseterAddress, provider);
    return offsetter;
}
export async function syncedOffseterModel(address: string): Promise<Offseter> {
    let offseter = loadOffseterModel(address);
    await offseter.sync();
    return offseter;
}

export function loadMinterModel(minterAddress: string): Minter {
    let minter = new Minter(minterAddress, provider);
    return minter;
}
export async function syncedMinterModel(address: string): Promise<Minter> {
    let minter = loadMinterModel(address);
    await minter.sync();
    return minter;
}

export function loadPaymentModel(paymentAddress: string): Payment {
    let payment = new Payment(paymentAddress, provider);
    return payment;
}
export async function syncedPaymentModel(address: string): Promise<Payment> {
    let payment = loadPaymentModel(address);
    await payment.sync();
    return payment;
}

export function getProjectAddressesFrom(projectAddress: string) {
    // This method only works if data input is not shitty....
    // Be extra careful with this one !
    return data.filter(project => project.project === projectAddress).pop();
}

export function formatMoney(value: number, formatter: Intl.NumberFormat | null = null): string {
    formatter = formatter ?? moneyFormatter;
    return moneyFormatter.format(value);
}

export function formatTon(value: number, tonEquivalent: number): number {
    return 0 === value ? 0 : value / tonEquivalent;
}
