#  AGENTS.md file
# Agent Instructions

This file defines how AI agents should operate within the **digital-twin-project-team2** repository.

---



## Core Rules

* Do not modify files unless explicitly instructed
* Prefer documentation, clarity, and correctness over speed
* Make small, well-scoped changes** only
* Follow existing repository structure and naming conventions
* Do not introduce new tools, libraries, or frameworks without team approval

---

## Repository Scope (Current Phase)

Agents should focus on:

* Planning and design documentation
* Clear explanation of system architecture and workflow
* Conceptual design of RAG pipelines and AI agents
* Readable Markdown documentation

Agents should not:

* Implement full production code unless requested
* Add unnecessary boilerplate or premature optimisation
* Refactor unrelated content

---

## Coding & Design Guidelines (When Code Is Added)

* Keep code modular and easy to understand
* Prefer explicit logic over complex abstractions
* Use meaningful variable and function names
* Comment code to explain why, not just what

---

## AI & RAG Design Expectations

When discussing or designing AI components:

* Clearly separate:

  * Data storage (e.g. digitaltwin.json)
  * Retrieval (semantic/vector search)
  * Generation (LLM responses)
* Explain assumptions and limitations
* Avoid making claims of guaranteed accuracy
* Treat generated responses as assistive, not authoritative

---

## Security & Ethics

* Assume professional profile data may be sensitive
* Do not include real personal data in examples
* Avoid hard-coded secrets or credentials
* Follow basic ethical AI principles (transparency, user control, bias awareness)

---

## Collaboration & Version Control

* Respect team-based workflows (commits, pull requests, reviews)
* Do not rewrite history or squash commits unless instructed
* Keep commit messages clear and descriptive

---

## Documentation Standards

* Use clear headings and structured Markdown
* Keep explanations concise and student-friendly
* Update documentation when behaviour or design changes

---

## Read-Only / Caution Files

Unless explicitly instructed, treat the following as read-only:

* README.md (major changes require team agreement)
* Any agreed planning or assessment documents

---

## Out of Scope

Agents should not:

* Make architectural decisions without team context
* Add assessment-specific content without alignment to project requirements
* Introduce production-level security or scaling assumptions

---

**Guiding Principle:**

> Support the team by improving clarity, learning outcomes, and design quality while respecting collaborative project workflows.


# Digital Twin MCP Server Project Instructions

## Project Overview
Build an MCP server using the roll dice pattern to create a digital twin assistant that can answer questions about a person's professional profile using RAG (Retrieval-Augmented Generation).

## Reference Repositories
- **Pattern Reference**: https://github.com/gocallum/rolldice-mcpserver.git
  - Roll dice MCP server - use same technology and pattern for our MCP server
- **Logic Reference**: https://github.com/gocallum/binal_digital-twin_py.git
  - Python code using Upstash Vector for RAG search with Groq and LLaMA for generations

## Core Functionality
- MCP server accepts user questions about the person's professional background
- Create server actions that search Upstash Vector database and return RAG results
- Search logic must match the Python version exactly

## Environment Variables (.env.local)
```
UPSTASH_VECTOR_REST_URL=
UPSTASH_VECTOR_REST_TOKEN=
GROQ_API_KEY=
```

## Technical Requirements
- **Framework**: Next.js 15.5.3+ (use latest available)
- **Package Manager**: Always use pnpm (never npm or yarn)
- **Commands**: Always use Windows PowerShell commands
- **Type Safety**: Enforce strong TypeScript type safety throughout
- **Architecture**: Always use server actions where possible
- **Styling**: Use globals.css instead of inline styling
- **UI Framework**: ShadCN with dark mode theme
- **Focus**: Prioritize MCP functionality over UI - UI is primarily for MCP server configuration

## Setup Commands
```bash
pnpm dlx shadcn@latest init
```
Reference: https://ui.shadcn.com/docs/installation/next

## Upstash Vector Integration

### Key Documentation
- Getting Started: https://upstash.com/docs/vector/overall/getstarted
- Embedding Models: https://upstash.com/docs/vector/features/embeddingmodels
- TypeScript SDK: https://upstash.com/docs/vector/sdks/ts/getting-started

### Example Implementation
```typescript
import { Index } from "@upstash/vector"

const index = new Index({
  url: process.env.UPSTASH_VECTOR_REST_URL!,
  token: process.env.UPSTASH_VECTOR_REST_TOKEN!,
})

// RAG search example
await index.query({
  data: "What is Upstash?",
  topK: 3,
  includeMetadata: true,
})
```

## Additional Useful Resources
- Add any other relevant documentation links as needed
- Include specific API references for integrations
- Reference MCP protocol specifications
- Add deployment and testing guidelines
