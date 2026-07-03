/*
  wallet-core - Copyright 2026 Sett Sarverott A.A.B. <sett@sarverott.com>
*/
import { EventEmitter } from "node:events";
// import walletCoreConfig from "../structures/load-config.mjs";

class CoreModels extends EventEmitter {
	static get CHAIN() {
		return chainConfiguration;
	}
	static get CHAIN_ID() {
		return chainConfiguration.chainId;
	}
	static get CHAIN_NAME() {
		return chainConfiguration.chainName;
	}
	static get PRESETS() {
		return walletCoreConfig;
	}
	// constructor() {
	// 	super();
	// }
}

export default CoreModels;
