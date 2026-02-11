#!/usr/bin/env python3
"""
Digital Twin RAG Application
Retrieval-Augmented Generation system for interview preparation
- Upstash Vector: Semantic search across professional profile
- Groq: Ultra-fast LLM inference for responses
"""

import os
import json
from typing import List, Dict, Any, Optional
from dotenv import load_dotenv
from upstash_vector import Index
from groq import Groq

# Load environment variables
load_dotenv(dotenv_path='.env.local')

# Configuration
UPSTASH_VECTOR_REST_URL = os.getenv('test_UPSTASH_VECTOR_REST_URL') or os.getenv('UPSTASH_VECTOR_REST_URL')
UPSTASH_VECTOR_REST_TOKEN = os.getenv('test_UPSTASH_VECTOR_REST_TOKEN') or os.getenv('UPSTASH_VECTOR_REST_TOKEN')
GROQ_API_KEY = os.getenv('GROQ_API_KEY')
DEFAULT_MODEL = "llama-3.1-8b-instant"
JSON_FILE = "data/digitaltwin_clean.json"


class DigitalTwinRAG:
    """RAG system for digital twin interview preparation"""
    
    def __init__(self):
        """Initialize RAG system with vector database and LLM"""
        self.vector_index: Optional[Index] = None
        self.groq_client: Optional[Groq] = None
        self.profile_data: Dict[str, Any] = {}
        self.setup_failed = False
    
    def setup_vector_database(self) -> bool:
        """Setup Upstash Vector database connection"""
        try:
            if not UPSTASH_VECTOR_REST_URL or not UPSTASH_VECTOR_REST_TOKEN:
                print("❌ Upstash Vector credentials not found in environment")
                return False
            
            self.vector_index = Index(
                url=UPSTASH_VECTOR_REST_URL,
                token=UPSTASH_VECTOR_REST_TOKEN,
            )
            print("✅ Upstash Vector connected successfully")
            
            # Check database status
            try:
                info = self.vector_index.info()
                vector_count = getattr(info, 'vector_count', 0)
                print(f"📊 Vectors in database: {vector_count}")
                
                if vector_count == 0:
                    print("⚠️  No vectors found in database. Run embed_digitaltwin.py first.")
                    return False
            except Exception as e:
                print(f"⚠️  Could not check database info: {e}")
            
            return True
        
        except Exception as e:
            print(f"❌ Error setting up vector database: {str(e)}")
            return False
    
    def setup_groq_client(self) -> bool:
        """Setup Groq LLM client"""
        try:
            if not GROQ_API_KEY:
                print("❌ GROQ_API_KEY not found in environment")
                return False
            # Prefer explicit keyword-style initialization. Some environments
            # inject proxy settings which can cause underlying HTTP client
            # constructors to fail (e.g. unexpected 'proxies' kwarg). To avoid
            # that, create a dedicated httpx.Client that does not pick up env
            # proxies and pass it to the Groq client when needed.
            try:
                self.groq_client = Groq(api_key=GROQ_API_KEY)
                print("✅ Groq client initialized successfully")
                return True
            except Exception as first_exc:
                # Try again with an explicit httpx client that ignores env proxies
                try:
                    import httpx
                    http_client = httpx.Client(trust_env=False)
                    self.groq_client = Groq(api_key=GROQ_API_KEY, http_client=http_client)
                    print("✅ Groq client initialized successfully (http_client override)")
                    return True
                except Exception as e2:
                    print(f"❌ Error initializing Groq client: {first_exc} | fallback error: {e2}")
                    return False
            
        
        except Exception as e:
            print(f"❌ Error initializing Groq client: {str(e)}")
            return False
    
    def load_profile_data(self) -> bool:
        """Load digital twin profile for context"""
        try:
            if not os.path.exists(JSON_FILE):
                print(f"⚠️  {JSON_FILE} not found")
                return False
            
            with open(JSON_FILE, 'r', encoding='utf-8') as f:
                self.profile_data = json.load(f)
            
            print("✅ Profile data loaded")
            return True
        
        except Exception as e:
            print(f"⚠️  Error loading profile: {e}")
            return False
    
    def query_vectors(self, query_text: str, top_k: int = 3) -> List[Dict[str, Any]]:
        """Query vector database for relevant content"""
        try:
            if not self.vector_index:
                print("❌ Vector database not initialized")
                return []
            
            results = self.vector_index.query(
                data=query_text,
                top_k=top_k,
                include_metadata=True
            )
            
            formatted_results = []
            for result in results:
                metadata = getattr(result, 'metadata', {})
                score = getattr(result, 'score', 0)
                
                formatted_results.append({
                    'id': getattr(result, 'id', 'unknown'),
                    'content': metadata.get('content', '') if metadata else '',
                    'title': metadata.get('title', '') if metadata else '',
                    'type': metadata.get('type', '') if metadata else '',
                    'score': score,
                    'metadata': metadata
                })
            
            return formatted_results
        
        except Exception as e:
            print(f"❌ Error querying vectors: {str(e)}")
            return []
    
    def generate_response(self, prompt: str, model: str = DEFAULT_MODEL) -> str:
        """Generate response using Groq LLM"""
        try:
            if not self.groq_client:
                print("❌ Groq client not initialized")
                return "Unable to generate response"
            
            completion = self.groq_client.chat.completions.create(
                model=model,
                messages=[
                    {
                        "role": "system",
                        "content": "You are an AI digital twin representing a professional. Answer questions as if you are the person, speaking in first person about your background, skills, and experiences. Be specific, use examples, and demonstrate your expertise with quantifiable achievements."
                    },
                    {
                        "role": "user",
                        "content": prompt
                    }
                ],
                temperature=0.7,
                max_tokens=500
            )
            
            return completion.choices[0].message.content.strip()
        
        except Exception as e:
            return f"❌ Error generating response: {str(e)}"
    
    def rag_query(self, question: str, use_llm_formatting: bool = True) -> Dict[str, Any]:
        """
        Perform RAG query: semantic search + LLM response generation
        """
        try:
            # Step 1: Search vector database
            print(f"\n🔍 Searching your professional profile...")
            vector_results = self.query_vectors(question, top_k=3)
            
            if not vector_results:
                return {
                    'success': False,
                    'response': "I don't have specific information about that topic in my professional background.",
                    'results_found': 0
                }
            
            # Step 2: Extract and display context
            print(f"✅ Found {len(vector_results)} relevant items:")
            context_pieces = []
            
            for idx, result in enumerate(vector_results, 1):
                title = result.get('title', 'Unknown')
                score = result.get('score', 0)
                content = result.get('content', '')
                
                print(f"  {idx}. {title} (Relevance: {score:.0%})")
                
                if content:
                    context_pieces.append(f"{title}: {content}")
            
            # Step 3: Generate response with LLM
            print(f"\n⚡ Generating personalized response...")
            
            context = "\n".join(context_pieces)
            
            if use_llm_formatting:
                # Use LLM to format response for interview context
                prompt = f"""Based on the following professional information, provide a compelling interview response:

Professional Context:
{context}

Interview Question: {question}

Guidelines:
- Speak in first person as the professional
- Include specific examples and metrics
- Use STAR format (Situation-Task-Action-Result) when telling stories
- Sound confident and natural
- Directly address the question

Response:"""
            else:
                # Simpler RAG without LLM formatting
                prompt = f"""Professional Context:
{context}

Question: {question}

Answer in first person based on this context:"""
            
            response = self.generate_response(prompt)

            # If LLM is not available, return the raw context as a fallback
            if not self.groq_client:
                fallback_response = (
                    "⚠️ LLM not available. Returning supporting context instead:\n\n" + context
                )
                return {
                    'success': True,
                    'response': fallback_response,
                    'results_found': len(vector_results),
                    'context_items': vector_results,
                    'model_used': None
                }

            return {
                'success': True,
                'response': response,
                'results_found': len(vector_results),
                'context_items': vector_results,
                'model_used': DEFAULT_MODEL
            }
        
        except Exception as e:
            return {
                'success': False,
                'response': f"❌ Error during query: {str(e)}",
                'results_found': 0
            }
    
    def initialize(self) -> bool:
        """Initialize all components"""
        print("🤖 Initializing Digital Twin RAG System\n")
        print("=" * 60)
        
        # Setup vector database
        print("\n📍 Setting up Vector Database...")
        vector_ok = self.setup_vector_database()
        if not vector_ok:
            print("⚠️  Vector database setup had issues")
            self.setup_failed = True
        
        # Setup Groq (optional)
        print("\n📍 Setting up LLM (Groq)...")
        groq_ok = self.setup_groq_client()
        if not groq_ok:
            print("⚠️  Groq setup had issues — continuing without LLM (degraded mode)")
        
        # Load profile
        print("\n📍 Loading Profile Data...")
        if not self.load_profile_data():
            print("⚠️  Profile data not available")
        
        print("\n" + "=" * 60)
        
        if not self.setup_failed:
            print("✅ RAG System initialized successfully!")
            return True
        else:
            print("⚠️  RAG system initialized with some issues — vector DB is required")
            return False


def main():
    """Main interactive loop"""
    # Initialize RAG system
    rag_system = DigitalTwinRAG()
    
    if not rag_system.initialize():
        print("\n❌ Failed to initialize. Please check your setup.")
        return
    
    print("\n🤖 Chat with your Digital Twin")
    print("=" * 60)
    print("Ask questions about professional background, skills, projects, or goals.")
    print("Type 'exit' to quit.\n")
    
    print("💭 Example questions:")
    print("  • Tell me about your work experience")
    print("  • What are your technical skills?")
    print("  • Describe a challenging project you worked on")
    print("  • How are you transitioning into data analytics?")
    print()
    
    # Interactive chat loop
    while True:
        try:
            question = input("You: ").strip()
            
            if question.lower() in ["exit", "quit", "bye"]:
                print("\n👋 Thank you for using Digital Twin RAG!")
                break
            
            if not question:
                print("Please ask a question.\n")
                continue
            
            # Run RAG query
            result = rag_system.rag_query(question)
            
            if result['success']:
                print(f"\n🤖 Digital Twin: {result['response']}\n")
                print("-" * 60)
            else:
                print(f"\n🤖 Digital Twin: {result['response']}\n")
        
        except KeyboardInterrupt:
            print("\n\n👋 Goodbye!")
            break
        except Exception as e:
            print(f"❌ Error: {e}\n")


if __name__ == "__main__":
    main()
