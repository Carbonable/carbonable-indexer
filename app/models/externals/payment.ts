import { ContractClass, ProviderInterface, RawCalldata, shortString, number } from "starknet";

export class Payment {
  private readonly address: string;
  private readonly provider: ProviderInterface;
  private contract: ContractClass;

  constructor(address: string, provider: ProviderInterface) {
    this.address = address;
    this.provider = provider;
  }

  async init() {
    const { result } = await this.provider.callContract({
      contractAddress: this.address,
      entrypoint: 'getImplementationHash',
    })
    this.contract = await this.provider.getClassByHash(result[0]);
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