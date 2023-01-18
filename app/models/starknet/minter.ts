import { ProviderInterface, RawCalldata, hash } from "starknet";
import Contract from './contract';
import { FieldElement } from '@apibara/starknet'

const AIRDROP = FieldElement.fromBigInt(hash.getSelectorFromName('Airdrop'));
const BUY = FieldElement.fromBigInt(hash.getSelectorFromName('Buy'));
const PRE_SALE_OPEN = FieldElement.fromBigInt(hash.getSelectorFromName('PreSaleOpen'));
const PRE_SALE_CLOSE = FieldElement.fromBigInt(hash.getSelectorFromName('PreSaleClose'));
const PUBLIC_SALE_OPEN = FieldElement.fromBigInt(hash.getSelectorFromName('PublicSaleOpen'));
const PUBLIC_SALE_CLOSE = FieldElement.fromBigInt(hash.getSelectorFromName('PublicSaleClose'));
const SOLD_OUT = FieldElement.fromBigInt(hash.getSelectorFromName('SoldOut'));

export { AIRDROP, BUY, PRE_SALE_OPEN, PRE_SALE_CLOSE, PUBLIC_SALE_OPEN, PUBLIC_SALE_CLOSE, SOLD_OUT };

export default class Minter extends Contract {

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
    return await this.fetch('getImplementationHash', this.toAddress, calldata);
  }

  async getCarbonableProjectAddress(calldata?: RawCalldata) {
    return await this.fetch('getCarbonableProjectAddress', this.toAddress, calldata);
  }

  async getPaymentTokenAddress(calldata?: RawCalldata) {
    return await this.fetch('getPaymentTokenAddress', this.toAddress, calldata);
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
    return await this.fetch('getWhitelistMerkleRoot', this.toHex, calldata);
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