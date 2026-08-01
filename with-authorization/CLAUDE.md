# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Development Commands

- `pnpm dev` - Start development server on http://localhost:3000
- `pnpm build` - Build production bundle
- `pnpm start` - Start production server
- `pnpm lint` - Run ESLint

## Architecture Overview

This is a Next.js 15 application built with the App Router pattern that demonstrates an MCP (Model Context Protocol) server with comprehensive authentication and authorization features.

### Key Technologies

- **Next.js 15** with App Router
- **TypeScript** for type safety
- **TailwindCSS** for styling  
- **shadcn/ui** components (configured in components.json)
- **better-auth** for authentication with PostgreSQL backend
- **SpiceDB** for fine-grained authorization and permissions
- **mcp-handler** library for MCP server functionality with OAuth 2.0 support
- **@modelcontextprotocol/sdk** for MCP protocol implementation
- **@authzed/authzed-node** for SpiceDB client integration

### Core MCP Integration with Authorization

The main MCP server is implemented in `src/app/api/[transport]/route.ts` using the `mcp-handler` library with SpiceDB permission checking.

**MCP Authorization Features**:
- OAuth 2.0 protected resource endpoints (`.well-known/oauth-protected-resource/`)
- Dynamic client registration support
- Session-based authentication with better-auth
- Permission checks via SpiceDB before tool execution

Current MCP tools:
- `echo` - Demonstrates tool execution with SpiceDB permission checking

Configuration options:
- Redis support via `REDIS_URL` environment variable
- `basePath: "/api"` matches the route structure
- `maxDuration: 60` seconds
- Verbose logging enabled
- Authorization integration with session validation

### Authentication System

Authentication is fully implemented using better-auth with PostgreSQL backend:

**Server Configuration** (`src/auth.ts`):
- PostgreSQL database connection via `pg` Pool
- Email and password authentication enabled
- Session management with secure cookies

**API Routes** (`src/app/api/auth/[...auth]/route.ts`):
- Handles all authentication endpoints (`/api/auth/*`)
- Supports GET and POST methods via `auth.handler`

**Client Configuration** (`src/lib/auth-client.ts`):
- Uses `createAuthClient` from "better-auth/react"
- Environment-aware configuration (development vs production)
- Base URL handling for different deployment environments

**Authentication Pages**:
- `/signin` - Sign in page with email/password form and tab navigation
- `/signup` - Sign up page with email/password/confirm password
- Both pages include proper form validation, error handling, and loading states
- Session info component shows signed-in user details with sign-out functionality

### Authorization & Permissions

**SpiceDB Integration** (`src/lib/spicedb-client.ts`):
- Environment-aware client configuration (insecure localhost for development)
- Permission model defined in `schema/mcp.zed`
- Real-time permission checking before tool execution

**Permission Model**:
- `user` objects for authenticated users
- `mcp_tool` objects for individual tools
- `enabled` relation grants `execute` permission
- Simple relationship-based access control

**OAuth 2.0 Compliance**:
- Protected resource handler in `.well-known/oauth-protected-resource/`
- Environment variable configuration for auth server URLs
- MCP authorization specification compliance

### UI Components

UI follows shadcn/ui patterns with components in `src/components/ui/`. 

**Authentication Forms**:
- `signin-form.tsx` - Sign in form with better-auth integration and proper tab ordering
- `signup-form.tsx` - Sign up form with password confirmation, validation, and better-auth integration
- `session-info.tsx` - User session display with email and sign-out functionality
- All forms include loading states, error handling, and navigation links

**Styling & Accessibility**:
- Consistent button styling with outlined variants
- Proper tab navigation and focus management
- Form validation with client-side password requirements
- Responsive design with card-based layouts

### Project Structure

- `src/app/` - Next.js App Router pages and API routes
  - `api/auth/[...auth]/` - Better-auth API endpoints
  - `api/[transport]/` - MCP protocol handling with authorization
  - `.well-known/oauth-protected-resource/` - OAuth 2.0 protected resource endpoint
  - `signin/` - Sign in page
  - `signup/` - Sign up page
- `src/components/` - React components (UI components and authentication forms)
  - `ui/` - shadcn/ui components (button, card, input, label)
  - Authentication forms and session management components
- `src/lib/` - Utility functions and configurations
  - `auth-client.ts` - Better-auth client configuration
  - `spicedb-client.ts` - SpiceDB client with environment handling
  - `utils.ts` - Utility functions for shadcn/ui
- `schema/` - SpiceDB schema definitions
  - `mcp.zed` - Permission model for MCP tools
- `AUTHORIZATION.md` - Detailed documentation for permission management

## Required Environment Variables

For development, create `.env.local` with:
- `DATABASE_URL` - PostgreSQL connection string for better-auth
- `BETTER_AUTH_SECRET` - Secret key for better-auth sessions
- `BETTER_AUTH_URL` - Base URL for authentication (http://localhost:3000 for development)
- `SPICEDB_ENDPOINT` - SpiceDB server endpoint (localhost:50051 for development)
- `SPICEDB_TOKEN` - SpiceDB authentication token

## Development Notes

- Uses `pnpm` as package manager
- ESLint configured with Next.js rules
- TailwindCSS configured with CSS variables and new-york style
- No test framework currently configured
- Standard Next.js project structure with TypeScript
- SpiceDB can run locally for development using Docker or homebrew

## Authorization Development

When working with authorization:
- All MCP tool execution requires SpiceDB permission checks
- User sessions are validated before permission checks
- Permission relationships must be created via SpiceDB (see AUTHORIZATION.md)
- Environment-specific client configuration (secure vs insecure connections)
- OAuth 2.0 endpoints support MCP authorization specification

## Authentication Development

When working with authentication:
- Forms use React state management with loading/error states
- Client-side validation includes password length and confirmation matching
- Better-auth handles session management and secure authentication flows
- Forms redirect to home page (`/`) after successful authentication
- All authentication components are client-side components (`"use client"`)
- Session info component shows user email and provides sign-out functionality
- Tab navigation properly configured for accessibility