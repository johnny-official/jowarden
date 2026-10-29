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

This command affects live infrastructure. Normally let GitHub Actions deploy instead: the `CI` workflow validates the exact commit, then deploys only `main` through the `production` environment. PR validation never receives Cloudflare credentials.

### GitHub / Cloudflare setup

1. In GitHub repository Actions secrets, set `CLOUDFLARE_API_TOKEN`, `CLOUDFLARE_ACCOUNT_ID`, and `UPSTREAM_SYNC_TOKEN`. Never commit their values.
2. Obtain the Account ID from the intended Cloudflare account dashboard. Create an account-scoped API token from Cloudflare profile API Tokens; start with the Workers edit template and restrict it to the intended account/zone. This deployment also uses D1, R2, Durable Objects and a custom domain: verify the template grants the necessary permissions for those existing resources. Do not use a Global API Key.
3. In GitHub Settings > Environments, configure `production` to allow only `main`. For stronger isolation, move the Cloudflare secrets from repository secrets into this environment. Optionally enable required reviewers for manual production approval.
4. Disable the Cloudflare Worker's automatic Git builds/deployments before enabling this workflow on `main`. Keep the Worker, database, buckets and runtime secrets intact. Otherwise Cloudflare Git builds can deploy independently of CI.
5. Protect `main`: require pull requests and the `validate` check from the `CI` workflow, block force pushes, and restrict bypass permissions. Review workflow changes especially carefully.
6. Merge a reviewed PR or manually run `CI` on `main`. Check that `validate` succeeds before `Deploy production` starts, then inspect the Cloudflare deployment and test login/sync. A failed validation must leave deployment skipped.

The deploy job runs `wrangler deploy` against `wrangler.toml`; it does not recreate credentials or intentionally rename storage. The configuration references the existing D1 database by name. If Wrangler requests a database ID, verify it against the existing production database before adding it; never create a replacement database merely to satisfy CI. Keep `JWT_SECRET` in Cloudflare runtime secrets. A successful deploy is not proof of application health: test client login/sync and retain a tested backup/rollback plan.

## Updates

The upstream synchronization workflow checks upstream `main` every six hours, validates updates and opens a review PR. It does not force-push or automatically merge into `main`. Unexpected conflicts require manual review.

Configure `UPSTREAM_SYNC_TOKEN` with the minimum repository permissions needed for Contents, Pull requests and workflow updates. Protect `main` with required CI checks. Do not grant production Cloudflare credentials to the upstream sync job.

When an upstream release changes security-sensitive behavior, review it even when all automated checks pass.

## Security reports

Do not disclose credentials or exploit details in public issues. Use the repository's private vulnerability reporting feature when enabled. Rotate any exposed credential immediately; deleting a file does not remove it from Git history or existing clones.

## License and attribution

Licensed under [LGPL-3.0](./LICENSE). Preserve the license and upstream copyright notices when redistributing.

Original NodeWarden work is by shuaiplus and its contributors. Bitwarden provides the compatible clients/protocol; Vaultwarden is an implementation reference. Jowarden customizes the fork's presentation and maintenance configuration without claiming authorship of the upstream implementation.
