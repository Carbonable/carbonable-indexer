import { ProviderInterface, RawCalldata, hash } from "starknet";
import Contract from './contract';
import { FieldElement } from '@apibara/starknet'

const SNAPSHOT = FieldElement.fromBigInt(hash.getSelectorFromName('Snapshot'));
const USER_SNAPSHOT = FieldElement.fromBigInt(hash.getSelectorFromName('UserSnapshot'));
const VESTING = FieldElement.fromBigInt(hash.getSelectorFromName('Vesting'));
const USER_VESTING = FieldElement.fromBigInt(hash.getSelectorFromName('UserVesting'));

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
    return await this.fetch('getImplementationHash', this.toAddress, calldata);
  }

  async getCarbonableProjectAddress(calldata?: RawCalldata) {
    return await this.fetch('getCarbonableProjectAddress', this.toAddress, calldata);
  }

  async getCarbonableOffseterAddress(calldata?: RawCalldata) {
    return await this.fetch('getCarbonableOffseterAddress', this.toAddress, calldata);
  }

  async getCarbonableVesterAddress(calldata?: RawCalldata) {
    return await this.fetch('getCarbonableVesterAddress', this.toAddress, calldata);
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
    return await this.fetch('getRegisteredOwnerOf', this.toAddress, calldata);
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