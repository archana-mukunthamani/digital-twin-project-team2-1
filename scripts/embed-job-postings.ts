/**
 * Job Posting Embedding Script
 * 
 * This script reads job posting markdown files from job-postings/ directory,
 * converts them to embeddings, and stores them in Upstash Vector Database.
 * 
 * Usage: npx ts-node scripts/embed-job-postings.ts
 */

import { Index } from "@upstash/vector";
import fs from "fs";
import path from "path";

// Initialize Upstash Vector Index
function getVectorIndex() {
  const url = process.env.UPSTASH_VECTOR_REST_URL;
  const token = process.env.UPSTASH_VECTOR_REST_TOKEN;

  if (!url || !token) {
    throw new Error(
      "Missing UPSTASH_VECTOR_REST_URL or UPSTASH_VECTOR_REST_TOKEN"
    );
  }

  return new Index({
    url,
    token,
  });
}

interface JobPosting {
  id: string;
  title: string;
  company: string;
  location: string;
  salary: string;
  content: string;
}

// Read job posting markdown and parse it
async function parseJobPosting(filePath: string): Promise<JobPosting> {
  const content = fs.readFileSync(filePath, "utf-8");
  const lines = content.split("\n");

  // Extract title from first heading
  const titleMatch = content.match(/^#\s+(.+)$/m);
  const title = titleMatch ? titleMatch[1] : "Unknown Position";

  // Extract company
  const companyMatch = content.match(/\*\*Company:\*\*\s*(.+)/);
  const company = companyMatch ? companyMatch[1].trim() : "Unknown Company";

  // Extract location
  const locationMatch = content.match(/\*\*Location:\*\*\s*(.+)/);
  const location = locationMatch ? locationMatch[1].trim() : "Unknown Location";

  // Extract salary
  const salaryMatch = content.match(/\*\*Salary:\*\*\s*(.+)/);
  const salary = salaryMatch ? salaryMatch[1].trim() : "Not specified";

  // Generate ID from filename
  const filename = path.basename(filePath, ".md");
  const id = `job_${filename}`;

  return {
    id,
    title,
    company,
    location,
    salary,
    content,
  };
}

// Generate a simple embedding using text hashing (fallback)
// In production, use OpenAI or other embedding service
function generateSimpleEmbedding(text: string): number[] {
  // For demonstration: create a 384-dimensional vector from text hash
  // In production, use actual embedding model
  const seedHash = text.split("").reduce((acc, char) => {
    return ((acc << 5) - acc + char.charCodeAt(0)) | 0;
  }, 0);

  const embedding: number[] = [];
  let seed = seedHash;
  for (let i = 0; i < 384; i++) {
    seed = (seed * 9301 + 49297) % 233280;
    embedding.push((seed / 233280) * 2 - 1); // Normalize to -1 to 1
  }
  return embedding;
}

// Embed and store job posting in Upstash Vector
async function embedJobPosting(
  index: Index<{
    jobId: string;
    type: string;
    title: string;
    company: string;
    location: string;
    salary: string;
  }>
) {
  try {
    console.log("🚀 Starting job posting embedding process...\n");

    // Get all .md files in job-postings directory
    const jobPostingsDir = path.join(process.cwd(), "job-postings");

    if (!fs.existsSync(jobPostingsDir)) {
      console.log(`❌ Directory not found: ${jobPostingsDir}`);
      console.log("   Please create job-postings directory with .md files");
      return;
    }

    const files = fs
      .readdirSync(jobPostingsDir)
      .filter((f) => f.endsWith(".md"));

    if (files.length === 0) {
      console.log("❌ No .md files found in job-postings directory");
      return;
    }

    console.log(`📄 Found ${files.length} job posting file(s)\n`);

    // Process each job posting
    for (const file of files) {
      const filePath = path.join(jobPostingsDir, file);
      console.log(`Processing: ${file}`);

      try {
        const jobPosting = await parseJobPosting(filePath);
        console.log(`  ✓ Title: ${jobPosting.title}`);
        console.log(`  ✓ Company: ${jobPosting.company}`);
        console.log(`  ✓ Location: ${jobPosting.location}`);

        // Generate embedding from job content
        const embedding = generateSimpleEmbedding(jobPosting.content);

        // Create metadata object
        const metadata = {
          jobId: jobPosting.id,
          type: "job_posting",
          title: jobPosting.title,
          company: jobPosting.company,
          location: jobPosting.location,
          salary: jobPosting.salary,
        };

        // Upsert vector to Upstash
        await index.upsert({
          id: jobPosting.id,
          vector: embedding,
          metadata,
          data: jobPosting.content,
        });

        console.log(`  ✅ Embedded successfully\n`);
      } catch (error) {
        console.error(`  ❌ Error processing ${file}:`, error);
      }
    }

    console.log("✨ Job posting embedding complete!");
    console.log("   Job postings are now accessible via MCP tool: query_job_posting");
  } catch (error) {
    console.error("Fatal error:", error);
    process.exit(1);
  }
}

// Main execution
async function main() {
  try {
    const index = getVectorIndex();
    await embedJobPosting(index);
  } catch (error) {
    console.error("Setup error:", error);
    process.exit(1);
  }
}

main();
