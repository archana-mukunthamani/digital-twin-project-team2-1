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
    // Predefined interview questions (can be made dynamic)
    const questions = [
      'Tell me about your relevant work experience.',
      'What are your key technical skills?',
      'Describe a challenging project you worked on.',
      'What are your career goals?',
      'Why are you interested in this position?',
    ]

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

        // Delay before next question
        await new Promise((resolve) => setTimeout(resolve, 2000))
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
    await new Promise((resolve) => setTimeout(resolve, 2000))

    // In a real implementation, this would analyze the responses
    // For now, we'll use a simplified scoring system
    const score = Math.floor(Math.random() * 30) + 70 // 70-100 score

    const decision = score >= 75 ? 'pass' : 'fail'
    const recommendation =
      decision === 'pass'
        ? `Strong candidate with relevant experience and skills. Score: ${score}/100. Recommended for next interview round.`
        : `Candidate does not meet minimum requirements. Score: ${score}/100. Not recommended to proceed.`

    setResult({ decision, recommendation, score })
    setIsInterviewing(false)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 py-12 px-4">
      <div className="max-w-3xl mx-auto">
        <h1 className="text-4xl font-bold mb-2 text-gray-900 text-center">
          AI-Powered Interview System
        </h1>
        <p className="text-gray-600 text-center mb-8">
          Select a job posting or enter your own to begin the interview
        </p>

        {/* Job Description Input */}
        {!isInterviewing && messages.length === 0 && (
          <div className="bg-white rounded-xl shadow-lg p-8 mb-6">
            <h2 className="text-2xl font-semibold mb-4 text-gray-800">
              Select Job Posting
            </h2>
            
            {/* Job Selection Buttons */}
            <div className="grid grid-cols-2 gap-3 mb-6">
              <button
                onClick={() => loadJobPosting('job1')}
                className="bg-blue-50 hover:bg-blue-100 border-2 border-blue-200 rounded-lg p-4 text-left transition"
              >
                <div className="font-semibold text-blue-900">Job 1</div>
                <div className="text-sm text-blue-700">Data Analyst - ABC</div>
              </button>
              <button
                onClick={() => loadJobPosting('job2')}
                className="bg-green-50 hover:bg-green-100 border-2 border-green-200 rounded-lg p-4 text-left transition"
              >
                <div className="font-semibold text-green-900">Job 2</div>
                <div className="text-sm text-green-700">App Support - Plenti</div>
              </button>
              <button
                onClick={() => loadJobPosting('job3')}
                className="bg-purple-50 hover:bg-purple-100 border-2 border-purple-200 rounded-lg p-4 text-left transition"
              >
                <div className="font-semibold text-purple-900">Job 3</div>
                <div className="text-sm text-purple-700">Oracle Engineer - PeopleScout</div>
              </button>
              <button
                onClick={() => loadJobPosting('job4')}
                className="bg-orange-50 hover:bg-orange-100 border-2 border-orange-200 rounded-lg p-4 text-left transition"
              >
                <div className="font-semibold text-orange-900">Job 4</div>
                <div className="text-sm text-orange-700">Support Specialist - Orbus</div>
              </button>
            </div>

            <h2 className="text-xl font-semibold mb-3 text-gray-800">
              Job Description
            </h2>
            <textarea
              className="w-full h-48 border-2 border-gray-300 rounded-lg p-4 mb-4 text-gray-900 text-sm focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition resize-y"
              placeholder="Click a job above or paste your own job description here..."
              value={jobDescription}
              onChange={(e) => setJobDescription(e.target.value)}
            />
            <button
              onClick={startInterview}
              className="w-full bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition font-semibold text-lg shadow-md hover:shadow-lg"
            >
              Start Interview
            </button>
          </div>
        )}

        {/* Interview Progress */}
        {isInterviewing && (
          <div className="bg-white rounded-xl shadow-lg p-6 mb-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-2xl font-semibold text-gray-800">
                Interview in Progress...
              </h2>
              <span className="text-sm font-medium text-gray-600 bg-gray-100 px-3 py-1 rounded-full">
                Question {currentQuestion} of 5
              </span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-3">
              <div
                className="bg-blue-600 h-3 rounded-full transition-all duration-300 shadow-sm"
                style={{ width: `${(currentQuestion / 5) * 100}%` }}
              />
            </div>
          </div>
        )}

        {/* Interview Transcript */}
        <div className="bg-white rounded-xl shadow-lg p-8 mb-6">
          <h2 className="text-2xl font-semibold mb-6 text-gray-800">
            Interview Transcript
          </h2>
          <div className="space-y-4 max-h-[32rem] overflow-y-auto">
            {messages.length === 0 ? (
              <p className="text-gray-500 text-center py-12 text-lg">
                No interview started yet
              </p>
            ) : (
              messages.map((msg, idx) => (
                <div
                  key={idx}
                  className={`p-5 rounded-xl ${
                    msg.role === 'interviewer'
                      ? 'bg-blue-50 border-l-4 border-blue-500 shadow-sm'
                      : 'bg-green-50 border-l-4 border-green-500 shadow-sm'
                  }`}
                >
                  <div className="flex justify-between items-start mb-2">
                    <span className="font-bold text-gray-900 text-lg">
                      {msg.role === 'interviewer' ? '💼 Interviewer' : '🤖 Digital Twin'}
                    </span>
                    <span className="text-xs text-gray-500">
                      {msg.timestamp.toLocaleTimeString()}
                    </span>
                  </div>
                  <p className="text-gray-700 whitespace-pre-wrap leading-relaxed">{msg.content}</p>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Interview Result */}
        {result && (
          <div
            className={`rounded-xl shadow-lg p-8 ${
              result.decision === 'pass'
                ? 'bg-green-50 border-2 border-green-500'
                : 'bg-red-50 border-2 border-red-500'
            }`}
          >
            <h2 className="text-3xl font-bold mb-6 text-gray-900 text-center">
              {result.decision === 'pass' ? '✅ PASS' : '❌ FAIL'}
            </h2>
            <div className="mb-6">
              <div className="flex justify-between mb-3">
                <span className="font-bold text-gray-800 text-lg">Overall Score:</span>
                <span className="font-bold text-gray-900 text-xl">{result.score}/100</span>
              </div>
              <div className="w-full bg-gray-300 rounded-full h-4">
                <div
                  className={`h-4 rounded-full transition-all ${
                    result.decision === 'pass' ? 'bg-green-600' : 'bg-red-600'
                  }`}
                  style={{ width: `${result.score}%` }}
                />
              </div>
            </div>
            <div className="bg-white p-6 rounded-lg border-2 border-gray-200 shadow-inner">
              <h3 className="font-bold mb-3 text-gray-800 text-lg">Recommendation:</h3>
              <p className="text-gray-700 leading-relaxed">{result.recommendation}</p>
            </div>
            <button
              onClick={() => {
                setMessages([])
                setResult(null)
                setJobDescription('')
              }}
              className="mt-6 w-full bg-gray-700 text-white px-6 py-3 rounded-lg hover:bg-gray-800 transition font-semibold shadow-md hover:shadow-lg"
            >
              Start New Interview
            </button>
          </div>
        )}
      </div>
    </div>
  )
}
