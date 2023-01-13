import { ProviderInterface, RawCalldata, number } from "starknet";

export class Payment {
  private readonly address: string;
  private readonly provider: ProviderInterface;

  constructor(address: string, provider: ProviderInterface) {
    this.address = address;
    this.provider = provider;
  }

  async getDecimals(calldata?: RawCalldata) {
    const { result } = await this.provider.callContract({
      contractAddress: this.address,
      entrypoint: 'decimals',
      calldata,
    })
    return Number(number.toBN(result[0]));
  }

  async getAllowance(calldata?: RawCalldata) {
    const { result } = await this.provider.callContract({
      contractAddress: this.address,
      entrypoint: 'allowance',
      calldata,
    })
    return Number(number.toBN(result[0]));
  }
}