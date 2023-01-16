import { ProviderInterface, RawCalldata, hash } from "starknet";
import Contract from './contract';
import { hexToBuffer } from '@apibara/protocol';

const DEPOSIT = hexToBuffer(hash.getSelectorFromName('Deposit'), 32);
const WITHDRAW = hexToBuffer(hash.getSelectorFromName('Withdraw'), 32);
const CLAIM = hexToBuffer(hash.getSelectorFromName('Claim'), 32);

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
    return await this.fetch('getImplementationHash', this.toHex, calldata);
  }

  async getCarbonableProjectAddress(calldata?: RawCalldata) {
    return await this.fetch('getCarbonableProjectAddress', this.toHex, calldata);
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
    return await this.fetch('getRegisteredOwnerOf', this.toHex, calldata);
  }

  async getRegisteredTimeOf(calldata?: RawCalldata) {
    return await this.fetch('getRegisteredTimeOf', this.toDate, calldata);
  }

  async getRegisteredTokensOf(calldata?: RawCalldata) {
    return await this.fetch('getRegisteredTokensOf', this.toNNInts, calldata);
  }
}