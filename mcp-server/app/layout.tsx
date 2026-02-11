import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Digital Twin MCP Server',
  description: 'MCP server for digital twin RAG queries',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body>
        <main>{children}</main>
      </body>
    </html>
  )
}