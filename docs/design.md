# Digital Twin AI Agent - Design

## Overview

This design document translates the PRD into a concrete technical plan for implementing the Digital Twin AI Agent (MVP → production). It focuses on system architecture, data models, the RAG pipeline, MCP server design, integrations, deployment, security, and an implementation roadmap.

## Goals

- Deliver a production-ready MCP server that exposes interview-query endpoints
- Provide a robust RAG pipeline using Upstash Vector + Groq LLMs
- Support multi-channel access (VS Code Copilot, Claude Desktop, Web)
- Ensure security, observability, and testability for Phase 1

## High-level Architecture

Components:
- Frontends: VS Code Copilot (Agent), Claude Desktop (mcp-remote), Web UI (Next.js)
- MCP Server: Next.js server actions exposing JSON-RPC `/api/mcp`
- RAG Pipeline: Query enhancement → Vector search → Context assembly → LLM formatting
- Vector DB: Upstash Vector (REST API)
- LLM: Groq (Llama 3.1 family)
- Storage & Secrets: Environment variables for API keys, optional encrypted store for profiles
- Observability: Metrics (Prometheus), Logs (structured logs + Sentry/LogDNA)

Diagram (conceptual):

User → Frontend → MCP Server → (RAG Pipeline → Upstash Vector) and (LLM: Groq)

## Data Model

Primary artifact: `digitaltwin.json` (see PRD section 6). Design decisions:
- Chunk profile into coherent content chunks (300-800 tokens) with metadata fields: `id`, `title`, `category`, `tags`, `source`, `created_at`.
- Store chunk vectors in Upstash with metadata for fast filtering (e.g., category=experience).
- Keep a small local index map (UUID → chunk metadata) to assist re-embedding and deletions.

Vector record shape (recommended):

```
{
  "id": "uuid",
  "vector": [..],
  "metadata": { "title":"...", "category":"experience", "source":"digitaltwin.json", "tags":[] }
}
```

## RAG Pipeline - Implementation Details

1. Query intake: accept JSON-RPC `query_digital_twin` with `question`, optional `interview_type`, `top_k`.
2. Optional enhancement: send question to a fast LLM (llama-3.1-8b-instant) to normalize intent, expand synonyms, and create a focused retrieval prompt.
3. Vector search: call Upstash `POST /query` with the enhanced query embedding. Default `top_k=3` (configurable).
4. Context selection: assemble top results, truncate to token budget for Groq model.
5. Response generation: call Groq model (e.g., llama-3.1-70b-versatile) with system prompt instructing STAR formatting, role-playing as the user's digital twin.
6. Post-process: apply light formatting, attach metadata (vectors retrieved, relevance scores, processing_time_ms).

Retry and fallback:
- If enhancement step fails, fall back to raw query embedding.
- Retries for Upstash/Groq use exponential backoff with max 3 attempts.

## MCP Server API

Endpoint: `POST /api/mcp` (JSON-RPC 2.0)

Supported methods (MVP):
- `initialize` — returns server metadata and capabilities
- `query_digital_twin` — primary method (params: `question`, `interview_type`, `top_k`, `use_enhancement`)
- `list_skills` — optional helper returning top skill categories

Response contract: match PRD JSON-RPC formats (result with `response` and `metadata`).

Implementation notes:
- Validate inputs early and return JSON-RPC errors for malformed requests.
- Enforce per-IP and per-key rate limits (middleware).
- Keep handler stateless; persist long-term state (profiles) in external storage if required.

## Integration Points

- VS Code: supply `.vscode/mcp.json` pointing to the local MCP server. Provide quick commands to run simulations.
- Claude Desktop: support mcp-remote tunneling to the MCP endpoint.
- Web: simple Next.js UI to send queries and view transcripts and assessment reports.

## Security

- Store API keys in environment variables: `UPSTASH_VECTOR_REST_URL`, `UPSTASH_VECTOR_REST_TOKEN`, `GROQ_API_KEY`.
- Use TLS everywhere (Vercel will terminate TLS for production). Local dev should support HTTPS tunnels (ngrok, mcp-remote).
- Do not log sensitive profile fields. Sanitize logs and redact tokens.
- Encrypt persisted profile data at rest if stored on a remote store.

## Observability & Monitoring

- Metrics: request latency, vector search time, LLM latency, success/error counts.
- Logs: structured JSON logs, include request IDs for tracing.
- Alerts: high error rate, slow responses, rate-limit breaches.

## Testing Strategy

- Unit tests: validation, vector record mapping, query enhancement logic.
- Integration tests: mock Upstash + Groq to validate RAG flow end-to-end.
- E2E: simulate MCP JSON-RPC calls from VS Code and Claude Desktop clients.

## Deployment & CI/CD

- Host MCP Server as a Next.js app on Vercel for production (auto-deploy on push to main).
- Use GitHub Actions for lint, unit tests, build, and deploy steps.
- Ensure environment variables are configured in Vercel and CI secrets.

## Implementation Roadmap (Phase-aligned)

- Week 1: Project skeleton — Next.js MCP server, Python RAG scripts, skeleton `digitaltwin.json` samples.
- Week 2: Upstash integration, embedding flow, basic vector search, CLI scripts to embed data.
- Week 3: Groq integration for enhancement + response generation; implement `query_digital_twin` end-to-end.
- Week 4: VS Code integration, local testing, documentation, and acceptance tests for MVP.

## Acceptance Criteria (MVP)

- `query_digital_twin` returns coherent, contextual interview responses for test profiles.
- Upstash contains embedded profile chunks with correct metadata.
- VS Code Copilot can call the local MCP server using `.vscode/mcp.json`.
- End-to-end latency meets PRD targets in a development environment (vector <1s, LLM <3s).

## Appendix — Key Config Snippets

ENV (example):

```
UPSTASH_VECTOR_REST_URL=https://your-region.upstash.io
UPSTASH_VECTOR_REST_TOKEN=XXX
GROQ_API_KEY=XXX
```

JSON-RPC Example (query):

```
{
  "jsonrpc":"2.0",
  "method":"query_digital_twin",
  "params":{ "question":"Tell me about my leadership experience","top_k":3 },
  "id":1
}
```

---

Document owner: Digital Twin Team — use this as the authoritative engineering design for Phase 1 implementation.
