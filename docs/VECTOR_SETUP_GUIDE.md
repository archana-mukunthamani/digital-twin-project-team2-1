# Vector Database Setup & Data Loading Guide

A comprehensive guide to setting up Upstash Vector Database and loading your digital twin profile data for semantic search.

## Overview

This implementation provides:
- **Vector Database Integration**: Upstash Vector for semantic search across professional profile
- **Data Embedding**: Automatic conversion of profile content into embeddings
- **RAG System**: Retrieval-Augmented Generation combining vector search with Groq LLM
- **Interactive Interface**: Chat-based interface for testing and development

---

## Prerequisites

### Required Software
- Python 3.8 or higher
- pip (Python package manager)
- Virtual environment (optional but recommended)

### Required Credentials
- **Upstash Vector REST URL**: Your vector database endpoint
- **Upstash Vector REST Token**: Authentication token for vector database
- **Groq API Key**: For LLM inference

### Environment Variables Setup

Create or update your `.env` file:

```bash
# Upstash Vector Database
UPSTASH_VECTOR_REST_URL="https://your-region-your-id.upstash.io"
UPSTASH_VECTOR_REST_TOKEN="your_upstash_token"

# Groq API (for LLM responses)
GROQ_API_KEY="your_groq_api_key"
```

**Note**: Test credentials with `test_` prefix are supported:
- `test_UPSTASH_VECTOR_REST_URL`
- `test_UPSTASH_VECTOR_REST_TOKEN`

---

## Installation Steps

### 1. Install Python Dependencies

```bash
# Create virtual environment (optional)
python -m venv venv

# Activate virtual environment
# On Windows:
venv\Scripts\activate
# On macOS/Linux:
source venv/bin/activate

# Install dependencies
pip install -r requirements.txt
```

### 2. Verify Environment Variables

```bash
# Verify credentials are loaded correctly
python -c "from dotenv import load_dotenv; import os; load_dotenv(); print('UPSTASH URL:', os.getenv('test_UPSTASH_VECTOR_REST_URL') or os.getenv('UPSTASH_VECTOR_REST_URL')); print('GROQ API:', 'Set' if os.getenv('GROQ_API_KEY') else 'Not Set')"
```

---

## Vector Database Setup & Data Loading

### Step 1: Prepare Your Profile Data

Ensure `data/digitaltwin.json` contains your complete professional profile:
- Personal information and career summary
- Work experience with quantified achievements
- Technical and soft skills
- Education and certifications
- Projects and portfolio
- Interview preparation notes

**File Structure**:
```
data/
  └── digitaltwin.json     # Your professional profile
```

### Step 2: Run the Embedding Script

The `embed_digitaltwin.py` script:
1. Loads your profile from digitaltwin.json
2. Extracts content chunks with proper categorization
3. Connects to Upstash Vector Database
4. Embeds and stores vectors with metadata
5. Verifies data was loaded correctly

**Execute**:
```bash
python embed_digitaltwin.py
```

**Expected Output**:
```
🤖 Digital Twin Vector Database Setup
============================================================

📍 Step 1: Connecting to Upstash Vector Database...
✅ Connected to Upstash Vector successfully!
📊 Current vectors in database: 0

📍 Step 2: Loading Digital Twin profile data...
✅ Loaded profile data from data/digitaltwin.json
✅ Extracted 45 content chunks

📍 Step 3: Embedding and storing content chunks...
🔄 Embedding 45 chunks into vector database...
  ✓ Uploaded batch 1/5 (10 vectors)
  ✓ Uploaded batch 2/5 (10 vectors)  
  ✓ Uploaded batch 3/5 (10 vectors)
  ✓ Uploaded batch 4/5 (10 vectors)
  ✓ Uploaded batch 5/5 (5 vectors)

✅ Successfully uploaded 45 vectors to database

📍 Step 4: Verifying database contents...
🔍 Verifying database contents...

  Query: 'work experience skills'
    ✓ Found: Cloud Support Engineer - Achievements at AWS (relevance: 0.89)
    ✓ Found: Professional Skills (relevance: 0.87)

  Query: 'cloud support AWS'
    ✓ Found: Cloud Support Engineer at AWS (relevance: 0.92)
    ✓ Found: AWS Certified Cloud Practitioner (relevance: 0.85)

  Query: 'data analytics'
    ✓ Found: CompTIA Data+ (relevance: 0.88)
    ✓ Found: Professional Skills (relevance: 0.84)

✅ Vector database verification complete

============================================================
✅ Vector database setup complete!

Your Digital Twin profile is now ready for semantic search.
```

### Step 3: Test Semantic Search

Run the RAG application to test vector search and LLM integration:

```bash
python digital_twin_rag.py
```

**Interactive Testing**:
```
🤖 Initializing Digital Twin RAG System

============================================================

📍 Setting up Vector Database...
✅ Upstash Vector connected successfully
📊 Vectors in database: 45

📍 Setting up LLM (Groq)...
✅ Groq client initialized successfully

📍 Loading Profile Data...
✅ Profile data loaded

============================================================
✅ RAG System initialized successfully!

🤖 Chat with your Digital Twin
============================================================
Ask questions about professional background, skills, projects, or goals.
Type 'exit' to quit.

💭 Example questions:
  • Tell me about your work experience
  • What are your technical skills?
  • Describe a challenging project you worked on
  • How are you transitioning into data analytics?

You: Tell me about your work experience
```

---

## How It Works

### Content Chunking Strategy

Profile data is extracted into semantic chunks:

| Chunk Type | Source | Purpose |
|-----------|--------|---------|
| **Profile Summary** | personal_profile | Career overview and positioning |
| **Education** | education array | Degree and institution info |
| **Certifications** | certifications array | Professional credentials |
| **Experience Headers** | professional_experience role/company | Job position and company |
| **Achievements** | quantified_impact | Specific accomplishments with metrics |
| **Metrics** | metrics_examples | Quantified results and impact |
| **Skills** | skills object | Technical and soft skills |
| **Behavioral Q&A** | interview_prep.behavioral | STAR format interview stories |
| **Technical Q&A** | interview_prep.technical | Technical interview responses |
| **Career Transition** | career_transition | Transition narrative and evidence |

### Vector Search Flow

```
User Question
    ↓
[Upstash Vector Query]
    ↓
Semantic Search (finds similar content)
    ↓
Top-K Results with Relevance Scores
    ↓
[LLM Processing]
    ↓
Interview-Ready Response
```

### Embedding Size & Performance

- **Total Chunks**: ~45 per standard profile
- **Average Text Length**: 150-300 characters
- **Embedding Dimension**: 384 (Upstash default)
- **Search Time**: < 1 second
- **Database Size**: < 1MB

---

## Advanced Usage

### Custom Query Configuration

Modify search parameters in `digital_twin_rag.py`:

```python
# Adjust number of results
vector_results = self.query_vectors(question, top_k=5)  # Default is 3

# Control LLM response formatting
result = rag_system.rag_query(question, use_llm_formatting=True)
```

### LLM Model Selection

Switch between Groq models for different use cases:

```python
# Fast, cost-effective (default)
DEFAULT_MODEL = "llama-3.1-8b-instant"

# More detailed responses
DEFAULT_MODEL = "llama-3.1-70b-versatile"

# Balanced performance
DEFAULT_MODEL = "llama-3.3-70b-versatile"
```

### Adding New Content

To add new content to your profile:

1. Update `data/digitaltwin.json` with new experience, skills, or achievements
2. Re-run `embed_digitaltwin.py` to update vectors:
   ```bash
   python embed_digitaltwin.py
   ```
3. Test new content in `digital_twin_rag.py`

---

## Troubleshooting

### Issue: Connection to Upstash Failed

**Symptom**: `❌ Error connecting to Upstash Vector`

**Solutions**:
1. Verify credentials in `.env`:
   ```bash
   python -c "import os; from dotenv import load_dotenv; load_dotenv(); print(os.getenv('test_UPSTASH_VECTOR_REST_URL'))"
   ```
2. Check URL format: `https://your-region-your-id.upstash.io`
3. Verify token is not expired (check Upstash console)
4. Test internet connectivity

### Issue: No Vectors in Database

**Symptom**: `Current vectors in database: 0`

**Solutions**:
1. Run embedding script: `python embed_digitaltwin.py`
2. Check `data/digitaltwin.json` exists and has content
3. Verify no errors during chunk extraction
4. Check Upstash console for database status

### Issue: Invalid JSON Format

**Symptom**: `❌ Invalid JSON format`

**Solutions**:
1. Validate JSON: `python -m json.tool data/digitaltwin.json`
2. Fix syntax errors (missing quotes, commas, brackets)
3. Use JSON linter: https://jsonlint.com/

### Issue: Groq API Error

**Symptom**: `❌ Error initializing Groq client` or timeout errors

**Solutions**:
1. Verify API key in `.env`
2. Check Groq API status: https://console.groq.com
3. Verify rate limits not exceeded
4. Test API connectivity:
   ```bash
   python -c "from groq import Groq; c = Groq(); print(c.models.list())"
   ```

### Issue: Slow Response Times

**Symptom**: Queries take > 5 seconds

**Solutions**:
1. Use faster model: `llama-3.1-8b-instant`
2. Reduce top_k parameter: `top_k=2` or `top_k=3`
3. Check internet connection
4. Monitor Groq API usage and rate limits

---

## Performance Optimization

### Batch Processing

For embedding large profiles, the script automatically batches vectors:

```python
BATCH_SIZE = 10  # Adjust based on your needs
```

### Query Optimization

```python
# Reduce results for faster responses
top_k = 2  # Instead of 3

# Use faster model
model = "llama-3.1-8b-instant"  # Instead of 70b
```

### Cost Management

Monitor token usage in Groq console. Strategies to reduce costs:

1. Use 8B model for query enhancement
2. Cache common questions
3. Reduce response lengths
4. Use temperature parameter (0.3 for consistent, 0.7 for creative)

---

## Production Considerations

### Security
- ✅ Credentials stored in `.env` (not committed)
- ✅ HTTPS-only communication with Upstash and Groq
- ✅ No sensitive data logged to console
- ⚠️ Implement rate limiting for production APIs

### Monitoring
- Log API calls and response times
- Track error rates and types
- Monitor token consumption
- Alert on connection failures

### Scaling
- Upstash Vector handles auto-scaling
- Consider caching frequent queries
- Implement request queuing for high load
- Monitor database vector count

---

## Next Steps

1. ✅ **Environment Setup**: Configure `.env` with credentials
2. ✅ **Data Loading**: Run `embed_digitaltwin.py` to populate database
3. ✅ **Testing**: Use `digital_twin_rag.py` for interactive testing
4. ⏭️ **Integration**: Connect to MCP server for VS Code/Claude Desktop
5. ⏭️ **Deployment**: Deploy to Vercel for production

---

## References

- **Upstash Vector Documentation**: https://upstash.com/docs/vector
- **Groq API**: https://console.groq.com
- **Model Context Protocol**: https://modelcontextprotocol.io

---

## Support

For issues or questions:
1. Check troubleshooting section above
2. Verify all prerequisites are installed
3. Review console output carefully
4. Check Upstash and Groq dashboards for service status
