/*
  wallet-core - Copyright 2026 Sett Sarverott A.A.B. <sett@sarverott.com>
*/

/**
 * Default chain configuration for the IPI blockchain (Cosmos SDK).
 *
 * SSOT: chainconfig — these literals mirror `ipicoin/chainconfig` (Fala 0).
 * They are inlined here so the wallet core has a zero-dependency, offline
 * default. When the live `chainconfig` package / endpoint is wired in, replace
 * the literals below with a runtime read (see `loadChainConfig` override hook).
 */
export const IPI_CHAINCONFIG = {
	// SSOT: chainId aligned with `ipicoin/chainconfig` (Fala 0).
	chainId: "ipi-mainnet-2",
	chainName: "ipicoin",
	// bech32 account address prefix
	bech32Prefix: "ipi",
	// BIP44 coin type (Cosmos default)
	coinType: 118,
	// minimal (base) denomination used on-chain for amounts and fees
	denom: "nipi",
	// human-facing display denomination
	displayDenom: "ipi",
	// 1 ipi = 10^9 nipi
	decimals: 9,
	// RPC endpoint (Tendermint/CometBFT) — SSOT: chainconfig
	rpc: "https://ipicoin.eu/rpc",
	// default gas price expressed in the minimal denom
	gasPrice: "0.025nipi",
};

export default IPI_CHAINCONFIG;
