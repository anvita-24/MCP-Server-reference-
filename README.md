<div align="center">

# MCP Server Reference Implementations

**Production-grade blueprints for building remote, hosted [Model Context Protocol](https://modelcontextprotocol.io/) servers with Next.js.**

From a five-minute starter to a fully authenticated, permission-aware server.

[![Deploy Basic](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/anvita-24/MCP-Server-reference-/tree/main/basic)
[![License: Apache-2.0](https://img.shields.io/badge/license-Apache--2.0-blue.svg)](./LICENSE)
[![Next.js](https://img.shields.io/badge/Next.js-15-black?logo=next.js)](https://nextjs.org)
[![TypeScript](https://img.shields.io/badge/TypeScript-5-3178C6?logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![MCP](https://img.shields.io/badge/MCP-compatible-8A2BE2)](https://modelcontextprotocol.io/)
[![PRs Welcome](https://img.shields.io/badge/PRs-welcome-brightgreen.svg)](#contributing)

[Quickstart](#quickstart) · [Architecture](#architecture) · [Deploy](#deploying-to-vercel) · [FAQ](#faq)

</div>

---

## Overview

Building a remote MCP server usually means wiring together protocol handling, authentication, authorization, and deployment from scratch. This repository does that wiring for you, in two flavors:

| | |
|---|---|
| **`basic/`** | A minimal starter for learning MCP and prototyping fast |
| **`with-authorization/`** | A fully featured, production-ready server with auth, permissions, and OAuth 2.0 |

Both are built on Next.js 15 and are deployable to Vercel. `basic/` deploys in one click; `with-authorization/` also needs a PostgreSQL database, a SpiceDB instance, and environment variables (see [Deploying to Vercel](#deploying-to-vercel)).

---

## Table of Contents

- [Overview](#overview)
- [Features](#features)
- [Which implementation should I use?](#which-implementation-should-i-use)
- [Architecture](#architecture)
- [Repository structure](#repository-structure)
- [Prerequisites](#prerequisites)
- [Quickstart](#quickstart)
- [Local endpoints](#local-endpoints)
- [Deploying to Vercel](#deploying-to-vercel)
- [Testing your server](#testing-your-server)
- [Supported clients](#supported-clients)
- [Tech stack](#tech-stack)
- [Compatibility](#compatibility)
- [Roadmap](#roadmap)
- [FAQ](#faq)
- [Contributing](#contributing)
- [Resources](#resources)
- [License](#license)

---

## Features

- Remote, hosted MCP servers (not local subprocess servers)
- Next.js 15 App Router
- Official MCP TypeScript SDK
- Runtime input validation with Zod
- Production authentication with Better Auth
- Fine-grained authorization using SpiceDB (Zanzibar-style)
- OAuth 2.0, MCP-spec compliant
- TypeScript-first throughout

## Which implementation should I use?

| | [`basic/`](./basic) | [`with-authorization/`](./with-authorization) |
|---|---|---|
| **Purpose** | Minimal starting point | Production-ready foundation |
| **Auth** | None | Full sign-up/sign-in via Better Auth |
| **Authorization** | None | Fine-grained permissions via SpiceDB |
| **OAuth 2.0** | No | Yes, MCP-spec compliant |
| **Database** | None | PostgreSQL |
| **UI** | Bare-bones | Tailwind + shadcn/ui |
| **Good for** | Learning MCP, quick prototypes, single-tenant tools | Multi-user products that need per-user access control |

If you're not sure, start with `basic/` — you can graduate to `with-authorization/` once you actually need accounts and permissions.

## Architecture

```
        Client (Claude, Cursor, VS Code, agents...)
                        │
                        ▼
                  MCP Server (Next.js)
                        │
          ┌─────────────┼─────────────┐
          ▼             ▼             ▼
        Tools       Resources      Prompts
          │
          ▼
  ┌───────────────────────────────┐
  │  with-authorization/ only:    │
  │  Better Auth  →  SpiceDB      │
  │  (who are you) (what can you  │
  │                  access)      │
  └───────────────────────────────┘
                        │
                        ▼
          External APIs / PostgreSQL
```

`basic/` stops at the Tools/Resources/Prompts layer. `with-authorization/` adds the auth + permissions layer before any tool call is allowed to run.

## Repository structure

```
Repository
│
├── basic/                              # Minimal MCP server
│   ├── src/app/api/[transport]/route.ts   # tool definitions live here
│   └── package.json
│
├── with-authorization/                 # MCP server + auth + permissions
│   ├── src/
│   ├── AUTHORIZATION.md                # deep dive on the permission model
│   ├── .env.example
│   └── package.json
│
└── LICENSE
```

## Prerequisites

- **Node.js 20+**
- **npm**, **pnpm**, or **yarn** (examples below use `npm`)
- For `with-authorization/` only:
  - A **PostgreSQL** database (local or hosted, e.g. [Neon](https://neon.tech), [Supabase](https://supabase.com), [Railway](https://railway.app))
  - A **SpiceDB** instance (run locally with Docker, or use [AuthZed Cloud](https://authzed.com) for production)

## Quickstart

### `basic/`

```bash
cd basic
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) for the landing page. Add or edit tools in `basic/src/app/api/[transport]/route.ts`.

### `with-authorization/`

```bash
cd with-authorization
npm install
cp .env.example .env
```

Fill in `.env`:

```env
BETTER_AUTH_SECRET=       # generate with: openssl rand -base64 32
BETTER_AUTH_URL=http://localhost:3000

PGUSER=postgres
PGPASSWORD=postgres
PGHOST=localhost
PGPORT=5432
PGDATABASE=mcp_reference

SPICEDB_ENDPOINT=localhost:50051
SPICEDB_TOKEN=dev-key     # must match --grpc-preshared-key below
```

Start Postgres and SpiceDB (Docker example):

```bash
docker run -d --name mcp-postgres \
  -e POSTGRES_PASSWORD=postgres \
  -e POSTGRES_DB=mcp_reference \
  -p 5432:5432 postgres:16

docker run -d --name mcp-spicedb \
  -p 50051:50051 \
  authzed/spicedb serve --grpc-preshared-key "dev-key"
```

Run the database migrations and load the SpiceDB schema as described in [`with-authorization/AUTHORIZATION.md`](./with-authorization/AUTHORIZATION.md), then:

```bash
npm run dev
```

## Local endpoints

**`basic/`**

| | |
|---|---|
| App | `http://localhost:3000` |
| MCP endpoint | `http://localhost:3000/api/mcp` |

**`with-authorization/`**

| | |
|---|---|
| App | `http://localhost:3000` |
| MCP endpoint | `http://localhost:3000/api/mcp` |
| Sign-in | `http://localhost:3000/sign-in` |

After you deploy, your endpoint will be `https://<your-project>.vercel.app/api/mcp`.

## Deploying to Vercel

Both apps are standard Next.js apps and deploy to [Vercel](https://vercel.com).

1. Push your repository to GitHub.
2. For `basic/`, click **Deploy Basic** at the top of this README, or deploy manually:
   ```bash
   npm i -g vercel
   cd basic          # or with-authorization
   vercel --prod
   ```
3. For `with-authorization/`, first provision PostgreSQL and SpiceDB, then add the environment variables from `.env.example` in the Vercel dashboard under **Settings → Environment Variables**.
4. In **Project Settings → Root Directory**, set `basic` or `with-authorization` — these are two independent Next.js apps in one repo, not a workspace, so deploy them as separate Vercel projects.

## Testing your server

Use the [MCP Inspector](https://github.com/modelcontextprotocol/inspector) to interact with your server directly:

```bash
npx @modelcontextprotocol/inspector
```

In the Inspector UI, choose the **Streamable HTTP** transport and enter `http://localhost:3000/api/mcp`. You can browse tools/resources, run tools with custom inputs, and inspect raw protocol messages — including OAuth flows in `with-authorization/`.

## Supported clients

Any MCP-compatible client can connect, including:

- Claude Desktop / Claude.ai (via custom connectors)
- Cursor
- VS Code (via MCP extensions)
- OpenAI-compatible agent frameworks
- Any other client implementing the MCP spec

## Tech stack

| Component | Technology |
|---|---|
| Framework | Next.js 15 (App Router) |
| Language | TypeScript |
| Runtime validation | Zod |
| MCP protocol | [`@modelcontextprotocol/sdk`](https://www.npmjs.com/package/@modelcontextprotocol/sdk) |
| MCP ↔ Next.js adapter | [`mcp-handler`](https://github.com/vercel/mcp-adapter) |
| Authentication *(with-authorization)* | Better Auth |
| Authorization *(with-authorization)* | SpiceDB |
| Database *(with-authorization)* | PostgreSQL |
| UI *(with-authorization)* | Tailwind CSS + shadcn/ui + Radix UI |

## Compatibility

| Software | Version |
|---|---|
| Node.js | 20+ |
| Next.js | 15.x |
| TypeScript | 5.x |
| MCP SDK | see `package.json` |

## Roadmap

- [x] Basic MCP server
- [x] OAuth 2.0 support
- [x] Authorization example (SpiceDB)
- [ ] Example database-backed tools
- [ ] Streaming tool example
- [ ] Docker Compose setup for one-command local dev
- [ ] Automated tests for both implementations

## FAQ

<details>
<summary><strong>Does this support local (stdio) MCP servers?</strong></summary>
<br>
No, both implementations are remote, HTTP-based MCP servers designed for hosting. For a local subprocess server, see the <a href="https://github.com/modelcontextprotocol/typescript-sdk">official MCP TypeScript SDK examples</a>.
</details>

<details>
<summary><strong>Can I deploy this somewhere other than Vercel?</strong></summary>
<br>
Yes — both are standard Next.js apps, so any platform that supports Next.js (Railway, Render, Fly.io, self-hosted Node) will work. Vercel is just the fastest path.
</details>

<details>
<summary><strong>Can I use SQLite instead of PostgreSQL in <code>with-authorization/</code>?</strong></summary>
<br>
Better Auth supports SQLite, but this reference implementation is configured for PostgreSQL. You'd need to update the database adapter yourself.
</details>

<details>
<summary><strong>Why SpiceDB instead of a simpler role-based check?</strong></summary>
<br>
SpiceDB gives you fine-grained, relationship-based permissions (Zanzibar-style) that scale better than hardcoded roles once you have real multi-tenant access patterns. For simple cases, a basic role check may be all you need — see <code>AUTHORIZATION.md</code> for the tradeoffs.
</details>

<details>
<summary><strong>Can I swap out Better Auth for something else (Clerk, Auth0, NextAuth)?</strong></summary>
<br>
Yes, but you'll need to reimplement the session logic that <code>with-authorization/</code> wires into the MCP OAuth flow.
</details>

## Contributing

Issues and PRs welcome — this is meant as a foundation to build on, so improvements to security, docs, or new example tools are all fair game.

## Resources

- [MCP Specification](https://modelcontextprotocol.io/specification)
- [Next.js Documentation](https://nextjs.org/docs)
- [SpiceDB Documentation](https://authzed.com/docs)
- [Better Auth Documentation](https://www.better-auth.com/docs)

## License

Licensed under the [Apache License 2.0](./LICENSE).
