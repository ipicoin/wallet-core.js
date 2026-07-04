/*
  wallet-core - Copyright 2026 Sett Sarverott A.A.B. <sett@sarverott.com>
*/

import { describe, expect, test } from "vitest";

import {
	createHardwareSigner,
	HardwareSigner,
	Ntag424Signer,
	WebAuthnSigner,
	YubiKeyPivSigner,
	adapters,
} from "../src/hardware/index.mjs";

describe("HardwareSigner (abstraction)", () => {
	test("abstract methods reject with 'not implemented'", async () => {
		const signer = new HardwareSigner();
		await expect(signer.getPublicKey()).rejects.toThrow(/not implemented/);
		await expect(signer.signDirect("ipi1x", {})).rejects.toThrow(
			/not implemented/,
		);
	});

	test("default prefix is ipi", () => {
		expect(new HardwareSigner().prefix).toBe("ipi");
	});
});

describe("adapters", () => {
	test("all three hardware paths are registered", () => {
		expect(Object.keys(adapters).sort()).toEqual([
			"ntag424",
			"webauthn",
			"yubikeyPiv",
		]);
	});

	test.each([
		["webauthn", WebAuthnSigner],
		["yubikeyPiv", YubiKeyPivSigner],
		["ntag424", Ntag424Signer],
	])("createHardwareSigner('%s') builds the right adapter", (kind, Cls) => {
		const signer = createHardwareSigner(kind, { prefix: "ipi" });
		expect(signer).toBeInstanceOf(Cls);
		expect(signer).toBeInstanceOf(HardwareSigner);
		expect(signer.prefix).toBe("ipi");
	});

	test("unknown adapter throws", () => {
		expect(() => createHardwareSigner("nope")).toThrow(
			/Unknown hardware signer/,
		);
	});

	test("adapters expose the required signer surface", () => {
		const signer = createHardwareSigner("yubikeyPiv");
		expect(typeof signer.getPublicKey).toBe("function");
		expect(typeof signer.signDirect).toBe("function");
		expect(typeof signer.getAccounts).toBe("function");
	});

	test("PIV advertises secp256r1 (P-256), NOT secp256k1", () => {
		// PIV ECC = NIST P-256; it cannot produce secp256k1 signatures. Reaching
		// e2e signing requires a chain-side secp256r1 verifier (Fala 0/1).
		const signer = createHardwareSigner("yubikeyPiv");
		expect(signer.algo).toBe("secp256r1");
		expect(signer.algo).not.toBe("secp256k1");
	});

	test("WebAuthn advertises a P-256 (non-secp256k1) algo", () => {
		const signer = createHardwareSigner("webauthn");
		expect(signer.algo).not.toBe("secp256k1");
	});
});
