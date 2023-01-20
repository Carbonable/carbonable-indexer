import { ProviderInterface, RawCalldata, hash } from "starknet";
import Contract, { UPGRADED } from './contract';
import { FieldElement } from '@apibara/starknet'

const EVENTS = {
  UPGRADED,
  ABSORPTION_UPDATE: FieldElement.fromBigInt(hash.getSelectorFromName('AbsorptionUpdate')),
  TRANSFER: FieldElement.fromBigInt(hash.getSelectorFromName('Transfer')),
}

export { EVENTS };

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
      'isSetup',
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
    return await this.fetch('tokenURI', this.toJson, calldata);
  }

  async getContractUri(calldata?: RawCalldata) {
    return await this.fetch('contractURI', this.toJson, calldata);
  }

  async getOwner(calldata?: RawCalldata) {
    return await this.fetch('owner', this.toAddress, calldata);
  }

  async getTonEquivalent(calldata?: RawCalldata) {
    return await this.fetch('getTonEquivalent', this.toInt, calldata);
  }

  async getCurrentAbsorption(calldata?: RawCalldata) {
    return await this.fetch('getCurrentAbsorption', this.toInt, calldata);
  }

  async getFinalAbsorption(calldata?: RawCalldata) {
    return await this.fetch('getFinalAbsorption', this.toInt, calldata);
  }

  async getAbsorption(calldata?: RawCalldata) {
    return await this.fetch('getAbsorption', this.toInt, calldata);
  }

  async getAbsorptions(calldata?: RawCalldata) {
    return await this.fetch('getAbsorptions', this.toInts, calldata);
  }

  async getStartTime(calldata?: RawCalldata) {
    return await this.fetch('getStartTime', this.toDate, calldata);
  }

  async getFinalTime(calldata?: RawCalldata) {
    return await this.fetch('getFinalTime', this.toDate, calldata);
  }

  async getTimes(calldata?: RawCalldata) {
    return await this.fetch('getTimes', this.toDates, calldata);
  }

  async isSetup(calldata?: RawCalldata) {
    return await this.fetch('isSetup', this.toBool, calldata);
  }
}