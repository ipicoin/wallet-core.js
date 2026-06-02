

import IPI_Models from '../models/_index.mjs';

const { readFile } = require('fs/promises'); // ALL CJS `require` HAVE TO BE REPLACED WITH MJS `import`
const { DirectSecp256k1HdWallet } = require("@cosmjs/proto-signing");  // ALL CJS `require` HAVE TO BE REPLACED WITH MJS `import`
const { SigningStargateClient, GasPrice } = require("@cosmjs/stargate");  // ALL CJS `require` HAVE TO BE REPLACED WITH MJS `import`

async function sendAmount(fromWallet, toAddress, tokenAmount, chainConfig, feeCalc="auto") {

    if(IPI_Models.check(fromWallet,)){
        
    }

    const [firstAccount] = await fromWallet.walletHook.getAccounts();

    const amountToSend = {
        denom: config.denom,
        tokenAmount //: "1000000", // 1 token if 6 decimals
    };

    const result = await client.sendTokens(
        firstAccount.address, 
        recipient, 
        [amountToSend], 
        "auto", // Automatically calculates fee based on gasPrice in config
        "NO_MESSAGE_INCLUDED by wallet-core (https://github.com/ipicoin/wallet-core.js)"
    );
    console.log("Transaction Hash:", result.transactionHash);
    
}
module.exports=sendAmount  // CJS `module.exports=X` HAVE TO BE REPLACED WITH MJS `export default X`

main().catch(console.error);