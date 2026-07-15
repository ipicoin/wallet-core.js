# IPI Wallet Core for JavaScript

An experimental JavaScript library for Cosmos-compatible wallet models and
operations.

> **Status: pre-alpha.** This package is not ready to protect real assets. Key
> generation and import, transaction construction, address validation, network
> responses, and recovery behavior require a documented threat model,
> compatibility fixtures, independent review, and release controls.

## Current surface

The package exports `Models` and `Operations` from `src/index.mjs`. The current
tree includes models for wallets, addresses, requests, transactions, and
contracts, together with early operations for wallet creation/import, balance
queries, address validation, and transfers.

The command below starts a Node.js REPL with the package exposed as `IPI`:

```sh
npm install
npm start
```

Run the test suite with:

```sh
npm test
```

## Security boundaries

Never use test mnemonics or keys for assets of value. Do not commit secrets.
Callers must verify chain identity, endpoint trust, denominations, transaction
messages, fees, and signer intent. An RPC response is untrusted input and is
not independently verified state merely because the client received it.

Security-sensitive findings must use the private reporting process in the IPI
[security policy](https://github.com/ipicoin/.github/blob/main/SECURITY.md).

## Road to a supported release

A supported release requires a stable documented API, deterministic fixtures,
cross-wallet compatibility tests, audited key handling, dependency and
supply-chain controls, signed versioned releases, migration guidance, and an
explicit maintenance commitment.

## License

Licensed under the [MIT License](LICENSE).
