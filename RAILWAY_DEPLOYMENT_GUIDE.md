# Railway Deployment Guide - AI Chatbot Backend

**Deploy your Node.js backend to Railway in 5 minutes**

---

## 🚀 Quick Deployment Steps

### Step 1: Create Railway Account

1. Visit: **https://railway.app/**
2. Click **"Start a New Project"**
3. Sign up with **GitHub** (recommended) or email
4. Verify your email if needed

### Step 2: Create New Project

**Option A: Deploy from GitHub (Recommended)**
1. Push your backend code to GitHub first
2. In Railway, click **"New Project"**
3. Select **"Deploy from GitHub repo"**
4. Authorize Railway to access your GitHub
5. Select your repository
6. Select the **backend** directory

**Option B: Deploy from Local (Quick Start)** ⭐
1. In Railway, click **"New Project"**
2. Select **"Deploy from Local"**
3. Railway CLI will guide you through the upload

### Step 3: Configure Environment Variables

Once your project is created:

1. Click on your service
2. Go to **"Variables"** tab
3. Add these environment variables:

```env
ANTHROPIC_API_KEY=sk-ant-api03-YOUR_ACTUAL_KEY_HERE
NODE_ENV=production
COMPANY_NAME=Your Company Name
SEND_EMAIL_NOTIFICATIONS=false
```

**IMPORTANT**: Replace `sk-ant-api03-YOUR_ACTUAL_KEY_HERE` with your real Claude API key!

### Step 4: Deploy

1. Railway will automatically deploy
2. Wait 2-3 minutes for deployment to complete
3. Look for **"Deployment successful"** message

### Step 5: Get Your Backend URL

1. Click on your service
2. Go to **"Settings"** tab
3. Scroll to **"Domains"**
4. Click **"Generate Domain"**
5. Railway will give you a URL like: `https://your-app.up.railway.app`

**Copy this URL** - you'll need it for Vercel!

---

## 🔧 Alternative: Deploy via Railway CLI

### Install Railway CLI:

```powershell
npm install -g @railway/cli
```

### Login to Railway:

```powershell
railway login
```

### Navigate to Backend Directory:

```powershell
cd D:\AI-Workstation\Claude\projects\templates\ai-chatbot-basic\backend
```

### Initialize Railway Project:

```powershell
railway init
```

**Prompts**:
- "Enter project name": **ai-chatbot-backend**
- "Create new project?": **Yes**

### Link to Railway:

```powershell
railway link
```

### Add Environment Variables:

```powershell
railway variables set ANTHROPIC_API_KEY=sk-ant-api03-YOUR_KEY_HERE
railway variables set NODE_ENV=production
railway variables set COMPANY_NAME="Your Company Name"
railway variables set SEND_EMAIL_NOTIFICATIONS=false
```

### Deploy:

```powershell
railway up
```

### Get Your URL:

```powershell
railway domain
```

This will generate and show your Railway domain.

---

## 🌐 Connect Frontend to Backend

Now that your backend is deployed, connect your Vercel frontend to it:

### Method 1: Via Vercel CLI

```powershell
cd D:\AI-Workstation\Claude\projects\templates\ai-chatbot-basic\frontend

# Add environment variable
npx vercel env add REACT_APP_API_URL production

# When prompted, enter:
# Value: https://your-app.up.railway.app/api
```

Then redeploy:

```powershell
npx vercel --prod
```

### Method 2: Via Vercel Dashboard

1. Go to **https://vercel.com/dashboard**
2. Select your **ai-chatbot-widget** project
3. Click **"Settings"** → **"Environment Variables"**
4. Add new variable:
   - **Name**: `REACT_APP_API_URL`
   - **Value**: `https://your-app.up.railway.app/api`
   - **Environments**: Select all (Production, Preview, Development)
5. Click **"Save"**
6. Go to **"Deployments"** tab
7. Click **"⋯"** on latest deployment → **"Redeploy"**

---

## ✅ Testing Your Deployment

### Test 1: Backend Health Check

Visit in your browser:
```
https://your-app.up.railway.app/api/health
```

**Expected Response**:
```json
{
  "status": "ok",
  "timestamp": "2025-11-19T...",
  "service": "AI Chatbot API",
  "version": "1.0.0"
}
```

### Test 2: Frontend Loads

Visit your Vercel URL:
```
https://ai-chatbot-widget-orcin.vercel.app
```

**Expected**: Chat widget appears in bottom-right

### Test 3: Chat Works

1. Click chat icon
2. Type a question: "What are your hours?"
3. Should get instant FAQ response

4. Type AI question: "Tell me about AI"
5. Should get Claude API response in 2-3 seconds

---

## 🔧 CORS Configuration (Important!)

Your backend needs to allow requests from your Vercel domain.

### Update `backend/server.js`:

Find the CORS configuration and update it:

```javascript
const cors = require('cors');

app.use(cors({
  origin: [
    'http://localhost:3000',
    'http://localhost:3001',
    'https://ai-chatbot-widget-orcin.vercel.app',
    'https://ai-chatbot-widget-2aol9gct1-beacon-hobbies-projects.vercel.app',
    /\.vercel\.app$/  // Allow all Vercel preview deployments
  ],
  credentials: true
}));
```

**Then redeploy to Railway**:
```powershell
railway up
```

Or if using GitHub integration, just push to GitHub:
```powershell
git add .
git commit -m "Update CORS for Vercel"
git push
```

Railway will auto-deploy!

---

## 💰 Railway Pricing

### Free Tier:
- ✅ **$5 free credits per month**
- ✅ ~500 execution hours
- ✅ Perfect for 1-2 small apps
- ✅ Automatic HTTPS
- ✅ Custom domains

### Paid Plans:
- **Developer**: $5/month (pay as you go)
- **Team**: $20/month (shared resources)

### Cost Estimates:
- **Small chatbot backend**: ~$2-5/month
- **With moderate traffic**: ~$5-10/month
- **Pass cost to clients**: Charge $25-50/month maintenance

---

## 📊 Monitoring Your Backend

### View Logs:

**Via Railway Dashboard**:
1. Go to your project
2. Click on your service
3. Click **"Logs"** tab
4. View real-time logs

**Via CLI**:
```powershell
railway logs
```

### Monitor Usage:

1. Go to **"Metrics"** tab in Railway dashboard
2. View:
   - CPU usage
   - Memory usage
   - Network traffic
   - Request count

### Set Up Alerts:

1. Go to **"Settings"** tab
2. Scroll to **"Notifications"**
3. Enable deployment notifications
4. Add webhook for Slack/Discord (optional)

---

## 🔄 Continuous Deployment

### GitHub Integration:

If you deployed from GitHub:
1. Every push to `main` branch auto-deploys
2. Pull requests get preview environments
3. Automatic rollback on failures

### Manual Deployments:

If using Railway CLI:
```powershell
cd backend
railway up
```

---

## 🐛 Troubleshooting

### Problem: "Application failed to respond"

**Cause**: Server not listening on PORT variable

**Solution**: Ensure `server.js` uses:
```javascript
const PORT = process.env.PORT || 5000;
```

Railway automatically sets the PORT variable.

### Problem: "Module not found" errors

**Cause**: Dependencies not installed

**Solution**: Ensure `package.json` has all dependencies:
```powershell
cd backend
npm install --save express cors dotenv axios @anthropic-ai/sdk
```

Commit and push:
```powershell
git add package.json package-lock.json
git commit -m "Update dependencies"
git push
```

### Problem: CORS errors in frontend

**Cause**: Backend not allowing Vercel domain

**Solution**: Update CORS configuration (see above) and redeploy

### Problem: "Invalid API key" from Claude

**Cause**: Environment variable not set correctly

**Solution**:
1. Check Railway **"Variables"** tab
2. Ensure `ANTHROPIC_API_KEY` is set correctly
3. No quotes around the value
4. Redeploy after fixing

### Problem: High costs

**Cause**: Too many requests or memory usage

**Solution**:
1. Check Railway **"Metrics"** for usage
2. Add rate limiting to backend
3. Optimize API calls
4. Consider upgrading plan or optimizing code

---

## 🎯 Quick Reference Commands

### Railway CLI Commands:

```powershell
# Login
railway login

# Initialize project
railway init

# Link to existing project
railway link

# Set environment variables
railway variables set KEY=value

# View environment variables
railway variables

# Deploy
railway up

# View logs
railway logs

# Open in browser
railway open

# Get domain
railway domain
```

### Testing Commands:

```powershell
# Test backend health
curl https://your-app.up.railway.app/api/health

# Test chat endpoint
curl -X POST https://your-app.up.railway.app/api/chat \
  -H "Content-Type: application/json" \
  -d '{"message":"Hello","sessionId":"test123"}'
```

---

## ✅ Deployment Checklist

### Pre-Deployment:
- [ ] Railway account created
- [ ] Claude API key ready
- [ ] Backend code tested locally
- [ ] All environment variables documented

### Deployment:
- [ ] Project created on Railway
- [ ] Environment variables set
- [ ] Backend deployed successfully
- [ ] Domain generated
- [ ] CORS configured for Vercel

### Post-Deployment:
- [ ] Health check endpoint returns 200
- [ ] Frontend environment variable updated
- [ ] Frontend redeployed with new backend URL
- [ ] Chat widget works end-to-end
- [ ] Logs show no errors
- [ ] Monitoring set up

---

## 🎉 Success!

Your backend is now live on Railway!

**Next steps**:
1. Update Vercel frontend with Railway backend URL
2. Test the complete chatbot
3. Monitor logs and usage
4. Set up custom domain (optional)
5. Create industry-specific demos

---

## 📞 Support Resources

- **Railway Docs**: https://docs.railway.app
- **Railway Discord**: https://discord.gg/railway
- **Claude API Docs**: https://docs.anthropic.com
- **Your Backend Code**: See `server.js` and `check-config.js`

---

**Estimated deployment time**: 5-10 minutes
**Monthly cost**: $2-10 (mostly free tier)

**Your chatbot backend is now production-ready!** 🚀
