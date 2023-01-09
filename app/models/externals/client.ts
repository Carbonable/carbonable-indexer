import { Provider } from "starknet";

const url = 'https://starknet-goerli.infura.io/v3/f46a67c22ae24d98a6dde83028e735c0';
const provider = new Provider({ rpc: { nodeUrl: url } });

export default provider;