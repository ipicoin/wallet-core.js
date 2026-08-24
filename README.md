# IPI Wallet Core for JavaScript

JavaScript model and validation layer for IPI/Cosmos wallet development.

## Verified surface

The package exports `Models` and `Operations` from `src/index.mjs`. The tested
surface currently covers:

- configurable Cosmos chain metadata;
- 20-byte Bech32 account validation against the configured prefix;
- wallet, address, request, transaction, and contract model construction; and
- shared model type checks and event-capable base structures.

Seven test files contain eleven passing tests for the model and configuration
layer:

The current dependency graph requires Node.js `^20.19.0` or `>=22.12.0`; the
verified audit environment used Node 24.

```sh
npm install
npm test -- --run
```

Configure the model layer before constructing chain-dependent objects:

```js
import WalletCore from "./src/index.mjs";

WalletCore.Models.configure({
  chain: {
    chainId: "ipi-testnet-1",
    chainName: "IPI Testnet",
    bip44: { coinType: 118 },
    bech32Config: { bech32PrefixAccAddr: "ipi" },
    currencies: [{ coinDenom: "IPI", coinMinimalDenom: "aipi" }],
  },
});
```

## Incomplete operations

Files for mnemonic import, key generation, balance queries, and token transfer
exist under `src/operations`, but they are not a working supported transaction
API. The current implementations contain unresolved imports/configuration,
undefined transaction variables, or empty bodies and have no behavioral tests.
They must not be presented or consumed as completed signing workflows.

The package also declares broader Cosmos, CosmWasm, InterchainJS, WebAuthn,
Socket.IO, SSH, and chain-registry dependencies. A declared dependency is not
evidence that the corresponding feature is integrated.

## Development status

**Active development — model layer implemented, wallet operations incomplete.**
This package is not ready to protect real assets. A supported wallet-core
release requires a stable API, deterministic signing and transaction fixtures,
fee and denomination handling, endpoint and chain verification, recovery and
migration tests, audited key handling, dependency remediation, signed releases,
and an explicit support policy.

An RPC response is untrusted input and is not independently verified state
merely because a client received it. Never use test mnemonics or keys for assets
of value, and never commit secrets. Report vulnerabilities through the IPI
[security policy](https://github.com/ipicoin/.github/blob/main/SECURITY.md).

## License

Licensed under the [MIT License](LICENSE).
