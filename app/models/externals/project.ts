import { ContractClass, ProviderInterface, RawCalldata, shortString, number } from "starknet";

export class Project {
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

  async getTotalSupply(calldata?: RawCalldata) {
    const { result } = await this.provider.callContract({
      contractAddress: this.address,
      entrypoint: 'totalSupply',
      calldata,
    })
    return Number(number.toBN(result[0]));
  }

  async getTokenByIndex(calldata?: RawCalldata) {
    const { result } = await this.provider.callContract({
      contractAddress: this.address,
      entrypoint: 'tokenByIndex',
      calldata,
    })
    return Number(number.toBN(result[0]));
  }

  async getTokenOfOwnerByIndex(calldata?: RawCalldata) {
    const { result } = await this.provider.callContract({
      contractAddress: this.address,
      entrypoint: 'tokenByIndex',
      calldata,
    })
    return Number(number.toBN(result[0]));
  }

  async getName(calldata?: RawCalldata) {
    const { result } = await this.provider.callContract({
      contractAddress: this.address,
      entrypoint: 'name',
      calldata,
    })
    return shortString.decodeShortString(result[0]);
  }

  async getSymbol(calldata?: RawCalldata) {
    const { result } = await this.provider.callContract({
      contractAddress: this.address,
      entrypoint: 'symbol',
      calldata,
    })
    return shortString.decodeShortString(result[0]);
  }

  async getBalanceOf(calldata?: RawCalldata) {
    const { result } = await this.provider.callContract({
      contractAddress: this.address,
      entrypoint: 'balanceOf',
      calldata,
    })
    return Number(number.toBN(result[0]));
  }

  async getOwnerOf(calldata?: RawCalldata) {
    const { result } = await this.provider.callContract({
      contractAddress: this.address,
      entrypoint: 'ownerOf',
      calldata,
    })
    return number.toHex(number.toBN(result[0]));
  }

  async getApproved(calldata?: RawCalldata) {
    const { result } = await this.provider.callContract({
      contractAddress: this.address,
      entrypoint: 'getApproved',
      calldata,
    })
    return Boolean(Number(number.toBN(result[0])));
  }

  async isApprovedForAll(calldata?: RawCalldata) {
    const { result } = await this.provider.callContract({
      contractAddress: this.address,
      entrypoint: 'isApprovedForAll',
      calldata,
    })
    return Boolean(Number(number.toBN(result[0])));
  }

  async getTokenUri(calldata?: RawCalldata) {
    const { result } = await this.provider.callContract({
      contractAddress: this.address,
      entrypoint: 'tokenURI',
      calldata,
    })
    return result.slice(1).map((char) => shortString.decodeShortString(char)).join('');
  }

  async getContractUri(calldata?: RawCalldata) {
    const { result } = await this.provider.callContract({
      contractAddress: this.address,
      entrypoint: 'contractURI',
      calldata,
    })
    return result.slice(1).map((char) => shortString.decodeShortString(char)).join('');
  }

  async getOwner(calldata?: RawCalldata) {
    const { result } = await this.provider.callContract({
      contractAddress: this.address,
      entrypoint: 'owner',
      calldata,
    })
    return number.toHex(number.toBN(result[0]));
  }
}