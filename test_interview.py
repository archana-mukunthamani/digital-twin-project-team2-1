#!/usr/bin/env python3
"""
Test the Digital Twin MCP server with technical interview questions
"""
import requests
import json
import time

API_URL = "http://localhost:3000/api/mcp"

def query_digital_twin(question: str, question_id: str) -> dict:
    """Query the digital twin with a single question"""
    payload = {
        "jsonrpc": "2.0",
        "id": question_id,
        "method": "tools/call",
        "params": {
            "name": "query_digital_twin",
            "arguments": {
                "question": question
            }
        }
    }
    
    try:
        response = requests.post(API_URL, json=payload, timeout=15)
        return response.json()
    except Exception as e:
        return {"error": str(e)}

# Technical Interview Questions
questions = [
    {
        "id": 1,
        "title": "Q1: Data Quality Investigation",
        "question": "Describe your methodology for investigating data quality issues, particularly when metrics are inflated compared to source systems. What would you check first? Walk me through your source-to-target validation process."
    },
    {
        "id": 2,
        "title": "Q2: Cloud Data Stack Experience",
        "question": "How would you approach migrating a reporting system from on-premises Oracle with nightly batch loads to a modern cloud data warehouse like Snowflake? What would you prioritize and why?"
    },
    {
        "id": 3,
        "title": "Q3: System Design - Data Discovery",
        "question": "Design a system that helps business users discover relevant data tables across multiple sources using natural language questions. How would you handle semantic search, metadata management, and performance at scale?"
    },
    {
        "id": 4,
        "title": "Q4: Testing RAG & Non-Deterministic Systems",
        "question": "You've built a RAG system with vector embeddings and an LLM. How would you test for correctness when the LLM output is non-deterministic? What would you test deterministically versus probabilistically?"
    },
    {
        "id": 5,
        "title": "Q5: Translating Business Requirements",
        "question": "Your CFO wants a 'Cost-Per-Broadcast-Hour' metric but different teams define 'broadcast hour' and 'costs' differently. How would you align stakeholders and validate the final metric? What would be your acceptance criteria?"
    }
]

print("=" * 80)
print("🤖 DIGITAL TWIN TECHNICAL INTERVIEW")
print("Testing Digital Twin as Interview Candidate")
print("=" * 80)
print()

results = []

for q in questions:
    print(f"📋 {q['title']}")
    print("-" * 80)
    print(f"Question: {q['question']}")
    print()
    
    response = query_digital_twin(q['question'], q['id'])
    
    # Extract the response
    try:
        if "result" in response and response["result"] and "content" in response["result"]:
            answer = response["result"]["content"][0]["text"]
            print(f"✅ DIGITAL TWIN RESPONSE:")
            print()
            print(answer)
        elif "error" in response:
            print(f"❌ Error: {response['error']['message']}")
            answer = f"ERROR: {response['error']['message']}"
        else:
            print(f"❌ Unexpected response format: {json.dumps(response, indent=2)}")
            answer = "ERROR: Unexpected response"
    except Exception as e:
        print(f"❌ Error parsing response: {str(e)}")
        answer = f"ERROR: {str(e)}"
    
    results.append({
        "question": q['title'],
        "answer": answer
    })
    
    print()
    print("=" * 80)
    print()
    time.sleep(1)  # Rate limiting

# Summary
print("\n" + "=" * 80)
print("📊 INTERVIEW SUMMARY")
print("=" * 80)
print()

for i, result in enumerate(results, 1):
    print(f"{i}. {result['question']}")
    if "ERROR" in result['answer']:
        print(f"   Status: ❌ Failed")
    else:
        answer_preview = result['answer'][:100] + "..." if len(result['answer']) > 100 else result['answer']
        print(f"   Status: ✅ Success")
        print(f"   Preview: {answer_preview}")
    print()

print("=" * 80)
print("✅ Interview test complete!")
print("=" * 80)
