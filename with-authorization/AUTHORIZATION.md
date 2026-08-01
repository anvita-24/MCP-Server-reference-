# MCP Tool Permissions with SpiceDB

This document explains the simplified permission model for MCP tool execution using SpiceDB.

## Schema Overview

The permission model consists of two main object types:

### `user`
Represents authenticated users in the system.

### `mcp_tool`
Represents individual MCP tools that can be executed.

**Relations:**
- `enabled`: Users who can enable/disable the tool (typically admins)

**Permissions:**
- `execute`: Permission to execute the tool (derived from `enabled` relation)

## Setup Instructions

### 1. Install SpcieDB and the zed CLI
```bash
brew install authzed/tap/spicedb authzed/tap/zed
```

### 2. Apply the Schema
```bash
zed schema write \
    --endpoint="$SPICEDB_ENDPOINT" \
    --token="$SPICEDB_TOKEN" \
    --insecure \
    "./schema/mcp.zed"
```

## Permission Model

The schema implements a simple permission model:

1. **Tool Enablement**: Tools must be enabled by adding users to the `enabled` relation
2. **Execution Permission**: Users can execute tools if they have the `enabled` relation to that tool

## Integration with MCP Server

The MCP server automatically checks permissions before executing tools:

1. Extracts user ID from the authenticated session
2. Checks `mcp_tool:TOOL_NAME execute user:USER_ID` permission
3. Allows execution only if permission check returns `HAS_PERMISSION`
4. Returns access denied message if permission is not granted

## Development - Managing Permissions with zed CLI

**Note**: The following commands are for development purposes only. In production environments:
- Use secure connections (remove `--insecure` flag)
- Relationships should be written by the application, not manually via CLI

### Managing Permissions

**Note**: The following zed commands emulate the relationship writes and permission checks that would happen in an admin application. In production, these operations would typically be performed through an administrative interface rather than manual CLI commands.

### Enable a Tool for a User
```bash
zed relationship create \
    --endpoint="localhost:50051" \
    --token="your_token" \
    --insecure \
    "mcp_tool:TOOL_NAME enabled user:USER_ID"
```

### Check if User Can Execute a Tool
```bash
zed permission check \
    --endpoint="localhost:50051" \
    --token="your_token" \
    --insecure \
    "mcp_tool:TOOL_NAME execute user:USER_ID"
```

### Remove Tool Access
```bash
zed relationship delete \
    --endpoint="localhost:50051" \
    --token="your_token" \
    --insecure \
    "mcp_tool:TOOL_NAME enabled user:USER_ID"
```

### Environment Variables

- `SPICEDB_ENDPOINT`: SpiceDB server endpoint (default: `localhost:50051`)
- `SPICEDB_TOKEN`: SpiceDB authentication token

### Example Usage

```bash
# Enable echo tool for a specific user
zed relationship create \
    --endpoint="localhost:50051" \
    --token="t_your_token_here_1234567deadbeef" \
    --insecure \
    "mcp_tool:echo enabled user:john@example.com"

# Verify the user can execute the tool
zed permission check \
    --endpoint="localhost:50051" \
    --token="t_your_token_here_1234567deadbeef" \
    --insecure \
    "mcp_tool:echo execute user:john@example.com"
```

This will allow `john@example.com` to execute the `echo` tool through the MCP server.