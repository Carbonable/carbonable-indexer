import { ProviderInterface, RawCalldata } from "starknet";
import Contract from './contract';

export default class Payment extends Contract {

  constructor(address: string, provider: ProviderInterface) {
    super(address, provider);
    this.properties = [
      'name',
      'symbol',
      'decimals',
    ];
  }

  async getName(calldata?: RawCalldata) {
    return await this.fetch('name', this.toShortString, calldata);
  }

  async getSymbol(calldata?: RawCalldata) {
    return await this.fetch('symbol', this.toShortString, calldata);
  }

  async getDecimals(calldata?: RawCalldata) {
    return await this.fetch('decimals', this.toInt, calldata);
  }

  async getAllowance(calldata?: RawCalldata) {
    return await this.fetch('allowance', this.toInt, calldata);
  }
}