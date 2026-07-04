/*
  wallet-core - Copyright 2026 Sett Sarverott A.A.B. <sett@sarverott.com>
*/

import { describe, expect, test } from "vitest";

import IPI_CHAINCONFIG from "../src/config/ipi-chainconfig.mjs";
import {
	generateMnemonic,
	getBalance,
	getSigningClient,
	makeHdPath,
	mnemonicToAccount,
	sendTokens,
} from "../src/core.mjs";

// Standard BIP39 test vector (24 words, valid checksum).
const TEST_MNEMONIC =
	"abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon art";

describe("chainconfig (SSOT)", () => {
	test("exposes IPI defaults", () => {
		expect(IPI_CHAINCONFIG.bech32Prefix).toBe("ipi");
		expect(IPI_CHAINCONFIG.coinType).toBe(118);
		expect(IPI_CHAINCONFIG.denom).toBe("nipi");
		expect(IPI_CHAINCONFIG.decimals).toBe(9);
	});
});

describe("generateMnemonic", () => {
	test("default strength yields a 24-word mnemonic", () => {
		const words = generateMnemonic().trim().split(/\s+/);
		expect(words).toHaveLength(24);
	});

	test("128 bits yields a 12-word mnemonic", () => {
		const words = generateMnemonic(128).trim().split(/\s+/);
		expect(words).toHaveLength(12);
	});

	test("two mnemonics differ (entropy is random)", () => {
		expect(generateMnemonic()).not.toBe(generateMnemonic());
	});

	test("rejects invalid strength", () => {
		expect(() => generateMnemonic(100)).toThrow();
	});
});

describe("makeHdPath (BIP44)", () => {
	test("uses coinType 118 by default", () => {
		const path = makeHdPath();
		// m/44'/118'/0'/0/0 → coinType is the hardened index at position 1
		expect(path).toHaveLength(5);
		expect(path[1].isHardened()).toBe(true);
		expect(path[1].toNumber()).toBe(0x80000000 + 118);
	});

	test("account and index land in the right path positions", () => {
		// m/44'/coinType'/account'/0/index
		const path = makeHdPath(118, 3, 7);
		expect(path[2].isHardened()).toBe(true);
		expect(path[2].toNumber()).toBe(0x80000000 + 3); // account (hardened)
		expect(path[4].isHardened()).toBe(false);
		expect(path[4].toNumber()).toBe(7); // index (normal)
	});
});

describe("mnemonicToAccount (HD derivation)", () => {
	test("derived address carries the ipi bech32 prefix", async () => {
		const acct = await mnemonicToAccount(TEST_MNEMONIC);
		expect(acct.address.startsWith("ipi")).toBe(true);
		expect(acct.pubkey).toBeInstanceOf(Uint8Array);
	});

	test("derivation is deterministic for a given mnemonic", async () => {
		const a = await mnemonicToAccount(TEST_MNEMONIC);
		const b = await mnemonicToAccount(TEST_MNEMONIC);
		expect(a.address).toBe(b.address);
	});

	test("prefix override changes the address prefix", async () => {
		const acct = await mnemonicToAccount(TEST_MNEMONIC, { prefix: "cosmos" });
		expect(acct.address.startsWith("cosmos")).toBe(true);
	});

	test("round-trips a freshly generated mnemonic to an ipi address", async () => {
		const mnemonic = generateMnemonic();
		const acct = await mnemonicToAccount(mnemonic);
		expect(acct.address.startsWith("ipi")).toBe(true);
	});

	test("different account / index derive different addresses", async () => {
		// Guards the getSigningClient fix: non-zero account/index must be reachable.
		const base = await mnemonicToAccount(TEST_MNEMONIC);
		const otherAccount = await mnemonicToAccount(TEST_MNEMONIC, { account: 1 });
		const otherIndex = await mnemonicToAccount(TEST_MNEMONIC, { index: 1 });
		expect(otherAccount.address).not.toBe(base.address);
		expect(otherIndex.address).not.toBe(base.address);
		expect(otherAccount.address).not.toBe(otherIndex.address);
	});
});

describe("API surface", () => {
	test("exports the documented functions", () => {
		expect(typeof getSigningClient).toBe("function");
		expect(typeof sendTokens).toBe("function");
		expect(typeof getBalance).toBe("function");
	});
});
