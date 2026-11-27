# Milon JS SDK examples

These examples cover the SDK's main public capabilities and directly import `../dist/index.js` from this repository.
Build the repository root before running them:

```bash
npm install
npm run build
```

Then run them individually:

```bash
node example/01-crypto-and-addresses.mjs
node example/02-idl-transaction-signing.mjs
node example/03-transaction-json.mjs
node example/04-account-token-builders.mjs
node example/05-postcard-and-resources.mjs
node example/06-idl-catalog.mjs
```

Network examples do not make requests by default. Enable access explicitly to use DEVNET:

```bash
MILON_RUN_NETWORK_EXAMPLES=1 node example/07-rpc-and-view.mjs
```

When integrating from another project, replace `../dist/index.js` with `@milon/jssdk`; you can also use
`@milon/jssdk/crypto`, `/transaction`, `/transaction-json`, `/idl`, `/executor`, `/bcs`, and `/postcard` subpaths.

Example overview:

- `01`: four key/signature algorithms, public-key derivation, Address, and encoding conversion.
- `02`: IDL encoding, transaction construction, Ed25519 signing, and a Postcard round trip.
- `03`: DApp JSON validation and normalization, plus Transaction/Postcard conversion.
- `04`: advanced Account/Token builders, Views, and multisig voting proposals.
- `05`: custom Postcard types, BCS, ResourceId, and ResourcePath.
- `06`: dynamically list all bundled applications and methods from `DEFAULT_IDLS`.
- `07`: advanced RPC, low-level ClientHandler, and View JSON.

Never print or commit private keys in production. Before submitting a write transaction, verify the chain ID, payer balance, on-chain signer configuration, and target node version.
