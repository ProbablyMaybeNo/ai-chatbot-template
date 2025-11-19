# Quick Test Guide - 5 Minutes

## Step 1: Get Your API Key

1. Go to: https://console.anthropic.com/settings/api-keys
2. Copy your existing key OR create a new one
3. Key starts with: `sk-ant-api03-...`

## Step 2: Add Credits (If Needed)

1. Go to: https://console.anthropic.com/settings/billing
2. Check "Available Balance"
3. If less than $10, click "Purchase Credits"
4. Add $50 (recommended)

## Step 3: Configure Template

**Edit**: `backend\.env` (create if doesn't exist)

```env
ANTHROPIC_API_KEY=sk-ant-api03-PASTE_YOUR_KEY_HERE
PORT=5000
NODE_ENV=development
COMPANY_NAME=Test Company
SEND_EMAIL_NOTIFICATIONS=false
```

## Step 4: Test

### Terminal 1 - Backend
```bash
cd D:\AI-Workstation\Claude\projects\templates\ai-chatbot-basic\backend
npm install
npm start
```

Wait for: `Claude API: ✓ Configured`

### Terminal 2 - Frontend
```bash
cd D:\AI-Workstation\Claude\projects\templates\ai-chatbot-basic\frontend
npm install
npm start
```

Browser opens at: http://localhost:3000

### Test Chat
1. Click chat button (bottom-right)
2. Type: "What are your business hours?"
   - Gets instant FAQ response ✓
3. Type: "Tell me about AI"
   - Gets Claude AI response in 2-3 seconds ✓

## ✅ Success!

You now have a working AI chatbot template worth $500-800!

---

## What's Using Your API Credits?

- **FAQ questions**: $0 (instant, no API call)
- **AI questions**: ~$0.01-0.03 per message
- **Typical conversation**: ~$0.05-0.15
- **Client's monthly usage**: ~$5-15

**Your $50 credits = ~300-500 conversations = plenty for testing + 3-5 client projects!**

---

## Next: Create Portfolio Demos

Once testing works, you can create 3 customized versions:
1. E-commerce chatbot
2. SaaS chatbot
3. Service business chatbot

Deploy all 3 to Vercel → Live portfolio URLs → Win clients! 🎉
