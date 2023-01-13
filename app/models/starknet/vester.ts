import { ProviderInterface, RawCalldata, number } from "starknet";

export class Vester {
  private readonly address: string;
  private readonly provider: ProviderInterface;

  constructor(address: string, provider: ProviderInterface) {
    this.address = address;
    this.provider = provider;
  }

  async getImplementationHash(calldata?: RawCalldata) {
    const { result } = await this.provider.callContract({
      contractAddress: this.address,
      entrypoint: 'getImplementationHash',
      calldata,
    })
    return number.toHex(number.toBN(result[0]));
  }

  async getVestingTotalAmount(calldata?: RawCalldata) {
    const { result } = await this.provider.callContract({
      contractAddress: this.address,
      entrypoint: 'vestings_total_amount',
      calldata,
    });
    return Number(number.toBN(result[0]));
  }

  async getVestingCount(calldata?: RawCalldata) {
    const { result } = await this.provider.callContract({
      contractAddress: this.address,
      entrypoint: 'vesting_count',
      calldata,
    });
    return Number(number.toBN(result[0]));
  }

  async getVestingId(calldata?: RawCalldata) {
    const { result } = await this.provider.callContract({
      contractAddress: this.address,
      entrypoint: 'get_vesting_id',
      calldata,
    });
    return Number(number.toBN(result[0]));
  }

  async getWithdrawableAmount(calldata?: RawCalldata) {
    const { result } = await this.provider.callContract({
      contractAddress: this.address,
      entrypoint: 'withdrawable_amount',
      calldata,
    });
    return Number(number.toBN(result[0]));
  }

  async getReleasableAmount(calldata?: RawCalldata) {
    const { result } = await this.provider.callContract({
      contractAddress: this.address,
      entrypoint: 'releasable_amount',
      calldata,
    });
    return Number(number.toBN(result[0]));
  }

  async getReleasableOf(calldata?: RawCalldata) {
    const { result } = await this.provider.callContract({
      contractAddress: this.address,
      entrypoint: 'releasableOf',
      calldata,
    });
    return Number(number.toBN(result[0]));
  }
}