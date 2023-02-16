import { ProviderInterface, RawCalldata, shortString, number, hash } from "starknet";
import { FieldElement } from '@apibara/starknet'
import logger from "../../handlers/logger";

export const UPGRADED = FieldElement.fromBigInt(hash.getSelectorFromName('Upgraded'));

const ADDR_BOUND = 2n ** 251n - 256n;

export function computeStorage(name: string, args: bigint[]): bigint {
    let acc = hash.getSelectorFromName(name)
    for (let arg of args) {
        acc = hash.pedersen([acc, '0x' + arg.toString(16)])
    }
    let res = BigInt(acc)
    while (res > ADDR_BOUND) {
        res -= ADDR_BOUND
    }
    return res
}

export default class Contract {
    private readonly multicall: string = '0x05754af3760f3356da99aea5c3ec39ccac7783d925a19666ebbeca58ff0087f4';
    private state: string[][] = [];
    protected readonly address: string;
    protected readonly provider: ProviderInterface;
    protected properties: string[];

    constructor(address: string, provider: ProviderInterface) {
        this.address = address;
        this.provider = provider;
    }

    async sync() {
        this.state = await this.multiload(this.properties);
    }

    async query(contractAddress: string, entrypoint: string, calldata?: RawCalldata) {
        try {
            const { result } = await this.provider.callContract({ contractAddress, entrypoint, calldata });
            return result;
        } catch (error) {
            logger.error(error.message);
        }
    }

    async fetch(selector: string, parser: Function, calldata?: RawCalldata) {
        const result = this.state[this.properties.indexOf(selector)] || await this.query(this.address, selector, calldata);
        return await parser(result);
    }

    parse(responses: string[]): string[][] {
        if (responses.length === 0) {
            return []
        }

        const [size, ...rest] = responses;
        const length = number.toBN(size).toNumber();
        const response = rest.slice(0, length);
        const remaining = rest.slice(length);

        return [response, ...this.parse(remaining)];
    }

    async multiload(calls: string[]) {
        const calldata: (string | number)[] = [calls.length];
        calls.forEach((call) => calldata.push(this.address, hash.getSelectorFromName(call), 1, 0));
        calldata.push(1, 0);
        const { result } = await this.provider.callContract({
            contractAddress: this.multicall,
            entrypoint: 'aggregate',
            calldata,
        })
        return this.parse(result.slice(2));
    }

    async getAbi() {
        const classHash = await this.provider.getClassHashAt(this.address);
        const contractClass = await this.provider.getClassByHash(classHash);
        return contractClass.abi;
    }

    async getProxyAbi() {
        const result = await this.query(this.address, 'getImplementationHash');
        const contractClass = await this.provider.getClassByHash(result[0]);
        return contractClass.abi;
    }

    toInt(result: string[]) {
        return Number(number.toBN(result[0]));
    }

    toInts(result: string[]) {
        return result.slice(1).map((value) => Number(value));
    }

    toNNInts(result: string[]) {
        return result.slice(1).map((token) => Number(token)).filter((token) => Boolean(token));
    }

    toHex(result: string[]) {
        return number.toHex(number.toBN(result[0]));
    }

    toAddress(result: string[]) {
        return `0x${number.toBN(result[0]).toString(16).padStart(64, '0')}`;
    }

    toBool(result: string[]) {
        return Boolean(Number(number.toBN(result[0])));
    }

    toShortString(result: string[]) {
        return shortString.decodeShortString(result[0]);
    }

    toString(result: string[]) {
        return result.slice(1).map((char) => shortString.decodeShortString(char)).join('');
    }

    toDate(result: string[]) {
        return new Date(Number(number.toBN(result[0])) * 1000);
    }

    toDates(result: string[]) {
        return result.slice(1).map((value) => new Date(Number(value) * 1000));
    }
}
