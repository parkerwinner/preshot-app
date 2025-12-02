# Preshot MCP Server - Environment Setup Guide

## 📋 Required Environment Variables

### 1. Local Development (.dev.vars file)

Create a `.dev.vars` file in `/agent/preshot-mcp-server/` with:

```bash
# Anthropic API Key (REQUIRED)
PRESHOT_ANTHROPIC_API_KEY=sk-ant-api03-xxxxx

# Pinata JWT for IPFS (REQUIRED)
PRESHOT_PINATA_JWT=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.xxxxx
```

**How to get these:**

**Anthropic API Key:**
1. Go to: https://console.anthropic.com/
2. Sign up / Log in
3. Navigate to "API Keys"
4. Click "Create Key"
5. Copy the key (starts with `sk-ant-`)

**Pinata JWT:**
1. Go to: https://pinata.cloud/
2. Sign up / Log in (free tier works)
3. Go to "API Keys" in the dashboard
4. Click "New Key"
5. Give it Admin permissions
6. Copy the JWT token

### 2. Cloudflare KV Setup

**Create a new KV namespace** (separate from your existing mcp-server):

```bash
cd /home/george/Documents/team/preshot-app/agent/preshot-mcp-server

# Create the KV namespace
npx wrangler kv namespace create PRESHOT_KV

# You'll get output like:
# Created namespace with id: xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
```

**Update wrangler.toml** with the namespace ID you just created:

```toml
[[kv_namespaces]]
binding = "PRESHOT_KV"
id = "paste_your_namespace_id_here"
```

**Store the AI wallet private key in KV:**

```bash
# Replace with your actual private key (for Base Sepolia)
npx wrangler kv key put --binding=PRESHOT_KV "PRESHOT_AI_WALLET_KEY" "0xYourPrivateKeyHere"
```

### 3. File Structure

```
agent/preshot-mcp-server/
├── .dev.vars                 # ← Create this file (gitignored)
├── .dev.vars.example         # ← Template provided
├── wrangler.toml             # ← Update KV namespace ID
└── src/
    ├── server.ts             # ← Uses PRESHOT_ env vars
    └── env.d.ts              # ← TypeScript interface
```

## 🚀 Quick Start

### Step 1: Create .dev.vars

```bash
cd /home/george/Documents/team/preshot-app/agent/preshot-mcp-server
cp .dev.vars.example .dev.vars
nano .dev.vars  # Edit and add your API keys
```

### Step 2: Create KV Namespace

```bash
npx wrangler kv:namespace create PRESHOT_KV
# Copy the ID from output
```

### Step 3: Update wrangler.toml

Edit `wrangler.toml` and replace `CREATE_NEW_KV_NAMESPACE` with your actual namespace ID.

### Step 4: Store AI Wallet Key

```bash
npx wrangler kv key put --binding=PRESHOT_KV "PRESHOT_AI_WALLET_KEY" "0xYourPrivateKey"
```

### Step 5: Install Dependencies

```bash
pnpm install
```

### Step 6: Start MCP Inspector

```bash
pnpm dev
```

This will start:
- **Wrangler dev server** on `http://localhost:8787`
- **MCP Inspector** UI for testing

## 🔑 Environment Variables Reference

| Variable | Required | Where | Purpose |
|----------|----------|-------|---------|
| `PRESHOT_ANTHROPIC_API_KEY` | ✅ Yes | .dev.vars | Claude AI for assessments/coaching |
| `PRESHOT_PINATA_JWT` | ✅ Yes | .dev.vars | IPFS file uploads |
| `PRESHOT_AI_WALLET_KEY` | ✅ Yes | Cloudflare KV | AI wallet private key for blockchain |
| `PRESHOT_KV` | ✅ Yes | wrangler.toml | KV namespace binding |
| `PRESHOT_AI_API_KEY` | ⬜ No | .dev.vars | Alternative AI provider |
| `PRESHOT_PINATA_API_KEY` | ⬜ No | .dev.vars | Alternative to JWT |
| `PRESHOT_PINATA_SECRET` | ⬜ No | .dev.vars | Alternative to JWT |

## ⚠️ Important Notes

1. **Never commit `.dev.vars`** - It's in `.gitignore`
2. **KV namespace is separate** from your existing `mcp-server` KV
3. **All variables use `PRESHOT_` prefix** to avoid conflicts
4. **AI wallet must be funded** on Base Sepolia for blockchain submissions
5. **Contract address** must be updated in `server.ts` after deployment (line ~808)

## 🧪 Testing

After starting the server, test endpoints:

```bash
# Health check
curl http://localhost:8787/api/health

# Test assessment (requires API keys)
curl -X POST http://localhost:8787/api/preshot/assess \
  -H "Content-Type: application/json" \
  -d '{
    "background": "Software engineer from Kenya",
    "goals": "Apply to YALI fellowship"
  }'
```

## 🌐 Production Deployment

For production (after testing locally):

```bash
# Set production secrets
npx wrangler secret put PRESHOT_ANTHROPIC_API_KEY
npx wrangler secret put PRESHOT_PINATA_JWT

# Deploy
pnpm deploy
```

## 🆘 Troubleshooting

**"KV not configured"**
- Run: `npx wrangler kv:namespace create PRESHOT_KV`
- Update `wrangler.toml` with the namespace ID

**"AI wallet key not found"**
- Run: `npx wrangler kv:key put --binding=PRESHOT_KV "PRESHOT_AI_WALLET_KEY" "0xYourKey"`

**"API key not configured"**
- Check `.dev.vars` exists and has `PRESHOT_ANTHROPIC_API_KEY`

**"Pinata upload failed"**
- Verify `PRESHOT_PINATA_JWT` is correct
- Check Pinata dashboard for API quota

## 📞 Need Help?

Check the main README.md for API documentation and examples.
