'use server'

import { 
  ragQuery as ragQueryCore,
  queryExperience as queryExperienceCore,
  querySkills as querySkillsCore,
  queryProjects as queryProjectsCore,
  queryEducation as queryEducationCore,
  queryCareerGoals as queryCareerGoalsCore,
  digitalTwinTools,
  healthCheck as healthCheckCore,
  type RAGResponse
} from '@/lib/digital-twin'

// Server action wrapper for error handling
async function executeRAGAction<T>(
  action: () => Promise<T>,
  actionName: string
): Promise<{ success: boolean; result?: T; error?: { code: number; message: string } }> {
  try {
    const result = await action()
    return {
      success: true,
      result
    }
  } catch (error) {
    console.error(`Error in ${actionName}:`, error)
    return {
      success: false,
      error: {
        code: -32603,
        message: error instanceof Error ? error.message : `Internal error in ${actionName}`
      }
    }
  }
}

// General RAG query action
export async function ragQuery(question: string, useLLMFormatting: boolean = true) {
  return executeRAGAction(
    () => ragQueryCore(question, useLLMFormatting),
    'ragQuery'
  )
}

// Specialized query actions
export async function queryExperience() {
  return executeRAGAction(
    () => queryExperienceCore(),
    'queryExperience'
  )
}

export async function querySkills() {
  return executeRAGAction(
    () => querySkillsCore(),
    'querySkills'
  )
}

export async function queryProjects() {
  return executeRAGAction(
    () => queryProjectsCore(),
    'queryProjects'
  )
}

export async function queryEducation() {
  return executeRAGAction(
    () => queryEducationCore(),
    'queryEducation'
  )
}

export async function queryCareerGoals() {
  return executeRAGAction(
    () => queryCareerGoalsCore(),
    'queryCareerGoals'
  )
}

// Health check action
export async function healthCheck() {
  return executeRAGAction(
    () => healthCheckCore(),
    'healthCheck'
  )
}

// Interview enrichment action - takes simple command and enriches with template
export async function enrichInterviewCommand(
  jobTitle: string, 
  company: string, 
  location: string = ''
) {
  return executeRAGAction(
    async () => {
      try {
        // Read the interview template from data folder
        const fs = await import('fs/promises')
        const path = await import('path')
        
        const templatePath = path.resolve(
          process.cwd(),
          '..',
          'data',
          'interview-template.json'
        )
        
        let template: any = {}
        
        try {
          const templateContent = await fs.readFile(templatePath, 'utf-8')
          template = JSON.parse(templateContent)
        } catch {
          // Fallback if template file not found - return basic structure
          template = {
            critical_rules: [
              'RULE 1: ONLY use data from query_digital_twin and query_job_postings tools',
              'RULE 2: NEVER hallucinate or make up skills, experience, or education',
              'RULE 3: If a specific skill is NOT in profile, honestly state: "I don\'t have experience with [topic]"'
            ]
          }
        }

        // Generate enriched interview instructions
        const query = `${jobTitle} ${company} ${location}`.trim()
        
        const enrichedInstructions = `# 🎯 STRUCTURED INTERVIEW - 5 QUESTIONS ONLY

You MUST follow this exact structure. Do not deviate.

**JOB:** ${jobTitle} at ${company}${location ? ', ' + location : ''}

**CRITICAL RULES:**
${template.critical_rules?.map((rule: string) => `• ${rule}`).join('\n')}

---

## DO THIS NOW (In exact order):

### STEP 1: QUERY TOOLS

\`\`\`
Tool 1: query_job_postings("${query}")
Tool 2: query_digital_twin("What is my complete professional background, experience, skills, education, projects, and accomplishments?")
\`\`\`

Wait for both results.

---

### STEP 2: FILL IN THIS INTERVIEW TEMPLATE

Copy this template and fill in the [CANDIDATE ANSWER] sections ONLY with data from the query results. Do not skip any section.

---

## INTERVIEW EXECUTION

### Q1: PROFESSIONAL BACKGROUND

**Manager:** "Tell me about your professional background and how it relates to this ${jobTitle} role at ${company}."

**Candidate:** [CANDIDATE ANSWER - Use ONLY: Job titles, companies, years, skills from query_digital_twin]

---

### Q2: RELEVANT PROJECT

**Manager:** "Describe a specific project from your background that's relevant to this role. What technologies did you use?"

**Candidate:** [CANDIDATE ANSWER - Use ONLY: Project name, technologies, your role, outcomes from query_digital_twin]

---

### Q3: SOLVING PROBLEMS

**Manager:** "Walk me through a complex problem you solved. What was your approach?"

**Candidate:** [CANDIDATE ANSWER - Use ONLY: Problem, your approach, tools used, results from query_digital_twin]

---

### Q4: OWNERSHIP & COMMUNICATION

**Manager:** "Tell me about a time you took ownership of something and communicated with stakeholders."

**Candidate:** [CANDIDATE ANSWER - Use ONLY: Situation, your action, people involved, outcome from query_digital_twin]

---

### Q5: LEARNING TECHNOLOGIES

**Manager:** "How do you learn new technologies? Give me a specific recent example."

**Candidate:** [CANDIDATE ANSWER - Use ONLY: Technology, when learned, how learned, what you can do now from query_digital_twin]

---

### COMPETENCY SCORES (0-100 each)

Fill these in based ONLY on what was said in the 5 answers above:

| Competency | Score | Evidence Quote |
|------------|-------|-----------------|
| Technical Proficiency | ___ /100 | "[Quote from answers]" |
| Problem-Solving | ___ /100 | "[Quote from answers]" |
| Communication | ___ /100 | "[Quote from answers]" |
| Ownership | ___ /100 | "[Quote from answers]" |
| Learning Ability | ___ /100 | "[Quote from answers]" |

**OVERALL SCORE:** Average = ___ /100

---

### FINAL RECOMMENDATION

**HIRING DECISION:**
- [ ] **HIRE** (Score 85+, all strong competencies)
- [ ] **CONDITIONAL OFFER** (Score 75-84, trainable gaps)
- [ ] **DO NOT HIRE** (Score <75 or critical skill missing)

**PASS/FAIL:** 
- **PASS** = Score ≥ 75
- **FAIL** = Score < 75

**SUMMARY:**
- Overall fit (1 sentence):
- Strength 1 (with evidence):
- Strength 2 (with evidence):
- Gap 1 (with evidence):
- Gap 2 (with evidence):

**FINAL SCORE: ___ /100**

---

**VERIFICATION CHECKLIST:**
✓ Queried query_job_postings?
✓ Queried query_digital_twin?
✓ Filled BOTH candidate answer sections?
✓ All answers from tools only (no made-up data)?
✓ Scored all 5 competencies?
✓ Chose hiring recommendation?

If NO to any: Go back and fix it before finishing.

---

**ACTION: Execute STEP 1 now. Query the tools.**
        `.trim()

        return {
          instructions: enrichedInstructions,
          jobTitle,
          company,
          location,
          templateVersion: template.version || '1.0'
        }
      } catch (error) {
        throw new Error(`Failed to enrich interview command: ${error instanceof Error ? error.message : 'Unknown error'}`)
      }
    },
    'enrichInterviewCommand'
  )
}