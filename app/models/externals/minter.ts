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
    });
    this.contract = await this.provider.getClassByHash(result[0]);
  }

  async getCarbonableProjectAddress(calldata?: RawCalldata) {
    const { result } = await this.provider.callContract({
      contractAddress: this.address,
      entrypoint: 'carbonable_project_address',
      calldata,
    });
    return number.toHex(number.toBN(result[0]));
  }

  async getPaymentTokenAddress(calldata?: RawCalldata) {
    const { result } = await this.provider.callContract({
      contractAddress: this.address,
      entrypoint: 'payment_token_address',
      calldata,
    });
    return number.toHex(number.toBN(result[0]));
  }

  async isWhitelistedSaleOpen(calldata?: RawCalldata) {
    const { result } = await this.provider.callContract({
      contractAddress: this.address,
      entrypoint: 'whitelisted_sale_open',
      calldata,
    });
    return Boolean(Number(number.toBN(result[0])));
  }

  async isPublicSaleOpen(calldata?: RawCalldata) {
    const { result } = await this.provider.callContract({
      contractAddress: this.address,
      entrypoint: 'public_sale_open',
      calldata,
    });
    return Boolean(Number(number.toBN(result[0])));
  }

  async getMaxBuyPerTx(calldata?: RawCalldata) {
    const { result } = await this.provider.callContract({
      contractAddress: this.address,
      entrypoint: 'max_buy_per_tx',
      calldata,
    });
    return Number(number.toBN(result[0]));
  }

  async getUnitPrice(calldata?: RawCalldata) {
    const { result } = await this.provider.callContract({
      contractAddress: this.address,
      entrypoint: 'unit_price',
      calldata,
    });
    return Number(number.toBN(result[0]));
  }

  async getReservedSupply(calldata?: RawCalldata) {
    const { result } = await this.provider.callContract({
      contractAddress: this.address,
      entrypoint: 'reserved_supply_for_mint',
      calldata,
    });
    return Number(number.toBN(result[0]));
  }

  async getMaxSupply(calldata?: RawCalldata) {
    const { result } = await this.provider.callContract({
      contractAddress: this.address,
      entrypoint: 'max_supply_for_mint',
      calldata,
    });
    return Number(number.toBN(result[0]));
  }

  async getWhitelistMerkleRoot(calldata?: RawCalldata) {
    const { result } = await this.provider.callContract({
      contractAddress: this.address,
      entrypoint: 'whitelist_merkle_root',
      calldata,
    });
    return Number(number.toBN(result[0]));
  }

  async getWhitelistedSlots(calldata?: RawCalldata) {
    const { result } = await this.provider.callContract({
      contractAddress: this.address,
      entrypoint: 'whitelisted_slots',
      calldata,
    });
    return Number(number.toBN(result[0]));
  }

  async getClaimedSlots(calldata?: RawCalldata) {
    const { result } = await this.provider.callContract({
      contractAddress: this.address,
      entrypoint: 'claimed_slots',
      calldata,
    });
    return shortString.decodeShortString(result[0]);
  }

  async isSoldOut(calldata?: RawCalldata) {
    const { result } = await this.provider.callContract({
      contractAddress: this.address,
      entrypoint: 'sold_out',
      calldata,
    });
    return Boolean(Number(number.toBN(result[0])));
  }
}