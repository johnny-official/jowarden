# Jowarden

A personal Bitwarden-compatible vault on Cloudflare Workers, maintained in [johnny-official/jowarden](https://github.com/johnny-official/jowarden).

Jowarden is a customized fork of [NodeWarden](https://github.com/shuaiplus/nodewarden). It is not affiliated with Bitwarden and is not a substitute for an independent security audit.

## Features

- Web vault and compatible Bitwarden clients.
- Passkeys, two-factor authentication and device management.
- Attachments and Send using R2, with an optional KV configuration.
- Encrypted import/export and scheduled backup support.
- English-first interface with additional non-Chinese translations.

Organizations, enterprise SSO and SCIM are not implemented. Client compatibility must be verified for each deployment.

## Development

Use the Node.js version in `.node-version` (currently 24.22.1). Keep `package-lock.json` committed for reproducible installs.

```sh
npm ci
npm run dev
```

Store local secrets in the ignored `.dev.vars` file. Never put credentials into frontend code, `VITE_*` variables, tracked configuration or screenshots.

## Verification

```sh
npm audit --audit-level=high
npm run i18n:validate
npm run test:config-compatibility
npm run test:vault-compatibility
npm run test:web-crypto
npm run test:notifications-security
npm run test:webauthn-connectors
npm run build
npx wrangler deploy --dry-run
```

CI runs compatibility/security tests and builds without production credentials. A passing build does not establish that a deployment is secure.

## Production deployment

This repository already uses Wrangler. Review `wrangler.toml`, existing D1/R2 bindings and the custom domain before deployment; do not rename existing storage resources merely to change branding.

- Set a cryptographically random `JWT_SECRET` of at least 32 characters as a Cloudflare runtime secret, not a plaintext variable.
- Keep Cloudflare API tokens in a secret store, least-privileged and restricted to the intended account/resources.
- Keep Workers development and preview URLs disabled for production.
- Use HTTPS, secure administrator access and two-factor authentication.
- Back up the vault and test restoration before upgrades. Keep exports and backup credentials private.
- Review logging for sensitive data. Never log authorization headers, tokens, passwords or decrypted vault contents.
- The initial account/bootstrap process must be completed by the operator before exposing a new instance publicly.
- Optional `HIDE_WEB_VAULT=1` hides server-hosted frontend routes but is not an authentication mechanism.

Deploy only after reviewing the target account, configuration and changes:

```sh
npm run deploy
```

This command affects live infrastructure. No automatic production deployment is configured by the CI added for this fork.

## Updates

The upstream synchronization workflow checks upstream `main` every six hours, validates updates and opens a review PR. It does not force-push or automatically merge into `main`. Unexpected conflicts require manual review.

Configure `UPSTREAM_SYNC_TOKEN` with the minimum repository permissions needed for Contents, Pull requests and workflow updates. Protect `main` with required CI checks. Do not grant production Cloudflare credentials to the upstream sync job.

When an upstream release changes security-sensitive behavior, review it even when all automated checks pass.

## Security reports

Do not disclose credentials or exploit details in public issues. Use the repository's private vulnerability reporting feature when enabled. Rotate any exposed credential immediately; deleting a file does not remove it from Git history or existing clones.

## License and attribution

Licensed under [LGPL-3.0](./LICENSE). Preserve the license and upstream copyright notices when redistributing.

Original NodeWarden work is by shuaiplus and its contributors. Bitwarden provides the compatible clients/protocol; Vaultwarden is an implementation reference. Jowarden customizes the fork's presentation and maintenance configuration without claiming authorship of the upstream implementation.
