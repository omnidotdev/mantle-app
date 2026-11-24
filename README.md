# 🌋 Mantle App

Web app for [Mantle](https://mantle.omni.dev), the Omni business operations suite: people, invoices, quotes and contracts, and inventory. Built with [TanStack Start](https://tanstack.com/start).

Product documentation lives at [docs.omni.dev](https://docs.omni.dev/products/mantle). To run the whole stack (database, API, and app) together, see the [Mantle metarepo](https://github.com/omnidotdev/mantle-stack).

## Prerequisites

- [Bun](https://bun.sh)
- A running [Mantle API](https://github.com/omnidotdev/mantle-api)
- An OpenID Connect provider for sign-in (Omni Gatekeeper, or any standard provider)

## Local Development

1. Copy the environment template and fill in the values:

   ```sh
   cp .env.local.template .env.local
   ```

   `VITE_API_URL` points at the API. `AUTH_BASE_URL`, `AUTH_CLIENT_ID`, and `AUTH_CLIENT_SECRET` configure sign-in against the OpenID Connect provider. `.env.development` holds the shared local defaults; `.env.local` overrides them.

2. Install dependencies and start the dev server (or run `tilt up`):

   ```sh
   bun install
   bun dev
   ```

The dev server serves HTTPS at `https://localhost:3000` with a locally trusted certificate and regenerates the GraphQL client as `.graphql` documents change.

## Diagnostics

- Sign-in problems: check that `AUTH_BASE_URL` serves `/.well-known/openid-configuration` and that the provider allows `<VITE_BASE_URL>/api/auth/callback/omni` as a redirect URI
- Empty data after sign-in: check that the API's `AUTH_JWKS_URL` matches the provider that issued the token

## Common Commands

| Command | Description |
|---------|-------------|
| `bun dev` | Start the dev server and GraphQL codegen in watch mode |
| `bun test` | Run the unit tests |
| `bun check` | Lint and format check with Biome |
| `bun knip` | Find unused files, exports, and dependencies |
| `bun graphql:generate` | Regenerate the typed GraphQL client from the API schema |
| `bun run build` | Type check and build for production |

## Docker

```sh
docker build -t mantle-app .
docker run -p 3000:3000 mantle-app
```

## License

The code in this repository is licensed under Apache 2.0, &copy; [Omni LLC](https://omni.dev). See [LICENSE.md](LICENSE.md) for more information.
