/*

*/

import { Models } from "../index.mjs";
import { DirectEthSecp256k1HdWallet } from "@cosmjs/proto-signing";

async function importWalletByMnemonic(mnemonic) {
	return await DirectSecp256k1HdWallet.fromMnemonic(mnemonic, {
		prefix: Models.Address.prefix, // ...? it should not work, case sensitive namespace
	});
}

export default importWalletByMnemonic;
