# The One Interview Command

**One command. Everything included. Claude plays both interviewer and candidate.**

---

## 🎯 COMPLETE INTERVIEW COMMAND

Copy this ONE command, customize the placeholders, paste into Claude Desktop, and get a complete interview assessment.

```
I'll conduct a comprehensive interview for the [JOB_TITLE] position at [COMPANY], [LOCATION].

INSTRUCTIONS FOR THE INTERVIEW:

You are BOTH the interviewer AND the candidate. Act out this interview where:
- You ask the interview questions as the hiring manager
- You answer the questions using the candidate's profile from the digital twin

STEP 1: Query the job posting
Call tool: query_job_postings
Query: "[ROLE_KEYWORDS]"

STEP 2: Query the candidate profile
Call tool: query_digital_twin
Question: "What is my complete professional background, experience, skills, and accomplishments?"

STEP 3: Conduct the interview - covering all areas:

QUESTION 1: INTRODUCTION (2 min)
- Ask for a brief professional background (30 seconds)
- Ask how their experience aligns with the role (30 seconds)

QUESTION 2-4: TECHNICAL SKILLS (10 min)
- Ask 3 specific technical questions based on job requirements
- Questions should assess depth of knowledge, hands-on experience, problem-solving ability
- Get detailed examples from their project work

QUESTION 5-7: BEHAVIORAL SKILLS (8 min)
- Ask 3 behavioral questions: ownership, communication, adaptability
- Get specific examples of how they handle challenges, work with teams, learn quickly

QUESTION 8: SKILL-FOCUSED ASSESSMENT (4 min)
- Ask one deep-dive question on the most critical skill for this role
- Assess their expertise level and readiness for immediate impact

STEP 4: Score the competencies

For each area below, provide score 0-100 with specific evidence from their answers:
- Technical Proficiency (based on technical questions)
- Problem-Solving Ability (based on examples and approach)
- Communication Skills (based on how they explain concepts)
- Ownership & Initiative (based on behavioral examples)
- Cultural Fit (based on values alignment)

Show:
- Individual competency scores (0-100)
- Overall average score
- Key strengths with specific evidence
- Critical gaps or concerns

STEP 5: Final assessment

Provide on one page:

**HIRING RECOMMENDATION:**
Choose ONE: HIRE / CONDITIONAL OFFER / DO NOT HIRE

**PASS/FAIL:**
PASS: Score 75+ - Meets or exceeds requirements
FAIL: Score <75 - Does not meet critical requirements

**SUMMARY:**
- Overall fit for the role (1-2 sentences)
- Top 3 strengths with evidence
- Top 3 gaps or concerns
- If conditional offer: specific areas for development in first 3 months
- If do not hire: specific reasons why they're not a good fit

**FINAL SCORE:** [X]/100

Start now - Query the tools first, then conduct the interview as both interviewer and candidate.
```

---

## 🎯 HOW TO USE

### **Step 1: Customize the Command**

Replace these four placeholders:

| Placeholder | Replace With | Example |
|------------|-------------|---------|
| `[JOB_TITLE]` | The job title | "Data Analyst" |
| `[COMPANY]` | Company name | "Australian Broadcasting Corporation" |
| `[LOCATION]` | Location | "Sydney" |
| `[ROLE_KEYWORDS]` | Search keywords | "Data Analyst SQL Power BI reporting cloud" |

### **Step 2: Embed Your Job Posting**

Before running the interview:

```powershell
Ctrl+Shift+B → "Embed Job Postings to Upstash"
```

Wait for confirmation: ✅ Successfully embedded

### **Step 3: Copy Your Customized Command**

Example for ABC Data Analyst:

```
I'll conduct a comprehensive interview for the Data Analyst position at Australian Broadcasting Corporation, Sydney.

INSTRUCTIONS FOR THE INTERVIEW:

You are BOTH the interviewer AND the candidate. Act out this interview where:
- You ask the interview questions as the hiring manager
- You answer the questions using the candidate's profile from the digital twin

STEP 1: Query the job posting
Call tool: query_job_postings
Query: "Data Analyst SQL Power BI reporting cloud analytics"

[Rest of command same as above...]
```

### **Step 4: Open Claude Desktop**

- Start a **NEW conversation**
- Paste the entire customized command
- Press Enter

### **Step 5: Get Results**

Claude will provide:
- ✅ Overall competency score (0-100)
- ✅ Pass/Fail determination
- ✅ Hiring recommendation
- ✅ Detailed feedback with strengths and gaps
- ✅ Next steps if applicable

---

## 📋 WHAT YOU GET

After running this ONE command, you'll receive:

| Item | What It Is |
|------|-----------|
| **Introduction Assessment** | How well candidate can summarize their background |
| **Technical Skills Score** | 0-100 rating with evidence from 3 technical questions |
| **Behavioral Skills Score** | 0-100 rating with evidence from behavioral examples |
| **Critical Skill Assessment** | Deep dive on most important skill for the role |
| **Competency Scores** | Scores for: Technical, Problem-Solving, Communication, Ownership, Cultural Fit |
| **Overall Score** | Average of all competencies (0-100) |
| **Pass/Fail** | PASS (75+) or FAIL (<75) |
| **Hiring Recommendation** | HIRE / CONDITIONAL OFFER / DO NOT HIRE |
| **Summary** | 1-page executive summary with action items |

---

## 🚀 QUICK START - COPY THIS NOW

```
I'll conduct a comprehensive interview for the Data Analyst position at Australian Broadcasting Corporation, Sydney.

INSTRUCTIONS FOR THE INTERVIEW:

You are BOTH the interviewer AND the candidate. Act out this interview where:
- You ask the interview questions as the hiring manager
- You answer the questions using the candidate's profile from the digital twin

STEP 1: Query the job posting
Call tool: query_job_postings
Query: "Data Analyst SQL Power BI reporting cloud analytics Sydney ABC"

STEP 2: Query the candidate profile
Call tool: query_digital_twin
Question: "What is my complete professional background, experience, skills, and accomplishments?"

STEP 3: Conduct the interview - covering all areas:

QUESTION 1: INTRODUCTION (2 min)
- Ask for a brief professional background (30 seconds)
- Ask how their experience aligns with the role (30 seconds)

QUESTION 2-4: TECHNICAL SKILLS (10 min)
- Ask 3 specific technical questions based on job requirements
- Questions should assess depth of knowledge, hands-on experience, problem-solving ability
- Get detailed examples from their project work

QUESTION 5-7: BEHAVIORAL SKILLS (8 min)
- Ask 3 behavioral questions: ownership, communication, adaptability
- Get specific examples of how they handle challenges, work with teams, learn quickly

QUESTION 8: SKILL-FOCUSED ASSESSMENT (4 min)
- Ask one deep-dive question on the most critical skill for this role
- Assess their expertise level and readiness for immediate impact

STEP 4: Score the competencies

For each area below, provide score 0-100 with specific evidence from their answers:
- Technical Proficiency (based on technical questions)
- Problem-Solving Ability (based on examples and approach)
- Communication Skills (based on how they explain concepts)
- Ownership & Initiative (based on behavioral examples)
- Cultural Fit (based on values alignment)

Show:
- Individual competency scores (0-100)
- Overall average score
- Key strengths with specific evidence
- Critical gaps or concerns

STEP 5: Final assessment

Provide on one page:

**HIRING RECOMMENDATION:**
Choose ONE: HIRE / CONDITIONAL OFFER / DO NOT HIRE

**PASS/FAIL:**
PASS: Score 75+ - Meets or exceeds requirements
FAIL: Score <75 - Does not meet critical requirements

**SUMMARY:**
- Overall fit for the role (1-2 sentences)
- Top 3 strengths with evidence
- Top 3 gaps or concerns
- If conditional offer: specific areas for development in first 3 months
- If do not hire: specific reasons why they're not a good fit

**FINAL SCORE:** [X]/100

Start now - Query the tools first, then conduct the interview as both interviewer and candidate.
```

---

## 💡 KEY POINTS

1. **One Command for Everything** - No need to choose between different command types
2. **Claude is Both Roles** - Acts as interviewer asking questions + candidate answering based on profile
3. **Complete Assessment** - Technical + Behavioral + Skill-focused all in one interview
4. **Clear Pass/Fail** - Score 75+ = PASS, <75 = FAIL
5. **Hiring Recommendation** - Get clear HIRE / CONDITIONAL OFFER / DO NOT HIRE decision
6. **Detailed Feedback** - Strengths, gaps, next steps all included

---

## 🔄 FOR DIFFERENT ROLES

Just change the placeholders for any role:

**Example 1: Senior Engineer at Google**
```
Data Analyst position at Australian Broadcasting Corporation, Sydney
↓↓↓
Senior Software Engineer position at Google, Mountain View
```

**Example 2: Product Manager at Amazon**
```
Query: "Data Analyst SQL Power BI reporting cloud analytics Sydney ABC"
↓↓↓
Query: "Product Manager strategy roadmap Amazon AWS cloud"
```

**Example 3: UX Designer at Apple**
```
Query: "Data Analyst SQL Power BI reporting cloud analytics Sydney ABC"
↓↓↓
Query: "UX Designer Figma prototyping user research design systems Apple"
```

---

## ✅ CHECKLIST BEFORE RUNNING

- [ ] Job posting is embedded (`Ctrl+Shift+B` → "Embed Job Postings")
- [ ] Your profile is updated (if you made recent changes, run `Ctrl+Shift+B` → "Embed Digital Twin Profile")
- [ ] You're in Claude Desktop (not web version)
- [ ] MCP tunnel is running (mcp-remote)
- [ ] You customized the [PLACEHOLDERS]
- [ ] You're starting a NEW conversation

---

**Last Updated:** February 12, 2026  
**System:** Digital Twin + MCP Interview Assessment  
**Interviews:** Comprehensive all-in-one assessment with pass/fail determination  
**Status:** Ready to use - one command, everything included!
