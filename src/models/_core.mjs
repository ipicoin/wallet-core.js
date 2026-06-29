import { EventEmitter } from "node:events";
import walletCoreConfig from "../structures/load-config.mjs";

class CoreModels extends EventEmitter {
	// IPI_models as base for rest of them
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
