# Smart Interview Prompt Commands

**Use these short prompts with Claude Desktop instead of long detailed instructions!**

**Works with ANY job role from Seek, LinkedIn, Indeed, or custom job postings.**

---

## 🎯 HOW TO USE WITH ANY JOB ROLE

### **Step 0: Embed Your Job Posting**

1. Create a markdown file in `job-postings/` folder (e.g., `job2.md`, `job3.md`)
   ```markdown
   # [Job Title]
   
   **Company:** [Company Name]
   **Location:** [Location]
   **Salary:** [Salary Range]
   
   ## About the Role
   [Job description...]
   ```

2. Embed it: `Ctrl+Shift+B` → Select "Embed Job Postings to Upstash"

3. Copy the job ID from output (e.g., `job_job2`)

### **Step 1: Copy a Command**
- Select one template below
- Replace `[JOB_TITLE]` with actual job title (e.g., "Senior Software Engineer", "Product Manager")
- Optionally add `[COMPANY]` and `[LOCATION]`

### **Step 2: Choose Job Source (Optional)**
If multiple jobs are embedded, specify which one:
- **Default:** Uses most relevant job posting from vector DB
- **Specific:** "Use job posting for [COMPANY] [JOB_TITLE] role"

### **Step 3: Paste into Claude Desktop**
- Start NEW conversation
- Paste the customized command
- Press Enter

---

## ⚡ QUICK COMMANDS (Copy & Paste)

**IMPORTANT:** These commands are **tool-explicit**. They tell Claude exactly which MCP tools to call in which order. This ensures the interview works correctly.

Simply copy ONE of these, customize the `[JOB_TITLE]`, `[COMPANY]`, and `[ROLE_KEYWORDS]`, and paste into Claude.

---

### **COMMAND 1: Quick 5-Minute Assessment (Tool-Explicit)**

```
I'll conduct a quick interview for the [JOB_TITLE] position at [COMPANY]. Follow these steps in order:

STEP 1: Query the job posting
Call tool: query_job_postings
Query: "[ROLE_KEYWORDS] [COMPANY] position"

STEP 2: Query my profile  
Call tool: query_digital_twin
Question: "What are my relevant professional experience, technical skills, and accomplishments?"

STEP 3: Review both results
Analyze my profile against the job requirements from the posting

STEP 4: Ask 5 screening questions
Ask 5 key screening questions based on:
- The specific job requirements from the posting
- My background from the digital twin profile

STEP 5: Score competencies
For each question, give a competency score 0-100 with reasoning

STEP 6: Final recommendation
Give HIRE / CONDITIONAL OFFER / DO NOT HIRE with specific evidence from both sources

Start now - Query the tools first.
```

**Customize:** Replace `[JOB_TITLE]` with actual job title (e.g., "Senior Data Engineer", "Product Manager", "UX Designer")  
**Use when:** You want fast feedback in ~5 minutes  
**Output:** Quick competency scores + hiring recommendation

**Examples:**
```
Conduct a quick interview for the Senior Data Engineer position at Google.
Use MCP tools to query profile and job posting...
```

```
Conduct a quick interview for the Product Manager role at Stripe.
Use MCP tools to query profile and job posting...
```

---

### **COMMAND 2: Full 4-Phase Interview (Complete & Tool-Explicit)**

```
I'll conduct a comprehensive 4-phase structured interview for the [JOB_TITLE] 
role at [COMPANY], [LOCATION].

FOLLOW THESE STEPS IN ORDER:

STEP 1: Query the job posting
Call tool: query_job_postings
Query: "[ROLE_KEYWORDS] [COMPANY] [LOCATION]"

STEP 2: Query my profile  
Call tool: query_digital_twin
Question: "What are my professional experiences, technical skills, certifications, accomplishments, and career background?"

STEP 3: Analyze fit
Review the job requirements and my profile. Identify:
- Key required skills from job posting
- My relevant experience and skills
- Skill gaps
- Potential strengths for this role

STEP 4: Conduct 4-phase interview

Phase 1 - INITIAL SCREENING (7 min):
- Years of relevant experience
- Key technologies/tools used
- Location preference and availability
- Salary expectations

Phase 2 - TECHNICAL ASSESSMENT (10 min):
- Technical skills aligned with job requirements
- Relevant project examples
- Problem-solving approach
- Tool proficiency and hands-on experience

Phase 3 - BEHAVIORAL/CULTURAL FIT (8 min):
- Ownership and initiative examples
- Communication and presentation skills
- How you handle fast-paced environments
- Alignment with company culture/values

Phase 4 - FINAL ASSESSMENT:
- Overall competency scores (0-100) for 5-6 key competencies
- Top 3 strengths with specific evidence
- Top 3 gaps with recommendations
- Final hiring recommendation with rationale

Start now - Call the tools and begin the interview.
```

**Customize:** Replace `[JOB_TITLE]`, `[COMPANY]`, `[LOCATION]`  
**Use when:** You want complete, detailed evaluation  
**Output:** 4-phase evaluation + competency scorecard + hiring recommendation

**Examples:**
```
Conduct a comprehensive 4-phase structured interview for the Software Engineer
role at Microsoft, Sydney...
```

```
Conduct a comprehensive 4-phase structured interview for the Data Analyst
role at Amazon, Melbourne...
```

---

### **COMMAND 3: Screening Phase Only**

```
I'll conduct the SCREENING PHASE for the [JOB_TITLE] role at [COMPANY].

STEP 1: Query job posting
Call tool: query_job_postings
Query: "[ROLE_KEYWORDS] [COMPANY]"

STEP 2: Query my profile
Call tool: query_digital_twin
Question: "What is my professional background, experience level, and career history?"

STEP 3: Ask screening questions
Ask 5 screening questions about:
- Years of relevant experience vs. job requirements
- Key technologies/tools proficiency
- Location preference and availability
- Salary expectations
- Notice period / availability to start

STEP 4: Score fit
For each question, score 0-100 with reasoning.
Provide overall screening fit assessment.

Start now - Query the tools and conduct screening.
```

**Customize:** Replace `[JOB_TITLE]`, `[COMPANY]`, `[ROLE_KEYWORDS]` (e.g., "Data Analyst Sydney ABC")  
**Use when:** You just want to verify basic fit  
**Output:** Screening assessment + fit analysis  
**Time:** ~5-7 minutes

---

### **COMMAND 4: Technical Phase Only**

```
I'll conduct the TECHNICAL ASSESSMENT phase for the [JOB_TITLE] role.

STEP 1: Query job posting
Call tool: query_job_postings
Query: "[ROLE_KEYWORDS] technical requirements tools skills"

STEP 2: Query my profile
Call tool: query_digital_twin
Question: "What are my technical skills, programming languages, tools, and technical projects?"

STEP 3: Ask technical questions
Based on the job technical requirements, ask 5-7 questions about:
- Specific technical tools/technologies required by the role
- Hands-on project examples using those tools
- Problem-solving approach
- Complex technical challenges you've solved
- Performance optimization, data handling, or architecture decisions

STEP 4: Evaluate technical fit
For each technical area, score 0-100 with reasoning.
Provide technical skills scorecard.

Start now - Query the tools and assess technical fit.
```

**Customize:** Replace `[JOB_TITLE]` and `[ROLE_KEYWORDS]` (e.g., "Data Engineer Spark Python Big Data")  
**Use when:** You want to focus on technical abilities  
**Output:** Technical skills evaluation with scorecard  
**Time:** ~10 minutes

---

### **COMMAND 5: Behavioral Phase Only**

```
I'll conduct the BEHAVIORAL/CULTURAL FIT phase for the [JOB_TITLE] role at [COMPANY].

STEP 1: Query job posting
Call tool: query_job_postings
Query: "[COMPANY] culture values teamwork communication"

STEP 2: Query my profile
Call tool: query_digital_twin
Question: "What are my examples of ownership, initiative, teamwork, communication, and handling challenges?"

STEP 3: Ask behavioral questions
Ask 5 behavioral questions about:
- Taking ownership of challenging situations
- Examples of effective communication with diverse audiences
- How you handle fast-paced or changing environments
- Teamwork and collaboration examples
- Alignment with company values (innovation, quality, integrity, etc.)

STEP 4: Score behavioral fit
For each behavioral area, score 0-100 with reasoning.
Provide cultural fit assessment.

Start now - Query the tools and assess behavioral fit.
```

**Customize:** Replace `[JOB_TITLE]`, `[COMPANY]`, `[ROLE_KEYWORDS]`  
**Use when:** You want to assess soft skills & culture fit  
**Output:** Behavioral/cultural assessment  
**Time:** ~8 minutes

---

### **COMMAND 6: Skill-Focused Assessment**

```
I'll evaluate critical skills for the [JOB_TITLE] role.

STEP 1: Query job posting
Call tool: query_job_postings
Query: "[ROLE_KEYWORDS] skills requirements"

STEP 2: Query my profile
Call tool: query_digital_twin
Question: "What are my specific skills, certifications, projects, and expertise in [SKILL_AREA]?"

STEP 3: Identify critical skills
From the job posting, identify top 3-5 critical skills needed.

STEP 4: Deep dive on each skill
For each critical skill:
- Ask me detailed questions about proficiency and hands-on experience
- Request specific project examples
- Score 0-100 with evidence from my profile
- Identify skill gaps

STEP 5: Provide skill scorecard
Show overall technical proficiency scores and recommendations.

Start now - Query the tools and assess critical skills.
```

**Customize:** Replace `[JOB_TITLE]`, `[ROLE_KEYWORDS]`, `[SKILL_AREA]` (e.g., "Cloud Architecture AWS Azure GCP")  
**Use when:** You want deep dive on specific skills  
**Output:** Detailed skill evaluation with scores  
**Time:** ~5-10 minutes

---

### **COMMAND 7: Competency Scores Only**

```
I'll provide competency scores for the [JOB_TITLE] position.

STEP 1: Query job posting
Call tool: query_job_postings
Query: "[ROLE_KEYWORDS] requirements competencies"

STEP 2: Query my profile
Call tool: query_digital_twin
Question: "What are my complete professional background, skills, and achievements?"

STEP 3: Identify core competencies
From the job posting, identify 5-6 core competencies needed.

STEP 4: Score each competency
For each competency, provide score 0-100 with brief evidence from my profile.

STEP 5: Provide scorecard
Show:
- Overall average score
- Individual competency scores
- Top 3 strengths with evidence
- Top 3 gaps with recommendations

Start now - Query the tools and provide competency scorecard.
```

**Customize:** Replace `[JOB_TITLE]` and `[ROLE_KEYWORDS]`  
**Use when:** You just want numbers/scorecard  
**Output:** Competency scorecard  
**Time:** ~3 minutes

---

### **COMMAND 8: Hiring Recommendation**

```
I'll provide a HIRING RECOMMENDATION for the [JOB_TITLE] role at [COMPANY].

STEP 1: Query job posting
Call tool: query_job_postings
Query: "[ROLE_KEYWORDS] [COMPANY] [LOCATION]"

STEP 2: Query my profile
Call tool: query_digital_twin
Question: "What is my complete professional profile, experience, and accomplishments?"

STEP 3: Analyze fit
Review both job requirements and my profile. Assess:
- Experience level vs. requirements
- Technical skills alignment
- Soft skills and cultural fit
- Career trajectory and motivation
- Risk factors

STEP 4: Provide recommendation
Give one of: HIRE / CONDITIONAL OFFER / DO NOT HIRE

STEP 5: Detailed rationale
Provide:
- Key strengths that make you a good fit
- Critical gaps or concerns
- Evidence from profile and job posting
- Specific recommendations (e.g., "Will need 3-month ramp-up on [tool]")
- Next steps

Start now - Query the tools and provide hiring recommendation.
```

**Customize:** Replace `[JOB_TITLE]`, `[COMPANY]`, `[LOCATION]`, `[ROLE_KEYWORDS]`  
**Use when:** You want final hiring decision  
**Output:** Clear recommendation + justification  
**Time:** ~5 minutes

---

### **COMMAND 9: 3-Month Development Roadmap**

```
I'll create a 3-month development roadmap for the [JOB_TITLE] role.

STEP 1: Query job posting
Call tool: query_job_postings
Query: "[ROLE_KEYWORDS] [COMPANY] skills requirements"

STEP 2: Query my profile
Call tool: query_digital_twin
Question: "What is my current experience level, skill gaps, and development areas?"

STEP 3: Identify development priorities
Compare job requirements vs. my current skills. Identify top 5 learning areas.

STEP 4: Create roadmap
For each month (3 months total):
- List specific learning objectives
- Recommend hands-on activities/projects
- Identify tools/resources to master
- Define success metrics

STEP 5: Provide actionable roadmap
Show:
- Month 1: Foundation skills (weeks 1-4)
- Month 2: Intermediate skills (weeks 5-8)
- Month 3: Advanced application (weeks 9-12)
- Success indicators

Start now - Query the tools and create development roadmap.
```

**Customize:** Replace `[JOB_TITLE]`, `[COMPANY]`, `[ROLE_KEYWORDS]`  
**Use when:** You've made offer and need onboarding plan  
**Output:** Month-by-month development plan  
**Time:** ~5 minutes

---

### **COMMAND 10: Interview Feedback Summary**

```
I'll provide an EXECUTIVE SUMMARY for the [JOB_TITLE] interview.

STEP 1: Query job posting (if not already done)
Call tool: query_job_postings
Query: "[ROLE_KEYWORDS] [COMPANY]"

STEP 2: Query my profile (if not already done)
Call tool: query_digital_twin
Question: "What is my complete professional profile?"

STEP 3: Create executive summary
Provide one-page summary:
- Overall competency score (0-100)
- Top 3 strengths with specific evidence
- Top 3 gaps with recommendations
- Cultural/behavioral fit assessment
- Key risk factors (if any)
- Final recommendation: HIRE / CONDITIONAL OFFER / DO NOT HIRE
- Next steps and timeline

STEP 4: Format for sharing
Provide in professional format suitable for:
- Hiring manager review
- Team discussion
- Offer decision making

Start now - Query tools and provide executive summary.
```

**Customize:** Replace `[JOB_TITLE]`, `[COMPANY]`, `[ROLE_KEYWORDS]`  
**Use when:** You want condensed results for stakeholder sharing  
**Output:** 1-page executive summary  
**Time:** ~2 minutes

---

## 🎯 HOW TO USE THESE COMMANDS (Tool-Explicit Approach)

These commands are **explicitly designed to tell Claude which MCP tools to call** in which order. This ensures Claude properly queries your job posting and digital twin profile.

### **Step 1: Customize Your Command**

Each command has placeholders to customize:

| Placeholder | Replace With | Example |
|------------|-------------|---------|
| `[JOB_TITLE]` | The job title | "Data Analyst", "Senior Software Engineer" |
| `[COMPANY]` | Company name | "Australian Broadcasting Corporation", "Google", "Amazon" |
| `[LOCATION]` | Location | "Sydney", "San Francisco", "Melbourne" |
| `[ROLE_KEYWORDS]` | Keywords for search | "Data Analyst Sydney ABC", "Cloud Architect AWS Azure" |
| `[SKILL_AREA]` | Specific skill to focus on | "Power BI", "Python", "Cloud Architecture" |

### **Step 2: Copy & Customize**

**BEFORE (Generic template):**
```
Query: "[ROLE_KEYWORDS] [COMPANY] [LOCATION]"
```

**AFTER (For ABC Data Analyst role):**
```
Query: "Data Analyst ABC Australian Broadcasting Sydney"
```

**AFTER (For Google Cloud Architect role):**
```
Query: "Cloud Architect Google Mountain View AWS Azure"
```

### **Step 3: Open Claude Desktop**
- Ensure MCP is still connected (mcp-remote tunnel running)
- Start a **NEW conversation**

### **Step 4: Paste Your Customized Command**
- Paste the entire command (all STEPS 1-6)
- Press Enter
- **DO NOT modify the command structure** - keep all the STEP numbers and tool calls exactly as written

### **Step 5: Wait for Results**
Claude will:
- ✅ Call `query_job_postings()` with your query
- ✅ Call `query_digital_twin()` to get your profile
- ✅ Conduct the interview using both data sources
- ✅ Provide assessment and recommendation

**Important:** If Claude doesn't call the tools explicitly, paste this reminder:
```
Remember to call the tools explicitly:
- First call: query_job_postings with the query
- Second call: query_digital_twin with the question
Then proceed with the interview steps.
```

---

## 📋 CHEAT SHEET: When to Use Each Command

| Situation | Use Command | Time |
|-----------|-------------|------|
| Quick assessment (lunch break) | #1 Quick Assessment | 5 min |
| Full evaluation (detailed review) | #2 Full Interview | 30 min |
| Just verify basic fit | #3 Screening | 7 min |
| Technical skills check | #4 Technical Phase | 10 min |
| Culture/soft skills check | #5 Behavioral Phase | 8 min |
| Deep dive on critical skills | #6 Skill-Focused | 10 min |
| Just want numbers | #7 Competency Scores | 3 min |
| Decision time (hire or not?) | #8 Recommendation | 5 min |
| Plan onboarding for new hire | #9 Development Roadmap | 5 min |
| Share results with team | #10 Summary | 2 min |

---

## 🚀 READY-TO-USE EXAMPLES

Copy these examples directly - they're already customized for real job searches:

---

### **Example 1: ABC Data Analyst Interview**

**Use COMMAND 2 (Full 4-Phase Interview):**

```
I'll conduct a comprehensive 4-phase structured interview for the Data Analyst 
role at Australian Broadcasting Corporation (ABC), Sydney.

FOLLOW THESE STEPS IN ORDER:

STEP 1: Query the job posting
Call tool: query_job_postings
Query: "Data Analyst ABC Australian Broadcasting Sydney"

STEP 2: Query my profile  
Call tool: query_digital_twin
Question: "What are my professional experiences, technical skills, certifications, accomplishments, and career background?"

STEP 3: Analyze fit
Review the job requirements and my profile. Identify:
- Key required skills from job posting
- My relevant experience and skills
- Skill gaps
- Potential strengths for this role

STEP 4: Conduct 4-phase interview

Phase 1 - INITIAL SCREENING (7 min):
- Years of relevant experience
- Key technologies/tools used
- Location preference and availability
- Salary expectations

Phase 2 - TECHNICAL ASSESSMENT (10 min):
- Technical skills aligned with job requirements
- Relevant project examples
- Problem-solving approach
- Tool proficiency and hands-on experience

Phase 3 - BEHAVIORAL/CULTURAL FIT (8 min):
- Ownership and initiative examples
- Communication and presentation skills
- How you handle fast-paced environments
- Alignment with company culture/values

Phase 4 - FINAL ASSESSMENT:
- Overall competency scores (0-100) for 5-6 key competencies
- Top 3 strengths with specific evidence
- Top 3 gaps with recommendations
- Final hiring recommendation with rationale

Start now - Call the tools and begin the interview.
```

---

### **Example 2: Quick 5-Minute Assessment**

**Use COMMAND 1** - Just need quick feedback?

```
I'll conduct a quick interview for the Data Analyst position at Australian Broadcasting Corporation (ABC).

STEP 1: Query the job posting
Call tool: query_job_postings
Query: "Data Analyst ABC reporting insights"

STEP 2: Query my profile  
Call tool: query_digital_twin
Question: "What are my relevant professional experience, technical skills, and accomplishments?"

STEP 3: Review both results
Analyze my profile against the job requirements from the posting

STEP 4: Ask 5 screening questions
Ask 5 key screening questions based on:
- The specific job requirements from the posting
- My background from the digital twin profile

STEP 5: Score competencies
For each question, give a competency score 0-100 with reasoning

STEP 6: Final recommendation
Give HIRE / CONDITIONAL OFFER / DO NOT HIRE with specific evidence from both sources

Start now - Query the tools first.
```

---

### **Example 3: Create Your Own for Any Role**

**Template to customize for ANY job:**

1. Copy COMMAND 2 (Full 4-Phase Interview) from above
2. Replace these placeholders:
   - `[JOB_TITLE]` = Your target job title
   - `[COMPANY]` = Your target company
   - `[LOCATION]` = Your target location
   - `[ROLE_KEYWORDS]` = Search keywords (e.g., "Power BI data analytics cloud")

3. Paste into Claude Desktop and press Enter

---

## 💡 PRO TIPS

### **Tip 1: Ensure Tools Are Called Explicitly**

The commands tell Claude to call specific tools. If Claude doesn't call them, remind it:

```
You must call the tools explicitly in order:
- FIRST: Call tool: query_job_postings with your query
- SECOND: Call tool: query_digital_twin with your question
- THEN: Proceed with interview steps
```

---

### **Tip 2: Always Start New Conversation for Each Interview**

Don't reuse conversations. Create NEW conversation for each interview to:
- Keep results clean and separate
- Ensure fresh tool calls
- Avoid context confusion between roles

```
Bad: Paste multiple interview commands in same conversation
Good: New Claude conversation for each interview
```

---

### **Tip 3: Keep MCP Tunnel Running**

Before starting any interview in Claude Desktop:
1. Check that mcp-remote tunnel is still active
2. If tunnel stopped, MCP tools won't work
3. Claude will tell you if tools aren't available

---

### **Tip 4: Run Phases in Sequence (Same Conversation)**

For SINGLE role, you CAN run multiple phases in ONE conversation:

```
Message 1: COMMAND 7 (Get quick competency scores)
Message 2: "Now do COMMAND 5 (Assess behavioral fit)"
Message 3: "Give me COMMAND 8 (Final hiring recommendation)"
```

This works because all queries reference same job posting.

---

### **Tip 5: Compare Multiple Roles (Different Conversations)**

Compare how you fit different roles:

```
Conversation 1: Interview for Data Analyst at ABC
Conversation 2: Interview for Data Engineer at Google
Conversation 3: Interview for Senior Analyst at Amazon

Then compare the three conversations manually or with a summary
```

---

### **Tip 6: Ensure Job Posting is Embedded**

Before trying to interview for a role:

```powershell
# Make sure the job posting is embedded:
Ctrl+Shift+B → "Embed Job Postings to Upstash"

# Verify in the output:
✅ Successfully embedded 1 job posting(s)
```

If not embedded, Claude won't find it!

---

### **Tip 7: Update Profile Between Interviews**

If you update your profile (`digitaltwin_clean.json`), re-embed it:

```powershell
Ctrl+Shift+B → "Embed Digital Twin Profile"
```

Then run a new interview conversation. Claude will query the new profile data.

---

### **Tip 8: Save & Share Results**

After interview, save Claude conversation for:
- Hiring team feedback
- Future reference
- Comparing multiple interview results
- Building interview precedents

---

### **Tip 9: Create Your Own Job Posting**

Add new job postings anytime:

1. Create file: `job-postings/job_mycompany.md`
2. Add format:
   ```
   # Job Title
   
   **Company:** Name
   **Location:** City
   **Salary:** Range
   
   ## About the Role
   [Job description...]
   ```
3. Run: `Ctrl+Shift+B` → "Embed Job Postings"
4. Now you can interview for that role!

---

### **Tip 10: Customize Search Queries for Better Results**

Make your search queries specific for better results:

```
VAGUE: "Data skills"
SPECIFIC: "Data Analyst SQL Power BI reporting cloud"

VAGUE: "Cloud job"
SPECIFIC: "Cloud Architect AWS Azure GCP Terraform Infrastructure"

VAGUE: "Manager role"
SPECIFIC: "Engineering Manager leadership Python Java backend"
```

Specific queries = Better tool results = Better interview recommendations

---

### **Tip 2: Add Role-Specific Context**

Customize the technical assessment for different roles:

**For Data Science role:**
```
Conduct TECHNICAL ASSESSMENT phase for Data Science role.
Query job posting for technical requirements: Statistics, ML algorithms, Python/R, Big Data.
Query candidate profile...
```

**For Frontend Engineer role:**
```
Conduct TECHNICAL ASSESSMENT phase for Frontend Engineer role.
Query job posting for technical requirements: React/Vue, CSS, JavaScript, TypeScript, Testing.
Query candidate profile...
```

**For Solutions Architect role:**
```
Conduct TECHNICAL ASSESSMENT phase for Solutions Architect role.
Query job posting for technical requirements: Cloud platforms, System design, Enterprise solutions, Team leadership.
Query candidate profile...
```

---

### **Tip 3: Run Commands in Sequence**

In one Claude conversation, you can run multiple assessment commands:

```
First message: COMMAND 7 (Competency Scores)
Claude provides scores for the role...

Second message: "Now do COMMAND 5 (Behavioral assessment)"
Claude assesses soft skills...

Third message: "Give me COMMAND 8 (Recommendation)"
Claude makes hiring decision based on both assessments

Fourth message: "Create COMMAND 9 (Development Roadmap) if we hire them"
Claude creates onboarding plan
```

---

### **Tip 4: Compare Multiple Job Roles**

Assess ONE candidate against MULTIPLE jobs in same conversation:

```
Message 1: "Conduct COMMAND 1 for Data Analyst at Google"
Claude assesses candidate for Data Analyst role...

Message 2: "Now assess same candidate for Data Engineer at Google"
Claude assesses candidate for Data Engineer role...

Message 3: "Which role is better fit based on skills and background?"
Claude compares both assessments and recommends best fit
```

---

### **Tip 5: Filter by Job Source**

If you have multiple job postings embedded, you can specify which one:

```
"Conduct interview for Senior Developer role at Google" 
(Claude will automatically find Google job posting from vector DB)

OR be specific:

"Use job posting ID job_google_senior_dev and conduct COMMAND 2"
```

---

### **Tip 6: Save & Share Conversations**

After interview assessment, save the conversation for:
- Future reference when deciding between candidates
- Sharing assessment with hiring team
- Building interview precedents for same role
- Comparing multiple candidates side-by-side

```
In Claude Desktop menu:
  → Save this conversation
  → Share with team/manager
  → Reference for future interviews
```

---

### **Tip 7: Update Profile & Jobs Between Interviews**

When you want to interview for a new role:

1. **Add new job posting:**
   - Create `job-postings/job_newcompany.md` with job details
   - Run `Ctrl+Shift+B` → "Embed Job Postings"

2. **Update candidate profile:**
   - Edit `digitaltwin_clean.json` with new experiences/skills
   - Run `Ctrl+Shift+B` → "Embed Digital Twin Profile"

3. **Run interview with updated data:**
   - Paste command with new job title
   - Claude queries updated data automatically

---

## 🚀 QUICK START

**New to this? Try this:**

1. **Choose a job role you want to interview for** (e.g., "Senior Developer at Google")
2. **Make sure job posting is embedded:** `Ctrl+Shift+B` → "Embed Job Postings"
3. **Copy COMMAND 2** (Full 4-Phase Interview) above
4. **Replace placeholders:**
   - `[JOB_TITLE]` → "Senior Developer"
   - `[COMPANY]` → "Google"
   - `[LOCATION]` → "Mountain View"
5. **Open Claude Desktop**
6. **Start NEW conversation**
7. **Paste the customized command**
8. **Watch Claude interview the candidate automatically!**

**Result:** You'll get a complete 4-phase assessment with competency scores and hiring recommendation in ~30 minutes.

---

## 📝 NOTES

### **Candidate Profile Data**
- Your profile data is stored in `digitaltwin_clean.json`
- All commands automatically query YOUR profile via MCP tools
- Update your profile: Edit `digitaltwin_clean.json` → Run `Ctrl+Shift+B` → "Embed Digital Twin Profile"

### **Job Posting Data**
- Job postings are stored in `job-postings/` folder as markdown files  
- Create new job posting: `job-postings/job_example.md`
- Embed jobs: `Ctrl+Shift+B` → "Embed Job Postings to Upstash"
- MCP tools automatically find and query relevant job postings
- Supported sources: Seek, LinkedIn, Indeed, custom job descriptions

### **MCP Tools Used**
These commands automatically call these MCP tools behind the scenes:
- `query_digital_twin(query)` - Searches your profile data
- `query_job_postings(query)` - Searches job postings
- `get_job_posting(job_id)` - Fetches specific job details
- `list_job_postings()` - Lists all available jobs

### **Interview Workflow**
```
1. Embed job posting (Ctrl+Shift+B) → New job data in vector DB
2. Update profile if needed (Ctrl+Shift+B) → Latest profile in vector DB
3. Copy command template → Customize with job title/company
4. Paste in Claude Desktop → MCP tools automatically query data
5. Get assessment & hiring recommendation
```

### **Common Questions**

**Q: Can I interview for multiple roles?**
A: Yes! In one conversation, run multiple commands for different jobs to compare fit.

**Q: What if job posting isn't found?**
A: Make sure it's embedded first: `Ctrl+Shift+B` → "Embed Job Postings"

**Q: Can I add my own job posting?**
A: Yes! Create markdown file in `job-postings/` and embed it.

**Q: What happens if I update my profile?**
A: Claude queries the latest embedded version automatically after you run `Ctrl+Shift+B` → "Embed Digital Twin Profile"

---

**Last Updated:** February 11, 2026  
**System:** Digital Twin + MCP Interview Assessment  
**Works With:** Any job role (Seek, LinkedIn, Indeed, custom postings)  
**Status:** Ready to use with any interview scenario!
