import { StreamClient } from "@apibara/protocol";
import { env } from 'process';

let url: string;
switch (env.NETWORK) {
    case 'testnet':
        url = env.APIBARA_TESTNET;
        break;
    case 'testnet2':
        url = env.APIBARA_TESTNET2;
        break;
    default:
        url = env.APIBARA_MAINNET;
}

const clientOptions = { 'grpc.max_receive_message_length': 128 * 1_048_576 } // 128 MiB
const client = new StreamClient({ url, clientOptions });

export default client;