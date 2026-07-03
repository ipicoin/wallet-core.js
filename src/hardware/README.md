# Hardware-key signing

Scaffold for signing IPI transactions with a **hardware key / NFC**, tracking
issue [#10](https://github.com/ipicoin/wallet-core.js/issues/10)
("[Fala 2] Hardware-key signing: WebAuthn / Yubikey PIV / NTAG424").

This module ships the **interface** and adapter skeletons only — the actual
hardware I/O is left as clearly marked `TODO`s pointing at the org's library
forks. It is intentionally not a working hardware implementation yet.

## Design

A single abstraction, `HardwareSigner`, shaped to be **drop-in compatible with a
CosmJS `OfflineDirectSigner`** so a finished adapter can be passed straight to
`SigningStargateClient.connectWithSigner(rpc, signer)`.

```
HardwareSigner (abstract)
├─ getPublicKey()               -> Uint8Array   (device public key)
├─ signDirect(addr, signDoc)    -> DirectSignResponse
├─ getAccounts()                -> [{ address, algo, pubkey }]  (default impl)
└─ deriveAddress(pubkey)        -> bech32 string (TODO)
```

### Adapters

| adapter            | class              | mechanism                     | org fork to wire in            |
| ------------------ | ------------------ | ----------------------------- | ------------------------------ |
| WebAuthn / passkey | `WebAuthnSigner`   | FIDO2 assertion (browser)     | `ipicoin/webauthn` (+ `@passwordless-id/webauthn`) |
| YubiKey PIV        | `YubiKeyPivSigner` | PIV slot sign via PKCS#11     | `ipicoin/yubico-piv-tool`      |
| NFC NTAG424 DNA    | `Ntag424Signer`    | AES/CMAC (SDM) over PC/SC     | `ipicoin/node-ntag424`         |

Build one via the factory:

```js
import { createHardwareSigner } from "wallet-core/src/hardware/index.mjs";

const signer = createHardwareSigner("yubikeyPiv", { slot: "9c", prefix: "ipi" });
// once implemented:
// const { client } = await SigningStargateClient.connectWithSigner(rpc, signer);
```

## Caveats / open questions (decide against Fala 0 auth doc)

- **WebAuthn curve mismatch.** WebAuthn signs with ES256 (secp256r1 / P-256),
  not Cosmos' **secp256k1**. Options: use an authenticator advertising the
  `secp256k1` COSE algorithm, or register a custom on-chain pubkey type.
- **NTAG424 is symmetric.** NTAG424 DNA is an AES/CMAC (SUN/SDM) device, not an
  ECDSA signer. Likely model: the tag authorizes/unlocks a derived key and the
  signature is produced in software — to be confirmed with the auth doc.
- **PIN / secret handling.** PINs and secrets should come from an interactive
  prompt or a secrets agent, never be persisted in adapter options.

## TODO to reach acceptance (#10)

- [ ] `deriveAddress()` (secp256k1 → bech32 `ipi…`).
- [ ] WebAuthn end-to-end (register + assert → `DirectSignResponse`).
- [ ] YubiKey PIV sign via PKCS#11 / `yubico-piv-tool` fork.
- [ ] NTAG424 authorize + sign via `node-ntag424` fork.
- [ ] Per-path tests (mocked device layer + hardware integration).
