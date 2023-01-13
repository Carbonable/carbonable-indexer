import { ProviderInterface, RawCalldata, number } from "starknet";

export class Yielder {
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

  async getCarbonableProjectAddress(calldata?: RawCalldata) {
    const { result } = await this.provider.callContract({
      contractAddress: this.address,
      entrypoint: 'getCarbonableProjectAddress',
      calldata,
    });
    return number.toHex(number.toBN(result[0]));
  }

  async getCarbonableOffseterAddress(calldata?: RawCalldata) {
    const { result } = await this.provider.callContract({
      contractAddress: this.address,
      entrypoint: 'getCarbonableOffseterAddress',
      calldata,
    });
    return number.toHex(number.toBN(result[0]));
  }

  async getCarbonableVesterAddress(calldata?: RawCalldata) {
    const { result } = await this.provider.callContract({
      contractAddress: this.address,
      entrypoint: 'getCarbonableVesterAddress',
      calldata,
    });
    return number.toHex(number.toBN(result[0]));
  }

  async getMinClaimable(calldata?: RawCalldata) {
    const { result } = await this.provider.callContract({
      contractAddress: this.address,
      entrypoint: 'getMinClaimable',
      calldata,
    });
    return Number(number.toBN(result[0]));
  }

  async getTotalDeposited(calldata?: RawCalldata) {
    const { result } = await this.provider.callContract({
      contractAddress: this.address,
      entrypoint: 'getTotalDeposited',
      calldata,
    });
    return Number(number.toBN(result[0]));
  }

  async getTotalAbsorption(calldata?: RawCalldata) {
    const { result } = await this.provider.callContract({
      contractAddress: this.address,
      entrypoint: 'getTotalAbsorption',
      calldata,
    });
    return Number(number.toBN(result[0]));
  }

  async getAbsorptionOf(calldata?: RawCalldata) {
    const { result } = await this.provider.callContract({
      contractAddress: this.address,
      entrypoint: 'getAbsorptionOf',
      calldata,
    });
    return Number(number.toBN(result[0]));
  }

  async getRegisteredOwnerOf(calldata?: RawCalldata) {
    const { result } = await this.provider.callContract({
      contractAddress: this.address,
      entrypoint: 'getRegisteredOwnerOf',
      calldata,
    });
    return number.toHex(number.toBN(result[0]));
  }

  async getRegisteredTimeOf(calldata?: RawCalldata) {
    const { result } = await this.provider.callContract({
      contractAddress: this.address,
      entrypoint: 'getRegisteredTimeOf',
      calldata,
    });
    return new Date(Number(number.toBN(result[0])));
  }

  async getRegisteredTokensOf(calldata?: RawCalldata) {
    const { result } = await this.provider.callContract({
      contractAddress: this.address,
      entrypoint: 'getRegisteredTokensOf',
      calldata,
    });
    // Slip 0 values which comes from Uint256 high
    return result.slice(1).map((token) => Number(token)).filter((token) => Boolean(token));
  }

  async getSnapshotedTime(calldata?: RawCalldata) {
    const { result } = await this.provider.callContract({
      contractAddress: this.address,
      entrypoint: 'getSnapshotedTime',
      calldata,
    });
    return new Date(Number(number.toBN(result[0])));
  }

  async getSnapshotedOf(calldata?: RawCalldata) {
    const { result } = await this.provider.callContract({
      contractAddress: this.address,
      entrypoint: 'getSnapshotedOf',
      calldata,
    });
    return Number(number.toBN(result[0]));
  }
}