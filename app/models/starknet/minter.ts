import { ProviderInterface, RawCalldata } from "starknet";
import { Contract } from './contract';

export class Minter extends Contract {

  constructor(address: string, provider: ProviderInterface) {
    super(address, provider);
    this.properties = [
      'getImplementationHash',
      'getCarbonableProjectAddress',
      'getPaymentTokenAddress',
      'isPreSaleOpen',
      'isPublicSaleOpen',
      'getMaxBuyPerTx',
      'getReservedSupplyForMint',
      'getMaxSupplyForMint',
      'getWhitelistMerkleRoot',
      'isSoldOut',
      'getTotalValue',
    ];
  }

  async getImplementationHash(calldata?: RawCalldata) {
    return await this.fetch('getImplementationHash', this.toHex, calldata);
  }

  async getCarbonableProjectAddress(calldata?: RawCalldata) {
    return await this.fetch('getCarbonableProjectAddress', this.toHex, calldata);
  }

  async getPaymentTokenAddress(calldata?: RawCalldata) {
    return await this.fetch('getPaymentTokenAddress', this.toHex, calldata);
  }

  async isPreSaleOpen(calldata?: RawCalldata) {
    return await this.fetch('isPreSaleOpen', this.toBool, calldata);
  }

  async isPublicSaleOpen(calldata?: RawCalldata) {
    return await this.fetch('isPublicSaleOpen', this.toBool, calldata);
  }

  async getMaxBuyPerTx(calldata?: RawCalldata) {
    return await this.fetch('getMaxBuyPerTx', this.toInt, calldata);
  }

  async getUnitPrice(calldata?: RawCalldata) {
    return await this.fetch('getUnitPrice', this.toInt, calldata);
  }

  async getReservedSupply(calldata?: RawCalldata) {
    return await this.fetch('getReservedSupplyForMint', this.toInt, calldata);
  }

  async getMaxSupply(calldata?: RawCalldata) {
    return await this.fetch('getMaxSupplyForMint', this.toInt, calldata);
  }

  async getWhitelistMerkleRoot(calldata?: RawCalldata) {
    return await this.fetch('getWhitelistMerkleRoot', this.toInt, calldata);
  }

  async getWhitelistedSlots(calldata?: RawCalldata) {
    return await this.fetch('getWhitelistedSlots', this.toInt, calldata);
  }

  async getClaimedSlots(calldata?: RawCalldata) {
    return await this.fetch('getClaimedSlots', this.toInt, calldata);
  }

  async isSoldOut(calldata?: RawCalldata) {
    return await this.fetch('isSoldOut', this.toBool, calldata);
  }

  async getTotalValue(calldata?: RawCalldata) {
    return await this.fetch('getTotalValue', this.toInt, calldata);
  }
}