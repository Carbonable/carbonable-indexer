import { ProviderInterface, RawCalldata, hash } from "starknet";
import Contract, { UPGRADED, computeStorage } from './contract';
import { FieldElement } from '@apibara/starknet'

export const EVENTS = {
  UPGRADED,
  AIRDROP: FieldElement.fromBigInt(hash.getSelectorFromName('Airdrop')),
  BUY: FieldElement.fromBigInt(hash.getSelectorFromName('Buy')),
  PRE_SALE_OPEN: FieldElement.fromBigInt(hash.getSelectorFromName('PreSaleOpen')),
  PRE_SALE_CLOSE: FieldElement.fromBigInt(hash.getSelectorFromName('PreSaleClose')),
  PUBLIC_SALE_OPEN: FieldElement.fromBigInt(hash.getSelectorFromName('PublicSaleOpen')),
  PUBLIC_SALE_CLOSE: FieldElement.fromBigInt(hash.getSelectorFromName('PublicSaleClose')),
  SOLD_OUT: FieldElement.fromBigInt(hash.getSelectorFromName('SoldOut')),
}

export const ENTRIES = {
  MAX_BUY: computeStorage('CarbonableMinter_max_buy_per_tx_', []),
  UNIT_PRICE: computeStorage('CarbonableMinter_unit_price_', []),
  RESERVED_SUPPLY: computeStorage('CarbonableMinter_reserved_supply_for_mint_', []),
  MERKLE_ROOT: computeStorage('CarbonableMinter_whitelist_merkle_root_', []),
}

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