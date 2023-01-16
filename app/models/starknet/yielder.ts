import { ProviderInterface, RawCalldata, hash } from "starknet";
import Contract from './contract';
import { hexToBuffer } from '@apibara/protocol';

const SNAPSHOT = hexToBuffer(hash.getSelectorFromName('Snapshot'), 32);
const USER_SNAPSHOT = hexToBuffer(hash.getSelectorFromName('UserSnapshot'), 32);
const VESTING = hexToBuffer(hash.getSelectorFromName('Vesting'), 32);
const USER_VESTING = hexToBuffer(hash.getSelectorFromName('UserVesting'), 32);

export { SNAPSHOT, USER_SNAPSHOT, VESTING, USER_VESTING };

export default class Yielder extends Contract {

  constructor(address: string, provider: ProviderInterface) {
    super(address, provider);
    this.properties = [
      'getImplementationHash',
      'getCarbonableProjectAddress',
      'getCarbonableOffseterAddress',
      'getCarbonableVesterAddress',
      'getTotalDeposited',
      'getSnapshotedTime',
    ];
  }

  async getImplementationHash(calldata?: RawCalldata) {
    return await this.fetch('getImplementationHash', this.toHex, calldata);
  }

  async getCarbonableProjectAddress(calldata?: RawCalldata) {
    return await this.fetch('getCarbonableProjectAddress', this.toHex, calldata);
  }

  async getCarbonableOffseterAddress(calldata?: RawCalldata) {
    return await this.fetch('getCarbonableOffseterAddress', this.toHex, calldata);
  }

  async getCarbonableVesterAddress(calldata?: RawCalldata) {
    return await this.fetch('getCarbonableVesterAddress', this.toHex, calldata);
  }

  async getTotalDeposited(calldata?: RawCalldata) {
    return await this.fetch('getTotalDeposited', this.toInt, calldata);
  }

  async getTotalAbsorption(calldata?: RawCalldata) {
    return await this.fetch('getTotalAbsorption', this.toInt, calldata);
  }

  async getAbsorptionOf(calldata?: RawCalldata) {
    return await this.fetch('getAbsorptionOf', this.toInt, calldata);
  }

  async getRegisteredOwnerOf(calldata?: RawCalldata) {
    return await this.fetch('getRegisteredOwnerOf', this.toHex, calldata);
  }

  async getRegisteredTimeOf(calldata?: RawCalldata) {
    return await this.fetch('getRegisteredTimeOf', this.toDate, calldata);
  }

  async getRegisteredTokensOf(calldata?: RawCalldata) {
    return await this.fetch('getRegisteredTokensOf', this.toNNInts, calldata);
  }

  async getSnapshotedTime(calldata?: RawCalldata) {
    return await this.fetch('getSnapshotedTime', this.toDate, calldata);
  }

  async getSnapshotedOf(calldata?: RawCalldata) {
    return await this.fetch('getSnapshotedOf', this.toInt, calldata);
  }
}