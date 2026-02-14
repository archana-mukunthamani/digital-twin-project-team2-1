// lib/digital-twin.ts
import { Index } from '@upstash/vector'
import Groq from 'groq-sdk'
import { z } from 'zod'

// Environment configuration
const DEFAULT_MODEL = "llama-3.1-8b-instant"

const getEnvVars = () => ({
  UPSTASH_VECTOR_REST_URL: process.env.UPSTASH_VECTOR_REST_URL || process.env.test_UPSTASH_VECTOR_REST_URL,
  UPSTASH_VECTOR_REST_TOKEN: process.env.UPSTASH_VECTOR_REST_TOKEN || process.env.test_UPSTASH_VECTOR_REST_TOKEN,
  GROQ_API_KEY: process.env.GROQ_API_KEY,
})

// Types
export interface VectorResult {
  id: string
  content: string
  title: string
  type: string
  score: number
  metadata: Record<string, any>
}

export interface RAGResponse {
  success: boolean
  response: string
  resultsFound: number
  contextItems?: VectorResult[]
  modelUsed?: string
  error?: string
}

// Initialize clients
let vectorIndex: Index | null = null
let groqClient: Groq | null = null
let initError: string | null = null

function initializeVectorDatabase(): Index | null {
  try {
    const { UPSTASH_VECTOR_REST_URL, UPSTASH_VECTOR_REST_TOKEN } = getEnvVars()
    
    if (!UPSTASH_VECTOR_REST_URL || !UPSTASH_VECTOR_REST_TOKEN) {
      console.warn('Upstash Vector credentials not found')
      return null
    }

    return new Index({
      url: UPSTASH_VECTOR_REST_URL,
      token: UPSTASH_VECTOR_REST_TOKEN,
    })
  } catch (error) {
    console.error('Error initializing vector database:', error)
    return null
  }
}

function initializeGroqClient(): Groq | null {
  try {
    const { GROQ_API_KEY } = getEnvVars()
    
    if (!GROQ_API_KEY) {
      console.warn('GROQ_API_KEY not found - responses will be basic')
      return null
    }

    return new Groq({
      apiKey: GROQ_API_KEY,
    })
  } catch (error) {
    console.error('Error initializing Groq client:', error)
    return null
  }
}

// Lazy initialization
function getVectorIndex(): Index | null {
  if (!vectorIndex && !initError) {
    try {
      vectorIndex = initializeVectorDatabase()
    } catch (err) {
      initError = `Vector DB init failed: ${err}`
      console.error(initError)
    }
  }
  return vectorIndex
}

function getGroqClient(): Groq | null {
  if (!groqClient && !initError) {
    try {
      groqClient = initializeGroqClient()
    } catch (err) {
      initError = `Groq init failed: ${err}`
      console.error(initError)
    }
  }
  return groqClient
}

// Core RAG functionality
export async function queryVectors(queryText: string, topK: number = 3): Promise<VectorResult[]> {
  const index = getVectorIndex()
  
  if (!index) {
    throw new Error('Vector database not available')
  }

  try {
    const results = await index.query({
      data: queryText,
      topK,
      includeMetadata: true,
    })

    return results.map((result: any) => ({
      id: result.id || 'unknown',
      content: result.metadata?.content || '',
      title: result.metadata?.title || '',
      type: result.metadata?.type || '',
      score: result.score || 0,
      metadata: result.metadata || {},
    }))
  } catch (error) {
    console.error('Error querying vectors:', error)
    return []
  }
}

export async function generateResponse(prompt: string, model: string = DEFAULT_MODEL): Promise<string> {
  const client = getGroqClient()
  
  if (!client) {
    return 'LLM not available - returning raw context only'
  }

  try {
    const completion = await client.chat.completions.create({
      model,
      messages: [
        {
          role: 'system',
          content: 'You are an AI digital twin representing a professional. Answer questions as if you are the person, speaking in first person about your background, skills, and experiences. Be specific, use examples, and demonstrate your expertise with quantifiable achievements.',
        },
        {
          role: 'user',
          content: prompt,
        },
      ],
      temperature: 0.7,
      max_tokens: 500,
    })

    return completion.choices[0]?.message?.content?.trim() || 'No response generated'
  } catch (error) {
    console.error('Error generating response:', error)
    return `Error generating response: ${error instanceof Error ? error.message : 'Unknown error'}`
  }
}

export async function ragQuery(question: string, useLLMFormatting: boolean = true): Promise<RAGResponse> {
  try {
    // Step 1: Search vector database
    const vectorResults = await queryVectors(question, 3)
    
    if (!vectorResults || vectorResults.length === 0) {
      return {
        success: false,
        response: "I don't have specific information about that topic in my professional background.",
        resultsFound: 0,
        error: 'No relevant context found'
      }
    }

    // Step 2: Extract context
    const contextPieces = vectorResults
      .filter(result => result.content)
      .map(result => `${result.title}: ${result.content}`)
    
    const context = contextPieces.join('\\n\\n')

    // Step 3: Generate response
    let response: string
    
    if (useLLMFormatting) {
      const prompt = `Based on the following professional information, provide a compelling interview response:

Professional Context:
${context}

Interview Question: ${question}

Guidelines:
- Speak in first person as the professional
- Include specific examples and metrics
- Use STAR format (Situation-Task-Action-Result) when telling stories
- Sound confident and natural
- Directly address the question

Response:`

      response = await generateResponse(prompt)
    } else {
      response = `Based on my professional background:\\n\\n${context}`
    }

    return {
      success: true,
      response,
      resultsFound: vectorResults.length,
      contextItems: vectorResults,
      modelUsed: useLLMFormatting ? DEFAULT_MODEL : undefined
    }
  } catch (error) {
    return {
      success: false,
      response: `Error during query: ${error instanceof Error ? error.message : 'Unknown error'}`,
      resultsFound: 0,
      error: error instanceof Error ? error.message : 'Unknown error'
    }
  }
}

// Specialized query functions for different domains
export async function queryExperience(): Promise<RAGResponse> {
  return ragQuery('Tell me about your work experience, roles, and career progression')
}

export async function querySkills(): Promise<RAGResponse> {
  return ragQuery('What are your technical skills, programming languages, and tools you work with?')
}

export async function queryProjects(): Promise<RAGResponse> {
  return ragQuery('Describe significant projects you have worked on, including technologies used and outcomes')
}

export async function queryEducation(): Promise<RAGResponse> {
  return ragQuery('Tell me about your educational background, certifications, and learning journey')
}

export async function queryCareerGoals(): Promise<RAGResponse> {
  return ragQuery('What are your career goals, aspirations, and areas you want to develop?')
}

// MCP Tool definitions
export const digitalTwinTools = {
  ragQuery: {
    name: 'rag_query',
    description: 'Ask any question about the professional background using RAG',
    schema: {
      question: z.string().describe('The question to ask about professional background'),
      useLLMFormatting: z.boolean().optional().default(true).describe('Whether to use LLM for formatted responses')
    }
  },
  queryExperience: {
    name: 'query_experience',
    description: 'Get information about work experience and career progression',
    schema: {}
  },
  querySkills: {
    name: 'query_skills', 
    description: 'Get information about technical skills and competencies',
    schema: {}
  },
  queryProjects: {
    name: 'query_projects',
    description: 'Get information about significant projects and achievements',
    schema: {}
  },
  queryEducation: {
    name: 'query_education',
    description: 'Get information about educational background and certifications',
    schema: {}
  },
  queryCareerGoals: {
    name: 'query_career_goals',
    description: 'Get information about career goals and aspirations',
    schema: {}
  }
} as const

// Health check function
export async function healthCheck(): Promise<{ vectorDB: boolean; llm: boolean; details: string }> {
  const vectorDB = getVectorIndex() !== null
  const llm = getGroqClient() !== null
  
  let details = []
  if (!vectorDB) details.push('Vector DB not configured')
  if (!llm) details.push('LLM not configured')
  if (vectorDB && llm) details.push('All systems operational')
  
  return {
    vectorDB,
    llm,
    details: details.join(', ')
  }
}