// app/api/mcp/route.ts
import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    console.log('Received POST:', body.method)

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
              }
            ]
          }
        })
      }

      // Default response for unknown methods
      return NextResponse.json({
        jsonrpc: '2.0',
        id: body.id,
        error: {
          code: -32601,
          message: `Method not implemented: ${body.method}`
        }
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
    console.error('POST Error:', error)
    return NextResponse.json({
      jsonrpc: '2.0',
      error: {
        code: -32603,
        message: error instanceof Error ? error.message : 'Internal server error'
      }
    }, { status: 500 })
  }
}

export async function GET(request: NextRequest) {
  try {
    return NextResponse.json({
      message: 'Digital Twin MCP Server',
      version: '1.0.0',
      status: 'running',
      tools: ['query_digital_twin'],
      info: 'RAG-powered MCP server for professional profile queries'
    })
  } catch (error) {
    console.error('GET Error:', error)
    return NextResponse.json(
      {
        error: 'Internal server error',
        message: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    )
  }
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
