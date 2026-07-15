import { toBech32 } from "@cosmjs/encoding";
import { beforeAll, expect, test } from "vitest";

import Address from "../../src/models/address.mjs";

beforeAll(() => {
	Address.configure({
		chain: {
			chainId: "ipi-test-1",
			bech32Config: { bech32PrefixAccAddr: "ipi" },
			currencies: [],
		},
	});
});

test("accepts a 20-byte account address with the configured prefix", () => {
	const value = toBech32("ipi", new Uint8Array(20));
	expect(Address.isPublicAddressValid(value)).toBe(true);
	expect(new Address(value).publicKey).toBe(value);
});

test("rejects malformed and wrong-prefix addresses", () => {
	expect(Address.isPublicAddressValid("not-an-address")).toBe(false);
	expect(
		Address.isPublicAddressValid(toBech32("cosmos", new Uint8Array(20))),
	).toBe(false);
	expect(() => new Address("not-an-address")).toThrowError(TypeError);
});
