import { toBech32 } from "@cosmjs/encoding";
import { beforeAll, expect, test } from "vitest";

import Models from "../../src/models/_index.mjs";

beforeAll(() => {
	Models.configure({
		chain: {
			chainId: "ipi-test-1",
			chainName: "IPI Test",
			bip44: { coinType: 118 },
			bech32Config: { bech32PrefixAccAddr: "ipi" },
			currencies: [{ coinDenom: "IPI", coinMinimalDenom: "nipi" }],
		},
	});
});

test("exports the model registry", () => {
	expect(Models).toBeDefined();
});

test("constructs and recognizes each model type", () => {
	const address = new Models.Address(toBech32("ipi", new Uint8Array(20)));
	const wallet = new Models.Wallet();
	const request = new Models.Request();
	const transaction = new Models.Transaction();
	const contract = new Models.Contract();

	expect(Models.check(address, "is-address")).toBe(true);
	expect(Models.check(wallet, "is-wallet")).toBe(true);
	expect(Models.check(request, "is-request")).toBe(true);
	expect(Models.check(transaction, "is-transaction")).toBe(true);
	expect(Models.check(contract, "is-contract")).toBe(true);
});

test("creates a wallet instance", () => {
	expect(Models.Wallet.create()).toBeInstanceOf(Models.Wallet);
});
