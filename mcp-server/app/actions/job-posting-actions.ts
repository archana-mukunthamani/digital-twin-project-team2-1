/**
 * Job Posting Query Server Action
 * 
 * Queries job postings from Upstash Vector Database
 * Used by MCP endpoint to retrieve job posting details
 */

'use server'

import { Index } from '@upstash/vector'

interface JobPostingMetadata {
  jobId: string
  type: string
  title: string
  company: string
  location: string
  salary: string
}

interface QueryResult {
  success: boolean
  result?: {
    response: string
  }
  error?: {
    message: string
  }
}

function getVectorIndex(): Index<JobPostingMetadata> {
  const url = process.env.UPSTASH_VECTOR_REST_URL
  const token = process.env.UPSTASH_VECTOR_REST_TOKEN

  if (!url || !token) {
    throw new Error('Upstash Vector credentials not configured')
  }

  return new Index<JobPostingMetadata>({
    url,
    token,
  })
}

/**
 * Query job postings by keyword, location, or general search
 */
export async function queryJobPostings(query: string): Promise<QueryResult> {
  try {
    const index = getVectorIndex()

    // Search for similar job postings using Upstash's native embedding
    const results = await index.query({
      data: query,
      topK: 3,
      includeMetadata: true,
    })

    if (!results || results.length === 0) {
      return {
        success: true,
        result: {
          response: 'No matching job postings found.',
        },
      }
    }

    // Format results
    const jobPostings = results
      .filter((r) => r.metadata?.type === 'job_posting')
      .map((r) => {
        const meta = r.metadata as JobPostingMetadata
        const data = r.data as string | undefined

        return {
          title: meta.title,
          company: meta.company,
          location: meta.location,
          salary: meta.salary,
          score: r.score?.toFixed(3),
        }
      })

    const responseText = jobPostings
      .map(
        (jp) =>
          `**${jp.title}** at ${jp.company}\n` +
          `📍 Location: ${jp.location}\n` +
          `💰 Salary: ${jp.salary}\n` +
          `📊 Match Score: ${jp.score}`
      )
      .join('\n\n')

    return {
      success: true,
      result: {
        response:
          jobPostings.length > 0
            ? responseText
            : 'No job postings found in database. Please run the embedding script first.',
      },
    }
  } catch (error) {
    console.error('Job posting query error:', error)
    return {
      success: false,
      error: {
        message: `Failed to query job postings: ${error instanceof Error ? error.message : 'Unknown error'}`,
      },
    }
  }
}

/**
 * Get specific job posting by ID
 */
export async function getJobPosting(jobId: string): Promise<QueryResult> {
  try {
    const index = getVectorIndex()

    // Query for the job by its ID (search within metadata)
    const results = await index.query({
      data: `job_${jobId.replace(/^job_/, '')}`,
      topK: 1,
      includeMetadata: true,
    })

    if (!results || results.length === 0) {
      return {
        success: true,
        result: {
          response: `Job posting not found: ${jobId}`,
        },
      }
    }

    const result = results[0]
    const meta = result.metadata as JobPostingMetadata

    const responseText =
      `**${meta.title}** at ${meta.company}\n` +
      `📍 Location: ${meta.location}\n` +
      `💰 Salary: ${meta.salary}`

    return {
      success: true,
      result: {
        response: responseText,
      },
    }
  } catch (error) {
    console.error('Get job posting error:', error)
    return {
      success: false,
      error: {
        message: `Failed to retrieve job posting: ${error instanceof Error ? error.message : 'Unknown error'}`,
      },
    }
  }
}

/**
 * List all available job postings
 */
export async function listJobPostings(): Promise<QueryResult> {
  try {
    const index = getVectorIndex()

    // Query with a generic search term to list available jobs
    const results = await index.query({
      data: "job posting",
      topK: 10,
      includeMetadata: true,
    })

    const jobPostings = results
      .filter((r) => r.metadata?.type === 'job_posting')
      .map((r) => {
        const meta = r.metadata as JobPostingMetadata
        return {
          id: meta.jobId,
          title: meta.title,
          company: meta.company,
          location: meta.location,
          salary: meta.salary,
        }
      })

    if (jobPostings.length === 0) {
      return {
        success: true,
        result: {
          response:
            'No job postings available. Please run the embedding script first:\n```\nnpx ts-node scripts/embed-job-postings.ts\n```',
        },
      }
    }

    const responseText =
      '**Available Job Postings:**\n\n' +
      jobPostings
        .map(
          (jp, i) =>
            `${i + 1}. **${jp.title}**\n   - Company: ${jp.company}\n   - Location: ${jp.location}\n   - Salary: ${jp.salary}`
        )
        .join('\n\n')

    return {
      success: true,
      result: {
        response: responseText,
      },
    }
  } catch (error) {
    console.error('List job postings error:', error)
    return {
      success: false,
      error: {
        message: `Failed to list job postings: ${error instanceof Error ? error.message : 'Unknown error'}`,
      },
    }
  }
}
