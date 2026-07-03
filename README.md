# wallet-core.js

Logic core of the IPI wallet (Cosmos SDK chain). Provides mnemonic generation,
HD (BIP32/BIP44) key derivation, transaction signing and broadcast, and balance
queries.

## Usage

```js
import {
	generateMnemonic,
	mnemonicToAccount,
	getSigningClient,
	sendTokens,
	getBalance,
	IPI_CHAINCONFIG,
} from "wallet-core";

// 1. Create / restore a mnemonic (BIP39)
const mnemonic = generateMnemonic(); // 24 words (256 bits)

// 2. Derive an account (HD BIP44, coinType 118, bech32 prefix "ipi")
const { address } = await mnemonicToAccount(mnemonic);
console.log(address); // -> ipi1...

// 3. Connect a signing client (defaults to chainconfig RPC)
const { client } = await getSigningClient(mnemonic, IPI_CHAINCONFIG.rpc);

// 4. Query balance (minimal denom "nipi")
const balance = await getBalance(client, address);
console.log(`${balance.amount} ${balance.denom}`);

// 5. Send tokens (amount in nipi)
const result = await sendTokens(client, address, "ipi1recipient...", 1_000_000n);
console.log("tx:", result.transactionHash);
```

### Chain parameters (SSOT: chainconfig)

| parameter      | value                     |
| -------------- | ------------------------- |
| bech32 prefix  | `ipi`                     |
| coin type      | `118`                     |
| minimal denom  | `nipi` (9 decimals)       |
| display denom  | `ipi`                     |
| RPC            | `https://ipicoin.eu/rpc`  |

Defaults live in [`src/config/ipi-chainconfig.mjs`](./src/config/ipi-chainconfig.mjs)
and can be overridden per call. The functional core lives in
[`src/core.mjs`](./src/core.mjs).

## Tests

```sh
npm test
```

### License

it can be found in file named [LICENSE](./LICENSE)
