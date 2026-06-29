import CoreModels from "./_core.mjs";

class Transaction extends CoreModels {
	static get MIN_DENOMS() {
		return CoreModels.CHAIN.currencies.map((x) => x.coinMinimalDenom);
	}
	static get DENOMS() {
		return CoreModels.CHAIN.currencies.map((x) => x.coinDenom);
	}
	// constructor() {
	// 	super();
	// }
}

export default Transaction;
