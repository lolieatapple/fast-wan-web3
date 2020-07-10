const switchWeb3 = require('../lib/index.js');

async function main() {
    //networkId 3 is testnet, 1 is mainnet
    await switchWeb3.init(3);
    let web3 = await switchWeb3.getWeb3();
    console.log(await web3.eth.getBlockNumber());
}

main();