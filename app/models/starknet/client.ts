import { Provider } from 'starknet';
import { env } from 'process';

let url: string;
switch (env.NETWORK) {
    case 'testnet':
        url = env.STARKNET_TESTNET;
        break;
    case 'testnet2':
        url = env.STARKNET_TESTNET2;
        break;
    default:
        url = env.STARKNET_MAINNET;
}

const provider = new Provider({ rpc: { nodeUrl: url } });

export default provider;