# MCP Server Reference Implementation with Authorization

This is a reference implementation of an MCP (Model Context Protocol) server built with Next.js that includes authentication and authorization features. This project demonstrates how to create a remote hosted MCP server with fine-grained permissions for tool execution.

## What is MCP?

The Model Context Protocol (MCP) is an open standard that enables AI assistants to securely connect to data sources and tools. MCP servers expose resources, tools, and prompts that AI models can use to enhance their capabilities.

## Authorization Features

This implementation extends the basic MCP server with comprehensive authorization capabilities:

- **Authentication System**: Username and password based sign-up and sign-in pages for demo purposes
- **MCP Authorization Spec Compliance**: Full compliance with the MCP authorization specification including dynamic client registration
- **Fine-grained Permissions**: Tool execution permissions managed through SpiceDB
- **OAuth 2.0 Integration**: Protected resource endpoints with proper OAuth flows
- **Session Management**: Secure session handling with better-auth

## Getting Started

This project is designed for building **remote hosted MCP servers** with authorization that can be deployed to the cloud and accessed over HTTP with proper authentication and permission controls.

### Prerequisites

Before running this project, you'll need:

1. **PostgreSQL Database**: For storing authentication data
2. **SpiceDB Instance**: For managing permissions (can run locally for development or on AuthZed Cloud)

### Development

First, set up your environment variables by copying `.env.example` to `.env.local` and filling in the required values:

```bash
cp .env.example .env.local
```

Required environment variables:
- `DATABASE_URL`: PostgreSQL connection string for better-auth
- `BETTER_AUTH_SECRET`: Secret key for better-auth sessions
- `BETTER_AUTH_URL`: Base URL for authentication (http://localhost:3000 for development)
- `SPICEDB_ENDPOINT`: SpiceDB server endpoint (localhost:50051 for development)
- `SPICEDB_TOKEN`: SpiceDB authentication token

## Setting up BetterAuth

Before running the development server, you'll need to set up the database for authentication:

```bash
npx @better-auth/cli migrate
```

This will create the necessary database tables for user authentication and session management.

### Setting up SpiceDB

For local development, you'll need to run SpiceDB:

1. **Install SpiceDB and zed CLI**:
   ```bash
   brew install authzed/tap/spicedb authzed/tap/zed
   ```

2. **Start SpiceDB locally**:
   ```bash
   spicedb serve --grpc-preshared-key "your_token_here"
   ```

3. **Apply the permission schema**:
   ```bash
   zed schema write \
       --endpoint="localhost:50051" \
       --token="your_token_here" \
       --insecure \
       "./schema/mcp.zed"
   ```

Make sure to use the same token in your `.env.local` file as `SPICEDB_TOKEN`.

Then, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the web interface with sign-up and sign-in functionality.

The MCP server endpoints are available at `http://localhost:3000/api/[transport]` where `[transport]` can be various MCP transport protocols. Use `/api/mcp` to get started. All tool execution is protected by SpiceDB permissions.

You can start editing the MCP server implementation by modifying `app/api/[transport]/route.ts`. The server auto-reloads as you edit the file.



## Learn More

This project is built with the following key dependencies:

### Next.js
[Next.js](https://nextjs.org) provides the web framework and API routes that power this MCP server implementation. Key features used:
- **API Routes**: Handle MCP protocol requests via HTTP endpoints
- **App Router**: Modern routing system for both web interface and API endpoints
- **TypeScript Support**: Full type safety for MCP protocol implementations

### MCP Handler
[mcp-handler] is the core library that implements the Model Context Protocol specification. It provides:
- **Protocol Implementation**: Handles MCP JSON-RPC communication
- **Transport Abstraction**: Supports multiple transport mechanisms (HTTP, WebSocket, etc.)
- **Tool Registration**: Easy API for defining MCP tools and resources
- **Authorization Integration**: OAuth 2.0 protected resource handling
- **Type Safety**: Full TypeScript support for MCP protocol types

### MCP TypeScript SDK
[@modelcontextprotocol/sdk](https://www.npmjs.com/package/@modelcontextprotocol/sdk) is the official TypeScript SDK for the Model Context Protocol. It provides:
- **Core Protocol Types**: TypeScript definitions for all MCP protocol messages
- **Client/Server Interfaces**: Base classes and interfaces for building MCP clients and servers
- **Transport Implementations**: Built-in support for various transport mechanisms
- **Validation**: Runtime validation of MCP protocol messages

### Shadcn/ui
[Shadcn/ui](https://ui.shadcn.com) provides the UI component library for the authentication interface:
- **Form Components**: Pre-built form inputs and validation
- **Button Components**: Consistent button styling and behavior
- **Layout Components**: Cards, tabs, and responsive layouts
- **Accessibility**: WCAG compliant components with proper ARIA attributes

### Better Auth
[Better Auth](https://www.better-auth.com) handles authentication with PostgreSQL backend:
- **Email/Password Authentication**: Secure user registration and login
- **Session Management**: Encrypted session handling
- **Database Integration**: PostgreSQL adapter for user data storage
- **OAuth Integration**: Compatible with OAuth 2.0 flows for MCP authorization

### SpiceDB
[SpiceDB](https://authzed.com/spicedb) provides fine-grained authorization for tool execution:
- **Relationship-based Permissions**: Google Zanzibar-inspired permission model
- **Real-time Permission Checks**: Fast permission evaluation for tool execution
- **Scalable Architecture**: Designed for high-throughput permission checking
- **Development Tools**: CLI tools for managing permissions and testing

### Testing Your MCP Server

Use [MCP Inspector](https://github.com/modelcontextprotocol/inspector) to test and debug your MCP server with authorization:

```bash
# Install globally
npm install -g @modelcontextprotocol/inspector

# Test your server (requires authentication)
mcp-inspector http://localhost:3000/api/mcp
```

The inspector provides a web interface to:
- Browse available tools and resources
- Test tool execution with custom parameters (subject to permissions)
- View protocol messages and responses
- Debug authentication and authorization issues
- Test OAuth flows and token validation

## Deploy

Deploy to Vercel

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https%3A%2F%2Fgithub.com%2Fauthzed%2Fmcp-server-reference%2Ftree%2Fmain%2Fwith-authorization)

**Note**: When deploying, you'll need to configure the following environment variables:
- `DATABASE_URL` - PostgreSQL connection string
- `BETTER_AUTH_SECRET` - Secret key for session encryption
- `BETTER_AUTH_URL` - Your deployed application URL
- `SPICEDB_ENDPOINT` - SpiceDB server endpoint (use AuthZed Cloud for production)
- `SPICEDB_TOKEN` - SpiceDB authentication token

### Permission Management

See [AUTHORIZATION.md](./AUTHORIZATION.md) for detailed information about:
- Setting up SpiceDB for development and production
- Managing user permissions for tool execution
- Understanding the permission model
- Using the zed CLI for permission management

### Additional Resources
- [Model Context Protocol Specification](https://spec.modelcontextprotocol.io/) - Learn about the MCP standard
- [MCP Authorization Specification](https://spec.modelcontextprotocol.io/specification/server/authentication/) - Learn about MCP authentication and authorization
- [Next.js Documentation](https://nextjs.org/docs) - Learn about Next.js features and API
- [MCP Handler Documentation](https://github.com/vercel/mcp-adapter) - Learn about the MCP handler library
- [SpiceDB Documentation](https://authzed.com/docs) - Learn about SpiceDB permissions
- [Better Auth Documentation](https://www.better-auth.com/docs) - Learn about authentication implementation