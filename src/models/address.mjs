/*
  wallet-core - Copyright 2026 Sett Sarverott A.A.B. <sett@sarverott.com>
*/

import { fromBech32 } from "@cosmjs/encoding";

import CoreModels from "./_core.mjs";

class Address extends CoreModels {
	constructor(addrStr) {
		super();
		if (!Address.isPublicAddressValid(addrStr)) {
			const error = new TypeError(
				"Address is not a valid account for this chain",
			);
			error.code = "NON_VALID_ADDRESS";
			throw error;
		}
		this.publicKey = addrStr;
	}
	static get PREFIX() {
		return CoreModels.CHAIN.bech32Config.bech32PrefixAccAddr;
	}
	static isPublicAddressValid(addressString) {
		if (typeof addressString !== "string") return false;
		try {
			const decoded = fromBech32(addressString);
			return decoded.prefix === Address.PREFIX && decoded.data.length === 20;
		} catch {
			return false;
		}
	}
}

export default Address;
