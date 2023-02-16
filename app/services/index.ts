import Project from '../models/starknet/project';
import Vester from '../models/starknet/vester';
import Offseter from '../models/starknet/offseter';
import Yielder from '../models/starknet/yielder';
import provider from '../models/starknet/client';

import { data } from '../models/database/client';
import Minter from '../models/starknet/minter';
import Payment from '../models/starknet/payment';

const moneyFormatter = new Intl.NumberFormat('en-US', { currency: 'USD', style: 'currency' });

export function loadProjectModel(address: string) {
    return new Project(address, provider);
}

export async function loadVesterModel(vesterAddress: string) {
    let vester = new Vester(vesterAddress, provider);
    await vester.sync();
    return vester;
}

export async function loadYielderModel(yielderAddress: string) {
    let yielder = new Yielder(yielderAddress, provider);
    await yielder.sync();
    return yielder;
}

export async function loadOffseterModel(offseterAddress: string) {
    let offsetter = new Offseter(offseterAddress, provider);
    await offsetter.sync();
    return offsetter;
}

export async function loadMinterModel(minterAddress: string) {
    let minter = new Minter(minterAddress, provider);
    await minter.sync();
    return minter;
}

export async function loadPaymentModel(paymentAddress: string) {
    let payment = new Payment(paymentAddress, provider);
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
