/*
  wallet-core - Copyright 2026 Sett Sarverott A.A.B. <sett@sarverott.com>
*/
import { Models } from "../index.mjs";

import { makeCosmoshubPath } from "@cosmjs/amino";
import { DirectSecp256k1HdWallet } from "@cosmjs/proto-signing";

async function generateWalletKey() {
	console.log("Generating a brand new wallet...");

	// Explicitly derive path using BIP44 coinType (118)
	const hdPath = makeCosmoshubPath(0); // Standard derivation for coinType 118

	const wallet = await DirectSecp256k1HdWallet.generate(24, {
		prefix: Models.wallet.prefix, // that prefix is uppercase so it should be broken
		hdPaths: [hdPath],
	});

	return wallet;
}

export default generateWalletKey;
