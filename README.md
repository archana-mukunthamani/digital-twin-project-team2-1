# digital-twin-project-team2
Collaborative project for building a foundational Digital Twin using AI, RAG concepts, and team-based GitHub workflows.

Digital Twin AI Agent – Interview Preparation
### Project Overview

This project aims to build a Digital Twin AI Agent that helps users prepare for job interviews using Retrieval-Augmented Generation (RAG) and AI-powered semantic search.

The system represents a user’s professional profile and responds to interview questions as if it were the user, using their real experience, skills, and background data.

This repository currently focuses on planning, documentation, and initial setup, aligned with the Digital Twin I projwct requirements.

### Problem Statement

Job interview preparation is often generic and lacks personalisation.
This project addresses that gap by creating an AI agent that:
- Understands a user’s professional background
- Retrieves relevant experience using semantic search
- Generates interview-ready responses using AI

### Planned Features (Initial Phase)
- Structured professional profile (digitaltwin.json)
- Retrieval of relevant profile data using vector search
- AI-generated interview-style responses
- Support for behavioural, technical, and situational questions
- Clear documentation of design and workflow

### Team Collaboration
This repository is developed collaboratively by a 5-member team.
Each team member contributes through:
- Commits and pull requests
- Documentation updates
- Task ownership via ClickUp
- Peer reviews and feedback
- GitHub history is used to track individual contributions.
### Repository Structure
```
digital-twin-project-team2/
├── docs/                          # Documentation
│   ├── design.md                  # System architecture
│   ├── prd.md                     # Product requirements
│   ├── VECTOR_SETUP_GUIDE.md      # Vector database setup
│   ├── VECTOR_IMPLEMENTATION_SUMMARY.md
│   ├── VSCODE_AGENT_TESTING_GUIDE.md  # ⭐ Testing guide
│   ├── QUICK_TEST_CHECKLIST.md    # Quick reference
│   ├── UI_IMPLEMENTATION_SUMMARY.md   # ✨ Web UI documentation
│   ├── WEB_UI_IMPLEMENTATION_PLAN.md  # Future interview mode
│   └── WEB_UI_VS_AGENT_MODE.md    # Implementation comparison
├── data/                          # Profile data
│   ├── digitaltwin.json           # Professional profile
│   └── digitaltwin_clean.json
├── job-postings/                  # Test job postings
│   ├── job1.md, job2.md, etc.
├── scripts/                       # Python utilities
│   ├── embed_digitaltwin.py       # Load profile to vector DB
│   ├── digital_twin_rag.py        # Interactive RAG testing
│   └── verify_setup.py            # Environment verification
├── mcp-server/                    # Next.js MCP Server
│   ├── app/api/mcp/route.ts       # MCP endpoint
│   ├── lib/digital-twin.ts        # RAG logic
│   └── app/interview/page.tsx     # Web UI (optional)
├── .vscode/
│   └── mcp.json                   # VS Code MCP configuration
└── requirements.txt               # Python dependencies
```

### Quick Start Options

#### Option 1: Web UI (Interactive Browser Interface)

**Status:** ✅ Implemented locally | ⏳ Not yet deployed to Vercel

**Local Testing:**
1. Navigate to mcp-server directory:
   ```powershell
   cd mcp-server
   ```
2. Start development server:
   ```powershell
   pnpm dev
   ```
3. Open browser: `http://localhost:3000`
4. Use the interactive UI to query your digital twin

**Documentation**: See [docs/UI_IMPLEMENTATION_SUMMARY.md](docs/UI_IMPLEMENTATION_SUMMARY.md)

---

#### Option 2: VS Code Agent Mode (Developer Workflow)

**Prerequisites**:
- VS Code Insiders with GitHub Copilot
- Python 3.8+ with dependencies installed
- Vector database populated with profile data

**Quick Test**:
1. Open VS Code Insiders in this project
2. Open Copilot Chat (`Ctrl+Alt+I`)
3. Type: `@workspace Query my digital twin: "What are your skills?"`

**Detailed Testing Guide**: See [docs/VSCODE_AGENT_TESTING_GUIDE.md](docs/VSCODE_AGENT_TESTING_GUIDE.md)

**Quick Checklist**: See [docs/QUICK_TEST_CHECKLIST.md](docs/QUICK_TEST_CHECKLIST.md)


