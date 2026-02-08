#!/usr/bin/env python3
"""
Digital Twin Vector Database Setup and Data Loading
Embeds professional profile data into Upstash Vector Database for semantic search
"""

import os
import json
import sys
from typing import List, Dict, Any, Optional
from dataclasses import dataclass
from dotenv import load_dotenv
from upstash_vector import Index

# Load environment variables
load_dotenv()

# Configuration
UPSTASH_VECTOR_REST_URL = os.getenv('test_UPSTASH_VECTOR_REST_URL') or os.getenv('UPSTASH_VECTOR_REST_URL')
UPSTASH_VECTOR_REST_TOKEN = os.getenv('test_UPSTASH_VECTOR_REST_TOKEN') or os.getenv('UPSTASH_VECTOR_REST_TOKEN')
JSON_FILE = 'data/digitaltwin_clean.json'
BATCH_SIZE = 10  # Process vectors in batches
CHUNK_SIZE = 500  # Characters per chunk for better embedding


@dataclass
class ContentChunk:
    """Represents a chunk of embeddable content"""
    id: str
    title: str
    content: str
    type: str
    category: str
    tags: List[str]


class VectorDatabaseSetup:
    """Manages vector database setup and data loading"""

    def __init__(self):
        """Initialize vector database connection"""
        self.index: Optional[Index] = None
        self.chunks: List[ContentChunk] = []
        self.validate_environment()

    def validate_environment(self) -> None:
        """Validate environment variables are properly set"""
        if not UPSTASH_VECTOR_REST_URL:
            raise ValueError("❌ UPSTASH_VECTOR_REST_URL not found in environment variables")
        if not UPSTASH_VECTOR_REST_TOKEN:
            raise ValueError("❌ UPSTASH_VECTOR_REST_TOKEN not found in environment variables")
        print("✅ Environment variables validated")

    def setup_connection(self) -> bool:
        """Establish connection to Upstash Vector Database"""
        try:
            self.index = Index(
                url=UPSTASH_VECTOR_REST_URL,
                token=UPSTASH_VECTOR_REST_TOKEN,
            )
            print("✅ Connected to Upstash Vector successfully!")
            
            # Check database info
            try:
                info = self.index.info()
                vector_count = getattr(info, 'vector_count', 0)
                print(f"📊 Current vectors in database: {vector_count}")
            except Exception as e:
                print(f"⚠️  Could not retrieve database info: {e}")
            
            return True
        except Exception as e:
            print(f"❌ Error connecting to Upstash Vector: {str(e)}")
            return False

    def load_profile_data(self) -> bool:
        """Load digital twin profile from JSON file"""
        try:
            if not os.path.exists(JSON_FILE):
                print(f"❌ {JSON_FILE} not found")
                return False
            
            with open(JSON_FILE, 'r', encoding='utf-8') as f:
                profile_data = json.load(f)
            
            print(f"✅ Loaded profile data from {JSON_FILE}")
            self._extract_chunks(profile_data)
            
            if not self.chunks:
                print("❌ No content chunks extracted from profile")
                return False
            
            print(f"✅ Extracted {len(self.chunks)} content chunks")
            return True
        except json.JSONDecodeError as e:
            print(f"❌ Invalid JSON format: {str(e)}")
            return False
        except Exception as e:
            print(f"❌ Error loading profile data: {str(e)}")
            return False

    def _extract_chunks(self, profile_data: Dict[str, Any]) -> None:
        """Extract embeddable chunks from profile data"""
        chunk_id = 0
        
        # Personal Profile
        if 'personal_profile' in profile_data:
            personal = profile_data['personal_profile']
            self.chunks.append(ContentChunk(
                id=f"personal_{chunk_id}",
                title="Professional Summary",
                content=f"{personal.get('name', '')} - {personal.get('career_summary', '')}",
                type="profile",
                category="personal",
                tags=personal.get('primary_roles', [])
            ))
            chunk_id += 1

        # Education
        if 'education' in profile_data:
            for idx, edu in enumerate(profile_data['education']):
                self.chunks.append(ContentChunk(
                    id=f"education_{idx}",
                    title=f"{edu.get('degree', 'Education')}",
                    content=f"Degree: {edu.get('degree', '')}, Institution: {edu.get('institution', '')}, Year: {edu.get('year', '')}",
                    type="education",
                    category="education",
                    tags=["education", "degree"]
                ))

        # Certifications
        if 'certifications' in profile_data:
            for idx, cert in enumerate(profile_data['certifications']):
                self.chunks.append(ContentChunk(
                    id=f"cert_{idx}",
                    title=f"{cert.get('name', 'Certification')}",
                    content=f"Certification: {cert.get('name', '')}, Year: {cert.get('year', '')}",
                    type="certification",
                    category="certifications",
                    tags=["certification", "credential"]
                ))

        # Professional Experience
        if 'professional_experience' in profile_data:
            for idx, exp in enumerate(profile_data['professional_experience']):
                # Company and role
                company = exp.get('company', '')
                role = exp.get('role', '')
                self.chunks.append(ContentChunk(
                    id=f"experience_header_{idx}",
                    title=f"{role} at {company}",
                    content=f"Position: {role}, Company: {company}",
                    type="experience",
                    category="experience",
                    tags=["experience", "work", company.lower()]
                ))
                
                # Quantified impacts
                if 'quantified_impact' in exp:
                    impacts = exp['quantified_impact']
                    impact_text = " ".join(impacts)
                    self.chunks.append(ContentChunk(
                        id=f"experience_impact_{idx}",
                        title=f"{role} - Achievements at {company}",
                        content=impact_text,
                        type="experience",
                        category="achievements",
                        tags=["achievement", "impact", "metric"]
                    ))
                
                # Metrics examples
                if 'metrics_examples' in exp:
                    metrics = exp['metrics_examples']
                    metrics_text = " ".join([f"{k}: {v}" for k, v in metrics.items()])
                    self.chunks.append(ContentChunk(
                        id=f"experience_metrics_{idx}",
                        title=f"{role} - Key Metrics",
                        content=metrics_text,
                        type="experience",
                        category="metrics",
                        tags=["metrics", "performance", "results"]
                    ))

        # Skills
        if 'skills' in profile_data:
            skills = profile_data['skills']
            skill_text = ""
            
            if 'cloud' in skills:
                skill_text += f"Cloud Skills: {', '.join(skills['cloud'])}. "
            if 'data_analytics' in skills:
                skill_text += f"Data Analytics: {', '.join(skills['data_analytics'])}. "
            if 'databases' in skills:
                skill_text += f"Databases: {', '.join(skills['databases'])}. "
            if 'soft_skills' in skills:
                skill_text += f"Soft Skills: {', '.join(skills['soft_skills'])}. "
            
            if skill_text:
                self.chunks.append(ContentChunk(
                    id="skills_comprehensive",
                    title="Professional Skills",
                    content=skill_text,
                    type="skills",
                    category="skills",
                    tags=["skills", "competencies", "expertise"]
                ))

        # Interview Prep - Behavioral
        if 'interview_prep' in profile_data:
            interview_prep = profile_data['interview_prep']
            
            if 'behavioral' in interview_prep:
                for idx, item in enumerate(interview_prep['behavioral']):
                    question = item.get('question', '')
                    star = item.get('answer_star', {})
                    
                    star_text = f"Question: {question}. "
                    star_text += f"Situation: {star.get('situation', '')}. "
                    star_text += f"Task: {star.get('task', '')}. "
                    if 'action' in star:
                        actions = star['action']
                        if isinstance(actions, list):
                            star_text += f"Actions: {' '.join(actions)}. "
                        else:
                            star_text += f"Actions: {actions}. "
                    star_text += f"Result: {star.get('result', '')}"
                    
                    self.chunks.append(ContentChunk(
                        id=f"behavioral_qa_{idx}",
                        title=f"Behavioral Interview - {question[:50]}...",
                        content=star_text,
                        type="interview",
                        category="behavioral",
                        tags=["interview", "behavioral", "STAR"]
                    ))

        # Interview Prep - Technical
        if 'interview_prep' in profile_data:
            interview_prep = profile_data['interview_prep']
            
            if 'technical' in interview_prep:
                for idx, item in enumerate(interview_prep['technical']):
                    question = item.get('question', '')
                    answer = item.get('answer', {})
                    
                    answer_text = f"Question: {question}. "
                    if 'points' in answer:
                        answer_text += " ".join(answer['points'])
                    
                    self.chunks.append(ContentChunk(
                        id=f"technical_qa_{idx}",
                        title=f"Technical Interview - {question[:50]}...",
                        content=answer_text,
                        type="interview",
                        category="technical",
                        tags=["interview", "technical", "skills"]
                    ))

        # Career Transition
        if 'career_transition' in profile_data:
            transition = profile_data['career_transition']
            transition_text = f"Career Transition: From {transition.get('from', '')} to {transition.get('to', '')}. "
            if 'evidence' in transition:
                transition_text += f"Evidence: {' '.join(transition['evidence'])}"
            
            self.chunks.append(ContentChunk(
                id="career_transition",
                title="Career Transition Story",
                content=transition_text,
                type="career",
                category="transition",
                tags=["career", "transition", "growth"]
            ))

    def embed_and_store(self) -> bool:
        """Embed chunks and store in vector database"""
        if not self.index:
            print("❌ Vector database not connected")
            return False
        
        if not self.chunks:
            print("❌ No chunks to embed")
            return False
        
        try:
            print(f"\n🔄 Embedding {len(self.chunks)} chunks into vector database...")
            
            # Prepare vectors for upsert
            vectors = []
            for chunk in self.chunks:
                enriched_text = f"{chunk.title}: {chunk.content}"
                
                vector_metadata = {
                    "title": chunk.title,
                    "type": chunk.type,
                    "category": chunk.category,
                    "content": chunk.content,
                    "tags": chunk.tags
                }
                
                vectors.append((
                    chunk.id,
                    enriched_text,
                    vector_metadata
                ))
            
            # Upload vectors in batches
            total_uploaded = 0
            for i in range(0, len(vectors), BATCH_SIZE):
                batch = vectors[i:i + BATCH_SIZE]
                try:
                    self.index.upsert(vectors=batch)
                    total_uploaded += len(batch)
                    print(f"  ✓ Uploaded batch {i // BATCH_SIZE + 1}/{(len(vectors) + BATCH_SIZE - 1) // BATCH_SIZE} ({len(batch)} vectors)")
                except Exception as e:
                    print(f"  ⚠️  Error uploading batch: {e}")
                    continue
            
            print(f"\n✅ Successfully uploaded {total_uploaded} vectors to database")
            return True
        
        except Exception as e:
            print(f"❌ Error embedding data: {str(e)}")
            return False

    def verify_database(self) -> bool:
        """Verify data was stored correctly"""
        if not self.index:
            print("❌ Vector database not connected")
            return False
        
        try:
            print("\n🔍 Verifying database contents...")
            
            # Test a simple query
            test_queries = [
                "work experience skills",
                "cloud support AWS",
                "data analytics"
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
                        print(f"    ✓ Found: {title} (relevance: {score})")
                else:
                    print(f"  ⚠️  No results for query: '{test_query}'")
            
            print("\n✅ Vector database verification complete")
            return True
        
        except Exception as e:
            print(f"❌ Error verifying database: {str(e)}")
            return False


def main():
    """Main execution function"""
    print("🤖 Digital Twin Vector Database Setup\n")
    print("=" * 60)
    
    # Initialize setup
    setup = VectorDatabaseSetup()
    
    # Step 1: Connect to database
    print("\n📍 Step 1: Connecting to Upstash Vector Database...")
    if not setup.setup_connection():
        print("❌ Failed to connect to database. Exiting.")
        sys.exit(1)
    
    # Step 2: Load profile data
    print("\n📍 Step 2: Loading Digital Twin profile data...")
    if not setup.load_profile_data():
        print("❌ Failed to load profile data. Exiting.")
        sys.exit(1)
    
    # Step 3: Embed and store
    print("\n📍 Step 3: Embedding and storing content chunks...")
    if not setup.embed_and_store():
        print("❌ Failed to embed data. Exiting.")
        sys.exit(1)
    
    # Step 4: Verify
    print("\n📍 Step 4: Verifying database contents...")
    if not setup.verify_database():
        print("⚠️  Verification had issues, but data may still be stored.")
    
    print("\n" + "=" * 60)
    print("✅ Vector database setup complete!")
    print("\nYour Digital Twin profile is now ready for semantic search.")
    print("You can test it using the RAG application.\n")


if __name__ == "__main__":
    main()
