# fast-wan-web3

This is a npm use to get the fast web3 provider.

```
const fastWeb3 = require('fast-wan-web3');

async function main() {
    //networkId 3 is testnet, 1 is mainnet
    let networkId = 3;
    await fastWeb3.init(networkId);
    let web3 = await fastWeb3.getWeb3();
    console.log(await web3.eth.getBlockNumber());
}

main();
```