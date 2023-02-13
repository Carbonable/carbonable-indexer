FROM node:19-alpine3.16

RUN mkdir /app
WORKDIR /app

ENV GATEWAY https://carbonable.infura-ipfs.io/ipfs/
ENV APIBARA_MAINNET mainnet.starknet.a5a.ch:443
ENV APIBARA_TESTNET goerli.starknet.a5a.ch:443
ENV APIBARA_TESTNET2 goerli-2.starknet.a5a.ch:443
ENV STARKNET_MAINNET https://starknet-mainnet.infura.io/v3/f46a67c22ae24d98a6dde83028e735c0
ENV STARKNET_TESTNET https://starknet-goerli.infura.io/v3/f46a67c22ae24d98a6dde83028e735c0
ENV STARKNET_TESTNET2 https://starknet-goerli2.infura.io/v3/f46a67c22ae24d98a6dde83028e735c0

COPY . .

RUN npm install

LABEL fly_launch_runtime="nodejs"

CMD [ "npm", "run", "start" ]
