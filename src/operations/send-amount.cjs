/*
    wallet-core v0.1.1 - https://github.com/ipicoin/wallet-core.js
  Copyright 2026 Sett Sarverott A.A.B. <sett@sarverott.com>

   Licensed under the Apache License, Version 2.0 (the "License");
   you may not use this file except in compliance with the License.
   You may obtain a copy of the License at

       http://www.apache.org/licenses/LICENSE-2.0

   Unless required by applicable law or agreed to in writing, software
   distributed under the License is distributed on an "AS IS" BASIS,
   WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   See the License for the specific language governing permissions and
   limitations under the License.

  for further growth and evolution of IPI DAO (https://ipi.io/) 

  disclaimer of trademark copyrights branding notice statement: 
  - https://github.com/ipicoin/.github/blob/ac7d86625f46ef3e53aeea51931b96ea75ed87be/statements/BRANDING_NOTICE.md
*/

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