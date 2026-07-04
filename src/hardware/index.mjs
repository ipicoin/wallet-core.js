/*
  wallet-core - Copyright 2026 Sett Sarverott A.A.B. <sett@sarverott.com>
*/

/**
 * Hardware-key signing layer for the IPI wallet.
 *
 * Defines a single abstraction — {@link HardwareSigner} — plus skeleton adapters
 * for the three hardware paths the organization targets:
 *   - WebAuthn / passkey        (fork: ipicoin/webauthn)
 *   - YubiKey PIV (PKCS#11)     (fork: ipicoin/yubico-piv-tool)
 *   - NFC NTAG424 DNA           (fork: ipicoin/node-ntag424)
 *
 * The interface is shaped to be drop-in compatible with a CosmJS
 * `OfflineDirectSigner` (`getAccounts()` + `signDirect()`), so a completed
 * adapter can be handed straight to `SigningStargateClient.connectWithSigner`.
 *
 * This is an INTERFACE SCAFFOLD, not a hardware implementation. Every place that
 * must talk to real hardware / a real crypto library is marked with `TODO`.
 *
 * Issue: ipicoin/wallet-core.js#10 (Fala 2 — hardware-key signing).
 * Auth doc (Fala 0): ipicoin/.github docs/architecture/AUTH.md.
 * Roadmap: ipicoin/universal-independency-declaration#1.
 */

/**
 * @typedef {object} SignDocDirect
 * A CosmJS SignDoc (proto). See `@cosmjs/proto-signing` `SignDoc`.
 * @property {Uint8Array} bodyBytes
 * @property {Uint8Array} authInfoBytes
 * @property {string} chainId
 * @property {bigint|number|string} accountNumber
 */

/**
 * @typedef {object} DirectSignResponse
 * @property {SignDocDirect} signed The (possibly re-serialized) signed doc.
 * @property {{pub_key: {type: string, value: string}, signature: string}} signature
 */

/**
 * Abstract base for every hardware signer.
 *
 * Concrete adapters MUST implement {@link getPublicKey} and {@link signDirect}.
 * {@link getAccounts} is provided for OfflineDirectSigner compatibility and, by
 * default, derives the bech32 address from the public key returned by the
 * adapter (only valid for secp256k1 keys — see WebAuthn caveat).
 *
 * @abstract
 */
export class HardwareSigner {
	/**
	 * @param {object} [opts]
	 * @param {string} [opts.prefix="ipi"] bech32 address prefix.
	 * @param {string} [opts.algo="secp256k1"] signature algorithm.
	 */
	constructor({ prefix = "ipi", algo = "secp256k1" } = {}) {
		this.prefix = prefix;
		this.algo = algo;
	}

	/**
	 * Return the account public key held by the device.
	 * @abstract
	 * @returns {Promise<Uint8Array>} Compressed secp256k1 pubkey (33 bytes) or
	 *   the device-native COSE/DER key for non-secp256k1 curves.
	 */
	async getPublicKey() {
		throw new Error(
			`HardwareSigner.getPublicKey() not implemented by ${this.constructor.name}`,
		);
	}

	/**
	 * Produce a DIRECT-mode signature for a Cosmos SignDoc.
	 * @abstract
	 * @param {string} signerAddress bech32 address expected to sign.
	 * @param {SignDocDirect} signDoc
	 * @returns {Promise<DirectSignResponse>}
	 */
	async signDirect(signerAddress, signDoc) {
		throw new Error(
			`HardwareSigner.signDirect() not implemented by ${this.constructor.name}`,
		);
	}

	/**
	 * OfflineDirectSigner compatibility: expose the device account.
	 * Default derives address from {@link getPublicKey}.
	 * @returns {Promise<Array<{address:string, algo:string, pubkey:Uint8Array}>>}
	 */
	async getAccounts() {
		const pubkey = await this.getPublicKey();
		// TODO: derive bech32 address from `pubkey` (secp256k1: sha256→ripemd160→
		// bech32 with `this.prefix`). Use @cosmjs/amino `pubkeyToAddress` or
		// @cosmjs/crypto + @cosmjs/encoding once the pubkey format is finalized.
		const address = await this.deriveAddress(pubkey);
		return [{ address, algo: this.algo, pubkey }];
	}

	/**
	 * Derive a bech32 address from a public key.
	 * @param {Uint8Array} _pubkey
	 * @returns {Promise<string>}
	 */
	async deriveAddress(_pubkey) {
		// TODO: implement once per-adapter key encoding is fixed.
		throw new Error(
			`HardwareSigner.deriveAddress() not implemented by ${this.constructor.name}`,
		);
	}
}

/**
 * WebAuthn / passkey adapter.
 *
 * Caveat 1 — curve: WebAuthn authenticators sign with ES256 (secp256r1 / P-256),
 * which is NOT Cosmos' secp256k1.
 *
 * Caveat 2 — signature ENVELOPE (the blocking one): even with a matching curve,
 * WebAuthn never signs the raw bytes you hand it. The authenticator signs
 * `authenticatorData || SHA-256(clientDataJSON)`, where the SignDoc hash only
 * appears indirectly as the `challenge` field inside clientDataJSON. A Cosmos
 * verifier for a stock `secp256k1.PubKey` expects a signature over
 * `SHA-256(SignDoc)` directly, so it can NEVER validate a WebAuthn assertion —
 * the signed message is a different structure entirely.
 *
 * Consequence: a WebAuthn-backed IPI account is **not achievable in wallet-core
 * alone**. It requires a chain-side module in the daemon (Fala 0/1 scope): a
 * custom pubkey type + a verifier that re-derives `authenticatorData ||
 * SHA-256(clientDataJSON)`, checks the SignDoc hash inside the challenge, and
 * only then verifies the P-256 signature. Using an authenticator that advertises
 * the `secp256k1` COSE algorithm fixes only the curve, NOT this envelope.
 *
 * The passkey library (`@passwordless-id/webauthn`, already a dependency) is
 * used for the browser ceremony; org fork: ipicoin/webauthn.
 */
export class WebAuthnSigner extends HardwareSigner {
	/**
	 * @param {object} [opts]
	 * @param {string} [opts.rpId] Relying-party id (domain), e.g. "ipicoin.eu".
	 * @param {string} [opts.credentialId] Registered credential id.
	 * @param {string} [opts.prefix="ipi"]
	 */
	constructor({ rpId, credentialId, prefix = "ipi" } = {}) {
		super({ prefix, algo: "webauthn-es256" });
		this.rpId = rpId;
		this.credentialId = credentialId;
	}

	async getPublicKey() {
		// TODO: run WebAuthn registration/get ceremony via @passwordless-id/webauthn
		// (fork: ipicoin/webauthn) and return the COSE public key bytes.
		throw new Error(
			"WebAuthnSigner.getPublicKey(): TODO — wire @passwordless-id/webauthn",
		);
	}

	async signDirect(_signerAddress, _signDoc) {
		// TODO: SHA-256(SignDoc) → use as WebAuthn `challenge`;
		// call navigator.credentials.get(); collect the assertion.
		// BLOCKED chain-side: the assertion signs
		// `authenticatorData || SHA-256(clientDataJSON)`, NOT SHA-256(SignDoc).
		// A stock secp256k1 verifier cannot check this envelope; the daemon needs
		// a custom pubkey type + WebAuthn-aware verifier (Fala 0/1). There is no
		// DirectSignResponse mapping that a stock Cosmos AnteHandler would accept.
		throw new Error(
			"WebAuthnSigner.signDirect(): TODO — needs chain-side WebAuthn verifier (envelope != raw SignDoc)",
		);
	}
}

/**
 * YubiKey PIV adapter (PKCS#11 / PIV slot).
 * Org fork: ipicoin/yubico-piv-tool. Node bridge over PKCS#11 or the
 * `yubico-piv-tool` CLI / libykcs11.
 *
 * IMPORTANT — curve: the PIV applet does **NOT** support Cosmos' secp256k1.
 * PIV ECC slots only do the NIST curves **P-256 (secp256r1)** and P-384
 * (Ed25519 exists only on firmware ≥ 5.7 with a non-PIV slot type). This
 * adapter therefore advertises `secp256r1`, which stock Cosmos SDK cannot
 * verify. Reaching a working signature is **not possible in wallet-core alone**:
 * it requires chain-side support — a `secp256r1` pubkey type plus an AnteHandler
 * / signature verifier registered in the daemon (scope of Fala 0/1), not just
 * this client scaffold.
 */
export class YubiKeyPivSigner extends HardwareSigner {
	/**
	 * @param {object} [opts]
	 * @param {string} [opts.slot="9c"] PIV slot (9c = digital signature).
	 * @param {string} [opts.pin] User PIN (prefer a prompt/agent over storing).
	 * @param {string} [opts.prefix="ipi"]
	 */
	constructor({ slot = "9c", pin, prefix = "ipi" } = {}) {
		// PIV ECC = NIST P-256 (secp256r1), NOT secp256k1. Requires a chain-side
		// secp256r1 pubkey type + verifier before any signature is accepted.
		super({ prefix, algo: "secp256r1" });
		this.slot = slot;
		this.pin = pin;
	}

	async getPublicKey() {
		// TODO: read the PIV slot certificate/public key via PKCS#11 (libykcs11)
		// or `yubico-piv-tool` (fork: ipicoin/yubico-piv-tool).
		// NOTE: this returns a P-256 (secp256r1) key — stock Cosmos expects
		// secp256k1, so the daemon must register a secp256r1 pubkey type first.
		throw new Error(
			"YubiKeyPivSigner.getPublicKey(): TODO — read PIV slot pubkey (PKCS#11)",
		);
	}

	async signDirect(_signerAddress, _signDoc) {
		// TODO: SHA-256(SignDoc bytes) → PIV sign on slot → DER→raw signature →
		// build Cosmos DirectSignResponse.
		// BLOCKED chain-side: the resulting P-256/ECDSA signature cannot be
		// verified by a stock secp256k1 AnteHandler; needs a daemon-side
		// secp256r1 verifier (Fala 0/1), not achievable in wallet-core alone.
		throw new Error(
			"YubiKeyPivSigner.signDirect(): TODO — PIV sign via PKCS#11 (requires chain-side secp256r1 verifier)",
		);
	}
}

/**
 * NFC NTAG424 DNA adapter (symmetric SUN/CMAC or on-tag key ops).
 * Org fork: ipicoin/node-ntag424. Requires an NFC reader (PC/SC).
 *
 * Note: NTAG424 DNA is primarily an AES/CMAC device (SDM), not an ECDSA signer.
 * Typical use: authenticate/unlock a derived seed or approve a challenge, then
 * sign in software. Decide the exact model against the Fala 0 auth doc.
 */
export class Ntag424Signer extends HardwareSigner {
	/**
	 * @param {object} [opts]
	 * @param {string} [opts.reader] PC/SC reader name.
	 * @param {number} [opts.keyNo=0] On-tag application key number.
	 * @param {string} [opts.prefix="ipi"]
	 */
	constructor({ reader, keyNo = 0, prefix = "ipi" } = {}) {
		super({ prefix, algo: "ntag424-aes-cmac" });
		this.reader = reader;
		this.keyNo = keyNo;
	}

	async getPublicKey() {
		// TODO: read the associated public key / SDM data via node-ntag424
		// (fork: ipicoin/node-ntag424) over PC/SC.
		throw new Error(
			"Ntag424Signer.getPublicKey(): TODO — read via node-ntag424 (PC/SC)",
		);
	}

	async signDirect(_signerAddress, _signDoc) {
		// TODO: challenge the tag (CMAC/SUN) to authorize, then obtain the
		// signature per the chosen NTAG424 signing model → DirectSignResponse.
		throw new Error(
			"Ntag424Signer.signDirect(): TODO — NTAG424 authorize + sign",
		);
	}
}

/** Registry of available hardware signer adapters. */
export const adapters = {
	webauthn: WebAuthnSigner,
	yubikeyPiv: YubiKeyPivSigner,
	ntag424: Ntag424Signer,
};

/**
 * Factory: build a hardware signer by adapter name.
 * @param {"webauthn"|"yubikeyPiv"|"ntag424"} kind
 * @param {object} [opts] Adapter-specific options.
 * @returns {HardwareSigner}
 */
export function createHardwareSigner(kind, opts = {}) {
	const Adapter = adapters[kind];
	if (!Adapter) {
		throw new Error(
			`Unknown hardware signer "${kind}". Available: ${Object.keys(adapters).join(", ")}`,
		);
	}
	return new Adapter(opts);
}

export default {
	HardwareSigner,
	WebAuthnSigner,
	YubiKeyPivSigner,
	Ntag424Signer,
	adapters,
	createHardwareSigner,
};
