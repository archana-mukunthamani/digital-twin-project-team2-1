# Web UI Implementation Plan
## Digital Twin Interview System - Web Variant

**Date:** February 16, 2026  
**Goal:** Build a web UI that replicates the VS Code Agent Mode interview functionality  
**Status:** Planning Phase

---

## Executive Summary

This document outlines the complete architecture for a web-based interview system that mirrors the functionality currently available in VS Code Agent Mode. The web UI will enable users to:

1. Select or paste job descriptions
2. Start AI-powered behavioral interviews
3. Answer questions in real-time
4. Receive instant feedback based on their digital twin profile
5. Get comprehensive assessment reports with recommendations

---

## Current State (Agent Mode)

### What Works Now

**User Workflow:**
```
1. User opens VS Code Copilot Chat
2. User: "@workspace Interview me for job-postings/job1.md"
3. AI Agent:
   - Reads job1.md (Data Analyst role requirements)
   - Calls query_digital_twin("What are your data analysis skills?")
   - Analyzes profile match vs job requirements
   - Generates Question 1: "Tell me about your SQL experience in cloud platforms..."
4. User provides answer
5. AI Agent:
   - Evaluates answer against profile
   - Calls query_digital_twin again for verification
   - Provides feedback
   - Generates Question 2 based on previous answer
6. Process repeats for 5-7 questions
7. Final Report: Pass/Fail + Gap Analysis + Recommendations
```

**Technical Flow:**
```
VS Code Copilot → HTTP → /api/mcp → query_digital_twin → Upstash Vector + Groq → Response
```

---

## Target State (Web UI)

### Required User Experience

**User Workflow (Autonomous AI Interview Simulation):**
```
1. User visits https://your-app.vercel.app
2. Landing page: "Digital Twin Interview Simulator"
3. User selects job role from dropdown OR pastes job description
4. Click "Start Interview"
5. AI automatically begins simulation:
   ─────────────────────────────────────────
   📊 Analyzing job requirements...
   🔍 Querying your digital twin profile...
   💭 Generating interview questions...
   ✅ Ready to simulate!
   ─────────────────────────────────────────
   
6. Question 1 appears:
   ❓ "Can you describe your experience with SQL in cloud data warehouses?"
   
   [AI is generating answer from your profile...]
   
   💬 Your Digital Twin's Answer:
   "In my previous role at XYZ company, I worked extensively with..."
   [Full answer generated from Upstash Vector embeddings]
   
7. Instant Evaluation appears:
   ✅ Strengths: Mentioned specific platforms, provided metrics
   ⚠️ Areas to improve: Could elaborate on optimization
   📊 Score: 8.5/10
   
8. Auto-advance to Question 2 (or manual "Next")
9. Process repeats for 5-7 questions (ALL automated)
10. Final screen:
    - Overall Score: 85%
    - Pass/Fail determination
    - Skills matched vs required
    - Gap analysis
    - Personalized recommendations
    - Option to download PDF report
    - Share interview simulation results
11. User can retry with different job posting
```

**Key Difference from Original Plan:**
- ❌ User does NOT type answers
- ✅ AI generates BOTH questions AND answers from profile
- ✅ Demonstrates interview readiness automatically
- ✅ User just selects job and watches simulation

---

## Architecture Design

### System Components

```
┌─────────────────────────────────────────────────────────────┐
│                      WEB BROWSER                            │
│                                                              │
│  ┌────────────────────────────────────────────────────┐     │
│  │  React Frontend (Next.js App Router)               │     │
│  │  - Job Selection Page                              │     │
│  │  - Interview Page (Q&A Interface)                  │     │
│  │  - Results Dashboard                               │     │
│  │  Components: ShadCN UI + Dark Mode                 │     │
│  └────────────────────────────────────────────────────┘     │
│                        │                                     │
│                        ▼ (API Calls)                         │
└────────────────────────│─────────────────────────────────────┘
                         │
                         ▼
┌─────────────────────────────────────────────────────────────┐
│              BACKEND API (Next.js API Routes)               │
│                                                              │
│  ┌──────────────────────────────────────────────────────┐   │
│  │ /api/interview/start                                 │   │
│  │ - Input: jobDescription, jobRole                     │   │
│  │ - Creates session                                    │   │
│  │ - Queries digital twin for profile                   │   │
│  │ - Generates interview plan                           │   │
│  │ - Returns: sessionId, question1                      │   │
│  └──────────────────────────────────────────────────────┘   │
│                                                              │
│  ┌──────────────────────────────────────────────────────┐   │
│  │ /api/interview/answer                                │   │
│  │ - Input: sessionId, questionId, userAnswer           │   │
│  │ - Validates answer against profile                   │   │
│  │ - Scores response                                    │   │
│  │ - Generates next question                            │   │
│  │ - Returns: feedback, score, nextQuestion             │   │
│  └──────────────────────────────────────────────────────┘   │
│                                                              │
│  ┌──────────────────────────────────────────────────────┐   │
│  │ /api/interview/report                                │   │
│  │ - Input: sessionId                                   │   │
│  │ - Generates final assessment                         │   │
│  │ - Returns: overall score, gaps, recommendations      │   │
│  └──────────────────────────────────────────────────────┘   │
│                                                              │
│  ┌──────────────────────────────────────────────────────┐   │
│  │ Interview Orchestrator Service                       │   │
│  │ - Manages interview state and flow                   │   │
│  │ - Calls existing ragQuery() internally               │   │
│  │ - Uses Groq API for question generation              │   │
│  │ - Applies scoring algorithms                         │   │
│  └──────────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────────┘
                         │
                         ▼ (Reuses Existing)
┌─────────────────────────────────────────────────────────────┐
│            EXISTING INFRASTRUCTURE (No Changes)             │
│                                                              │
│  ┌─────────────────┐  ┌──────────────────┐                 │
│  │ lib/            │  │ /api/mcp/route.ts│                 │
│  │ digital-twin.ts │  │ (Keep for agents)│                 │
│  │ - ragQuery()    │  └──────────────────┘                 │
│  │ - queryVectors()│                                        │
│  │ - generateResp()│                                        │
│  └─────────────────┘                                        │
│           │                                                 │
│           ▼                                                 │
│  ┌──────────────────┐     ┌─────────────────┐              │
│  │ Upstash Vector   │     │   Groq API      │              │
│  │ (RAG Search)     │     │   (LLM)         │              │
│  └──────────────────┘     └─────────────────┘              │
└─────────────────────────────────────────────────────────────┘
```

---

## File Structure

### New Files to Create

```
mcp-server/
├── app/
│   ├── interview/                    # ✅ NEW - Interview pages
│   │   ├── page.tsx                  # Job selection page
│   │   ├── [sessionId]/              
│   │   │   └── page.tsx              # Active interview page
│   │   └── results/
│   │       └── [sessionId]/
│   │           └── page.tsx          # Results page
│   │
│   ├── api/
│   │   ├── interview/                # ✅ NEW - Interview API
│   │   │   ├── start/
│   │   │   │   └── route.ts          # Start interview
│   │   │   ├── answer/
│   │   │   │   └── route.ts          # Submit answer
│   │   │   ├── next-question/
│   │   │   │   └── route.ts          # Get next question
│   │   │   └── report/
│   │   │       └── route.ts          # Generate final report
│   │   │
│   │   └── mcp/
│   │       └── route.ts              # ✅ KEEP - Existing MCP endpoint
│   │
│   └── components/                   # ✅ NEW - UI Components
│       └── interview/
│           ├── JobSelector.tsx       # Job role selection
│           ├── QuestionCard.tsx      # Question display
│           ├── AIAnswerDisplay.tsx   # Shows AI-generated answer with animation
│           ├── FeedbackPanel.tsx     # Evaluation display
│           ├── ProgressBar.tsx       # Simulation progress
│           ├── SimulationPlayer.tsx  # Controls playback of simulation
│           └── ResultsDashboard.tsx  # Final report
│
├── lib/
│   ├── digital-twin.ts               # ✅ KEEP - No changes
│   ├── interview-orchestrator.ts     # ✅ NEW - Interview logic
│   ├── interview-session.ts          # ✅ NEW - Session management
│   └── scoring.ts                    # ✅ NEW - Answer scoring
│
└── types/
    └── interview.ts                  # ✅ NEW - TypeScript types
```

### Existing Files (No Changes)

```
✅ lib/digital-twin.ts           # Reuse as-is
✅ app/api/mcp/route.ts          # Keep for agent mode
✅ app/globals.css               # Extend with interview styles
✅ data/digitaltwin_clean.json   # Profile data (unchanged)
```

---

## Data Models

### TypeScript Types

```typescript
// types/interview.ts

export interface InterviewSession {
  id: string
  userId?: string
  jobRole: string
  jobDescription: string
  status: 'active' | 'completed' | 'abandoned'
  startTime: Date
  endTime?: Date
  currentQuestionIndex: number
  questions: InterviewQuestion[]
  answers: InterviewAnswer[]
  profileSummary: ProfileSummary
  finalScore?: number
  assessment?: FinalAssessment
}

export interface InterviewQuestion {
  id: string
  questionNumber: number
  category: 'experience' | 'technical' | 'behavioral' | 'situational'
  question: string
  expectedElements: string[]  // Key points from profile
  aiGeneratedAnswer?: string  // ✅ AI answer from profile
  maxScore: number
  generatedAt: Date
}

export interface InterviewAnswer {
  questionId: string
  userAnswer: string
  submittedAt: Date
  score: number
  feedback: AnswerFeedback
}

export interface AnswerFeedback {
  strengths: string[]
  missing: string[]
  suggestions: string[]
  score: number
  detailedAnalysis: string
}

export interface ProfileSummary {
  relevantExperience: string[]
  keySkills: string[]
  projects: string[]
  education: string[]
  careerGoals: string[]
}

export interface FinalAssessment {
  overallScore: number
  passed: boolean
  threshold: number
  categoryScores: {
    experience: number
    technical: number
    behavioral: number
    situational: number
  }
  gapAnalysis: {
    requiredSkills: string[]
    presentedSkills: string[]
    missingSkills: string[]
  }
  recommendations: string[]
  strengths: string[]
  areasForImprovement: string[]
}

export interface JobRequirements {
  role: string
  requiredSkills: string[]
  responsibilities: string[]
  qualifications: string[]
  niceToHave: string[]
}
```

---

## API Endpoints Specification

### 1. Start Interview & Run Simulation

**Endpoint:** `POST /api/interview/simulate`

**Request:**
```json
{
  "jobRole": "Data Analyst",
  "jobDescription": "Full job description text...",
  "jobSource": "job-postings/job1.md" // optional
}
```

**Process:**
1. Parse job requirements (extract skills, responsibilities)
2. Query digital twin for comprehensive profile:
   - Call `ragQuery("What is your work experience?")`
   - Call `ragQuery("What are your technical skills?")`
   - Call `ragQuery("Tell me about your projects")`
3. Analyze match between profile and job requirements
4. Generate 5-7 interview questions targeting required skills
5. **FOR EACH QUESTION:**
   - Generate answer using `ragQuery(question)` with interview context
   - Evaluate answer against job requirements
   - Score the response
   - Extract strengths and gaps
6. Generate final assessment report
7. Store complete simulation results

**Response:**
```json
{
  "success": true,
  "sessionId": "uuid-session-id",
  "simulationComplete": true,
  "profileSummary": {
    "relevantExperience": ["3 years in data analysis", "SQL expertise"],
    "keySkills": ["Python", "SQL", "Tableau", "AWS"],
    "matchScore": 78
  },
  "questionsAndAnswers": [
    {
      "id": "q1",
      "questionNumber": 1,
      "category": "technical",
      "question": "Can you describe your experience working with SQL in cloud data warehouses like Snowflake or BigQuery?",
      "context": "This role requires strong SQL skills in cloud platforms",
      "aiGeneratedAnswer": "In my previous role at XYZ company, I worked extensively with BigQuery for analyzing customer data patterns. I designed and optimized complex SQL queries that processed over 10TB of data daily, achieving a 40% reduction in query execution time through strategic partitioning and clustering. I also implemented data quality checks using SQL stored procedures...",
      "feedback": {
        "score": 8.5,
       Get Simulation Progress (Optional Streaming)

**Endpoint:** `GET /api/interview/progress/:sessionId`

**Purpose:** For real-time updates if simulation is running async

**Response:**
```json
{
  "sessionId": "uuid-session-id",
  "status": "processing",
  "currentStep": "Generating answer for question 3 of 6",
  "progress": {
    "current": 3,
    "total": 6,
    "percentage": 50
  },
  "completedQuestions": [
    {
      "questionNumber": 1,
      "score": 8.5
    },
    {
      "questionNumber": 2,
      "score": 7.2
    }
  ]
}
```

**Note:** Most likely NOT needed for MVP. Simulation can run synchronously in 10-15 seconds total.esponse:**
```json
{
  "success": true,
  "feedback": {
    "score": 8.5,
    "maxScore": 10,
    "strengths": [
      "✅ Mentioned specific cloud platform (BigQuery)",
      "✅ Provided quantifiable metrics",
      "✅ Used STAR format effectively"
    ],
    "missing": [
      "⚠️ Could elaborate on data warehousing concepts",
      "⚠️ Didn't mention optimization techniques"
    ],
    "suggestions": [
      "💡 Consider adding examples of query performance improvements",
      "💡 Mention collaboration with data engineers"
    ],
    "detailedAnalysis": "Your answer demonstrated strong technical knowledge..."
  },
  "nextQuestion": {
    "id": "q2",
    "questionNumber": 2,
    "category": "experience",
    "question": "Tell me about a time when you had to profile data sources to identify quality issues...",
    "context": "Following up on data quality aspect from your previous answer"
  },
  "progress": {
    "current": 1,
    "total": 6,
    "percentage": 16
  }
}
```

---

### 3. Generate Final Report

**Endpoint:** `POST /api/interview/report`

**Request:**
```json
{
  "sessionId": "uuid-session-id"
}
```

**Process:**
1. Retrieve complete session data
2. Calculate overall score (weighted average)
3. Analyze category-wise performance
4. Compare all presented skills vs job requirements
5. Generate gap analysis
6. Create personalized recommendations using LLM:
   ```
   Prompt: "Based on interview performance:
   - Scores: [technical: 8.5, behavioral: 7.2, experience: 9.0]
   - Job requirements: [list]
   - Identified gaps: [list]
   Generate 5 specific recommendations for improvement."
   ```
7. Determine pass/fail (threshold: 70%)

**Response:**
```json
{
  "success": true,
  "report": {
    "overallScore": 81.5,
    "passed": true,
    "threshold": 70,
    "categoryScores": {
      "Retrieve Simulation Results

**Endpoint:** `GET /api/interview/results/:sessionId`

**Purpose:** Fetch previously completed simulation for viewing/sharing

**Process:**
1. Retrieve session data from storage
2. Return complete results (already generated in simulate endpoint
      "📚 Study data profiling best practices and tools",
      "💼 Seek opportunities to work in Agile teams",
      "🎯 Practice STAR method for behavioral questions",
      "📊 Build portfolio project demonstrating end-to-end data pipeline",
      "🤝 Develop case studies showcasing stakeholder communication"
    ],
    "interviewData": {
      "duration": "18 minutes",
      "questionsAnswered": 6,
      "averageResponseTime": "3 minutes",
      "completedAt": "2026-02-16T10:30:00Z"
    }
  }
}
```

---

## Core Business Logic

### Interview Orchestrator Service

```typescript
// lib/interview-orchestrator.ts

import { ragQuery, queryVectors } from './digital-twin'
import Groq from 'groq-sdk'

export class InterviewOrchestrator {
  private groq: Groq
  
  constructor() {
    this.groq = new Groq({ apiKey: process.env.GROQ_API_KEY })
  }

  /**
   * Initialize interview by analyzing job requirements and profile
   */
  async initializeInterview(
    jobDescription: string,
    jobRole: string
  ): Promise<InterviewSession> {
    // Step 1: Parse job requirements
    const jobRequirements = await this.parseJobRequirements(jobDescription)
    
    // Step 2: Query digital twin for comprehensive profile
    const profileData = await this.getCompleteProfile()
    
    // Step 3: Analyze gap between profile and requirements
    const gapAnalysis = this.analyzeGaps(profileData, jobRequirements)
    
    // Step 4: Generate interview questions
    const questions = await this.generateQuestions(
     Run complete autonomous interview simulation
   */
  async runSimulation(
    jobDescription: string,
    jobRole: string
  ): Promise<InterviewSession> {
    // Step 1: Parse job requirements
    const jobRequirements = await this.parseJobRequirements(jobDescription)
    
    // Step 2: Query digital twin for comprehensive profile
    const profileData = await this.getCompleteProfile()
    
    // Step 3: Analyze gap between profile and requirements
    const gapAnalysis = this.analyzeGaps(profileData, jobRequirements)
    
    // Step 4: Generate interview questions
    const questions = await this.generateQuestions(
      jobRequirements,
      profileData,
      gapAnalysis
    )
    
    // Step 5: FOR EACH QUESTION - Generate AI answer and evaluate
    const questionsWithAnswers: InterviewQuestion[] = []
    const answers: InterviewAnswer[] = []
    
    for (const question of questions) {
      // Generate answer from digital twin profile
      const aiAnswer = await this.generateAnswerFromProfile(
        question,
        jobRequirements,
        profileData
      )
      
      // Evaluate the AI-generated answer
      const feedback = await this.scoreAnswer(
        question,
        aiAnswer,
        profileData
      )
      
      questionsWithAnswers.push({
        ...question,
        aiGeneratedAnswer: aiAnswer
      })
      
      answers.push({
        questionId: question.id,
        userAnswer: aiAnswer,
        submittedAt: new Date(),
        score: feedback.score,
        feedback
      })
    }
    
    // Step 6: Generate final assessment
    const finalAssessment = await this.generateFinalReport({
      questions: questionsWithAnswers,
      answers,
      jobDescription,
      profileSummary: profileData
    })
    
    // Step 7: Create complete session
    const session: InterviewSession = {
      id: crypto.randomUUID(),
      jobRole,
      jobDescription,
      status: 'completed',
      startTime: new Date(),
      endTime: new Date(),
      currentQuestionIndex: questions.length,
      questions: questionsWithAnswers,
      answers,
      profileSummary: profileData,
      finalScore: finalAssessment.overallScore,
      assessment: finalAssessment
    }
    
    return session
  }

  /**
   * Generate interview answer from digital twin profile
   */
  private async generateAnswerFromProfile(
    question: InterviewQuestion,
    jobRequirements: JobRequirements,
    profile: ProfileSummary
  ): Promise<string> {
    // Query the digital twin with interview context
    const contextPrompt = `You are interviewing for a ${jobRequirements.role} position.

Interview Question: ${question.question}

Key points to address based on job requirements:
${question.expectedElements.join('\n- ')}

Please provide a compelling interview answer in first person, using the STAR method (Situation-Task-Action-Result) where appropriate. Include specific examples, metrics, and technologies from your background. Keep the response 150-250 words.`

    // Use existing ragQuery to generate answer
    const response = await ragQuery(contextPrompt, true)
    
    return response.response
Return as JSON.`

    const completion = await this.groq.chat.completions.create({
      model: 'llama-3.1-70b-versatile',
      messages: [{ role: 'user', content: prompt }],
      temperature: 0.3,
      response_format: { type: 'json_object' }
    })
    
    return JSON.parse(completion.choices[0].message.content)
  }

  /**
   * Get complete profile from digital twin
   */
  private async getCompleteProfile(): Promise<ProfileSummary> {
    const [experience, skills, projects, education] = await Promise.all([
      ragQuery("Summarize your work experience and key achievements"),
      ragQuery("List all your technical skills and proficiencies"),
      ragQuery("Describe your significant projects"),
      ragQuery("What is your educational background?")
    ])

    return {
      relevantExperience: this.extractKeyPoints(experience.response),
      keySkills: this.extractKeyPoints(skills.response),
      projects: this.extractKeyPoints(projects.response),
      education: this.extractKeyPoints(education.response),
      careerGoals: []
    }
  }

  /**
   * Generate interview questions based on requirements and profile
   */
  private async generateQuestions(
    requirements: JobRequirements,
    profile: ProfileSummary,
    gaps: string[]
  ): Promise<InterviewQuestion[]> {
    const prompt = `You are an expert technical interviewer. Generate 6 behavioral interview questions for a ${requirements.role} position.

Job Requirements:
${JSON.stringify(requirements, null, 2)}

Candidate Profile:
${JSON.stringify(profile, null, 2)}

Identified Gaps:
${gaps.join(', ')}

Requirements:
- 2 questions on technical skills (focus on: ${requirements.requiredSkills.slice(0, 3).join(', ')})
- 2 questions on relevant experience
- 1 behavioral question
- 1 situational question
- Target areas where candidate has experience to showcase
- Also probe gap areas to assess trainability
- Each question should allow STAR format responses

Return as JSON array with: { category, question, expectedElements }`

    const completion = await this.groq.chat.completions.create({
      model: 'llama-3.1-70b-versatile',
      messages: [{ role: 'user', content: prompt }],
      temperature: 0.7,
      response_format: { type: 'json_object' }
    })
    
    const generated = JSON.parse(completion.choices[0].message.content)
    
    return generated.questions.map((q: any, index: number) => ({
      id: `q${index + 1}`,
      questionNumber: index + 1,
      category: q.category,
      question: q.question,
      expectedElements: q.expectedElements || [],
      maxScore: 10,
      generatedAt: new Date()
    }))
  }

  /**
   * Score an answer and generate feedback
   */
  async scoreAnswer(
    question: InterviewQuestion,
    userAnswer: string,
    profileContext: ProfileSummary
  ): Promise<AnswerFeedback> {
    // Step 1: Verify answer against digital twin profile
    const verificationQuery = `Does my background support this statement: "${userAnswer.slice(0, 200)}"`
    const verification = await ragQuery(verificationQuery)
    
    // Step 2: Score answer using LLM
    const scoringPrompt = `You are evaluating an interview answer.

Question: ${question.question}
Category: ${question.category}
Expected Elements: ${question.expectedElements.join(', ')}

User's Answer:
${userAnswer}

Profile Verification:
${verification.response}

Score this answer (0-10) based on:
1. Relevance to question (30%)
2. Profile alignment/authenticity (25%)
3. Specificity and examples (25%)
4. STAR format adherence (20%)

Provide:
- Score (0-10)
- Strengths (what was done well)
- Missing elements (what could be improved)
- Suggestions (specific recommendations)

Return as JSON.`

    const completion = await this.groq.chat.completions.create({
      model: 'llama-3.1-70b-versatile',
      messages: [{ role: 'user', content: scoringPrompt }],
      temperature: 0.3,
      response_format: { type: 'json_object' }
    })
    
    const evaluation = JSON.parse(completion.choices[0].message.content)
    
    return {
      score: evaluation.score,
      strengths: evaluation.strengths,
      missing: evaluation.missing,
      suggestions: evaluation.suggestions,
      detailedAnalysis: evaluation.analysis || ''
    }
  }

  /**
  **"Simulate Interview" button** (not "Start Interview")
- Preview of selected job requirements
- Estimated time: Watch AI simulation in 2-3 minutes
- Explanation: "AI will generate interview questions AND answers from your digital twin profile"

**v0 Prompt:**
```
Create a Next.js page with ShadCN UI components and dark mode:
- Centered card layout
- Heading: "Digital Twin Interview Simulator"
- Subtitle: "AI generates interview questions and answers from your profile"
- Dropdown to select job role (Data Analyst, Cloud Engineer, Software Developer, etc.)
- Tab switcher: "Select Role" | "Paste Description" | "Upload File"
- Large text area with placeholder for job description
- File upload dropzone for .md files
- "Simulate Interview" button (primary, large)
- Info badge: "Estimated time: 2-3 minutes"
- Display job requirements preview after selection
- Explanation card: "How it works:
  1. Select a job role or paste description
  2. AI analyzes requirements vs your profile
  3. Generates realistic interview questions
  4. Automatically answers using your background
  5. Evaluates responses and provides feedback"
    // Generate recommendations
    const recommendations = await this.generateRecommendations(
      session,
      gapAnalysis,
      categoryScores
    )
    
    return {
      overallScore: Math.round(overallScore * 10) / 10,
      passed: overallScore >= 7.0,
      threshold: 7.0,
      categoryScores,
      gapAnalysis,
      recommendations,
      strengths: this.extractStrengths(session.answers),
      areasForImprovement: this.extractWeaknesses(session.answers)
    }
  }

  // Helper methods...
  private calculateCategoryScores(answers: InterviewAnswer[]): Record<string, number> {
    // Group by cSimulation Page (Autonomous Display)

**File:** `app/interview/[sessionId]/page.tsx`

**Features:**
- Progress bar (Question 2 of 6)
- Question card with category badge
- **AI-generated answer display** (appears with typing animation)
- Automatic evaluation panel
- Auto-advance to next question (or manual "Next")
- Sidebar showing all questions with scores
- Watch the entire simulation unfold

**v0 Prompt:**
```
Create an autonomous interview simulation viewer with ShadCN UI and dark mode:
- Fixed header with progress bar (2/6 questions)
- Main content area with:
  - Question card: number, category badge, question text
  - Answer section:
    - Label: "Your Digital Twin's Response:"
    - Text display with typewriter animation effect
    - Word count badge
  - Evaluation panel (auto-appears after answer):
    - Score display (8.5/10) with circular progress
    - Strengths list (green checkmarks)
    - Areas to improve (orange alerts)
    - Suggestions (blue lightbulbs)
  - Auto-advance timer OR "Next Question" button
- Right sidebar (collapsible on mobile):
  - List of all questions
  - Completed ones show score badges
  - Current question highlighted
- Loading states for AI generation
- Responsive design

Key UX: User doesn't type - they WATCH the AI simulate the interview5-20 minutes

**v0 Prompt:**
```
Create a Next.js page with ShadCN UI components and dark mode:
- Centered card layout
- Heading: "Digital Twin Interview Simulator"
- Dropdown to select job role (Data Analyst, Cloud Engineer, Software Developer, etc.)
- Tab switcher: "Select Role" | "Paste Description" | "Upload File"
- Large text area with placeholder for job description
- File upload dropzone for .md files
- "Start Interview" button (primary, large)
- Show estimated duration: "15-20 minutes"
- Display job requirements preview after selection
```

---

### 2. Interview Page

**File:** `app/interview/[sessionId]/page.tsx`

**Features:**
- Progress bar (Question 2 of 6)
- Question card with category badge
- Large text area for answer (with character count)
- Timer showing elapsed time
- "Submit Answer" button
- Feedback panel (appears after submission)
- "Next Question" button
- Sidebar showing completed questions with scores

**v0 Prompt:**
```
Create an interview interface with ShadCN UI and dark mode:
- Fixed header with progress bar (2/6 questions)
- Main content area with:
  - Question card: number, category badge, question text
  - Large textarea (min 200 chars) for answer
  - Character counter
  - Timer badge
  - Submit button
- Right sidebar (collapsible on mobile):
  - List of completed questions with checkmarks
  - Score badges (8.5/10)
- Feedback panel (slides in after submission):
  - Score display (large number)
  - Strengths list (green checkmarks)
  - Missing elements (orange warnings)
  - Suggestions (blue lightbulbs)
  - "Next Question" button
- Responsive design
```

---

### 3. Results Dashboard

**File:** `app/interview/results/[sessionId]/page.tsx`

**Features:**
- Overall score (large circular progress indicator)
- Pass/Fail banner
- Category scores (radar chart or bar chart)
- Gap analysis (table comparison)
- Strengths and improvements (two-column layout)
- Recommendations (numbered list with icons)
- Interview statistics (duration, questions answered)
- "Download PDF" button
- "Start New Interview" button
- "Share Results" button

**v0 Prompt:**
```
Create a results dashboard with ShadCN UI and dark mode:
- Hero section: Large circular progress (81.5%) with Pass badge
- Grid layout (2x2):
  - Category Scores card (bar chart)
  - Gap Analysis table (Required vs Presented skills)
  - Strengths panel (green checkmark list)
  - Areas for Improvement (orange alert list)
- Recommendations section (full width):
  - Numbered cards with icons
  - Each recommendation is actionable
- Interview Stats footer:
  - Duration, Questions answered, Average time
- Action buttons:
  - Download PDF (primary)
  - Start New Interview (secondary)
  - Share Results (outline)
```

---

## Session Management

### Storage Options

#### Option 1: In-Memory (Development Only)
```typescript
// lib/interview-session.ts

const sessions = new Map<string, InterviewSession>()

export function saveSession(session: InterviewSession): void {
  sessions.set(session.id, session)
}

export function getSession(sessionId: string): InterviewSession | null {
  return sessions.get(sessionId) || null
}
```

⚠️ **Limitation:** Sessions lost on server restart

#### Option 2: Vercel KV (Recommended for Production)
```typescript
import { kv } from '@vercel/kv'

export async function saveSession(session: InterviewSession): Promise<void> {
  await kv.set(`interview:${session.id}`, JSON.stringify(session), {
    ex: 3600 // Expire after 1 hour
  })
}

export async function getSession(sessionId: string): Promise<InterviewSession | null> {
  const data = await kv.get(`interview:${sessionId}`)
  return data ? JSON.parse(data as string) : null
}
```

✅ **Benefits:** Persistent, fast, serverless-friendly

#### Option 3: Neon Postgres (Full-Featured)
```typescript
import { sql } from '@vercel/postgres'

export async function saveSession(session: InterviewSession): Promise<void> {
  await sql`
    INSERT INTO interview_sessions (id, data, created_at)
    VALUES (${session.id}, ${JSON.stringify(session)}, NOW())
    ON CONFLICT (id) DO UPDATE SET data = EXCLUDED.data
  `
}

export async function getSession(sessionId: string): Promise<InterviewSession | null> {
  const result = await sql`
    SELECT data FROM interview_sessions WHERE id = ${sessionId}
  `
  return result.rows[0]?.data || null
}
```

✅ **Benefits:** Full SQL capabilities, history tracking, user accounts

**Recommendation for Phase 1:** Start with Vercel KV (simple, scalable)

---

## Development Workflow

### Phase 1: Core Backend (Week 1)

1. ✅ **Setup Types**
   ```bash
   # Create types/interview.ts with all interfaces
   ```

2. ✅ **Build Interview Orchestrator**
   ```bash
   # Implement lib/interview-orchestrator.ts
   # Test with existing ragQuery()
   ```

3. ✅ **Create API Routes**
   ```bash
   # Implement /api/interview/start
   # Implement /api/interview/answer
   # Implement /api/interview/report
   # Test with Postman/curl
   ```

4. ✅ **Add Session Management**
   ```bash
   # Set up Vercel KV
   # Implement lib/interview-session.ts
   ```

### Phase 2: Frontend (Week 2)

1. ✅ **Build with v0.dev**
   ```bash
   # Generate Job Selection page
   # Generate Interview page
   # Generate Results page
   ```

2. ✅ **Integrate Components**
   ```bash
   # Connect forms to API endpoints
   # Implement state management (React Context or Zustand)
   # Add loading states and error handling
   ```

3. ✅ **Polish UI**
   ```bash
   # Add animations (Framer Motion)
   # Implement dark mode toggle
   # Make responsive
   ```

### Phase 3: Testing & Refinement (Week 3)

1. ✅ **End-to-End Testing**
   ```bash
   # Test complete interview flow
   # Verify scoring accuracy
   # Check against edge cases
   ```

2. ✅ **Performance Optimization**
   ```bash
   # Implement streaming responses
   # Add loading skeletons
   # Optimize API calls
   ```

3. ✅ **Documentation**
   ```bash
   # Update README with web UI instructions
   # Create user guide
   # Add screenshots/demo video
   ```

---

## Technology Stack

### Required (From AGENTS.md)
✅ **Framework:** Next.js 15.5.3+  
✅ **Language:** TypeScript (strict)  
✅ **UI Components:** ShadCN UI  
✅ **Styling:** `globals.css` (no inline styles)  
✅ **Package Manager:** pnpm only  

### Additional (For Web UI)
✅ **State Management:** Zustand (lightweight) or React Context  
✅ **Forms:** React Hook Form + Zod validation  
✅ **Charts:** Recharts (for results dashboard)  
✅ **Animations:** Framer Motion (optional)  
✅ **Session Storage:** Vercel KV (recommended)

### Existing (Reused 100%)
✅ **RAG Logic:** `lib/digital-twin.ts`  
✅ **Vector DB:** Upstash Vector  
✅ **LLM:** Groq API  
✅ **Data:** `data/digitaltwin_clean.json`

---

## Deployment Considerations

### Environment Variables

```env
# Existing (no changes)
UPSTASH_VECTOR_REST_URL=
UPSTASH_VECTOR_REST_TOKEN=
GROQ_API_KEY=

# New (for session management)
KV_REST_API_URL=         # Vercel KV
KV_REST_API_TOKEN=       # Vercel KV
```

### Vercel Configuration

Update `vercel.json` if needed (likely no changes required).

**Build Settings:**
- Framework Preset: Next.js
- Root Directory: `mcp-server`
- Build Command: `pnpm install && pnpm build`
- Output Directory: `.next`

### Multiple Deployment Modes

You can deploy same codebase with different entry points:

**Option A: Dual Mode (Recommended)**
```
Same deployment serves:
- /api/mcp → For VS Code Agent Mode
- /interview → Web UI for human users
```

**Option B: Separate Deployments**
```
mcp-server.vercel.app → Agent Mode only
interview.vercel.app → Web UI only
```

---

## Security Considerations

### 1. Rate Limiting
```typescript
// Prevent abuse of interview API
import { Ratelimit } from '@upstash/ratelimit'

const ratelimit = new Ratelimit({
  redis: kv,
  limiter: Ratelimit.slidingWindow(5, '1 h') // 5 interviews per hour
})

export async function checkRateLimit(identifier: string) {
  const { success } = await ratelimit.limit(identifier)
  return success
}
```

### 2. Input Validation
```typescript
// Validate all user inputs
import { z } from 'zod'

const startInterviewSchema = z.object({
  jobRole: z.string().min(1).max(100),
  jobDescription: z.string().min(50).max(10000)
})

// Use in API routes
const validated = startInterviewSchema.parse(requestBody)
```

### 3. Session Security
```typescript
// Validate session ownership
export function validateSession(sessionId: string, userId?: string): boolean {
  // Implement session validation logic
  // Could use IP address, user cookies, or auth tokens
  return true
}
```

---

## Cost Estimation

### API Usage

**Per Interview Session:**
- Groq API calls: ~15-20 (question generation + scoring)
- Upstash Vector queries: ~20-25 (profile retrieval + verification)
- Vercel KV operations: ~10-15 (session management)

**Monthly Cost (100 interviews):**
- Groq API: ~$1-2 (generous free tier)
- Upstash Vector: ~$0-1 (free tier covers most use)
- Vercel KV: ~$0 (free tier sufficient)
- Vercel Hosting: $0 (Hobby plan)

**Total:** ~$2-3/month for moderate usage ✅ Very affordable!

---

## Comparison: Agent Mode vs Web UI

| Feature | Agent Mode (Current) | Web UI (Autonomous Simulation) |
|---------|----------------------|-------------------------------|
| **User Interface** | VS Code Chat | Browser-based React app |
| **Question Generation** | AI agent generates | Backend generates via LLM |
| **Answer Generation** | ✅ AI from profile (ragQuery) | ✅ AI from profile (ragQuery) |
| **User Input Required** | None (fully autonomous) | None (fully autonomous) |
| **Evaluation** | Agent analyzes responses | Backend scores automatically |
| **Feedback Format** | Conversational in chat | Structured cards with scores |
| **Interview Control** | Agent manages conversation | User watches simulation |
| **Profile Queries** | Agent decides dynamically | Backend orchestrates queries |
| **Session Management** | Conversation context | Storage (Vercel KV) |
| **Suitable For** | Personal practice in IDE | Demo, sharing, portfolio |
| **Development Time** | ✅ Done (current) | ~1-2 weeks (simpler now!) |
| **Maintenance** | Low (API only) | Medium (UI + API) |
| **Shareability** | ❌ Not shareable | ✅ URL shareable |

**Key Insight:** Both modes are AUTONOMOUS - AI generates both questions AND answers!

---

## Success Metrics

### MVP Success Criteria

✅ Complete autonomous simulation works end-to-end  
✅ AI-generated answers match profile data accurately  
✅ Results are actionable and helpful  
✅ UI is responsive (desktop + mobile)  
✅ Simulation completes in 2-3 minutes  
✅ Agent Mode still works (no breaking changes)  
✅ Answers are generated from Upstash Vector embeddings  

### Quality Metrics

- **Response Accuracy:** >90% of AI answers align with profile data
- **User Experience:** Complete simulation in <3 minutes
- **Performance:** Full simulation completes <15 seconds
- **Error Rate:** <5% failed requests
- **Mobile Usage:** Fully functional on tablets/phones
- **Answer Quality:** AI answers include specific examples from profile

---

## Next Steps

### Immediate Actions (This Week)

1. **Decision:** Choose session storage (recommend Vercel KV)
2. **Setup:** Install additional dependencies
   ```bash
   cd mcp-server
   pnpm add @vercel/kv zustand recharts framer-motion
   pnpm add -D @types/node
   ```
3. **Create:** Type definitions (`types/interview.ts`)
4. **Implement:** Interview orchestrator (`lib/interview-orchestrator.ts`) with `generateAnswerFromProfile()`
5. **Build:** Single API endpoint (`/api/interview/simulate`)
6. **Test:** Verify it generates BOTH questions AND answers from `ragQuery()`

### Week 1 Milestone

✅ Backend autonomous simulation API working (generates Q&A from profile)  
✅ Tested with Postman - returns complete interview simulation

### Week 2 Milestone

✅ Complete web UI deployed with animated display  
✅ Shareable demo URL ready

---

## Questions to Resolve

Before starting implementation:

1. **Session Storage:** Confirm Vercel KV vs in-memory vs Postgres
2. **Authentication:** Do we need user accounts? (Recommendation: No for MVP)
3. **PDF Reports:** Should we generate PDFs? (Optional for Phase 2)
4. **Animation Speed:** How fast should AI answers display? (Recommendation: 2-3 seconds with typewriter effect)
5. **Job Postings:** Should we pre-load the existing .md files? (Yes, as dropdown options)
6. **Manual Control:** Should users be able to pause/play simulation? (Recommendation: Auto-play with manual next button)

---

## Conclusion

This web UI implementation:

- ✅ **Reuses 100%** of existing RAG infrastructure
- ✅ **Preserves** Agent Mode functionality
- ✅ **Adds** autonomous interview simulation (no user input needed)
- ✅ **Generates answers** from Upstash Vector embeddings via `ragQuery()`
- ✅ **Follows** all AGENTS.md requirements
- ✅ **Aligns** with project goals and constraints

The architecture is designed to be:
- **Modular:** Clear separation of concerns
- **Scalable:** Can handle multiple concurrent users
- **Maintainable:** Clean code with TypeScript types
- **Cost-effective:** Leverages free tiers
- **Impressive:** Autonomous AI demo that showcases your profile

Ready to proceed with implementation? Let me know if you want to:
1. Start with backend autonomous simulation API
2. Use v0.dev to generate UI components with animation
3. Both in parallel (different branches)

---

**Document Status:** ✅ Updated for Autonomous AI Simulation  
**Estimated Effort:** 1-2 weeks (3-4 days backend, 3-4 days frontend)  
**Complexity:** Medium (actually simpler than user-input version!)
