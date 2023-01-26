import { StreamClient, OnReconnectResult } from "@apibara/protocol";
import { StatusObject } from '@grpc/grpc-js'
import { env } from 'process';

const defaultOnReconnect = async (
    err: StatusObject,
    retryCount: number
): Promise<OnReconnectResult> => {
    if (![13, 14].includes(err.code)) {
        return { reconnect: false };
    }
    await new Promise((resolve) => setTimeout(resolve, retryCount * 1000))
    return { reconnect: retryCount < 5 };
};

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
const client = new StreamClient({ url, clientOptions, onReconnect: defaultOnReconnect });

export default client;