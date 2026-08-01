# MCP Server Reference Implementation

This is a basic reference implementation of an MCP (Model Context Protocol) server built with Next.js. This project demonstrates how to create a remote hosted MCP server that can be accessed by MCP clients.

## What is MCP?

The Model Context Protocol (MCP) is an open standard that enables AI assistants to securely connect to data sources and tools. MCP servers expose resources, tools, and prompts that AI models can use to enhance their capabilities.

## Getting Started

This project is designed for building **remote hosted MCP servers** that can be deployed to the cloud and accessed over HTTP. Unlike local MCP servers that run as separate processes, this implementation uses Next.js API routes to handle MCP protocol communications.

### Development

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the web interface.

The MCP server endpoints are available at `http://localhost:3000/api/[transport]` where `[transport]` can be various MCP transport protocols.

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
- **Type Safety**: Full TypeScript support for MCP protocol types

### MCP TypeScript SDK
[@modelcontextprotocol/sdk](https://www.npmjs.com/package/@modelcontextprotocol/sdk) is the official TypeScript SDK for the Model Context Protocol. It provides:
- **Core Protocol Types**: TypeScript definitions for all MCP protocol messages
- **Client/Server Interfaces**: Base classes and interfaces for building MCP clients and servers
- **Transport Implementations**: Built-in support for various transport mechanisms
- **Validation**: Runtime validation of MCP protocol messages

### Testing Your MCP Server

Use [MCP Inspector](https://github.com/modelcontextprotocol/inspector) to test and debug your MCP server:

```bash
# Install globally
npm install -g @modelcontextprotocol/inspector

# Test your server
mcp-inspector http://localhost:3000/api/mcp
```

The inspector provides a web interface to:
- Browse available tools and resources
- Test tool execution with custom parameters
- View protocol messages and responses
- Debug authentication and connection issues

## Deploy

Deploy with Vercel

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https%3A%2F%2Fgithub.com%2Fauthzed%2Fmcp-server-reference%2Ftree%2Fmain%2Fbasic)

### Additional Resources
- [Model Context Protocol Specification](https://spec.modelcontextprotocol.io/) - Learn about the MCP standard
- [Next.js Documentation](https://nextjs.org/docs) - Learn about Next.js features and API
- [MCP Handler Documentation](https://github.com/vercel/mcp-adapter) - Learn about the MCP handler library
