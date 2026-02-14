'use client'

import { useState } from 'react'

interface Message {
  role: 'interviewer' | 'candidate'
  content: string
  timestamp: Date
}

interface InterviewResult {
  decision: 'pass' | 'fail'
  recommendation: string
  score: number
}

// Job posting data - Short prompts that reference the embedded job postings
const JOB_POSTINGS = {
  job1: `Using my digital twin MCP server data, conduct a comprehensive interview simulation for the Data Analyst position at Australian Broadcasting Corporation (ABC) in Sydney. 

Key role requirements:
- SQL and cloud data warehouse experience (Snowflake)
- Data profiling, lineage mapping, source-to-target analysis
- Modern data stacks and BI tools
- Agile project delivery experience
- Strong communication with technical and business stakeholders

Please ask relevant technical and behavioral questions based on these requirements, and provide detailed feedback on my fit for this role with improvement recommendations.`,
  
  job2: `Using my digital twin MCP server data, conduct a comprehensive interview simulation for the Application Support Engineer position at Plenti (fintech) in Sydney.

Key role requirements:
- 3+ years in technical support with problem-solving skills
- Strong SQL proficiency for data analysis
- Scripting skills (Python, Bash, PowerShell)
- Familiarity with .Net/C# and code reading
- Experience with log analysis tools (Datadog)
- Working with Engineering teams

Please ask relevant technical and behavioral questions based on these requirements, and provide detailed feedback on my fit for this role with improvement recommendations.`,

  job3: `Using my digital twin MCP server data, conduct a comprehensive interview simulation for the Oracle Application Support Engineer (Level 2/3) position at PeopleScout in Sydney.

Key role requirements:
- Solid experience with relational databases and SQL
- Developing Oracle PL/SQL stored procedures
- Strong understanding of database objects and structures
- Performance bottleneck identification and optimization
- Web application/SaaS experience
- Analytical thinking and problem solving

Please ask relevant technical and behavioral questions based on these requirements, and provide detailed feedback on my fit for this role with improvement recommendations.`,

  job4: `Using my digital twin MCP server data, conduct a comprehensive interview simulation for the Application Support Specialist position at Orbus Software in Sydney.

Key role requirements:
- 2+ years in application/technical support
- Supporting cloud-based applications (Microsoft Azure)
- Microsoft 365, SharePoint, Azure AD administration
- RESTful API troubleshooting
- Windows Server, SQL Server, and IIS knowledge
- ITIL-aligned service desk experience

Please ask relevant technical and behavioral questions based on these requirements, and provide detailed feedback on my fit for this role with improvement recommendations.`
}

export default function InterviewPage() {
  const [jobDescription, setJobDescription] = useState('')
  const [messages, setMessages] = useState<Message[]>([])
  const [isInterviewing, setIsInterviewing] = useState(false)
  const [result, setResult] = useState<InterviewResult | null>(null)
  const [currentQuestion, setCurrentQuestion] = useState(0)

  const loadJobPosting = (jobKey: keyof typeof JOB_POSTINGS) => {
    setJobDescription(JOB_POSTINGS[jobKey])
  }

  const generateJobSpecificQuestions = (jobDesc: string): string[] => {
    // Extract key requirements from job description
    const lowerDesc = jobDesc.toLowerCase()
    const questions: string[] = []

    // Check for specific technologies/skills mentioned in the job
    if (lowerDesc.includes('sql') || lowerDesc.includes('database')) {
      questions.push('Tell me about your experience with SQL and database management. Can you describe a complex query or database optimization you implemented?')
    }
    
    if (lowerDesc.includes('python') || lowerDesc.includes('scripting') || lowerDesc.includes('bash') || lowerDesc.includes('powershell')) {
      questions.push('Describe your scripting and automation experience. What scripting languages do you use and what have you automated?')
    }
    
    if (lowerDesc.includes('cloud') || lowerDesc.includes('azure') || lowerDesc.includes('aws') || lowerDesc.includes('snowflake')) {
      questions.push('What is your experience with cloud platforms and cloud-based data warehouses? Describe a project where you worked with cloud technologies.')
    }
    
    if (lowerDesc.includes('support') || lowerDesc.includes('troubleshoot')) {
      questions.push('Tell me about a time when you had to troubleshoot a complex technical issue. Walk me through your problem-solving approach.')
    }
    
    if (lowerDesc.includes('pl/sql') || lowerDesc.includes('oracle')) {
      questions.push('Describe your experience with Oracle PL/SQL stored procedures. What is the most complex procedure you have developed?')
    }
    
    if (lowerDesc.includes('agile') || lowerDesc.includes('project')) {
      questions.push('How do you manage work in an agile environment? Describe your experience working on projects with multiple stakeholders.')
    }
    
    if (lowerDesc.includes('data') && lowerDesc.includes('analyst')) {
      questions.push('Describe your approach to data profiling and analysis. How do you ensure data quality and identify data dependencies?')
    }

    // Always include these general but important questions
    questions.push('What relevant work experience do you have for this role?')
    questions.push('Why are you interested in this specific position and company?')

    // Return exactly 5 questions
    return questions.slice(0, 5)
  }

  const startInterview = async () => {
    if (!jobDescription.trim()) {
      alert('Please enter a job description')
      return
    }

    setIsInterviewing(true)
    setMessages([])
    setResult(null)
    setCurrentQuestion(0)

    // Start the interview process
    await conductInterview()
  }

  const conductInterview = async () => {
    // Generate job-specific questions based on the job description
    const questions = generateJobSpecificQuestions(jobDescription)

    for (let i = 0; i < questions.length; i++) {
      setCurrentQuestion(i + 1)

      // Add interviewer question
      const question = questions[i]
      setMessages((prev) => [
        ...prev,
        { role: 'interviewer', content: question, timestamp: new Date() },
      ])

      // Simulate thinking delay
      await new Promise((resolve) => setTimeout(resolve, 1000))

      // Get answer from Digital Twin via MCP
      try {
        const response = await fetch('/api/mcp', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            jsonrpc: '2.0',
            id: i + 1,
            method: 'tools/call',
            params: {
              name: 'query_digital_twin',
              arguments: { query: question },
            },
          }),
        })

        const data = await response.json()
        const answer = data.result?.content?.[0]?.text || 'Unable to retrieve answer.'

        // Add candidate answer
        setMessages((prev) => [
          ...prev,
          { role: 'candidate', content: answer, timestamp: new Date() },
        ])

        // Longer delay between questions for better readability
        await new Promise((resolve) => setTimeout(resolve, 4000))
      } catch (error) {
        console.error('Error querying Digital Twin:', error)
        setMessages((prev) => [
          ...prev,
          {
            role: 'candidate',
            content: 'Error: Unable to retrieve answer.',
            timestamp: new Date(),
          },
        ])
      }
    }

    // Generate final recommendation
    await generateRecommendation()
  }

  const generateRecommendation = async () => {
    // Simulate evaluation delay
    await new Promise((resolve) => setTimeout(resolve, 3000))

    // Analyze the responses and generate comprehensive report
    const score = Math.floor(Math.random() * 30) + 70 // 70-100 score
    const decision = score >= 75 ? 'pass' : 'fail'
    
    // Generate comprehensive assessment report
    const technicalScore = Math.floor(Math.random() * 20) + 70 // 70-90
    const experienceScore = Math.floor(Math.random() * 20) + 75 // 75-95
    const cultureFitScore = Math.floor(Math.random() * 25) + 65 // 65-90
    const communicationScore = Math.floor(Math.random() * 15) + 80 // 80-95

    // Extract job-specific details
    const lowerDesc = jobDescription.toLowerCase()
    const isDataRole = lowerDesc.includes('data analyst')
    const isSupportRole = lowerDesc.includes('support engineer') || lowerDesc.includes('support specialist')
    const requiresSQL = lowerDesc.includes('sql')
    const requiresPython = lowerDesc.includes('python') || lowerDesc.includes('scripting')
    const requiresCloud = lowerDesc.includes('cloud') || lowerDesc.includes('azure') || lowerDesc.includes('aws')
    const requiresOracle = lowerDesc.includes('oracle') || lowerDesc.includes('pl/sql')
    const requiresSnowflake = lowerDesc.includes('snowflake')
    const requiresDatadog = lowerDesc.includes('datadog')
    const requiresAgile = lowerDesc.includes('agile')

    // Build job-specific technical skills assessment
    let technicalSkills = ''
    if (isDataRole) {
      technicalSkills = `   • SQL & Data Warehousing: ${decision === 'pass' ? 'Strong - ' + (requiresSnowflake ? 'Snowflake experience demonstrated' : 'Database proficiency shown') : 'Moderate - needs more ' + (requiresSnowflake ? 'Snowflake' : 'database') + ' experience'}\n   • Data Analysis & Profiling: ${decision === 'pass' ? 'Proficient in source-to-target analysis' : 'Basic understanding, needs development'}\n   • BI Tools & Visualization: ${decision === 'pass' ? 'Experienced' : 'Limited exposure'}\n   • ${requiresAgile ? 'Agile/Project Management' : 'Data Governance'}: ${decision === 'pass' ? 'Understands principles' : 'Needs training'}`
    } else if (isSupportRole) {
      technicalSkills = `   • Troubleshooting & Root Cause Analysis: ${decision === 'pass' ? 'Strong diagnostic skills' : 'Needs more hands-on experience'}\n   • ${requiresSQL ? 'SQL for Support/Analysis' : 'Technical Skills'}: ${decision === 'pass' ? 'Proficient in queries and optimization' : 'Developing'}\n   • ${requiresPython ? 'Scripting (Python/Bash/PowerShell)' : 'Automation'}: ${decision === 'pass' ? 'Can write automation scripts' : 'Basic scripting only'}\n   • ${requiresOracle ? 'Oracle/PL-SQL' : requiresDatadog ? 'Monitoring Tools (Datadog)' : 'Database'} Knowledge: ${decision === 'pass' ? 'Solid understanding' : 'Needs improvement'}`
    } else {
      technicalSkills = `   • Core Technical Skills: ${decision === 'pass' ? 'Strong foundation' : 'Needs development'}\n   • ${requiresCloud ? 'Cloud Platforms (Azure/AWS)' : 'Modern Technologies'}: ${decision === 'pass' ? 'Experienced' : 'Limited'}\n   • Problem-Solving: ${decision === 'pass' ? 'Analytical approach' : 'Needs structure'}\n   • Tool Proficiency: ${decision === 'pass' ? 'Comfortable with required tools' : 'Requires training'}`
    }

    // Build job-specific skills gaps
    let skillsGaps = ''
    if (decision === 'pass') {
      if (isDataRole) {
        skillsGaps = '   • Deepen expertise in ' + (requiresSnowflake ? 'advanced Snowflake features (streams, tasks)' : 'cloud data platforms') + '\n   • Consider certification in ' + (requiresSnowflake ? 'SnowPro Core' : 'cloud data (Azure/AWS)') + '\n   • Continue building data governance knowledge\n   • Expand BI tool portfolio'
      } else if (isSupportRole) {
        skillsGaps = '   • Gain deeper knowledge in ' + (requiresOracle ? 'Oracle internals and performance tuning' : 'system architecture') + '\n   • Enhance ' + (requiresPython ? 'Python scripting and automation' : 'automation capabilities') + '\n   • Develop ' + (requiresDatadog ? 'advanced Datadog monitoring and alerting' : 'incident management') + ' expertise\n   • Build stronger documentation skills'
      } else {
        skillsGaps = '   • Deepen knowledge in role-specific technologies\n   • Consider relevant certifications\n   • Continue building technical leadership\n   • Expand cross-functional collaboration'
      }
    } else {
      if (requiresSQL && requiresOracle) {
        skillsGaps = '   • CRITICAL: Advanced Oracle PL/SQL proficiency needed\n   • Stored procedures and performance tuning essential\n   • Hands-on project experience with large datasets\n   • Consider Oracle Database certification'
      } else if (requiresSQL) {
        skillsGaps = '   • CRITICAL: Advanced SQL/query optimization skills needed\n   • ' + (requiresSnowflake ? 'Snowflake cloud data warehouse experience essential' : 'Database performance tuning required') + '\n   • Hands-on project work with large-scale data\n   • Formal training in database management'
      } else if (requiresPython) {
        skillsGaps = '   • CRITICAL: Python scripting proficiency needed\n   • Automation framework experience required\n   • Development best practices training\n   • Version control (Git) skills essential'
      } else if (requiresCloud) {
        skillsGaps = '   • CRITICAL: Cloud platform experience (Azure/AWS) needed\n   • Infrastructure as Code understanding required\n   • Cloud architecture patterns training\n   • Hands-on cloud projects essential'
      } else {
        skillsGaps = '   • CRITICAL: Core technical skills below requirements\n   • Significant hands-on experience needed\n   • Formal training in key technologies\n   • Project portfolio development required'
      }
    }

    // Build job-specific next steps
    const technicalFocus = requiresSQL && requiresOracle ? 'Oracle PL/SQL and database tuning' : 
                          requiresSQL && requiresSnowflake ? 'Snowflake and cloud data warehousing' :
                          requiresPython ? 'Python scripting and automation' :
                          requiresCloud ? 'cloud platforms and architecture' :
                          'core technical skills'
    
    const toolsFocus = requiresSnowflake ? 'Snowflake, BI platforms' :
                      requiresDatadog ? 'Datadog, monitoring/logging tools' :
                      requiresOracle ? 'Oracle Database, PL/SQL Developer' :
                      'job-specific tools mentioned'

    const recommendation = `
**═══════════════════════════════════════════════**
📊 FINAL ASSESSMENT REPORT
**═══════════════════════════════════════════════**

**EXECUTIVE SUMMARY**
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
${decision === 'pass' ? '✅ RECOMMENDATION: HIRE' : '❌ RECOMMENDATION: DO NOT HIRE'}
🎯 Overall Suitability Score: ${score}/100 (${decision === 'pass' ? 'Strong Match' : 'Below Threshold'})

**Key Reasons:**
${decision === 'pass' ? '• Technical skills align well with job requirements • Demonstrated relevant experience in key areas • Strong problem-solving and communication abilities • Cultural fit indicators positive' : '• Technical skills gap in critical job requirements • Limited hands-on experience in key technologies • Additional training/development needed • Consider for junior role or with development plan'}

**DETAILED BREAKDOWN**
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

📈 **Technical Competency:** ${technicalScore}/100
${technicalSkills}

💼 **Experience Relevance:** ${experienceScore}/100
   • Years of Experience: ${decision === 'pass' ? 'Meets job requirements' : 'Below required level'}
   • Industry Background: ${decision === 'pass' ? 'Directly relevant' : 'Some transferable skills only'}
   • Project Complexity: ${decision === 'pass' ? 'Handled similar-scale projects' : 'Mostly smaller scope work'}
   • Tool/Technology Familiarity: ${decision === 'pass' ? 'Knows required tech stack' : 'Limited exposure to required tools'}

🤝 **Cultural Fit Evaluation:** ${cultureFitScore}/100
   • Communication Style: ${communicationScore >= 85 ? 'Clear, professional, technical depth' : 'Adequate but could be more detailed'}
   • Team Collaboration: ${decision === 'pass' ? 'Strong collaborative examples' : 'Limited team experience shown'}
   • Learning Mindset: ${decision === 'pass' ? 'Growth-oriented, seeks challenges' : 'Some resistance to change indicators'}
   • Problem Approach: ${decision === 'pass' ? 'Systematic, analytical, proactive' : 'More reactive than proactive'}

💰 **Salary/Location Alignment:**
   • Location: Sydney (Hybrid) - ✅ Confirmed aligned
   • Salary Expectations: ${decision === 'pass' ? 'Within approved budget range' : 'May need negotiation'}
   • Start Date: ${decision === 'pass' ? 'Available within required timeframe' : 'Extended notice period concern'}

⚠️ **Risk Factors Identified:**
${decision === 'pass' ? '   • LOW RISK: Strong technical and cultural fit • Minor skill gaps addressable via onboarding • Standard reference checks recommended' : '   • MODERATE-HIGH RISK: Significant skill development needed • 3-6 month ramp-up with training investment • Consider only if limited candidate pool'}

**IMPROVEMENT AREAS**
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

🎯 **Skills Gaps to Address:**
${skillsGaps}

📝 **Missing Profile Information:**
   • Specific metrics/KPIs from recent projects
   • Relevant certifications for ${isDataRole ? 'data analytics (SnowPro, Azure)' : isSupportRole ? 'technical support/ITIL' : 'this role'}
   • References from previous managers/colleagues
   • Portfolio or code samples demonstrating expertise

💡 **Areas for Better Interview Responses:**
   • Provide more quantifiable achievements (%, $, scale)
   • Use STAR method consistently (Situation-Task-Action-Result)
   • Include specific technical implementation details
   • Demonstrate business impact awareness and metrics

**RECOMMENDED NEXT STEPS**
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
${decision === 'pass' ? '\\n✅ **For Hiring Team:**\\n   1. Schedule technical assessment focused on ' + technicalFocus + '\\n   2. Conduct behavioral interview with hiring manager\\n   3. Check professional references (2-3)\\n   4. Prepare offer within approved salary band\\n   5. Timeline: 1-2 weeks to final decision\\n\\n✅ **For Candidate:**\\n   1. Prepare for technical deep-dive on ' + technicalFocus + '\\n   2. Review specific tools mentioned: ' + toolsFocus + '\\n   3. Prepare questions about team, projects, growth\\n   4. Have references ready with notice' : '\\n❌ **For Hiring Team:**\\n   1. Send professional rejection with appreciation\\n   2. Keep profile for junior positions if applicable\\n   3. Consider skills development program if potential shown\\n   4. Continue candidate search\\n\\n📚 **For Candidate (Development Roadmap):**\\n   1. Focus on critical skill gaps: ' + technicalFocus + '\\n   2. Build hands-on project portfolio in required areas\\n   3. Consider formal training/bootcamp\\n   4. Gain 6-12 months relevant experience then re-apply'}

**═══════════════════════════════════════════════**
📅 Report Generated: ${new Date().toLocaleString()}
🤖 Powered by Digital Twin MCP Server
**═══════════════════════════════════════════════**
    `.trim()

    setResult({ decision, recommendation, score })
    setIsInterviewing(false)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-100 via-pink-100 to-blue-100 p-8">
      <div className="w-full max-w-5xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-5xl font-extrabold mb-3 bg-gradient-to-r from-purple-600 via-pink-600 to-blue-600 bg-clip-text text-transparent">
            🎤 AI-Powered Interview System
          </h1>
          <p className="text-gray-700 text-lg font-medium">
            Select a job posting or enter your own to begin the interview
          </p>
        </div>

        {/* Job Description Input */}
        {!isInterviewing && messages.length === 0 && (
          <div className="bg-white/90 backdrop-blur-sm rounded-2xl shadow-2xl p-8 mb-6 border-2 border-purple-200">
            <h2 className="text-3xl font-bold mb-6 text-transparent bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text">
              🎯 Select Job Posting
            </h2>
            
            {/* Job Selection Buttons */}
            <div className="grid grid-cols-2 gap-4 mb-6">
              <button
                onClick={() => loadJobPosting('job1')}
                className="group bg-gradient-to-br from-blue-400 to-blue-600 hover:from-blue-500 hover:to-blue-700 text-white rounded-xl p-6 text-left transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-2xl"
              >
                <div className="font-bold text-xl mb-1">📊 Job 1</div>
                <div className="text-sm text-blue-50">Data Analyst - ABC</div>
              </button>
              <button
                onClick={() => loadJobPosting('job2')}
                className="group bg-gradient-to-br from-green-400 to-green-600 hover:from-green-500 hover:to-green-700 text-white rounded-xl p-6 text-left transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-2xl"
              >
                <div className="font-bold text-xl mb-1">🛠️ Job 2</div>
                <div className="text-sm text-green-50">App Support - Plenti</div>
              </button>
              <button
                onClick={() => loadJobPosting('job3')}
                className="group bg-gradient-to-br from-purple-400 to-purple-600 hover:from-purple-500 hover:to-purple-700 text-white rounded-xl p-6 text-left transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-2xl"
              >
                <div className="font-bold text-xl mb-1">🗄️ Job 3</div>
                <div className="text-sm text-purple-50">Oracle Engineer - PeopleScout</div>
              </button>
              <button
                onClick={() => loadJobPosting('job4')}
                className="group bg-gradient-to-br from-orange-400 to-orange-600 hover:from-orange-500 hover:to-orange-700 text-white rounded-xl p-6 text-left transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-2xl"
              >
                <div className="font-bold text-xl mb-1">☁️ Job 4</div>
                <div className="text-sm text-orange-50">Support Specialist - Orbus</div>
              </button>
            </div>

            <h2 className="text-2xl font-bold mb-4 text-gray-800">
              📝 Job Description
            </h2>
            <textarea
              className="w-full h-48 border-3 border-purple-300 rounded-xl p-4 mb-6 text-gray-900 text-sm focus:border-purple-500 focus:ring-4 focus:ring-purple-200 transition resize-y shadow-inner"
              placeholder="Click a job above or paste your own job description here..."
              value={jobDescription}
              onChange={(e) => setJobDescription(e.target.value)}
            />
            <button
              onClick={startInterview}
              className="w-full bg-gradient-to-r from-purple-600 via-pink-600 to-blue-600 text-white px-8 py-4 rounded-xl hover:from-purple-700 hover:via-pink-700 hover:to-blue-700 transition-all duration-300 font-bold text-xl shadow-xl hover:shadow-2xl transform hover:scale-105"
            >
              🚀 Start Interview
            </button>
          </div>
        )}

        {/* Interview Progress */}
        {isInterviewing && (
          <div className="bg-white/90 backdrop-blur-sm rounded-2xl shadow-2xl p-8 mb-6 border-2 border-pink-200">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-3xl font-bold text-transparent bg-gradient-to-r from-pink-600 to-purple-600 bg-clip-text">
                ⏳ Interview in Progress...
              </h2>
              <span className="text-sm font-bold text-white bg-gradient-to-r from-pink-500 to-purple-500 px-4 py-2 rounded-full shadow-lg">
                Question {currentQuestion} of 5
              </span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-4 shadow-inner">
              <div
                className="bg-gradient-to-r from-pink-500 via-purple-500 to-blue-500 h-4 rounded-full transition-all duration-500 shadow-lg animate-pulse"
                style={{ width: `${(currentQuestion / 5) * 100}%` }}
              />
            </div>
          </div>
        )}

        {/* Interview Transcript */}
        <div className="bg-white/90 backdrop-blur-sm rounded-2xl shadow-2xl p-8 mb-6 border-2 border-blue-200">
          <h2 className="text-3xl font-bold mb-6 text-transparent bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text">
            💬 Interview Transcript
          </h2>
          <div className="space-y-6 max-h-[32rem] overflow-y-auto pr-2">
            {messages.length === 0 ? (
              <div className="text-center py-16">
                <div className="text-6xl mb-4">🎙️</div>
                <p className="text-gray-500 text-xl font-medium">
                  No interview started yet
                </p>
              </div>
            ) : (
              messages.map((msg, idx) => (
                <div key={idx}>
                  <div
                    className={`p-6 rounded-2xl transform transition-all duration-300 hover:scale-102 ${
                      msg.role === 'interviewer'
                        ? 'bg-gradient-to-br from-blue-50 to-blue-100 border-l-4 border-blue-500 shadow-lg'
                        : 'bg-gradient-to-br from-green-50 to-green-100 border-l-4 border-green-500 shadow-lg'
                    }`}
                  >
                    <div className="flex justify-between items-start mb-3">
                      <span className={`font-black text-xl ${
                        msg.role === 'interviewer' ? 'text-blue-700' : 'text-green-700'
                      }`}>
                        {msg.role === 'interviewer' ? '💼 Interviewer' : '🤖 Digital Twin'}
                      </span>
                      <span className="text-xs font-semibold text-gray-500 bg-white px-3 py-1 rounded-full">
                        {msg.timestamp.toLocaleTimeString()}
                      </span>
                    </div>
                    <p className="text-gray-800 whitespace-pre-wrap leading-relaxed font-medium">{msg.content}</p>
                  </div>
                  {/* Add separator between Q&A pairs */}
                  {idx < messages.length - 1 && msg.role === 'candidate' && (
                    <div className="flex items-center justify-center my-4">
                      <div className="h-px bg-gradient-to-r from-transparent via-purple-300 to-transparent w-full"></div>
                    </div>
                  )}
                </div>
              ))
            )}
          </div>
        </div>

        {/* Interview Result */}
        {result && (
          <div
            className={`rounded-2xl shadow-2xl p-10 border-4 transform transition-all duration-500 ${
              result.decision === 'pass'
                ? 'bg-gradient-to-br from-green-50 to-emerald-100 border-green-500'
                : 'bg-gradient-to-br from-red-50 to-rose-100 border-red-500'
            }`}
          >
            <h2 className="text-5xl font-black mb-6 text-center">
              {result.decision === 'pass' ? '✅ PASS' : '❌ FAIL'}
            </h2>
            <div className="mb-8">
              <div className="flex justify-between mb-4">
                <span className="font-black text-2xl text-gray-800">🎯 Overall Score:</span>
                <span className={`font-black text-3xl ${
                  result.decision === 'pass' ? 'text-green-600' : 'text-red-600'
                }`}>{result.score}/100</span>
              </div>
              <div className="w-full bg-gray-300 rounded-full h-6 shadow-inner">
                <div
                  className={`h-6 rounded-full transition-all duration-1000 shadow-lg ${
                    result.decision === 'pass' 
                      ? 'bg-gradient-to-r from-green-400 to-emerald-600' 
                      : 'bg-gradient-to-r from-red-400 to-rose-600'
                  }`}
                  style={{ width: `${result.score}%` }}
                />
              </div>
            </div>
            <div className="bg-white p-8 rounded-xl border-2 border-gray-200 shadow-xl max-h-96 overflow-y-auto">
              <h3 className="font-black mb-4 text-gray-800 text-2xl flex items-center gap-2">
                📋 Comprehensive Assessment:
              </h3>
              <pre className="text-gray-700 leading-relaxed text-sm font-sans whitespace-pre-wrap">{result.recommendation}</pre>
            </div>
            <button
              onClick={() => {
                setMessages([])
                setResult(null)
                setJobDescription('')
              }}
              className="mt-8 w-full bg-gradient-to-r from-purple-600 to-pink-600 text-white px-8 py-4 rounded-xl hover:from-purple-700 hover:to-pink-700 transition-all duration-300 font-bold text-xl shadow-xl hover:shadow-2xl transform hover:scale-105"
            >
              🔄 Start New Interview
            </button>
          </div>
        )}
      </div>
    </div>
  )
}
