# Deployment Guide

## Overview

This guide provides step-by-step instructions for deploying the Digital Twin MCP Server to Vercel.

---

## Repository Setup

### Current Repository Structure

- **Origin**: `https://github.com/Himani1201/digital-twin-project-team2.git` (Main team repository)
- **Fork**: `https://github.com/archana-mukunthamani/digital-twin-project-team2-1.git` (Deployment fork)

### Git Remotes

```bash
# View current remotes
git remote -v

# Expected output:
# myfork  https://github.com/archana-mukunthamani/digital-twin-project-team2-1.git (fetch)
# myfork  https://github.com/archana-mukunthamani/digital-twin-project-team2-1.git (push)
# origin  https://github.com/Himani1201/digital-twin-project-team2.git (fetch)
# origin  https://github.com/Himani1201/digital-twin-project-team2.git (push)
```

---

## Pre-Deployment Checklist

### 1. Environment Variables

Ensure you have the following environment variables ready:

- `UPSTASH_VECTOR_REST_URL` - Upstash Vector database URL
- `UPSTASH_VECTOR_REST_TOKEN` - Upstash Vector database token
- `GROQ_API_KEY` - Groq LLM API key

**Important**: Never commit `.env` or `.env.local` files to Git. These are already in `.gitignore`.

### 2. Dependencies

Verify all dependencies are properly installed:

```bash
cd mcp-server
pnpm install
```

### 3. Local Testing

Test the application locally before deploying:

```bash
cd mcp-server
pnpm dev
```

Visit `http://localhost:3000` to verify the MCP server landing page.

Test MCP endpoint:
```bash
curl -X POST http://localhost:3000/api/mcp \
  -H "Content-Type: application/json" \
  -d '{
    "jsonrpc": "2.0",
    "id": 1,
    "method": "tools/list"
  }'
```

---

## Deployment Process

### Step 1: Commit Your Changes

```bash
# Check current status
git status

# Stage your changes (exclude .env files)
git add README.md
git add mcp-server/app/
git add docs/
# Add other relevant files...

# Commit with descriptive message
git commit -m "feat: describe your changes here"
```

### Step 2: Push to Origin (Team Repository)

```bash
# Push to origin dev branch
git push origin dev
```

### Step 3: Push to Fork (Deployment Repository)

```bash
# Push to your fork's dev branch
git push myfork dev

# Or push to main branch if deploying from main
git push myfork main
```

### Step 4: Deploy to Vercel

#### Option A: Vercel CLI Deployment

1. **Install Vercel CLI** (if not already installed):
   ```bash
   npm install -g vercel
   ```

2. **Login to Vercel**:
   ```bash
   vercel login
   ```

3. **Deploy from the mcp-server directory**:
   ```bash
   cd mcp-server
   vercel --prod
   ```

4. **Follow the prompts**:
   - Link to existing project or create new
   - Select your Vercel account/team
   - Confirm the project name
   - Wait for deployment to complete

#### Option B: Vercel Dashboard Deployment

1. **Go to Vercel Dashboard**: [https://vercel.com/dashboard](https://vercel.com/dashboard)

2. **Import Git Repository**:
   - Click "Add New..." → "Project"
   - Import `archana-mukunthamani/digital-twin-project-team2-1`
   - Select the branch to deploy (usually `dev` or `main`)

3. **Configure Build Settings** (IMPORTANT!):
   - **Framework Preset**: Next.js
   - **Root Directory**: `mcp-server` ⚠️ **MUST BE SET!**
   - **Build Command**: Leave default or use `pnpm build`
   - **Output Directory**: Leave default (`.next`)
   - **Install Command**: Leave default or use `pnpm install`
   
   **Critical**: The Root Directory setting tells Vercel where your Next.js app is located!

4. **Add Environment Variables**:
   - Go to "Settings" → "Environment Variables"
   - Add the following variables:
     - `UPSTASH_VECTOR_REST_URL`
     - `UPSTASH_VECTOR_REST_TOKEN`
     - `GROQ_API_KEY`
   - Save changes

5. **Deploy**:
   - Click "Deploy"
   - Wait for the build to complete
   - Your MCP server will be live at your Vercel URL

---

## Vercel Configuration

### vercel.json

The project includes a `vercel.json` configuration file at the root:

```json
{}
```

**Important**: The `vercel.json` file is intentionally minimal. Vercel configuration (especially Root Directory) **must be set in the Vercel Dashboard** during project setup.

**Why?** The `rootDirectory` property is NOT supported in `vercel.json`. You must configure it through the Vercel UI:
- Go to Project Settings → General → Root Directory
- Set it to: `mcp-server`

### Environment Variables in Vercel

**To add/update environment variables in Vercel**:

1. Go to your project dashboard on Vercel
2. Navigate to "Settings" → "Environment Variables"
3. Add or update variables
4. **Redeploy** to apply the changes:
   - Go to "Deployments"
   - Click "..." on the latest deployment
   - Select "Redeploy"

---

## Post-Deployment Verification

### 1. Check Deployment Status

```bash
# Using Vercel CLI
vercel ls

# View deployment logs
vercel logs <deployment-url>
```

### 2. Test MCP Endpoint

Once deployed, test your MCP server:

```bash
curl -X POST https://your-vercel-url.vercel.app/api/mcp \
  -H "Content-Type: application/json" \
  -d '{
    "jsonrpc": "2.0",
    "id": 1,
    "method": "tools/list"
  }'
```

Expected response should list available tools like `query_digital_twin`.

### 3. Update VS Code MCP Configuration

Update your `.vscode/mcp.json` with the new Vercel URL:

```json
{
  "mcpServers": {
    "digital-twin": {
      "url": "https://your-vercel-url.vercel.app/api/mcp",
      "transport": {
        "type": "http"
      }
    }
  }
}
```

### 4. Test with VS Code Copilot

Open VS Code Copilot Chat and test:

```
@workspace Query my digital twin: "What are your technical skills?"
```

---

## Future Deployments

### Quick Deployment Workflow

For future updates, follow this streamlined process:

1. **Make changes locally**
   ```bash
   # Edit files, test locally
   cd mcp-server
   pnpm dev
   ```

2. **Commit and push**
   ```bash
   # Stage and commit
   git add .
   git commit -m "feat: your change description"
   
   # Push to team repo
   git push origin dev
   
   # Push to deployment fork
   git push myfork dev
   ```

3. **Deploy**
   ```bash
   # Option 1: Automatic (if Vercel auto-deploy is enabled)
   # Vercel will automatically deploy when you push to the connected branch
   
   # Option 2: Manual via CLI
   cd mcp-server
   vercel --prod
   ```

4. **Verify**
   - Check Vercel dashboard for build status
   - Test MCP endpoint
   - Test in VS Code Copilot

---

## Automatic Deployments

### Enable Auto-Deploy from Git

To enable automatic deployments when pushing to your fork:

1. **Go to Vercel Project Settings**
2. **Navigate to "Git"**
3. **Enable "Auto Deploy"** for your target branch (e.g., `dev` or `main`)
4. **Save settings**

Now, whenever you push to the connected branch, Vercel will automatically:
- Detect the changes
- Build the project
- Deploy the new version
- Provide a unique URL for each deployment

---

## Troubleshooting

### Build Failures

**Issue**: Build fails on Vercel

**Solutions**:
1. Check build logs in Vercel dashboard
2. Verify `vercel.json` configuration
3. Ensure `pnpm-lock.yaml` is committed
4. Check that environment variables are set correctly
5. Test build locally:
   ```bash
   cd mcp-server
   pnpm build
   ```

### Environment Variable Issues

**Issue**: MCP queries fail or return errors

**Solutions**:
1. Verify environment variables in Vercel settings
2. Check that variable names match exactly (case-sensitive)
3. Ensure no extra spaces or quotes in variable values
4. Redeploy after adding/updating variables

### Upstash Connection Errors

**Issue**: Cannot connect to Upstash Vector database

**Solutions**:
1. Verify `UPSTASH_VECTOR_REST_URL` format
2. Check `UPSTASH_VECTOR_REST_TOKEN` is valid
3. Ensure Upstash database is active
4. Test connection locally first

### Groq API Errors

**Issue**: LLM queries fail

**Solutions**:
1. Verify `GROQ_API_KEY` is valid
2. Check Groq API quota/limits
3. Review Groq API status page
4. Test with a different API key if available

---

## Branch Strategy

### Recommended Workflow

- **`main` branch**: Production-ready code
- **`dev` branch**: Active development, testing
- **Feature branches**: Individual feature development

### Deployment Strategy

- **Development**: Deploy `dev` branch to a staging Vercel URL
- **Production**: Deploy `main` branch to production Vercel URL

To set this up:

1. Create two Vercel projects:
   - `digital-twin-dev` (connected to `dev` branch)
   - `digital-twin-prod` (connected to `main` branch)

2. Use different environment variable sets if needed

---

## Rollback Procedure

If a deployment introduces issues:

1. **Go to Vercel Dashboard** → "Deployments"
2. **Find the previous working deployment**
3. **Click "..." menu** → "Promote to Production"
4. **Or revert the Git commit and redeploy**:
   ```bash
   git revert <commit-hash>
   git push myfork dev
   ```

---

## Security Best Practices

1. **Never commit secrets**: Always use environment variables
2. **Use Vercel environment variable scopes**:
   - Production
   - Preview
   - Development
3. **Rotate API keys regularly**
4. **Review Vercel security logs** periodically
5. **Enable Vercel Security features** (if available)

---

## Monitoring and Logs

### View Deployment Logs

**Via Vercel Dashboard**:
1. Go to your project
2. Click "Deployments"
3. Select a deployment
4. View "Build Logs" and "Runtime Logs"

**Via Vercel CLI**:
```bash
vercel logs <deployment-url>
vercel logs <deployment-url> --follow
```

### Monitor Performance

- Use Vercel Analytics (if enabled)
- Review function execution times
- Monitor API request counts
- Track error rates

---

## Useful Commands Reference

```bash
# Git Commands
git status                          # Check working directory status
git add <file>                      # Stage file for commit
git commit -m "message"             # Commit staged changes
git push origin dev                 # Push to team repository
git push myfork dev                 # Push to deployment fork
git pull origin dev                 # Pull latest from team repo

# Vercel CLI Commands
vercel                              # Deploy to preview
vercel --prod                       # Deploy to production
vercel login                        # Login to Vercel account
vercel logout                       # Logout from Vercel
vercel ls                           # List deployments
vercel logs <url>                   # View deployment logs
vercel env ls                       # List environment variables
vercel env add <name>               # Add environment variable
vercel domains                      # Manage custom domains

# Local Development
cd mcp-server                       # Navigate to MCP server directory
pnpm install                        # Install dependencies
pnpm dev                            # Start development server
pnpm build                          # Build for production
pnpm start                          # Start production server
```

---

## Contact and Support

- **Vercel Documentation**: [https://vercel.com/docs](https://vercel.com/docs)
- **Next.js Documentation**: [https://nextjs.org/docs](https://nextjs.org/docs)
- **Upstash Documentation**: [https://upstash.com/docs](https://upstash.com/docs)
- **Groq API Documentation**: [https://console.groq.com/docs](https://console.groq.com/docs)

---

**Document Version**: 1.0  
**Last Updated**: February 16, 2026  
**Maintained By**: Digital Twin Project Team
