import { z } from 'zod';
import { createMcpHandler } from 'mcp-handler';

const handler = createMcpHandler(
  (server) => {
    server.tool(
      'roll_dice',
      'Rolls an N-sided die',
      { sides: z.number().int().min(2) },
      async ({ sides }) => {
        const value = 1 + Math.floor(Math.random() * sides);
        return {
          content: [{ type: 'text', text: `🎲 You rolled a ${value}!` }],
        };
      },
    );
  },
  {
    // Server options with capabilities
    serverInfo: {
      name: "MCP Server Reference Implementation",
      version: "1.0.0",
    },
    instructions: "This is a reference implementation of a MCP server. The tools and resources are for demo purposes only.",
  },
  {
    basePath: "/api", // this needs to match where the [transport] is located.
    maxDuration: 60,
    verboseLogs: true,
  }
);

export { handler as GET, handler as POST, handler as DELETE };