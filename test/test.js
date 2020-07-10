const switchWeb3 = require('../lib/index.js');

async function main() {
    //networkId 3 is testnet, 1 is mainnet
    let web3 = await switchWeb3.getFastWeb3(3);
    console.log(await web3.eth.getBlockNumber());
}

main();