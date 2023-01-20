import axios from 'axios';
import { env } from 'process';

const ipfs = {
    async load(uri: string) {
        const response = await axios.get(env.GATEWAY + uri.replace('ipfs://', ''));
        return response.data;
    },
}

export default ipfs;