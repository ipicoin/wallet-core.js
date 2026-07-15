/*
  wallet-core - Copyright 2026 Sett Sarverott A.A.B. <sett@sarverott.com>
*/
import { EventEmitter } from "node:events";

let chainConfiguration;
let walletCoreConfig = {};

class CoreModels extends EventEmitter {
	static configure({ chain, presets = {} } = {}) {
		if (!chain || typeof chain !== "object") {
			throw new TypeError("A chain configuration object is required");
		}
		if (typeof chain.chainId !== "string" || !chain.chainId.trim()) {
			throw new TypeError("chain.chainId must be a non-empty string");
		}
		if (
			!chain.bech32Config ||
			typeof chain.bech32Config.bech32PrefixAccAddr !== "string"
		) {
			throw new TypeError("chain.bech32Config.bech32PrefixAccAddr is required");
		}
		if (!Array.isArray(chain.currencies)) {
			throw new TypeError("chain.currencies must be an array");
		}

		chainConfiguration = chain;
		walletCoreConfig = presets;
		return this;
	}

	static get CHAIN() {
		if (!chainConfiguration) {
			throw new Error("Wallet core has not been configured with a chain");
		}
		return chainConfiguration;
	}
	static get CHAIN_ID() {
		return this.CHAIN.chainId;
	}
	static get CHAIN_NAME() {
		return this.CHAIN.chainName;
	}
	static get PRESETS() {
		return walletCoreConfig;
	}
}

export default CoreModels;
