/*
  wallet-core - Copyright 2026 Sett Sarverott A.A.B. <sett@sarverott.com>
*/

/**
 * Functional core of the IPI wallet: mnemonic generation, HD (BIP32/BIP44)
 * key derivation, signing-client bootstrap, token transfer and balance read.
 *
 * This is a thin, tested facade over CosmJS. It complements the class/model
 * architecture in `./models` and `./operations` with a small, directly
 * consumable API surface (see README "Usage").
 *
 * Issue: ipicoin/wallet-core.js#9 (Fala 2 — keygen / HD / sign & broadcast).
 * Roadmap: ipicoin/universal-independency-declaration#1
 */

import { Bip39, Random, Slip10RawIndex } from "@cosmjs/crypto";
import { DirectSecp256k1HdWallet } from "@cosmjs/proto-signing";
import {
	GasPrice,
	SigningStargateClient,
	StargateClient,
} from "@cosmjs/stargate";

import IPI_CHAINCONFIG from "./config/ipi-chainconfig.mjs";

/**
 * Build a BIP44 HD derivation path `m/44'/coinType'/account'/0/index` honoring
 * an arbitrary coin type (CosmJS `makeCosmoshubPath` hardcodes coinType 118).
 *
 * @param {number} coinType SLIP-0044 coin type (IPI default: 118)
 * @param {number} [account=0]
 * @param {number} [index=0]
 * @returns {import("@cosmjs/crypto").HdPath}
 */
export function makeHdPath(
	coinType = IPI_CHAINCONFIG.coinType,
	account = 0,
	index = 0,
) {
	return [
		Slip10RawIndex.hardened(44),
		Slip10RawIndex.hardened(coinType),
		Slip10RawIndex.hardened(account),
		Slip10RawIndex.normal(0),
		Slip10RawIndex.normal(index),
	];
}

/**
 * Generate a fresh BIP39 mnemonic.
 *
 * @param {number} [strength=256] Entropy in bits (128 → 12 words, 256 → 24 words).
 * @returns {string} Space-separated mnemonic.
 */
export function generateMnemonic(strength = 256) {
	if (strength % 32 !== 0 || strength < 128 || strength > 256) {
		throw new RangeError("strength must be one of 128, 160, 192, 224, 256");
	}
	const entropy = Random.getBytes(strength / 8);
	return Bip39.encode(entropy).toString();
}

/**
 * Derive an account (address + public key) from a mnemonic using HD BIP44.
 *
 * @param {string} mnemonic BIP39 mnemonic.
 * @param {object} [opts]
 * @param {string} [opts.prefix] bech32 prefix (default from chainconfig: "ipi").
 * @param {number} [opts.coinType] SLIP-0044 coin type (default: 118).
 * @param {number} [opts.account=0] HD account index.
 * @param {number} [opts.index=0] HD address index.
 * @returns {Promise<{address:string, pubkey:Uint8Array, algo:string, wallet:DirectSecp256k1HdWallet}>}
 */
export async function mnemonicToAccount(
	mnemonic,
	{
		prefix = IPI_CHAINCONFIG.bech32Prefix,
		coinType = IPI_CHAINCONFIG.coinType,
		account = 0,
		index = 0,
	} = {},
) {
	const wallet = await DirectSecp256k1HdWallet.fromMnemonic(mnemonic, {
		prefix,
		hdPaths: [makeHdPath(coinType, account, index)],
	});
	const [acct] = await wallet.getAccounts();
	return {
		address: acct.address,
		pubkey: acct.pubkey,
		algo: acct.algo,
		wallet,
	};
}

/**
 * Create a signing client connected to an RPC endpoint.
 *
 * @param {string} mnemonic BIP39 mnemonic used to build the signer.
 * @param {string} [rpc] RPC endpoint (default from chainconfig).
 * @param {object} [opts]
 * @param {string} [opts.prefix] bech32 prefix (default "ipi").
 * @param {number} [opts.coinType] coin type (default 118).
 * @param {number} [opts.account=0] HD account index (path `m/44'/coinType'/account'/0/index`).
 * @param {number} [opts.index=0] HD address index.
 * @param {string} [opts.gasPrice] gas price string, e.g. "0.025nipi".
 * @returns {Promise<{client:SigningStargateClient, wallet:DirectSecp256k1HdWallet}>}
 */
export async function getSigningClient(
	mnemonic,
	rpc = IPI_CHAINCONFIG.rpc,
	{
		prefix = IPI_CHAINCONFIG.bech32Prefix,
		coinType = IPI_CHAINCONFIG.coinType,
		account = 0,
		index = 0,
		gasPrice = IPI_CHAINCONFIG.gasPrice,
	} = {},
) {
	const wallet = await DirectSecp256k1HdWallet.fromMnemonic(mnemonic, {
		prefix,
		hdPaths: [makeHdPath(coinType, account, index)],
	});
	const client = await SigningStargateClient.connectWithSigner(rpc, wallet, {
		gasPrice: GasPrice.fromString(gasPrice),
	});
	return { client, wallet };
}

/**
 * Read-only client for queries (balances, tx lookups) without a signer.
 *
 * @param {string} [rpc] RPC endpoint (default from chainconfig).
 * @returns {Promise<StargateClient>}
 */
export async function connectReadOnly(rpc = IPI_CHAINCONFIG.rpc) {
	return StargateClient.connect(rpc);
}

/**
 * Send tokens (broadcast a bank MsgSend). Denomination defaults to `nipi`.
 *
 * @param {SigningStargateClient} client A connected signing client.
 * @param {string} from Sender bech32 address.
 * @param {string} to Recipient bech32 address.
 * @param {string|number|bigint} amount Amount in the minimal denom (nipi).
 * @param {object} [opts]
 * @param {string} [opts.denom] minimal denom (default "nipi").
 * @param {string} [opts.memo=""]
 * @param {"auto"|number|import("@cosmjs/stargate").StdFee} [opts.fee="auto"]
 * @returns {Promise<import("@cosmjs/stargate").DeliverTxResponse>}
 */
export async function sendTokens(
	client,
	from,
	to,
	amount,
	{ denom = IPI_CHAINCONFIG.denom, memo = "", fee = "auto" } = {},
) {
	const coins = [{ denom, amount: String(amount) }];
	return client.sendTokens(from, to, coins, fee, memo);
}

/**
 * Query the balance of an address for a given denom.
 *
 * @param {SigningStargateClient|StargateClient} client Connected client.
 * @param {string} address bech32 address.
 * @param {string} [denom] minimal denom (default "nipi").
 * @returns {Promise<import("@cosmjs/stargate").Coin>}
 */
export async function getBalance(
	client,
	address,
	denom = IPI_CHAINCONFIG.denom,
) {
	return client.getBalance(address, denom);
}

export { IPI_CHAINCONFIG };

export default {
	IPI_CHAINCONFIG,
	makeHdPath,
	generateMnemonic,
	mnemonicToAccount,
	getSigningClient,
	connectReadOnly,
	sendTokens,
	getBalance,
};
