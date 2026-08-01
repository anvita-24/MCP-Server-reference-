# MCP Server Reference Implementations

> Reference implementations for building **remote, hosted MCP (Model Context Protocol) servers** with Next.js — from a minimal starter to a full auth-and-permissions-enabled production template.

[![Deploy basic](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https%3A%2F%2Fgithub.com%2FYOUR_USERNAME%2FYOUR_REPO%2Ftree%2Fmain%2Fbasic)
[![License](https://img.shields.io/badge/license-Apache--2.0-blue.svg)](./LICENSE)
[![Next.js](https://img.shields.io/badge/Next.js-15-black)](https://nextjs.org)
[![TypeScript](https://img.shields.io/badge/TypeScript-5-blue)](https://www.typescriptlang.org/)

> Replace `YOUR_USERNAME/YOUR_REPO` above and throughout this README with your fork's path once it's pushed to GitHub.

---

## Table of Contents

- [What is MCP?](#what-is-mcp)
- [Which implementation should I use?](#which-implementation-should-i-use)
- [Repository structure](#repository-structure)
- [Prerequisites](#prerequisites)
- [Quickstart](#quickstart)
  - [basic/](#basic)
  - [with-authorization/](#with-authorization)
- [Deploying to Vercel](#deploying-to-vercel)
- [Testing your server](#testing-your-server)
- [Tech stack](#tech-stack)
- [Contributing](#contributing)
- [Resources](#resources)
- [License](#license)

---

## What is MCP?

The [Model Context Protocol](https://spec.modelcontextprotocol.io/) (MCP) is an open standard that lets AI models and agents securely connect to external tools and data sources. An MCP **server** exposes tools, resources, and prompts over a well-defined protocol; any MCP-compatible client (Claude, IDEs, agents, etc.) can then call into it.

This repo focuses specifically on **remote, hosted** MCP servers — ones deployed to the cloud and reached over HTTP — as opposed to local servers that run as a subprocess on your machine.

## Which implementation should I use?

| | [`basic/`](./basic) | [`with-authorization/`](./with-authorization) |
|---|---|---|
| **Purpose** | Minimal starting point | Production-ready foundation |
| **Auth** | None | Full sign-up/sign-in via `better-auth` |
| **Authorization** | None | Fine-grained permissions via SpiceDB |
| **OAuth 2.0** | No | Yes, MCP-spec compliant |
| **Database** | None | PostgreSQL |
| **UI** | Bare-bones | Tailwind + shadcn/ui |
| **Good for** | Learning MCP, quick prototypes, single-tenant tools | Multi-user products that need per-user access control |

If you're not sure, start with `basic/` — you can graduate to `with-authorization/` once you actually need accounts and permissions.

## Repository structure

```
.
├── basic/                 # Minimal MCP server (Next.js + mcp-handler)
│   └── src/app/api/[transport]/route.ts   # <- tool definitions live here
├── with-authorization/    # MCP server + better-auth + SpiceDB
│   ├── AUTHORIZATION.md   # Deep dive on the permission model
│   └── src/
└── LICENSE
```

## Prerequisites

- **Node.js 20+**
- **npm**, **pnpm**, or **yarn** (examples below use `npm`)
- For `with-authorization/` only:
  - A **PostgreSQL** database (local or hosted, e.g. [Neon](https://neon.tech), [Supabase](https://supabase.com), [Railway](https://railway.app))
  - A **SpiceDB** instance (run locally with Docker, or use [AuthZed Cloud](https://authzed.com) for production)

## Quickstart

### basic/

```bash
cd basic
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) for the landing page. Your MCP server endpoint is live at:

```
http://localhost:3000/api/mcp
```

Add or edit tools in `basic/src/app/api/[transport]/route.ts`.

### with-authorization/

```bash
cd with-authorization
npm install
cp .env.example .env
```

Fill in `.env`:

```env
BETTER_AUTH_SECRET=       # generate with: openssl rand -base64 32
BETTER_AUTH_URL=http://localhost:3000

PGUSER=
PGPASSWORD=
PGHOST=localhost
PGPORT=5432
PGDATABASE=mcp_reference

SPICEDB_ENDPOINT=
SPICEDB_TOKEN=
```

Then start Postgres and SpiceDB (Docker example):

```bash
docker run -d --name mcp-postgres -e POSTGRES_PASSWORD=postgres -p 5432:5432 postgres:16
docker run -d --name mcp-spicedb -p 50051:50051 authzed/spicedb serve --grpc-preshared-key "dev-key"
```

Run any migrations your setup requires, then:

```bash
npm run dev
```

See [`with-authorization/AUTHORIZATION.md`](./with-authorization/AUTHORIZATION.md) for details on the permission model.

## Deploying to Vercel

Both apps are ready to deploy on [Vercel](https://vercel.com) as-is.

1. Push your fork to GitHub.
2. Click the deploy button (update the URL below with your own repo path first):

   ```
   https://vercel.com/new/clone?repository-url=https://github.com/YOUR_USERNAME/YOUR_REPO/tree/main/basic
   ```

3. For `with-authorization/`, set the same root directory (`with-authorization`) and add the environment variables from `.env.example` in the Vercel dashboard under **Settings → Environment Variables**.
4. Deploy. Vercel builds each app from its subdirectory independently — set **Root Directory** to `basic` or `with-authorization` in the project settings.

> **Note:** these are two independent Next.js apps in one repo, not a pnpm/turbo workspace — deploy them as separate Vercel projects, each pointed at its own subfolder.

## Testing your server

Use the [MCP Inspector](https://github.com/modelcontextprotocol/inspector) to interact with your server directly:

```bash
npm install -g @modelcontextprotocol/inspector
mcp-inspector http://localhost:3000/api/mcp
```

This gives you a web UI to browse tools/resources, run tools with custom inputs, and inspect raw protocol messages — useful for debugging both apps, including OAuth flows in `with-authorization/`.

## Tech stack

**Core (both apps)**
- [Next.js 15](https://nextjs.org) (App Router) + TypeScript
- [`@modelcontextprotocol/sdk`](https://www.npmjs.com/package/@modelcontextprotocol/sdk) — official MCP TypeScript SDK
- [`mcp-handler`](https://github.com/vercel/mcp-adapter) — MCP protocol handling for Next.js API routes
- [Zod](https://zod.dev) — runtime validation for tool parameters

**`with-authorization/` only**
- [better-auth](https://www.better-auth.com) — authentication (PostgreSQL-backed)
- [SpiceDB](https://authzed.com/docs) — Zanzibar-style fine-grained authorization
- TailwindCSS + [shadcn/ui](https://ui.shadcn.com) + Radix UI — UI layer

## Contributing

Issues and PRs welcome — this is meant as a foundation to build on, so improvements to security, docs, or new example tools are all fair game.

## Resources

- [MCP Specification](https://spec.modelcontextprotocol.io/)
- [MCP Authorization Specification](https://spec.modelcontextprotocol.io/specification/server/authentication/)
- [Next.js Documentation](https://nextjs.org/docs)
- [SpiceDB Documentation](https://authzed.com/docs)
- [Better Auth Documentation](https://www.better-auth.com/docs)

## License

See [LICENSE](./LICENSE).
