import { ProviderInterface, RawCalldata, hash } from "starknet";
import Contract from './contract';
import { FieldElement } from '@apibara/starknet'

const ABSORPTION_UPDATE = FieldElement.fromBigInt(hash.getSelectorFromName('AbsorptionUpdate'));

export { ABSORPTION_UPDATE };

export default class Project extends Contract {

  constructor(address: string, provider: ProviderInterface) {
    super(address, provider);
    this.properties = [
      'getImplementationHash',
      'totalSupply',
      'name',
      'symbol',
      'contractURI',
      'owner',
      'getTonEquivalent',
      'getTimes',
      'getAbsorptions',
    ];
  }

  async getImplementationHash(calldata?: RawCalldata) {
    return await this.fetch('getImplementationHash', this.toAddress, calldata);
  }

  async getTotalSupply(calldata?: RawCalldata) {
    return await this.fetch('totalSupply', this.toInt, calldata);
  }

  async getTokenByIndex(calldata?: RawCalldata) {
    return await this.fetch('tokenByIndex', this.toInt, calldata);
  }

  async getTokenOfOwnerByIndex(calldata?: RawCalldata) {
    return await this.fetch('tokenOfOwnerByIndex', this.toInt, calldata);
  }

  async getName(calldata?: RawCalldata) {
    return await this.fetch('name', this.toShortString, calldata);
  }

  async getSymbol(calldata?: RawCalldata) {
    return await this.fetch('symbol', this.toShortString, calldata);
  }

  async getBalanceOf(calldata?: RawCalldata) {
    return await this.fetch('balanceOf', this.toInt, calldata);
  }

  async getOwnerOf(calldata?: RawCalldata) {
    return await this.fetch('ownerOf', this.toAddress, calldata);
  }

  async getApproved(calldata?: RawCalldata) {
    return await this.fetch('getApproved', this.toBool, calldata);
  }

  async isApprovedForAll(calldata?: RawCalldata) {
    return await this.fetch('isApprovedForAll', this.toBool, calldata);
  }

  async getTokenUri(calldata?: RawCalldata) {
    return await this.fetch('tokenURI', this.toString, calldata);
  }

  async getContractUri(calldata?: RawCalldata) {
    return await this.fetch('contractURI', this.toString, calldata);
  }

  async getOwner(calldata?: RawCalldata) {
    return await this.fetch('owner', this.toAddress, calldata);
  }

  async getTonEquivalent(calldata?: RawCalldata) {
    return await this.fetch('getTonEquivalent', this.toInt, calldata);
  }

  async getTimes(calldata?: RawCalldata) {
    return await this.fetch('getTimes', this.toDates, calldata);
  }

  async getAbsorptions(calldata?: RawCalldata) {
    return await this.fetch('getAbsorptions', this.toInts, calldata);
  }
}