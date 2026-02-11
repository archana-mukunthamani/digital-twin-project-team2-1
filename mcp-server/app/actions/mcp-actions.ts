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