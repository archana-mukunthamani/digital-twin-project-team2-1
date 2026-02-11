export default function HomePage() {
  return (
    <div style={{ padding: '2rem', fontFamily: 'system-ui' }}>
      <h1>Digital Twin MCP Server</h1>
      <p>
        This is an MCP (Model Context Protocol) server that provides RAG (Retrieval-Augmented Generation) 
        functionality for querying professional profile information.
      </p>
      
      <h2>Available Tools:</h2>
      <ul>
        <li><strong>rag_query</strong> - Ask any question about the professional background</li>
        <li><strong>query_experience</strong> - Get work experience information</li>
        <li><strong>query_skills</strong> - Get technical skills information</li>
        <li><strong>query_projects</strong> - Get project information</li>
        <li><strong>query_education</strong> - Get educational background</li>
        <li><strong>query_career_goals</strong> - Get career goals and aspirations</li>
        <li><strong>health_check</strong> - Check system status</li>
      </ul>

      <h2>MCP Endpoint:</h2>
      <p>
        The MCP server is available at: <code>/api/sse</code> or <code>/api/http</code>
      </p>

      <h2>Status:</h2>
      <p>Server is running and ready to handle MCP requests.</p>
    </div>
  )
}