#!/usr/bin/env python3
"""
Job Posting Vector Database Embedding
Embeds job posting markdown files into Upstash Vector Database for semantic search
"""

import os
import sys
from typing import List, Dict, Optional
from dataclasses import dataclass
from dotenv import load_dotenv
from upstash_vector import Index
import re

# Load environment variables
load_dotenv()

# Configuration
UPSTASH_VECTOR_REST_URL = os.getenv('test_UPSTASH_VECTOR_REST_URL') or os.getenv('UPSTASH_VECTOR_REST_URL')
UPSTASH_VECTOR_REST_TOKEN = os.getenv('test_UPSTASH_VECTOR_REST_TOKEN') or os.getenv('UPSTASH_VECTOR_REST_TOKEN')
JOB_POSTINGS_DIR = 'job-postings'
BATCH_SIZE = 5


@dataclass
class JobPosting:
    """Represents a job posting"""
    id: str
    filename: str
    title: str
    company: str
    location: str
    salary: str
    content: str


class JobPostingEmbedder:
    """Manages job posting embedding into vector database"""

    def __init__(self):
        """Initialize job posting embedder"""
        self.index: Optional[Index] = None
        self.job_postings: List[JobPosting] = []
        self.validate_environment()

    def validate_environment(self) -> None:
        """Validate environment variables"""
        if not UPSTASH_VECTOR_REST_URL:
            raise ValueError("❌ UPSTASH_VECTOR_REST_URL not found")
        if not UPSTASH_VECTOR_REST_TOKEN:
            raise ValueError("❌ UPSTASH_VECTOR_REST_TOKEN not found")
        print("✅ Environment variables validated")

    def setup_connection(self) -> bool:
        """Establish connection to Upstash"""
        try:
            self.index = Index(
                url=UPSTASH_VECTOR_REST_URL,
                token=UPSTASH_VECTOR_REST_TOKEN,
            )
            print("✅ Connected to Upstash Vector Database")
            
            # Check current vector count
            try:
                info = self.index.info()
                vector_count = getattr(info, 'vector_count', 0)
                print(f"📊 Current vectors in database: {vector_count}")
            except Exception as e:
                print(f"⚠️  Could not retrieve database info: {e}")
            
            return True
        except Exception as e:
            print(f"❌ Error connecting to Upstash: {str(e)}")
            return False

    def load_job_postings(self) -> bool:
        """Load all job posting markdown files"""
        try:
            if not os.path.exists(JOB_POSTINGS_DIR):
                print(f"❌ Directory not found: {JOB_POSTINGS_DIR}")
                return False
            
            md_files = [f for f in os.listdir(JOB_POSTINGS_DIR) if f.endswith('.md')]
            
            if not md_files:
                print(f"❌ No markdown files found in {JOB_POSTINGS_DIR}")
                return False
            
            print(f"✅ Found {len(md_files)} job posting file(s)")
            
            for filename in md_files:
                filepath = os.path.join(JOB_POSTINGS_DIR, filename)
                try:
                    self._parse_job_posting(filename, filepath)
                except Exception as e:
                    print(f"⚠️  Error parsing {filename}: {e}")
                    continue
            
            if not self.job_postings:
                print("❌ No job postings parsed successfully")
                return False
            
            print(f"✅ Successfully parsed {len(self.job_postings)} job posting(s)")
            return True
        
        except Exception as e:
            print(f"❌ Error loading job postings: {str(e)}")
            return False

    def _parse_job_posting(self, filename: str, filepath: str) -> None:
        """Parse a single job posting markdown file"""
        with open(filepath, 'r', encoding='utf-8') as f:
            content = f.read()
        
        # Extract title from first heading
        title_match = re.search(r'^#\s+(.+)$', content, re.MULTILINE)
        title = title_match.group(1).strip() if title_match else "Unknown Position"
        
        # Extract company
        company_match = re.search(r'\*\*Company:\*\*\s*(.+?)(?:\n|$)', content)
        company = company_match.group(1).strip() if company_match else "Unknown Company"
        
        # Extract location
        location_match = re.search(r'\*\*Location:\*\*\s*(.+?)(?:\n|$)', content)
        location = location_match.group(1).strip() if location_match else "Unknown Location"
        
        # Extract salary
        salary_match = re.search(r'\*\*Salary:\*\*\s*(.+?)(?:\n|$)', content)
        salary = salary_match.group(1).strip() if salary_match else "Not specified"
        
        # Generate ID from filename
        job_id = f"job_{os.path.splitext(filename)[0]}"
        
        job_posting = JobPosting(
            id=job_id,
            filename=filename,
            title=title,
            company=company,
            location=location,
            salary=salary,
            content=content
        )
        
        self.job_postings.append(job_posting)
        print(f"  ✓ Parsed: {title} ({company}, {location})")

    def embed_and_store(self) -> bool:
        """Embed job postings and store in vector database"""
        if not self.index:
            print("❌ Vector database not connected")
            return False
        
        if not self.job_postings:
            print("❌ No job postings to embed")
            return False
        
        try:
            print(f"\n🔄 Embedding {len(self.job_postings)} job posting(s)...")
            
            # Prepare vectors
            vectors = []
            for job in self.job_postings:
                enriched_text = (
                    f"Title: {job.title}\n"
                    f"Company: {job.company}\n"
                    f"Location: {job.location}\n"
                    f"Salary: {job.salary}\n"
                    f"Content: {job.content}"
                )
                
                metadata = {
                    "jobId": job.id,
                    "type": "job_posting",
                    "title": job.title,
                    "company": job.company,
                    "location": job.location,
                    "salary": job.salary,
                    "filename": job.filename
                }
                
                vectors.append((
                    job.id,
                    enriched_text,
                    metadata
                ))
            
            # Upload in batches
            total_uploaded = 0
            for i in range(0, len(vectors), BATCH_SIZE):
                batch = vectors[i:i + BATCH_SIZE]
                try:
                    self.index.upsert(vectors=batch)
                    total_uploaded += len(batch)
                    batch_num = i // BATCH_SIZE + 1
                    total_batches = (len(vectors) + BATCH_SIZE - 1) // BATCH_SIZE
                    print(f"  ✓ Uploaded batch {batch_num}/{total_batches} ({len(batch)} job posting(s))")
                except Exception as e:
                    print(f"  ⚠️  Error uploading batch: {e}")
                    continue
            
            print(f"\n✅ Successfully embedded {total_uploaded} job posting(s)")
            return True
        
        except Exception as e:
            print(f"❌ Error embedding job postings: {str(e)}")
            return False

    def verify_embeddings(self) -> bool:
        """Verify job postings were embedded correctly"""
        if not self.index:
            print("❌ Vector database not connected")
            return False
        
        try:
            print("\n🔍 Verifying job posting embeddings...")
            
            # Test queries
            test_queries = [
                "data analyst Sydney",
                "Power BI reporting",
                "Microsoft junior analyst"
            ]
            
            for test_query in test_queries:
                results = self.index.query(
                    data=test_query,
                    top_k=2,
                    include_metadata=True
                )
                
                if results and len(results) > 0:
                    print(f"\n  Query: '{test_query}'")
                    for result in results:
                        score = getattr(result, 'score', 'N/A')
                        metadata = getattr(result, 'metadata', {})
                        title = metadata.get('title', 'Unknown') if metadata else 'Unknown'
                        job_type = metadata.get('type', '') if metadata else ''
                        
                        if job_type == 'job_posting':
                            print(f"    ✓ {title} (relevance: {score:.4f})")
                else:
                    print(f"  ⚠️  No results for query: '{test_query}'")
            
            print("\n✅ Job posting verification complete")
            return True
        
        except Exception as e:
            print(f"❌ Error verifying embeddings: {str(e)}")
            return False


def main():
    """Main execution"""
    print("🤖 Job Posting Vector Database Embedding\n")
    print("=" * 60)
    
    # Initialize embedder
    embedder = JobPostingEmbedder()
    
    # Step 1: Connect
    print("\n📍 Step 1: Connecting to Upstash Vector Database...")
    if not embedder.setup_connection():
        print("❌ Failed to connect. Exiting.")
        sys.exit(1)
    
    # Step 2: Load job postings
    print("\n📍 Step 2: Loading job posting files...")
    if not embedder.load_job_postings():
        print("❌ Failed to load job postings. Exiting.")
        sys.exit(1)
    
    # Step 3: Embed and store
    print("\n📍 Step 3: Embedding and storing job postings...")
    if not embedder.embed_and_store():
        print("❌ Failed to embed job postings. Exiting.")
        sys.exit(1)
    
    # Step 4: Verify
    print("\n📍 Step 4: Verifying embeddings...")
    if not embedder.verify_embeddings():
        print("⚠️  Verification had issues, but data may still be stored.")
    
    print("\n" + "=" * 60)
    print("✅ Job posting embedding complete!")
    print("\nJob postings are now available for Claude to query via MCP tools.\n")


if __name__ == "__main__":
    main()
