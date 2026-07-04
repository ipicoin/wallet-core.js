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

| adapter            | class              | mechanism                     | curve / crypto        | needs chain-side module? | org fork to wire in            |
| ------------------ | ------------------ | ----------------------------- | --------------------- | ------------------------ | ------------------------------ |
| WebAuthn / passkey | `WebAuthnSigner`   | FIDO2 assertion (browser)     | ES256 / P-256 (secp256r1) | **Yes** (custom pubkey type + WebAuthn-envelope verifier) | `ipicoin/webauthn` (+ `@passwordless-id/webauthn`) |
| YubiKey PIV        | `YubiKeyPivSigner` | PIV slot sign via PKCS#11     | P-256 (secp256r1), P-384 | **Yes** (secp256r1 pubkey type + AnteHandler) | `ipicoin/yubico-piv-tool`      |
| NFC NTAG424 DNA    | `Ntag424Signer`    | AES/CMAC (SDM) over PC/SC     | AES-128 (symmetric)   | model-dependent (see below) | `ipicoin/node-ntag424`         |

Build one via the factory:

```js
import { createHardwareSigner } from "wallet-core/src/hardware/index.mjs";

const signer = createHardwareSigner("yubikeyPiv", { slot: "9c", prefix: "ipi" });
// once implemented:
// const { client } = await SigningStargateClient.connectWithSigner(rpc, signer);
```

## Caveats / open questions (decide against Fala 0 auth doc)

> **wallet-core alone cannot make WebAuthn or PIV signing work.** Both paths
> produce signatures a stock Cosmos SDK (`secp256k1.PubKey` + default
> AnteHandler) will reject. Reaching e2e signing needs a **chain-side module in
> the daemon** — a custom pubkey type and a matching signature verifier — which
> is Fala 0/1 scope, not this client scaffold. This PR only fixes the interface
> assumptions and documents the blockers honestly.

- **WebAuthn — curve mismatch.** WebAuthn signs with ES256 (secp256r1 / P-256),
  not Cosmos' **secp256k1**. Using an authenticator that advertises the
  `secp256k1` COSE algorithm fixes the curve — but NOT the next point.
- **WebAuthn — signature ENVELOPE mismatch (the real blocker).** A WebAuthn
  authenticator never signs the bytes you give it. It signs
  `authenticatorData || SHA-256(clientDataJSON)`; the SignDoc hash appears only
  as the `challenge` embedded inside `clientDataJSON`. A stock Cosmos verifier
  expects a signature over `SHA-256(SignDoc)` directly, so it can **never**
  validate a WebAuthn assertion regardless of curve. The daemon must add a
  verifier that re-derives the WebAuthn envelope and checks the SignDoc hash
  inside the challenge.
- **YubiKey PIV — no secp256k1.** The PIV applet supports RSA and the NIST
  curves **P-256 (secp256r1)** / P-384 only (Ed25519 needs firmware ≥ 5.7 and a
  non-PIV slot). It **cannot** produce secp256k1 signatures. The adapter now
  advertises `secp256r1`, which stock Cosmos cannot verify — the chain needs a
  `secp256r1` pubkey type + AnteHandler before PIV signing is possible.
  (The earlier scaffold hard-coded `algo: "secp256k1"` here — a false
  capability, now corrected.)
- **NTAG424 is symmetric.** NTAG424 DNA is an AES/CMAC (SUN/SDM) device, not an
  ECDSA signer. Likely model: the tag authorizes/unlocks a derived key and the
  signature is produced in software — to be confirmed with the auth doc. (This
  analysis was already correct and is unchanged.)
- **PIN / secret handling.** PINs and secrets should come from an interactive
  prompt or a secrets agent, never be persisted in adapter options.

## TODO to reach acceptance (#10)

- [ ] `deriveAddress()` (per-adapter key encoding → bech32 `ipi…`).
- [ ] **Chain-side (Fala 0/1, daemon — blocks WebAuthn + PIV):** register a
      `secp256r1` pubkey type + AnteHandler, and a WebAuthn-envelope verifier.
      Without this, the two ECC paths below cannot reach e2e signing.
- [ ] WebAuthn end-to-end (register + assert → `DirectSignResponse`) — depends on
      the chain-side WebAuthn verifier above.
- [ ] YubiKey PIV sign via PKCS#11 / `yubico-piv-tool` fork — depends on the
      chain-side `secp256r1` verifier above.
- [ ] NTAG424 authorize + sign via `node-ntag424` fork.
- [ ] Per-path tests (mocked device layer + hardware integration).
