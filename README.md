# Mantle App

Frontend web application for [Mantle](https://mantle.omni.dev), powered by [TanStack Start](https://tanstack.com/start).

## Features

- **Modern React Stack**: Built with [TanStack Start](https://tanstack.com/start) and TypeScript for optimal developer experience and performance
- **Authentication & Authorization**:
  - [Better Auth](https://www.better-auth.com) integration with OAuth2/OpenID Connect support
  - JWT-based authentication with remote JWKS validation via [jose](https://github.com/panva/jose)
  - Protected routes with automatic redirects
  - Server-side authentication middleware
- **UI/UX**:
  - Modern component library with [Ark UI](https://ark-ui.com) and [shadcn/ui](https://ui.shadcn.com) patterns
  - [Tailwind CSS](https://tailwindcss.com) v4 with optimized class sorting
  - [tw-animate-css](https://github.com/Wombosvideo/tw-animate-css) for Tailwind-powered animations
  - Dark/light theme support with persistent preferences
  - Responsive design with mobile-first approach
  - Toast notifications with [Sonner](https://sonner.emilkowal.ski)
  - [Lucide React](https://lucide.dev) for iconography
- **Data Management**:
  - [TanStack Query](https://tanstack.com/query) for server state management
  - [TanStack Table](https://tanstack.com/table) for data visualization
  - [TanStack React Form](https://tanstack.com/form) with [Zod](https://zod.dev) validation
  - [Zustand](https://zustand.docs.pmnd.rs) for client state management
  - GraphQL integration with code generation
  - Type-safe API calls with [GraphQL Request](https://github.com/jasonkuhrt/graphql-request)
- **GraphQL Integration**:
  - [GraphQL Code Generator](https://the-guild.dev/graphql/codegen) for type-safe queries
  - React Query hooks generation
  - TypeScript SDK generation
  - Watch mode for automatic regeneration
- **Feature Modules**:
  - People & contacts management
  - Invoicing
  - Quotes & contracts
  - Inventory tracking
  - Configurable module toggles
- **Developer Experience**:
  - Hot module replacement during development
  - [TanStack Devtools](https://tanstack.com/devtools) for Query, Router, and React debugging
  - Code quality with [Biome](https://biomejs.dev) for linting and formatting
  - Git hooks with [Husky](https://typicode.github.io/husky)
  - TypeScript strict mode with comprehensive type safety
  - [Knip](https://knip.dev) for unused dependency detection
  - Automated updates with [Renovate](https://docs.renovatebot.com)
  - Easy spin up with [Tilt](https://tilt.dev)
- **Production Ready**:
  - Server-side rendering (SSR) support
  - Environment-specific configurations
  - TLS/HTTPS support with [mkcert](https://github.com/FiloSottile/mkcert)
  - Optimized build process with Vite
  - Route-based code splitting
  - [Unleash](https://www.getunleash.io) feature flags
  - Maintenance mode support

## Local Development

First, `cp .env.local.template .env.local` and fill in the values.

### Building and Running

Run `tilt up`, or:

```sh
bun i
```

```sh
bun dev
```

## Docker

Build and run with Docker:

```sh
docker build -t mantle-app .
docker run -p 3000:3000 mantle-app
```

## License

The code in this repository is licensed under Apache 2.0, &copy; [Omni LLC](https://omni.dev). See [LICENSE.md](LICENSE.md) for more information.
