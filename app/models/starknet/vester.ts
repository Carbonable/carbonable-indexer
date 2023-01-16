import { ProviderInterface, RawCalldata } from "starknet";
import { Contract } from './contract';

export class Vester extends Contract {

  constructor(address: string, provider: ProviderInterface) {
    super(address, provider);
    this.properties = [
      'getImplementationHash',
      'vestings_total_amount',
      'withdrawable_amount',
    ];
  }

  async getImplementationHash(calldata?: RawCalldata) {
    return await this.fetch('getImplementationHash', this.toHex, calldata);
  }

  async getVestingTotalAmount(calldata?: RawCalldata) {
    return await this.fetch('vestings_total_amount', this.toInt, calldata);
  }

  async getVestingCount(calldata?: RawCalldata) {
    return await this.fetch('vesting_count', this.toInt, calldata);
  }

  async getVestingId(calldata?: RawCalldata) {
    return await this.fetch('get_vesting_id', this.toInt, calldata);
  }

  async getWithdrawableAmount(calldata?: RawCalldata) {
    return await this.fetch('withdrawable_amount', this.toInt, calldata);
  }

  async getReleasableAmount(calldata?: RawCalldata) {
    return await this.fetch('releasable_amount', this.toInt, calldata);
  }

  async getReleasableOf(calldata?: RawCalldata) {
    return await this.fetch('releasableOf', this.toInt, calldata);
  }
}