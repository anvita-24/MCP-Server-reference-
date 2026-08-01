import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async headers() {
    return [
      // Support MCP Inspector OAuth authentication flow
      // See https://github.com/better-auth/better-auth/issues/2813#issuecomment-2927854113
      {
        source: '/api/auth/:path*',
        headers: [
          { key: 'Access-Control-Allow-Credentials', value: 'true' },
          { key: 'Access-Control-Allow-Origin', value: '*' },
          { key: 'Access-Control-Allow-Methods', value: 'GET,DELETE,PATCH,POST,PUT' },
          {
            key: 'Access-Control-Allow-Headers',
            value: 'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type'
          }
        ]
      }
    ];
  }
};

export default nextConfig;
