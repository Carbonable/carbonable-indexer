import {
    credentials,
    NodeClient,
} from "@apibara/protocol";

const url = 'mainnet.starknet.stream.apibara.com';
const indexer = new NodeClient(url, credentials.createSsl());

export default indexer;