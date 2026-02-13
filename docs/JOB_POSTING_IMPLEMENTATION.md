# Job Posting Implementation (Option 1)

## Overview

This document describes how job postings are embedded into the Upstash Vector database and accessed through the MCP server. This enables cloud-ready interview simulation and job matching functionality.

---

## Architecture

```
job-postings/*.md          (markdown job posting files)
         ↓
scripts/embed-job-postings.ts   (embedding script)
         ↓
Upstash Vector Database    (stores embeddings with metadata)
         ↓
app/actions/job-posting-actions.ts  (query functions)
         ↓
app/api/mcp/route.ts       (MCP endpoint)
         ↓
Claude Desktop/Web         (access via MCP tools)
```

---

## 1. Files Created

### A. Embedding Script
**File:** `scripts/embed-job-postings.ts`

- Reads all `.md` files from `job-postings/` directory
- Parses metadata (title, company, location, salary)
- Generates embeddings from job content
- Upserts to Upstash Vector with metadata

**Usage:**
```bash
cd mcp-server
npx ts-node scripts/embed-job-postings.ts
```

**Output:**
```
🚀 Starting job posting embedding process...

📄 Found 1 job posting file(s)

Processing: job1.md
  ✓ Title: Junior Data & Reporting Analyst
  ✓ Company: Microsoft (via Strikeforce AMC)
  ✓ Location: Sydney NSW (Hybrid)
  ✅ Embedded successfully

✨ Job posting embedding complete!
   Job postings are now accessible via MCP tool: query_job_posting
```

---

### B. Server Actions
**File:** `app/actions/job-posting-actions.ts`

Provides three query functions:

#### 1. `queryJobPostings(query: string)`
Semantic search for job postings based on keywords

**Example:**
```typescript
const result = await queryJobPostings('data analyst Sydney')
// Returns matching job postings ranked by relevance
```

#### 2. `getJobPosting(jobId: string)`
Fetch full details of specific job posting by ID

**Example:**
```typescript
const result = await getJobPosting('job_job1')
// Returns: title, company, location, salary, full job posting content
```

#### 3. `listJobPostings()`
List all available job postings in database

**Example:**
```typescript
const result = await listJobPostings()
// Returns: all job postings with summaries
```

---

### C. MCP Endpoint Updates
**File:** `app/api/mcp/route.ts`

Added 3 new MCP tools:

| Tool | Purpose | Input |
|------|---------|-------|
| `query_job_postings` | Search jobs by keywords | `query: string` |
| `get_job_posting` | Get full job details | `jobId: string` |
| `list_job_postings` | List all available jobs | None |

---

## 2. How to Use

### Step 1: Add Job Postings

Create markdown files in `job-postings/` directory:

```
job-postings/
├── job1.md          (Microsoft Data Analyst)
├── job2.md          (AWS Software Engineer)
└── job3.md          (Google Product Manager)
```

**Markdown Format:**
```markdown
# [Job Title]

**Company:** [Company Name]
**Location:** [City/Region]
**Salary:** [Range]

## About the Position
[Job description...]

## Key Responsibilities
...

## Required Qualifications
...
```

### Step 2: Run Embedding Script

```bash
cd mcp-server
npx ts-node scripts/embed-job-postings.ts
```

This uploads all job postings to Upstash Vector.

### Step 3: Query via MCP Tools

In Claude Desktop:

```
User: Search for data analyst jobs in Sydney

Claude (using MCP):
1. Calls query_job_postings("data analyst Sydney")
2. Returns: Matching job postings with match scores
```

**Or get a specific job:**

```
User: Show me the full Microsoft job posting

Claude (using MCP):
1. Calls get_job_posting("job_job1")
2. Returns: Complete job details including responsibilities and requirements
```

---

## 3. Interview Simulation With Job Postings

**Phase 1: Candidate Profile** (uses digital twin MCP tools)
```
Claude: "Let me review your background"
- Uses: get_experience, get_skills, get_projects
- Retrieves: Professional history, technical skills, portfolio
```

**Phase 2: Job Requirements** (uses job posting MCP tools)
```
Claude: "Now let me review the job requirements"
- Uses: get_job_posting("job_job1")
- Retrieves: Full job posting with responsibilities and requirements
```

**Phase 3: Structured Interview**
```
Claude: "Let's assess how well you match this role"
- Asks targeted questions based on gaps
- Uses digital twin data to validate answers
- Scores competencies against job requirements
```

**Phase 4: Assessment Report**
```
Deliverable:
- Competency Match Scores (0-100)
- HIRE / DO NOT HIRE Recommendation
- Skill Gaps Analysis
- Development Areas
```

---

## 4. Cloud Deployment (Vercel)

Once deployed to Vercel:

1. **Environment Variables** in Vercel Dashboard:
   ```
   UPSTASH_VECTOR_REST_URL=https://...
   UPSTASH_VECTOR_REST_TOKEN=...
   GROQ_API_KEY=...
   ```

2. **Embedding Script** can be run remotely:
   ```bash
   # From local machine, pointing to production env
   UPSTASH_VECTOR_REST_URL=<prod-url> \
   UPSTASH_VECTOR_REST_TOKEN=<prod-token> \
   npx ts-node scripts/embed-job-postings.ts
   ```

3. **MCP Server URL** in Claude Desktop:
   ```json
   {
     "type": "http",
     "url": "https://your-project.vercel.app/api/mcp"
   }
   ```

4. **Scaling** (Future):
   - Add more job postings
   - Support multiple job categories
   - Implement job-to-candidate matching
   - Analytics on interview outcomes

---

## 5. Key Features

✅ **Semantic Search** - Find jobs by skills/location/role type
✅ **Cloud Ready** - Same embedding/query pattern as digital twin  
✅ **Metadata Preserved** - Title, company, salary, location indexed
✅ **Extensible** - Easy to add more job postings
✅ **Fast Lookup** - Vector DB queries in ~100ms
✅ **Interview Integration** - Seamless with profile data

---

## 6. Limitations & Future Improvements

### Current Limitations
- Simple embedding generation (not ML model-based)
- No job-to-candidate skill matching algorithms
- No salary negotiation logic
- No application tracking

### Future Enhancements
1. **Advanced Embeddings** - Use OpenAI embeddings API
2. **Skill Matching** - ML-based competency gap analysis
3. **Job Recommendations** - Suggest best-fit roles
4. **Salary Analysis** - Compare offers for same role
5. **Interview Analytics** - Track outcomes across roles
6. **Multi-language Support** - Job postings in multiple languages

---

## 7. Troubleshooting

### Issue: "No job postings found"
```
✓ Check job-postings/ directory exists and has .md files
✓ Run embedding script: npx ts-node scripts/embed-job-postings.ts
✓ Verify UPSTASH credentials in .env.local
```

### Issue: "Job posting embedding script fails"
```
✓ Ensure UPSTASH_VECTOR_REST_URL and UPSTASH_VECTOR_REST_TOKEN are set
✓ Check markdown files are properly formatted
✓ Verify Upstash Vector index exists
```

### Issue: "MCP tool returns empty results"
```
✓ Confirm embedding script was run successfully
✓ Check Upstash Vector index has data
✓ Verify job posting metadata is correct
```

---

## 8. Next Steps

1. **Run Embedding Script** (once per new job posting)
   ```bash
   npx ts-node scripts/embed-job-postings.ts
   ```

2. **Test in Claude Desktop** with command:
   ```
   @workspace List all job postings
   ```

3. **Run Interview Simulation**
   ```
   @workspace Conduct interview for Junior Data Analyst role
   ```

4. **Deploy to Vercel** (Option B)
   ```bash
   git push to main branch
   Vercel auto-deploys with prod environment variables
   ```

---

**Created:** February 11, 2026  
**Status:** Ready for Implementation  
**Next Phase:** Option B - Vercel Deployment
