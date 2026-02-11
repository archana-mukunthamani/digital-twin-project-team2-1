# Digital Twin MCP Server

A Model Context Protocol (MCP) server that provides RAG (Retrieval-Augmented Generation) functionality for querying professional profile information using Upstash Vector and Groq.

## Overview

This MCP server acts as a digital twin assistant, capable of answering questions about a person's professional profile using vector search and LLM-generated responses.

## Architecture

- **Next.js 15.5.3+** with TypeScript
- **Server Actions** for core RAG functionality
- **Upstash Vector** for semantic search
- **Groq** for LLM responses (optional) 
- **MCP Protocol** for tool exposure

## Available Tools

The server exposes the following MCP tools:

- **`rag_query`** - Ask any question about the professional background
  - Parameters: `question` (string), `useLLMFormatting` (boolean, optional)
- **`query_experience`** - Get work experience and career progression
- **`query_skills`** - Get technical skills and competencies
- **`query_projects`** - Get significant projects and achievements
- **`query_education`** - Get educational background and certifications
- **`query_career_goals`** - Get career goals and aspirations
- **`health_check`** - Check system status

## Setup

1. **Install dependencies:**
   ```bash
   pnpm install
   ```

2. **Configure environment variables:**
   Create `.env.local` with:
   ```
   UPSTASH_VECTOR_REST_URL=https://your-vector-endpoint.upstash.io
   UPSTASH_VECTOR_REST_TOKEN=your_upstash_token_here
   GROQ_API_KEY=your_groq_api_key_here
   ```

3. **Start the server:**
   ```bash
   pnpm dev
   ```

The server will be available at `http://localhost:3000` with MCP endpoints at:
- `/api/sse` (Server-Sent Events transport)
- `/api/http` (HTTP transport)

## Usage with Claude Desktop

Add to your Claude Desktop MCP configuration:

```json
{
  "mcpServers": {
    "digital-twin": {
      "command": "node",
      "args": [
        "path/to/mcp-server/.next/server.js"
      ],
      "transport": "stdio"
    }
  }
}
```

## Development

- **TypeScript checking:** `pnpm tsc --noEmit`
- **Build:** `pnpm build`
- **Lint:** `pnpm lint`

## Files Structure

```
mcp-server/
├── app/
│   ├── actions/
│   │   └── mcp-actions.ts      # Server actions for MCP tools
│   ├── api/
│   │   └── [transport]/
│   │       └── route.ts        # MCP API endpoint
│   ├── layout.tsx              # Next.js layout
│   └── page.tsx                # Landing page
├── lib/
│   └── digital-twin.ts         # Core RAG functionality
├── package.json                # Dependencies and scripts
├── tsconfig.json              # TypeScript configuration
└── next.config.js             # Next.js configuration
```

## Status

✅ **Completed:**
- Next.js project setup with pnpm
- MCP and RAG dependencies installed  
- Core RAG library with Upstash Vector + Groq
- Server actions for all digital twin tools
- MCP API route with proper tool registration
- TypeScript configuration
- Full compilaton without errors

The Digital Twin MCP Server is ready for use!