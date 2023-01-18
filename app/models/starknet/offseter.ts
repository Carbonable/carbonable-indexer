import { ProviderInterface, RawCalldata, hash } from "starknet";
import Contract from './contract';
import { FieldElement } from '@apibara/starknet'

const DEPOSIT = FieldElement.fromBigInt(hash.getSelectorFromName('Deposit'));
const WITHDRAW = FieldElement.fromBigInt(hash.getSelectorFromName('Withdraw'));
const CLAIM = FieldElement.fromBigInt(hash.getSelectorFromName('Claim'));

export { DEPOSIT, WITHDRAW, CLAIM };

export default class Offseter extends Contract {

  constructor(address: string, provider: ProviderInterface) {
    super(address, provider);
    this.properties = [
      'getImplementationHash',
      'getCarbonableProjectAddress',
      'getMinClaimable',
      'getTotalDeposited',
      'getTotalClaimed',
    ];
  }

  async getImplementationHash(calldata?: RawCalldata) {
    return await this.fetch('getImplementationHash', this.toAddress, calldata);
  }

  async getCarbonableProjectAddress(calldata?: RawCalldata) {
    return await this.fetch('getCarbonableProjectAddress', this.toAddress, calldata);
  }

  async getMinClaimable(calldata?: RawCalldata) {
    return await this.fetch('getMinClaimable', this.toInt, calldata);
  }

  async getTotalDeposited(calldata?: RawCalldata) {
    return await this.fetch('getTotalDeposited', this.toInt, calldata);
  }

  async getTotalClaimed(calldata?: RawCalldata) {
    return await this.fetch('getTotalClaimed', this.toInt, calldata);
  }

  async getTotalClaimable(calldata?: RawCalldata) {
    return await this.fetch('getTotalClaimable', this.toInt, calldata);
  }

  async getClaimableOf(calldata?: RawCalldata) {
    return await this.fetch('getClaimableOf', this.toInt, calldata);
  }

  async getClaimedOf(calldata?: RawCalldata) {
    return await this.fetch('getClaimedOf', this.toInt, calldata);
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
}