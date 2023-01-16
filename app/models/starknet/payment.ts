import { ProviderInterface, RawCalldata } from "starknet";
import Contract from './contract';

export default class Payment extends Contract {

  constructor(address: string, provider: ProviderInterface) {
    super(address, provider);
    this.properties = [
      'decimals',
    ];
  }

  async getDecimals(calldata?: RawCalldata) {
    return await this.fetch('decimals', this.toInt, calldata);
  }

  async getAllowance(calldata?: RawCalldata) {
    return await this.fetch('allowance', this.toInt, calldata);
  }
}