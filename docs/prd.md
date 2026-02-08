# Digital Twin AI Agent - Product Requirements Document

## Executive Summary

Build a personal AI agent for job interview preparation using RAG (Retrieval-Augmented Generation) technology and the Model Context Protocol (MCP). This digital twin system will enable users to practice realistic interview scenarios by leveraging their comprehensive professional profile data integrated with AI-powered semantic search and natural language generation.

**Version:** 1.0  
**Date:** January 20, 2026  
**Status:** Development

---

## 1. Product Overview

### 1.1 Vision

Create an intelligent, production-ready digital twin AI agent that serves as a personal interview preparation assistant. The system will understand a user's professional background, skills, and experiences, then provide realistic, personalized interview coaching through multiple interface channels (VS Code, Claude Desktop, and web).

### 1.2 Core Value Proposition

- **Personalized Interview Preparation**: AI agent answers interview questions as if representing the user, drawing from their actual professional data
- **RAG-Powered Intelligence**: Combines semantic search with large language models to provide contextual, accurate responses
- **Multi-Channel Access**: Accessible via VS Code GitHub Copilot, Claude Desktop, and web deployment
- **Production-Ready**: Enterprise-grade MCP server with deployment to Vercel for 24/7 availability
- **Intelligent Coaching**: LLM-enhanced responses provide interview-specific formatting and guidance

### 1.3 Target Users

- Job seekers preparing for interviews (entry-level to senior positions)
- Career changers needing interview coaching
- Professionals practicing for specific role types (technical, behavioral, executive)
- Recruiters using the system for candidate assessments

---

## 2. Core Features

### 2.1 Feature Set - Phase 1 (MVP)

#### 2.1.1 Professional Profile Management
- Create and maintain comprehensive digitaltwin.json containing:
  - Personal information and professional summary
  - Work experience with quantified achievements
  - Technical and soft skills with proficiency levels
  - Education and certifications
  - Projects and portfolio work
  - Career goals and aspirations
  - Salary and location preferences
  - Interview preparation resources and Q&A patterns

#### 2.1.2 RAG System Implementation
- **Vector Database Integration** (Upstash Vector):
  - Semantic search across professional profile data
  - Built-in embedding models for automatic vectorization
  - Production-grade vector storage with REST API
  
- **LLM Integration** (Groq):
  - Ultra-fast inference with Llama 3.1 models
  - Query generation and response formatting
  - Interview-context aware responses

#### 2.1.3 MCP Server Implementation
- **Next.js-based MCP Server**:
  - Model Context Protocol compatible endpoints
  - Server actions for AI integration
  - JSON-RPC 2.0 response format compliance
  - Production deployment via Vercel

#### 2.1.4 Multi-Channel Integration
- **VS Code GitHub Copilot Integration**:
  - .vscode/mcp.json configuration
  - Direct access through @workspace commands
  - Real-time interview simulation
  
- **Claude Desktop Integration**:
  - MCP server integration via mcp-remote tunnel
  - Natural conversation interface for practice
  - Persistent context across questions

#### 2.1.5 Interview Simulation & Testing
- **Job Posting Analysis**:
  - Import real job postings from Seek.com.au
  - Analyze job requirements against profile
  - Identify skills gaps
  
- **Multi-Persona Interview Simulation**:
  - HR/Recruiter screening questions
  - Technical interview assessment
  - Hiring manager conversations
  - Project manager collaboration evaluation
  - Executive cultural fit assessment
  - Leadership potential evaluation

---

### 2.2 Feature Set - Phase 2 (Enhancement)

#### 2.2.1 LLM-Enhanced RAG
- **Query Preprocessing**:
  - Intelligent query enhancement with intent understanding
  - Synonym expansion for better search accuracy
  - Interview context adaptation
  
- **Response Post-Processing**:
  - STAR format (Situation-Task-Action-Result) application
  - Interview-specific language and confidence building
  - Quantification of achievements
  - Coaching and presentation guidance

#### 2.2.2 Advanced Configuration
- **Interview-Type-Specific Optimization**:
  - Configurable prompts for different interview scenarios
  - Context-aware response generation
  - Industry-specific language and examples
  
- **Performance Monitoring**:
  - Response time tracking
  - Token usage monitoring
  - Quality metrics collection
  - Cost optimization tracking

#### 2.2.3 Extended Integration
- **Calendar Integration**:
  - Prepare for specific upcoming interviews
  - Automated preparation schedules
  
- **Job Board APIs**:
  - Real-time job posting analysis
  - Skills gap identification
  - Personalized recommendations

---

## 3. Technical Architecture

### 3.1 Technology Stack

| Component | Technology | Purpose |
|-----------|-----------|---------|
| **Frontend** | Next.js 15.5.3+ with TypeScript | MCP Server interface and UI |
| **Styling** | Tailwind CSS + ShadCN | Production-grade UI components |
| **Backend** | Next.js Server Actions | RAG processing and AI integration |
| **Vector DB** | Upstash Vector | Semantic search and embeddings |
| **LLM** | Groq (Llama 3.1) | Fast inference for queries and responses |
| **Deployment** | Vercel | Production hosting with auto-scaling |
| **Python** | Python 3.8+ | Local RAG implementation and data preparation |
| **MCP Protocol** | Model Context Protocol | AI agent integration standard |
| **IDE Integration** | VS Code Insiders | GitHub Copilot Agent mode support |

### 3.2 System Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                     User Interfaces                          │
├─────────────────────────────────────────────────────────────┤
│  VS Code Copilot  │  Claude Desktop  │  Web Browser          │
└──────────┬─────────────┬──────────────────┬──────────────────┘
           │             │                  │
           └─────────────┼──────────────────┘
                         │
          ┌──────────────▼───────────────┐
          │   MCP Server (Next.js)       │
          │  - Server Actions            │
          │  - JSON-RPC Endpoints        │
          │  - Error Handling            │
          └──────────────┬───────────────┘
                         │
        ┌────────────────┼────────────────┐
        │                │                │
   ┌────▼────┐    ┌─────▼─────┐   ┌─────▼────┐
   │  RAG    │    │   LLM     │   │ Vector   │
   │Pipeline │    │ Processing│   │ Search   │
   └────┬────┘    └─────┬─────┘   └─────┬────┘
        │                │              │
   ┌────▼─────────────────▼──────────────▼──────┐
   │  External Services                         │
   ├───────────────────────────────────────────┤
   │ Groq API (LLM) │ Upstash Vector (Search) │
   └───────────────────────────────────────────┘
```

### 3.3 Data Flow

```
User Question
    │
    ▼
[Query Enhancement] (LLM)
    │
    ▼
[Vector Search] (Upstash)
    │
    ▼
[Context Retrieval]
    │
    ▼
[Response Formatting] (LLM)
    │
    ▼
Interview-Ready Response
```

---

## 4. System Requirements

### 4.1 Functional Requirements

#### 4.1.1 Digital Twin Profile Management (FR-1)
- **FR-1.1**: User can create digitaltwin.json with comprehensive professional profile
- **FR-1.2**: JSON structure supports 15+ data categories (personal, experience, skills, education, projects, goals, interview prep)
- **FR-1.3**: System validates JSON structure and provides error feedback
- **FR-1.4**: User can update profile with new experiences, skills, and achievements
- **FR-1.5**: Profile data is encrypted and securely stored

#### 4.1.2 Vector Database Integration (FR-2)
- **FR-2.1**: System connects to Upstash Vector Database using REST API
- **FR-2.2**: Automatically embeds profile content using Upstash built-in embeddings
- **FR-2.3**: Stores up to 1000+ vectors with metadata (title, type, category, tags)
- **FR-2.4**: Performs semantic search with top-k retrieval (configurable, default k=3)
- **FR-2.5**: Returns search results with relevance scores

#### 4.1.3 RAG Query Processing (FR-3)
- **FR-3.1**: System accepts natural language questions from users
- **FR-3.2**: Optionally enhances queries using LLM for intent understanding
- **FR-3.3**: Performs vector search against professional profile
- **FR-3.4**: Retrieves relevant context from search results
- **FR-3.5**: Generates contextual responses using Groq LLM
- **FR-3.6**: Formats responses for interview context with STAR methodology
- **FR-3.7**: Returns response with metadata (search results count, relevance scores)

#### 4.1.4 MCP Server Implementation (FR-4)
- **FR-4.1**: Server implements Model Context Protocol specification
- **FR-4.2**: Exposes /api/mcp endpoint accepting JSON-RPC 2.0 requests
- **FR-4.3**: Supports required MCP methods: initialize, ping, query_digital_twin
- **FR-4.4**: Returns properly formatted MCP responses with status and data
- **FR-4.5**: Handles errors gracefully with meaningful error messages
- **FR-4.6**: Supports concurrent requests with proper rate limiting

#### 4.1.5 Multi-Channel Integration (FR-5)
- **FR-5.1**: VS Code configuration (.vscode/mcp.json) enables GitHub Copilot access
- **FR-5.2**: GitHub Copilot can query MCP server with @workspace commands
- **FR-5.3**: Claude Desktop can connect via mcp-remote tunnel
- **FR-5.4**: Web interface accessible at deployed Vercel URL
- **FR-5.5**: All channels return consistent response format

#### 4.1.6 Interview Simulation (FR-6)
- **FR-6.1**: System accepts job posting files (markdown format)
- **FR-6.2**: Analyzes job requirements against user profile
- **FR-6.3**: Simulates recruiter screening interview (5 questions, 15 mins)
- **FR-6.4**: Conducts technical assessment (4-5 questions, 45 mins)
- **FR-6.5**: Performs cultural fit evaluation (4-5 questions, 20 mins)
- **FR-6.6**: Provides comprehensive assessment report with scores (1-10 scale)
- **FR-6.7**: Identifies skills gaps and improvement areas

#### 4.1.7 Error Handling & Resilience (FR-7)
- **FR-7.1**: Graceful fallback to basic RAG if LLM enhancement fails
- **FR-7.2**: Handles API rate limiting with retry logic
- **FR-7.3**: Validates environment variables at startup
- **FR-7.4**: Provides meaningful error messages for debugging
- **FR-7.5**: Monitors system health and logs errors

### 4.2 Non-Functional Requirements

#### 4.2.1 Performance (NFR-1)
- **NFR-1.1**: Query response time < 5 seconds (95th percentile)
- **NFR-1.2**: Vector search < 1 second for average profile
- **NFR-1.3**: LLM inference < 3 seconds for response generation
- **NFR-1.4**: MCP endpoint response time < 6 seconds

#### 4.2.2 Scalability (NFR-2)
- **NFR-2.1**: Support 100+ concurrent users without degradation
- **NFR-2.2**: Vector database scales to 10,000+ documents
- **NFR-2.3**: Efficient token management for LLM API calls
- **NFR-2.4**: Horizontal scaling via Vercel

#### 4.2.3 Reliability (NFR-3)
- **NFR-3.1**: 99.9% uptime SLA for deployed MCP server
- **NFR-3.2**: Automatic recovery from transient failures
- **NFR-3.3**: Data persistence and backup in Upstash Vector
- **NFR-3.4**: Zero data loss on application restart

#### 4.2.4 Security (NFR-4)
- **NFR-4.1**: All API keys stored in environment variables
- **NFR-4.2**: HTTPS/TLS for all network communication
- **NFR-4.3**: No sensitive data logged or exposed
- **NFR-4.4**: CORS properly configured for web access
- **NFR-4.5**: Request validation and sanitization

#### 4.2.5 Usability (NFR-5)
- **NFR-5.1**: Clear error messages for user action
- **NFR-5.2**: Documentation for all configuration steps
- **NFR-5.3**: Setup wizard or automation for environment setup
- **NFR-5.4**: Intuitive interfaces in both CLI and web UI

#### 4.2.6 Maintainability (NFR-6)
- **NFR-6.1**: TypeScript strict mode throughout
- **NFR-6.2**: Code coverage > 80% for critical paths
- **NFR-6.3**: Clear separation of concerns (RAG, LLM, MCP layers)
- **NFR-6.4**: Comprehensive logging for debugging
- **NFR-6.5**: Documented API contracts and interfaces

---

## 5. User Workflows

### 5.1 Initial Setup Workflow

```
1. Install Prerequisites
   ├─ VS Code Insiders with GitHub Copilot Agent mode
   ├─ Python 3.8+ with pip
   ├─ Node.js and pnpm
   └─ Claude Desktop application

2. Environment Configuration
   ├─ Create project directory
   ├─ Set up .env file with API keys
   │  ├─ UPSTASH_VECTOR_REST_URL
   │  ├─ UPSTASH_VECTOR_REST_TOKEN
   │  └─ GROQ_API_KEY
   └─ Test all integrations

3. Profile Creation
   ├─ Create digitaltwin.json
   ├─ Add personal information
   ├─ Document work experiences (STAR format)
   ├─ List technical and soft skills
   ├─ Include projects and achievements
   └─ Structure content chunks for embedding

4. RAG System Setup
   ├─ Create Python RAG application
   ├─ Embed profile into Upstash Vector
   ├─ Test semantic search functionality
   └─ Verify LLM integration with Groq

5. MCP Server Development
   ├─ Create Next.js project
   ├─ Create agents.md for Copilot context
   ├─ Implement MCP endpoints
   ├─ Integrate RAG pipeline
   └─ Test locally with Copilot

6. Deployment
   ├─ Create GitHub repository
   ├─ Push code to GitHub
   ├─ Deploy to Vercel
   ├─ Configure Vercel environment variables
   └─ Test production endpoints
```

### 5.2 Interview Preparation Workflow

```
1. Find Job Posting
   ├─ Browse Seek.com.au
   ├─ Select relevant position
   └─ Copy job details

2. Create Job File
   ├─ Save job posting to /job-postings/job1.md
   ├─ Include all requirements and description
   └─ Verify completeness

3. Run Interview Simulation
   ├─ Open VS Code or Claude Desktop
   ├─ Launch MCP server
   ├─ Run interview simulation prompt
   └─ Get comprehensive feedback

4. Receive Assessment
   ├─ Recruiter screening feedback
   ├─ Technical competency scores
   ├─ Behavioral assessment
   ├─ Overall suitability score
   └─ Gap analysis

5. Profile Refinement
   ├─ Update digitaltwin.json based on feedback
   ├─ Add missing information
   ├─ Enhance weak areas
   ├─ Re-embed profile to vector DB
   └─ Re-test with updated data

6. Iterate & Improve
   ├─ Test with different job postings
   ├─ Practice with different interviewer personas
   ├─ Track improvements across simulations
   └─ Build confidence for real interviews
```

### 5.3 Daily Interview Practice Workflow

```
1. Open Claude Desktop or VS Code
2. Launch Interview Simulation
   ├─ Choose interview type (technical, behavioral, executive)
   ├─ Provide job context if available
   └─ Select interviewer persona

3. Conduct Practice Interview
   ├─ Answer interviewer questions
   ├─ Get real-time coaching feedback
   ├─ Practice storytelling and presentation
   └─ Refine answers based on guidance

4. Review Performance
   ├─ Assess response quality
   ├─ Identify weak areas
   ├─ Note improvements needed
   └─ Track progress over time

5. Refine & Prepare
   ├─ Update profile with new achievements
   ├─ Practice problem areas
   ├─ Build confidence in responses
   └─ Prepare for real interviews
```

---

## 6. Data Models

### 6.1 Digital Twin Profile (digitaltwin.json)

```json
{
  "personal": {
    "name": "string",
    "title": "string",
    "location": "string",
    "summary": "string",
    "elevator_pitch": "string",
    "contact": {
      "email": "string",
      "linkedin": "string",
      "github": "string",
      "portfolio": "string"
    }
  },
  "salary_location": {
    "current_salary": "string",
    "salary_expectations": "string",
    "location_preferences": ["string"],
    "relocation_willing": "boolean",
    "remote_experience": "string",
    "travel_availability": "string",
    "work_authorization": "string"
  },
  "experience": [
    {
      "company": "string",
      "title": "string",
      "duration": "string",
      "company_context": "string",
      "team_structure": "string",
      "achievements_star": [
        {
          "situation": "string",
          "task": "string",
          "action": "string",
          "result": "string"
        }
      ],
      "technical_skills_used": ["string"],
      "leadership_examples": ["string"],
      "budget_managed": "string",
      "team_size_managed": "number"
    }
  ],
  "skills": {
    "technical": {
      "programming_languages": [
        {
          "language": "string",
          "years": "number",
          "proficiency": "string",
          "frameworks": ["string"]
        }
      ],
      "databases": ["string"],
      "cloud_platforms": ["string"],
      "ai_ml": ["string"]
    },
    "soft_skills": ["string"],
    "certifications": ["string"]
  },
  "education": {
    "university": "string",
    "degree": "string",
    "graduation_year": "number",
    "gpa": "string",
    "relevant_coursework": ["string"],
    "thesis_project": "string"
  },
  "projects_portfolio": [
    {
      "name": "string",
      "description": "string",
      "technologies": ["string"],
      "impact": "string",
      "github_url": "string",
      "live_demo": "string"
    }
  ],
  "career_goals": {
    "short_term": "string",
    "long_term": "string",
    "learning_focus": ["string"],
    "industries_interested": ["string"]
  },
  "interview_prep": {
    "common_questions": {
      "behavioral": ["string"],
      "technical": ["string"],
      "situational": ["string"],
      "company_research": {
        "research_areas": ["string"],
        "preparation_questions": ["string"]
      }
    },
    "weakness_mitigation": [
      {
        "weakness": "string",
        "mitigation": "string"
      }
    ]
  },
  "professional_development": {
    "recent_learning": ["string"],
    "conferences_attended": ["string"],
    "publications": ["string"],
    "open_source": ["string"]
  },
  "content_chunks": [
    {
      "id": "string",
      "title": "string",
      "type": "string",
      "content": "string",
      "metadata": {
        "category": "string",
        "tags": ["string"]
      }
    }
  ]
}
```

### 6.2 Vector Database Record

```json
{
  "id": "string",
  "text": "string (embedded)",
  "metadata": {
    "title": "string",
    "type": "string",
    "content": "string",
    "category": "string",
    "tags": ["string"]
  }
}
```

### 6.3 MCP Server Request/Response

```json
{
  "jsonrpc": "2.0",
  "method": "query_digital_twin",
  "params": {
    "question": "string",
    "interview_type": "string (optional)",
    "model": "string (optional)"
  },
  "id": "string|number"
}
```

```json
{
  "jsonrpc": "2.0",
  "result": {
    "response": "string",
    "metadata": {
      "vectors_searched": "number",
      "relevance_scores": ["number"],
      "processing_time": "number"
    }
  },
  "id": "string|number"
}
```

---

## 7. API Specifications

### 7.1 MCP Server Endpoints

#### 7.1.1 Query Digital Twin
**Endpoint**: `/api/mcp`  
**Method**: POST  
**Protocol**: JSON-RPC 2.0

**Request:**
```json
{
  "jsonrpc": "2.0",
  "method": "query_digital_twin",
  "params": {
    "question": "Tell me about your work experience",
    "interview_type": "behavioral",
    "top_k": 3,
    "use_enhancement": true
  },
  "id": 1
}
```

**Response (Success):**
```json
{
  "jsonrpc": "2.0",
  "result": {
    "response": "Based on my professional background...",
    "metadata": {
      "vectors_retrieved": 3,
      "relevance_scores": [0.92, 0.87, 0.81],
      "processing_time_ms": 2450,
      "model_used": "llama-3.1-70b-versatile"
    }
  },
  "id": 1
}
```

**Response (Error):**
```json
{
  "jsonrpc": "2.0",
  "error": {
    "code": -32600,
    "message": "Invalid request parameters",
    "data": {
      "details": "question parameter is required"
    }
  },
  "id": 1
}
```

#### 7.1.2 Initialize Server
**Endpoint**: `/api/mcp`  
**Method**: POST  
**Protocol**: JSON-RPC 2.0

**Request:**
```json
{
  "jsonrpc": "2.0",
  "method": "initialize",
  "params": {},
  "id": 1
}
```

**Response:**
```json
{
  "jsonrpc": "2.0",
  "result": {
    "server_name": "digital-twin-mcp",
    "version": "1.0.0",
    "capabilities": ["query_digital_twin", "list_skills", "interview_simulation"]
  },
  "id": 1
}
```

### 7.2 External API Integration

#### 7.2.1 Upstash Vector API
- **Base URL**: `https://your-region.upstash.io`
- **Authentication**: Bearer token in Authorization header
- **Methods Used**:
  - `POST /query`: Semantic search with embeddings
  - `POST /upsert`: Store vectors with metadata
  - `GET /info`: Get database statistics

#### 7.2.2 Groq API
- **Base URL**: `https://api.groq.com/openai/v1`
- **Authentication**: Bearer token via API key
- **Models Used**:
  - `llama-3.1-8b-instant`: Fast query enhancement (600+ tokens/sec)
  - `llama-3.1-70b-versatile`: Detailed response formatting (500+ tokens/sec)

---

## 8. Development Phases

### Phase 1: MVP (Weeks 1-4)
**Goal**: Core RAG + MCP server foundation

**Deliverables**:
- [ ] Digital twin JSON structure and documentation
- [ ] Python RAG implementation with Upstash Vector + Groq
- [ ] Next.js MCP server with basic query endpoint
- [ ] VS Code integration (.vscode/mcp.json)
- [ ] Local testing and validation

**Success Criteria**:
- Can embed profile data into vector database
- RAG queries return relevant results
- MCP server responds to queries correctly
- VS Code Copilot can access MCP server

### Phase 2: Multi-Channel Integration (Weeks 5-6)
**Goal**: Full platform accessibility

**Deliverables**:
- [ ] Claude Desktop integration via mcp-remote
- [ ] Interview simulation framework
- [ ] Job posting analysis tools
- [ ] Assessment reporting system

**Success Criteria**:
- Claude Desktop can query MCP server seamlessly
- Interview simulations execute with 5+ persona types
- Assessment reports provide actionable feedback
- All channels return consistent responses

### Phase 3: Production Deployment (Weeks 7-8)
**Goal**: Live 24/7 service

**Deliverables**:
- [ ] GitHub repository with CI/CD
- [ ] Vercel deployment with auto-scaling
- [ ] Environment configuration for production
- [ ] Monitoring and logging setup

**Success Criteria**:
- MCP server deployed to Vercel
- 99.9% uptime and < 5 second response times
- Automatic deployments on code changes
- Accessible from any device/location

### Phase 4: Advanced Features (Weeks 9-12)
**Goal**: LLM-enhanced RAG and optimizations

**Deliverables**:
- [ ] Query preprocessing with intent enhancement
- [ ] Response post-processing with STAR formatting
- [ ] Performance monitoring and metrics
- [ ] Cost optimization and caching

**Success Criteria**:
- Enhanced RAG improves response quality 60-80%
- Interview-specific formatting applied automatically
- Performance monitoring tracks all key metrics
- Token usage optimized for cost

---

## 9. Success Metrics

### 9.1 Functional Metrics
- **Profile Data Coverage**: 100% of target categories populated
- **Vector Search Accuracy**: > 85% relevant document retrieval
- **Response Quality Score**: 8+/10 in user testing
- **Interview Simulation Completion**: 95%+ of sessions complete successfully
- **Assessment Report Usefulness**: 8+/10 user satisfaction

### 9.2 Performance Metrics
- **API Response Time**: < 5 seconds (95th percentile)
- **Vector Search Time**: < 1 second
- **LLM Processing Time**: < 3 seconds
- **Uptime**: 99.9%
- **Error Rate**: < 0.5%

### 9.3 User Engagement Metrics
- **Interview Simulations Run**: Target 10+ per user/week
- **Profile Update Frequency**: 1-2 updates per week
- **Job Posting Analysis Usage**: 3+ job postings tested per user
- **Assessment Report Application**: 70%+ incorporate feedback

### 9.4 Business Metrics
- **User Retention**: 80%+ 30-day retention
- **Feature Adoption**: 90%+ adoption of core features
- **Referral Rate**: 30%+ of users refer others
- **ROI**: Measurable improvement in interview outcomes

---

## 10. Risk Assessment & Mitigation

| Risk | Impact | Probability | Mitigation |
|------|--------|-------------|-----------|
| API Rate Limits (Groq/Upstash) | High | Medium | Implement caching, queue system, consider paid tiers |
| Profile Data Gaps | Medium | Medium | Auto-fill suggestions, guided wizard, validation |
| LLM Hallucination | Medium | Medium | Ground LLM in actual profile data, use lower temperature |
| Performance Degradation | High | Low | Monitoring, auto-scaling, query optimization |
| Security Vulnerabilities | High | Low | Regular audits, CORS, input validation, secrets management |
| User Privacy Concerns | Medium | Medium | Encryption, clear privacy policy, data retention limits |

---

## 11. Appendices

### 11.1 Technology References
- **Upstash Vector**: https://upstash.com/docs/vector
- **Groq Console**: https://console.groq.com
- **Model Context Protocol**: https://modelcontextprotocol.io
- **Next.js Documentation**: https://nextjs.org/docs
- **Vercel Deployment**: https://vercel.com/docs

### 11.2 Interview Preparation Resources
- **STAR Method Guide**: Situation-Task-Action-Result framework
- **Behavioral Interview Questions**: Common patterns and responses
- **Technical Interview Patterns**: System design, coding challenges
- **Salary Negotiation Guide**: Research, positioning, tactics

### 11.3 Example Prompts
- Technical: "What are the most important technical skills for a Senior Developer role?"
- Behavioral: "Tell me about a time you had to handle a difficult team situation"
- Executive: "How would you approach leading a technical transformation initiative?"
- Situational: "What would you do if you discovered a critical production bug?"

### 11.4 Configuration Examples

**Environment Variables (.env.local)**:
```bash
UPSTASH_VECTOR_REST_URL=https://YOUR-REGION-YOUR-ID.upstash.io
UPSTASH_VECTOR_REST_TOKEN=YOUR_UPSTASH_TOKEN
GROQ_API_KEY=YOUR_GROQ_API_KEY
```

**MCP Configuration (.vscode/mcp.json)**:
```json
{
  "servers": {
    "digital-twin-mcp": {
      "type": "http",
      "url": "http://localhost:3000/api/mcp",
      "timeout": 30000
    }
  }
}
```

---

## 12. Glossary

- **RAG**: Retrieval-Augmented Generation - combining vector search with LLM
- **MCP**: Model Context Protocol - standard for AI agent integration
- **Vector Database**: Stores embeddings for semantic search
- **Semantic Search**: Finding similar content based on meaning, not keywords
- **Embedding**: Numerical representation of text for similarity comparison
- **STAR**: Situation-Task-Action-Result interview storytelling framework
- **LLM**: Large Language Model (e.g., Groq, Claude, GPT)
- **Token**: Individual words or subwords used by LLMs

---

## Document Control

| Version | Date | Author | Changes |
|---------|------|--------|---------|
| 1.0 | Jan 20, 2026 | AI Agent | Initial PRD based on Digital Twin Workshop |
| | | | |

---

**Document Status**: APPROVED FOR DEVELOPMENT  
**Last Updated**: January 20, 2026  
**Next Review**: Upon completion of Phase 1
