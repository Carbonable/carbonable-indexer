import { ProviderInterface, RawCalldata, shortString, number } from "starknet";

export class Minter {
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

  async getPaymentTokenAddress(calldata?: RawCalldata) {
    const { result } = await this.provider.callContract({
      contractAddress: this.address,
      entrypoint: 'getPaymentTokenAddress',
      calldata,
    });
    return number.toHex(number.toBN(result[0]));
  }

  async isPreSaleOpen(calldata?: RawCalldata) {
    const { result } = await this.provider.callContract({
      contractAddress: this.address,
      entrypoint: 'isPreSaleOpen',
      calldata,
    });
    return Boolean(Number(number.toBN(result[0])));
  }

  async isPublicSaleOpen(calldata?: RawCalldata) {
    const { result } = await this.provider.callContract({
      contractAddress: this.address,
      entrypoint: 'isPublicSaleOpen',
      calldata,
    });
    return Boolean(Number(number.toBN(result[0])));
  }

  async getMaxBuyPerTx(calldata?: RawCalldata) {
    const { result } = await this.provider.callContract({
      contractAddress: this.address,
      entrypoint: 'getMaxBuyPerTx',
      calldata,
    });
    return Number(number.toBN(result[0]));
  }

  async getUnitPrice(calldata?: RawCalldata) {
    const { result } = await this.provider.callContract({
      contractAddress: this.address,
      entrypoint: 'getUnitPrice',
      calldata,
    });
    return Number(number.toBN(result[0]));
  }

  async getReservedSupply(calldata?: RawCalldata) {
    const { result } = await this.provider.callContract({
      contractAddress: this.address,
      entrypoint: 'getReservedSupplyForMint',
      calldata,
    });
    return Number(number.toBN(result[0]));
  }

  async getMaxSupply(calldata?: RawCalldata) {
    const { result } = await this.provider.callContract({
      contractAddress: this.address,
      entrypoint: 'getMaxSupplyForMint',
      calldata,
    });
    return Number(number.toBN(result[0]));
  }

  async getWhitelistMerkleRoot(calldata?: RawCalldata) {
    const { result } = await this.provider.callContract({
      contractAddress: this.address,
      entrypoint: 'getWhitelistMerkleRoot',
      calldata,
    });
    return Number(number.toBN(result[0]));
  }

  async getWhitelistedSlots(calldata?: RawCalldata) {
    const { result } = await this.provider.callContract({
      contractAddress: this.address,
      entrypoint: 'getWhitelistedSlots',
      calldata,
    });
    return Number(number.toBN(result[0]));
  }

  async getClaimedSlots(calldata?: RawCalldata) {
    const { result } = await this.provider.callContract({
      contractAddress: this.address,
      entrypoint: 'getClaimedSlots',
      calldata,
    });
    return Number(number.toBN(result[0]));
  }

  async isSoldOut(calldata?: RawCalldata) {
    const { result } = await this.provider.callContract({
      contractAddress: this.address,
      entrypoint: 'isSoldOut',
      calldata,
    });
    return Boolean(Number(number.toBN(result[0])));
  }

  async getTotalValue(calldata?: RawCalldata) {
    const { result } = await this.provider.callContract({
      contractAddress: this.address,
      entrypoint: 'getTotalValue',
      calldata,
    });
    return Number(number.toBN(result[0]));
  }
}