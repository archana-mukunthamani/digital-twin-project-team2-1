// app/api/mcp/route.ts
import { NextRequest, NextResponse } from 'next/server'
import { 
  ragQuery,
  queryExperience,
  querySkills,
  queryProjects,
  queryEducation,
  queryCareerGoals
} from "@/app/actions/mcp-actions"

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()

    // Handle JSON-RPC 2.0 requests
    if (body.jsonrpc === '2.0') {
      // Handle initialize request
      if (body.method === 'initialize') {
        return NextResponse.json({
          jsonrpc: '2.0',
          id: body.id,
          result: {
            protocolVersion: '2024-11-05',
            capabilities: {
              tools: {}
            },
            serverInfo: {
              name: 'digital-twin-mcp',
              version: '1.0.0'
            }
          }
        })
      }

      // Handle list_tools request
      if (body.method === 'tools/list') {
        return NextResponse.json({
          jsonrpc: '2.0',
          id: body.id,
          result: {
            tools: [
              {
                name: 'query_digital_twin',
                description: 'Ask questions about your professional background, experience, skills, and career using RAG-powered search',
                inputSchema: {
                  type: 'object',
                  properties: {
                    question: {
                      type: 'string',
                      description: 'Question about your professional background, skills, experience, projects, or education'
                    }
                  },
                  required: ['question']
                }
              },
              {
                name: 'get_experience',
                description: 'Retrieve your professional work experience and career history',
                inputSchema: {
                  type: 'object',
                  properties: {},
                  required: []
                }
              },
              {
                name: 'get_skills',
                description: 'Retrieve your technical and professional skills',
                inputSchema: {
                  type: 'object',
                  properties: {},
                  required: []
                }
              },
              {
                name: 'get_projects',
                description: 'Retrieve your portfolio projects and notable work',
                inputSchema: {
                  type: 'object',
                  properties: {},
                  required: []
                }
              },
              {
                name: 'get_education',
                description: 'Retrieve your educational background and qualifications',
                inputSchema: {
                  type: 'object',
                  properties: {},
                  required: []
                }
              },
              {
                name: 'get_career_goals',
                description: 'Retrieve your career goals and professional aspirations',
                inputSchema: {
                  type: 'object',
                  properties: {},
                  required: []
                }
              }
            ]
          }
        })
      }

      // Handle tool calls
      if (body.method === 'tools/call') {
        const { name, arguments: args } = body.params || {}
        
        try {
          let result
          
          if (name === 'query_digital_twin') {
            result = await ragQuery(args?.question || 'Tell me about yourself')
          } else if (name === 'get_experience') {
            result = await queryExperience()
          } else if (name === 'get_skills') {
            result = await querySkills()
          } else if (name === 'get_projects') {
            result = await queryProjects()
          } else if (name === 'get_education') {
            result = await queryEducation()
          } else if (name === 'get_career_goals') {
            result = await queryCareerGoals()
          } else {
            return NextResponse.json({
              jsonrpc: '2.0',
              id: body.id,
              error: {
                code: -32601,
                message: `Unknown tool: ${name}`
              }
            })
          }

          // Handle the result
          if (result.success) {
            return NextResponse.json({
              jsonrpc: '2.0',
              id: body.id,
              result: {
                content: [
                  {
                    type: 'text',
                    text: result.result?.response || 'No response generated'
                  }
                ]
              }
            })
          } else {
            return NextResponse.json({
              jsonrpc: '2.0',
              id: body.id,
              error: {
                code: -32603,
                message: result.error?.message || 'Tool execution failed'
              }
            })
          }
        } catch (error) {
          console.error(`Error executing tool ${name}:`, error)
          return NextResponse.json({
            jsonrpc: '2.0',
            id: body.id,
            error: {
              code: -32603,
              message: `Error executing tool: ${error instanceof Error ? error.message : 'Unknown error'}`
            }
          })
        }
      }

      // Default response for unknown methods
      return NextResponse.json({
        jsonrpc: '2.0',
        id: body.id,
        result: {}
      })
    }

    return NextResponse.json({
      jsonrpc: '2.0',
      error: {
        code: -32600,
        message: 'Invalid Request'
      }
    }, { status: 400 })
  } catch (error) {
    console.error('Error:', error)
    return NextResponse.json({
      jsonrpc: '2.0',
      error: {
        code: -32603,
        message: 'Internal server error'
      }
    }, { status: 500 })
  }
}

export async function GET(request: NextRequest) {
  return NextResponse.json({
    message: 'Digital Twin MCP Server',
    version: '1.0.0',
    status: 'running',
    tools: ['query_digital_twin', 'get_experience', 'get_skills', 'get_projects', 'get_education', 'get_career_goals'],
    info: 'RAG-powered MCP server for professional profile queries'
  })
}

/* Original mcp-handler implementation - keeping for reference
import { createMcpHandler } from "mcp-handler"
import { 
  ragQuery,
  queryExperience,
  querySkills,
  queryProjects,
  queryEducation,
  queryCareerGoals,
  healthCheck
} from "@/app/actions/mcp-actions"
import { digitalTwinTools } from "@/lib/digital-twin"

const handler = createMcpHandler(
  (server) => {
    // General RAG query tool
    server.tool(
      digitalTwinTools.ragQuery.name,
      digitalTwinTools.ragQuery.description,
      digitalTwinTools.ragQuery.schema,
      async ({ question, useLLMFormatting = true }: { question: string; useLLMFormatting?: boolean }) => {
        const result = await ragQuery(question, useLLMFormatting)
        
        if (result.success && result.result) {
          return {
            content: [
              {
                type: 'text',
                text: result.result.response
              }
            ],
            isError: false
          }
        } else {
          return {
            content: [
              {
                type: 'text', 
                text: result.error?.message || 'Query failed'
              }
            ],
            isError: true
          }
        }
      }
    )

    // Experience query tool
    server.tool(
      digitalTwinTools.queryExperience.name,
      digitalTwinTools.queryExperience.description,
      digitalTwinTools.queryExperience.schema,
      async () => {
        const result = await queryExperience()
        
        if (result.success && result.result) {
          return {
            content: [
              {
                type: 'text',
                text: result.result.response
              }
            ],
            isError: false
          }
        } else {
          return {
            content: [
              {
                type: 'text',
                text: result.error?.message || 'Experience query failed'
              }
            ],
            isError: true
          }
        }
      }
    )

    // Skills query tool
    server.tool(
      digitalTwinTools.querySkills.name,
      digitalTwinTools.querySkills.description,
      digitalTwinTools.querySkills.schema,
      async () => {
        const result = await querySkills()
        
        if (result.success && result.result) {
          return {
            content: [
              {
                type: 'text',
                text: result.result.response
              }
            ],
            isError: false
          }
        } else {
          return {
            content: [
              {
                type: 'text',
                text: result.error?.message || 'Skills query failed'
              }
            ],
            isError: true
          }
        }
      }
    )

    // Projects query tool
    server.tool(
      digitalTwinTools.queryProjects.name,
      digitalTwinTools.queryProjects.description,
      digitalTwinTools.queryProjects.schema,
      async () => {
        const result = await queryProjects()
        
        if (result.success && result.result) {
          return {
            content: [
              {
                type: 'text',
                text: result.result.response
              }
            ],
            isError: false
          }
        } else {
          return {
            content: [
              {
                type: 'text',
                text: result.error?.message || 'Projects query failed'
              }
            ],
            isError: true
          }
        }
      }
    )

    // Education query tool
    server.tool(
      digitalTwinTools.queryEducation.name,
      digitalTwinTools.queryEducation.description,
      digitalTwinTools.queryEducation.schema,
      async () => {
        const result = await queryEducation()
        
        if (result.success && result.result) {
          return {
            content: [
              {
                type: 'text',
                text: result.result.response
              }
            ],
            isError: false
          }
        } else {
          return {
            content: [
              {
                type: 'text',
                text: result.error?.message || 'Education query failed'
              }
            ],
            isError: true
          }
        }
      }
    )

    // Career goals query tool
    server.tool(
      digitalTwinTools.queryCareerGoals.name,
      digitalTwinTools.queryCareerGoals.description,
      digitalTwinTools.queryCareerGoals.schema,
      async () => {
        const result = await queryCareerGoals()
        
        if (result.success && result.result) {
          return {
            content: [
              {
                type: 'text',
                text: result.result.response
              }
            ],
            isError: false
          }
        } else {
          return {
            content: [
              {
                type: 'text',
                text: result.error?.message || 'Career goals query failed'
              }
            ],
            isError: true
          }
        }
      }
    )

    // Health check tool (useful for debugging)
    server.tool(
      'health_check',
      'Check the health status of vector database and LLM connections',
      {},
      async () => {
        const result = await healthCheck()
        
        if (result.success && result.result) {
          return {
            content: [
              {
                type: 'text',
                text: `Health Status: Vector DB: ${result.result.vectorDB ? '✅' : '❌'}, LLM: ${result.result.llm ? '✅' : '❌'}. ${result.result.details}`
              }
            ],
            isError: false
          }
        } else {
          return {
            content: [
              {
                type: 'text',
                text: result.error?.message || 'Health check failed'
              }
            ],
            isError: true
          }
        }
      }
    )
  },
  {
    // Optional server options
  },
  {
    // Handler options - no basePath for this version
    maxDuration: 60,
    verboseLogs: true,
  }
)
*/