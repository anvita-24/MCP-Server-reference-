# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Common Commands

**Development:**
- `pnpm dev` - Start development server on localhost:3000
- `pnpm build` - Build production version
- `pnpm start` - Start production server
- `pnpm lint` - Run ESLint checks

## Architecture Overview

This is a basic Next.js 15 application that serves as an MCP (Model Context Protocol) server reference implementation. It demonstrates how to build a remote hosted MCP server using Next.js API routes.

**Key Components:**

1. **MCP Server Implementation** (`src/app/api/[transport]/route.ts`):
   - Uses `mcp-handler` v1.0.1 library to create MCP server endpoints
   - Implements dynamic transport routing via `[transport]` parameter
   - Currently includes a "roll_dice" tool that rolls N-sided dice with Zod validation
   - Configured with server info: "MCP Server Reference Implementation" v1.0.0
   - Uses basePath "/api" with 60s max duration and verbose logging enabled
   - Exports GET, POST, and DELETE handlers for comprehensive HTTP support

2. **Next.js App Structure**:
   - Clean Next.js 15 App Router architecture
   - Standard create-next-app structure with minimal modifications
   - Basic home page (`src/app/page.tsx`) with default Next.js styling
   - TypeScript configuration with standard Next.js setup

3. **Project Structure**:
   - `src/app/` - Next.js App Router pages and API routes
   - `src/app/api/[transport]/` - MCP server endpoint handling multiple transport protocols
   - `public/` - Static assets (Next.js logos, icons)
   - Standard configuration files (tsconfig.json, next.config.ts, eslint.config.mjs)

**Dependencies:**
- `@modelcontextprotocol/sdk` v1.17.3 - Core MCP functionality and protocol types
- `mcp-handler` v1.0.1 - Simplified MCP server creation and transport handling
- `zod` v3.25.76 - Runtime type validation for tool parameters
- Next.js 15.4.1 with React 19.1.0
- TypeScript v5.9.2 for full type safety

**Development Notes:**
- This is a **basic reference implementation** - minimal setup to demonstrate MCP server concepts
- The MCP handler expects tools to be defined within the server configuration callback
- Tools use Zod schemas for parameter validation and type safety
- The `[transport]` dynamic route handles different MCP transport protocols (HTTP, WebSockets, etc.)
- Server can be tested using `mcp-inspector http://localhost:3000/api/mcp`
- No authentication, database, or complex business logic - focuses purely on MCP server fundamentals