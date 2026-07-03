/*
  wallet-core - Copyright 2026 Sett Sarverott A.A.B. <sett@sarverott.com>
*/

import CoreModels from "./_core.mjs";

import Address from "./address.mjs";
import Contract from "./contract.mjs";
import Request from "./request.mjs";
import Transaction from "./transaction.mjs";
import Wallet from "./wallet.mjs";

export default Object.assign(CoreModels, {
	/*
    this class shall provide extensible base for all model classes
    that should make it verification root parrent shared 
    across package beside containing unit that 
    allows access to all classes 
    */
	check(instance, checkname) {
		switch (checkname) {
			case "is-wallet":
				return instance instanceof Wallet;
			// break;
			case "is-address":
				return instance instanceof Address;
			// break;
			case "is-contract":
				return instance instanceof Contract;
			// break;
			case "is-transaction":
				return instance instanceof Transaction;
			// break;
			case "is-request":
				return instance instanceof Request;
			// break;
			default:
				throw TypeError("not valid type of model");
		}
	},
	get Address() {
		return Address;
	},
	get Wallet() {
		return Wallet;
	},
	get Contract() {
		return Contract;
	},
	get Request() {
		return Request;
	},
	get Transaction() {
		return Transaction;
	},
});
