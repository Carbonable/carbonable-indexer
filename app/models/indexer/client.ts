import {
    credentials,
    NodeClient,
} from "@apibara/protocol";

// const url = 'mainnet.starknet.stream.apibara.com';
const url = 'goerli.starknet.stream.apibara.com';
const indexer = new NodeClient(url, credentials.createSsl());

export default indexer;

const START_BLOCK = 631_610;
const INDEXER_NAME = 'main';
export { START_BLOCK, INDEXER_NAME };