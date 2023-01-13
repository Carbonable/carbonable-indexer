import { ProviderInterface, RawCalldata, number } from "starknet";

export class Offseter {
  private readonly address: string;
  private readonly provider: ProviderInterface;

  constructor(address: string, provider: ProviderInterface) {
    this.address = address;
    this.provider = provider;
  }

  async getImplementationHash(calldata?: RawCalldata) {
    const { result } = await this.provider.callContract({
      contractAddress: this.address,
      entrypoint: 'getCarbonableProjectAddress',
      calldata,
    })
    console.log(this.address, result);
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

  async getTotalClaimed(calldata?: RawCalldata) {
    const { result } = await this.provider.callContract({
      contractAddress: this.address,
      entrypoint: 'getTotalClaimed',
      calldata,
    });
    return Number(number.toBN(result[0]));
  }

  async getTotalClaimable(calldata?: RawCalldata) {
    const { result } = await this.provider.callContract({
      contractAddress: this.address,
      entrypoint: 'getTotalClaimable',
      calldata,
    });
    return Number(number.toBN(result[0]));
  }

  async getClaimableOf(calldata?: RawCalldata) {
    const { result } = await this.provider.callContract({
      contractAddress: this.address,
      entrypoint: 'getClaimableOf',
      calldata,
    });
    return Number(number.toBN(result[0]));
  }

  async getClaimedOf(calldata?: RawCalldata) {
    const { result } = await this.provider.callContract({
      contractAddress: this.address,
      entrypoint: 'getClaimedOf',
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
}