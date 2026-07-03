/*
  wallet-core - Copyright 2026 Sett Sarverott A.A.B. <sett@sarverott.com>
*/
import fs from "node:fs";
import path from "node:path";
import { URL } from "node:url";

import CoreModels from "./_core.mjs";

// becoming to be shaped under outlines of some concept of usage logics, yet it still do nothing spectacular

class Wallet extends CoreModels {
	static get COIN_TYPE() {
		return CoreModels.CHAIN.bip44.coinType;
	}
	getBallance() {}
	readAddress() {}
	saveKeyfile(keyPath) {
		return;
	}
	loadKeyfile() {}
	loadMnemonic() {}
	// constructor() {
	// 	super();
	// }
	sendTransmission() {}
	listTransmissions() {}
	listReceivings() {}
	static load(keypath) {
		return new Wallet();
	}
	static save(walletItem, keypath) {
		return keypath;
	}
	static create() {
		const walletContainer = new Wallet();
		return;
	}
}

export default Wallet;
