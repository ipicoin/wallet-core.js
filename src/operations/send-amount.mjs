



const { readFile } = require('fs/promises');
const { DirectSecp256k1HdWallet } = require("@cosmjs/proto-signing");
const { SigningStargateClient, GasPrice } = require("@cosmjs/stargate");

async function sendAmount(fromWallet, toAddress, tokenAmount, chainConfig, feeCalc="auto") {

    if(fromWallet instanceof )

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

main().catch(console.error);