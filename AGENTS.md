# AGENTS.md

## Agent Instructions

This file defines how AI agents (including GitHub Copilot) should operate within the **digital-twin-project-team2** repository. It is the authoritative source of project context, constraints, and expectations.

---

## 1. Project Overview

**Project Name:** Digital Twin MCP Server

**Goal:**
Build an **MCP server** (using the *roll dice* pattern) that acts as a **digital twin assistant**, capable of answering questions about a person’s professional profile using **Retrieval-Augmented Generation (RAG)**.

The system retrieves relevant profile data from a vector database and uses an LLM to generate grounded, context-aware responses.

---

## 2. Reference Repositories (DO NOT CHANGE WITHOUT INSTRUCTION)

These repositories define the required architecture and logic patterns.

* **MCP Pattern Reference (Roll Dice):**
  [https://github.com/gocallum/rolldice-mcpserver.git](https://github.com/gocallum/rolldice-mcpserver.git)

* **RAG Logic Reference (Python):**
  [https://github.com/gocallum/binal_digital-twin_py.git](https://github.com/gocallum/binal_digital-twin_py.git)

Agents must:

* Follow the *roll dice MCP server pattern* exactly
* Ensure RAG search logic matches the Python reference implementation

---

## 3. Core Rules

Agents must:

* ❌ Not modify files unless explicitly instructed
* ✅ Prefer documentation, clarity, and correctness over speed
* ✅ Make small, well-scoped changes only
* ✅ Follow existing repository structure and naming conventions
* ❌ Not introduce new tools, libraries, or frameworks without team approval

---

## 4. Repository Scope (Current Phase)

### In Scope

Agents should focus on:

* Planning and design documentation
* Clear explanations of system architecture and workflow
* Conceptual design of RAG pipelines and MCP agents
* Readable, student-friendly Markdown documentation

### Out of Scope (Unless Explicitly Requested)

Agents should not:

* Implement full production code
* Add unnecessary boilerplate or premature optimisation
* Refactor unrelated content
* Make architectural decisions without team context

---

## 5. MCP & RAG Architecture Expectations

When designing or explaining AI components, agents must clearly separate:

1. **Data Storage**

   * Professional profile data (e.g. `digitaltwin_clean.json` or equivalent)

2. **Retrieval**

   * Semantic / vector search using **Upstash Vector**

3. **Generation**

   * LLM-based response generation using retrieved context

Additional constraints:

* Do not claim guaranteed accuracy
* Treat LLM output as assistive, not authoritative
* Explicitly explain assumptions and limitations

---

## 6. Environment Variables (Must Match `.env.local`)

Agents must not invent or rename environment variables.

```env
UPSTASH_VECTOR_REST_URL=
UPSTASH_VECTOR_REST_TOKEN=
GROQ_API_KEY=
```

If functionality requires additional variables, this must be discussed first.

---

## 7. Technical Requirements

Agents must respect the following technical constraints:

* **Framework:** Next.js 15.5.3+ (latest available)
* **Language:** TypeScript (strict typing enforced)
* **Architecture:** Prefer **server actions** wherever possible
* **Package Manager:** pnpm only (never npm or yarn)
* **Commands:** Windows PowerShell syntax only
* **Styling:** `globals.css` (no inline styles)
* **UI Framework:** ShadCN UI with dark mode

UI is secondary. **MCP server functionality is the priority.**

---

## 8. Upstash Vector Integration

### Official Documentation

* Getting Started: [https://upstash.com/docs/vector/overall/getstarted](https://upstash.com/docs/vector/overall/getstarted)
* Embedding Models: [https://upstash.com/docs/vector/features/embeddingmodels](https://upstash.com/docs/vector/features/embeddingmodels)
* TypeScript SDK: [https://upstash.com/docs/vector/sdks/ts/getting-started](https://upstash.com/docs/vector/sdks/ts/getting-started)

### Required Usage Pattern

* Use the official Upstash Vector TypeScript SDK
* Include metadata in query results
* Ensure search behaviour matches the Python reference implementation exactly

---

## 9. Coding & Design Guidelines (When Code Is Added)

When code is explicitly requested:

* Keep code modular and readable
* Prefer explicit logic over complex abstractions
* Use meaningful variable and function names
* Comment code to explain *why*, not just *what*
* Enforce strong TypeScript typing throughout

---

## 10. Security & Ethics

Agents must:

* Assume professional profile data may be sensitive
* Avoid real personal data in examples
* Never hard-code secrets or credentials
* Follow ethical AI principles:

  * Transparency
  * User control
  * Bias awareness

---

## 11. Collaboration & Version Control

Agents must respect team workflows:

* Use clear, descriptive commit messages
* Do not rewrite history or squash commits unless instructed
* Assume pull requests and reviews are required

---

## 12. Documentation Standards

* Use structured Markdown with clear headings
* Keep explanations concise and student-friendly
* Update documentation when behaviour or design changes

---

## 13. Read-Only / Caution Files

Unless explicitly instructed, treat the following as read-only:

* `README.md` (major changes require team agreement)
* Agreed planning or assessment documents

---

## Guiding Principle

> Support the team by improving clarity, learning outcomes, and design quality while respecting collaborative project workflows.
