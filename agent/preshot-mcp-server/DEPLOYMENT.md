# Preshot MCP Server - Deployment Guide

## 🎯 Overview

This guide helps you deploy the Preshot MCP server to Cloudflare Workers without conflicting with your existing `mcp-serve` deployment.

**Worker Name:** `preshot-mcp-server` (configured in wrangler.toml)
**Existing Worker:** `mcp-serve` (no conflict)

---

## 📋 Prerequisites

1. **Cloudflare Account**
   - Free or paid account at [dash.cloudflare.com](https://dash.cloudflare.com)

2. **Wrangler CLI**
   ```bash
   npm install -g wrangler
   # or
   pnpm add -g wrangler
   ```

3. **Environment Variables**
   - Anthropic API key (for Claude)
   - Base Sepolia RPC URL
   - Contract addresses

---

## 🔐 Step 1: Login to Cloudflare

```bash
cd /home/george/Documents/team/preshot-app/agent/preshot-mcp-server

# Login to your Cloudflare account
wrangler login
```

This will open a browser for authentication.

---

## ⚙️ Step 2: Set Up Environment Variables

### Create KV Namespace (if not exists)

```bash
# Check if KV namespace exists
wrangler kv:namespace list

# If you need to create a new one (optional)
# wrangler kv:namespace create "PRESHOT_KV"
```

### Set Secrets (Required)

```bash
# Set Anthropic API key
wrangler secret put ANTHROPIC_API_KEY
# Paste your key when prompted

# Set RPC URL for Base Sepolia
wrangler secret put BASE_SEPOLIA_RPC_URL
# Example: https://base-sepolia.g.alchemy.com/v2/YOUR_KEY

# Set contract addresses
wrangler secret put BADGES_CONTRACT_ADDRESS
# Value: 0x97d0CcEfE0Fe3A9dD392743c29A39ea18ADD0156

wrangler secret put CREDENTIALS_CONTRACT_ADDRESS
# Value: 0xEF18625F583F2362390A8edD637f707f62358669

# Optional: Set private key for blockchain transactions
wrangler secret put DEPLOYER_PRIVATE_KEY
# Only if you want the server to submit to blockchain
```

### Verify .dev.vars (Local Development)

Check that `.dev.vars` has all required variables:

```bash
cat .dev.vars
```

Should include:
```
ANTHROPIC_API_KEY=your_key_here
BASE_SEPOLIA_RPC_URL=https://base-sepolia.g.alchemy.com/v2/YOUR_KEY
BADGES_CONTRACT_ADDRESS=0x97d0CcEfE0Fe3A9dD392743c29A39ea18ADD0156
CREDENTIALS_CONTRACT_ADDRESS=0xEF18625F583F2362390A8edD637f707f62358669
```

---

## 🚀 Step 3: Deploy to Cloudflare

### Build and Deploy

```bash
# Install dependencies (if not done)
pnpm install

# Deploy to Cloudflare Workers
pnpm run deploy

# OR use wrangler directly
wrangler deploy
```

### Expected Output

```
⛅️ wrangler 3.x.x
------------------
Uploading... (100%)
✨ Success! Deployed to Cloudflare Workers
🌐 URL: https://preshot-mcp-server.YOUR_ACCOUNT.workers.dev
```

---

## ✅ Step 4: Verify Deployment

### Test the Server

```bash
# Test the health endpoint
curl https://preshot-mcp-server.YOUR_ACCOUNT.workers.dev/health

# Should return:
# {"status":"healthy","service":"preshot-mcp-server"}
```

### Test MCP Tools Endpoint

```bash
curl https://preshot-mcp-server.YOUR_ACCOUNT.workers.dev/mcp/tools

# Should return a list of available tools
```

---

## 🔧 Step 5: Update Frontend Configuration

Once deployed, update your frontend `.env.local`:

```bash
cd /home/george/Documents/team/preshot-app/frontend

# Edit .env.local
nano .env.local
```

Add:
```env
VITE_MCP_SERVER_URL=https://preshot-mcp-server.YOUR_ACCOUNT.workers.dev
```

Replace `YOUR_ACCOUNT` with your actual Cloudflare account subdomain.

---

## 🛠️ Troubleshooting

### Issue: Deployment Fails

```bash
# Check wrangler configuration
wrangler whoami

# Verify you're logged in
wrangler login

# Check for syntax errors
pnpm run build
```

### Issue: KV Namespace Not Found

```bash
# List all KV namespaces
wrangler kv:namespace list

# Update wrangler.toml with correct ID
# Or create a new namespace
wrangler kv:namespace create "PRESHOT_KV"
```

### Issue: Service Binding Error

Your `wrangler.toml` references a service called `mcp`. If this doesn't exist:

```toml
# Option 1: Remove service binding (comment out lines 6-9)
# [[services]]
# binding = "MCP_SERVICE"
# service = "mcp"

# Option 2: Deploy the 'mcp' service first
# Or change to your existing 'mcp-serve'
[[services]]
binding = "MCP_SERVICE"
service = "mcp-serve"  # Use your existing worker
```

---

## 📦 Configuration Reference

### wrangler.toml Structure

```toml
name = "preshot-mcp-server"  # Worker name (unique)
main = "src/index.ts"
compatibility_date = "2025-11-23"
compatibility_flags = ["nodejs_compat"]

# Optional: Service binding
[[services]]
binding = "MCP_SERVICE"
service = "mcp-serve"  # Your existing MCP worker

# KV Namespace
[[kv_namespaces]]
binding = "PRESHOT_KV"
id = "f63d382b98e64e198856d74af5036d8f"
```

---

## 🔄 Updating the Deployment

```bash
# Make code changes, then:
pnpm run deploy

# Or with a custom name
wrangler deploy --name preshot-mcp-server-staging
```

---

## 🌐 Custom Domain (Optional)

### Add Custom Domain in Cloudflare Dashboard

1. Go to **Workers & Pages** → **preshot-mcp-server**
2. Click **Triggers** → **Custom Domains**
3. Add domain: `api.preshot.app` (or similar)
4. Update frontend to use custom domain

---

## 📊 Monitoring

### View Logs

```bash
# Tail live logs
wrangler tail

# View in Cloudflare Dashboard
# Workers & Pages → preshot-mcp-server → Logs
```

### Check Metrics

```bash
# In Cloudflare Dashboard:
# Workers & Pages → preshot-mcp-server → Metrics
```

---

## 🔒 Security Best Practices

1. **Never commit secrets** - Use `wrangler secret put`
2. **Use environment-specific workers** - Separate staging/production
3. **Enable rate limiting** - Protect against abuse
4. **CORS configuration** - Only allow your frontend domain

---

## ✅ Deployment Checklist

- [ ] Wrangler installed and logged in
- [ ] Secrets configured (ANTHROPIC_API_KEY, RPC_URL, contract addresses)
- [ ] KV namespace created/verified
- [ ] Code built successfully (`pnpm run build`)
- [ ] Deployed to Cloudflare (`pnpm run deploy`)
- [ ] Health endpoint tested
- [ ] MCP tools endpoint tested
- [ ] Frontend `.env.local` updated with worker URL
- [ ] CORS configured for frontend domain

---

## 📞 Support

- **Cloudflare Docs**: https://developers.cloudflare.com/workers
- **Wrangler Docs**: https://developers.cloudflare.com/workers/wrangler
- **Issues**: Check project README and logs

---

**Deployment Status:** Ready for production ✅
