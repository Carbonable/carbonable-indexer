import { ProviderInterface, RawCalldata, hash, shortString, number } from "starknet";
import Contract, { UPGRADED, computeStorage } from './contract';
import { FieldElement } from '@apibara/starknet'

export const EVENTS = {
  UPGRADED,
  TRANSFER_SINGLE: FieldElement.fromBigInt(hash.getSelectorFromName('TransferSingle')),
};

export const ENTRIES = {
  METADATA: computeStorage('strings_data', [BigInt(shortString.encodeShortString('uri')), BigInt(0)]),
}

export default class Badge extends Contract {

  constructor(address: string, provider: ProviderInterface) {
    super(address, provider);
    this.properties = [
      'getImplementationHash',
      'name',
      'contractURI',
      'owner',
    ];
  }

  async getImplementationHash(calldata?: RawCalldata) {
    return await this.fetch('getImplementationHash', this.toAddress, calldata);
  }

  async getOwner(calldata?: RawCalldata) {
    return await this.fetch('owner', this.toAddress, calldata);
  }

  async getName(calldata?: RawCalldata) {
    return await this.fetch('name', this.toShortString, calldata);
  }

  async getBalanceOf(calldata?: RawCalldata) {
    return await this.fetch('balanceOf', this.toInt, calldata);
  }

  async getLocked(calldata?: RawCalldata) {
    return await this.fetch('locked', this.toAddress, calldata);
  }

  async isApprovedForAll(calldata?: RawCalldata) {
    return await this.fetch('isApprovedForAll', this.toBool, calldata);
  }

  async getTokenUri(calldata?: RawCalldata) {
    return await this.fetch('uri', this.toString, calldata);
  }

  async getContractUri(calldata?: RawCalldata) {
    return await this.fetch('contractURI', this.toString, calldata);
  }
}