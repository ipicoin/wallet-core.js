/*
  wallet-core - Copyright 2026 Sett Sarverott A.A.B. <sett@sarverott.com>
*/

import CoreModels from "./_core.mjs";

class Address extends CoreModels {
	constructor(addrStr) {
		super();
		if (!Address.isPublicAddressValid(addrStr))
			throw TypeError(
				"NON_VALID_ADDRESS",
				`address "${addrStr}" is not wallet in chain`,
			);
		this.publicKey = addrStr;
	}
	static get PREFIX() {
		return CoreModels.CHAIN.bech32Config.bech32PrefixAccAddr;
	}
	static isPublicAddressValid(addressString) {
		addressString instanceof String && addressString.startsWith(Address.PREFIX);
	}
}

export default Address;
