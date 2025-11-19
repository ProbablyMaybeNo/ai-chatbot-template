# Vercel Deployment Guide - AI Chatbot

**Complete guide to deploying your AI chatbot to production**

---

## 📋 Prerequisites

- [ ] Vercel account (free tier works great) - https://vercel.com/signup
- [ ] GitHub account (optional, for automatic deployments)
- [ ] Backend deployed somewhere (Railway, Render, or Vercel)
- [ ] Claude API key from Anthropic

---

## 🚀 Quick Deployment (5 Minutes)

### Step 1: Build Frontend for Production

```powershell
cd D:\AI-Workstation\Claude\projects\templates\ai-chatbot-basic\frontend
npm run build
```

**Expected output**:
```
Creating an optimized production build...
Compiled successfully!

File sizes after gzip:
  XX.XX kB  build/static/js/main.xxxxx.js
  ...
```

### Step 2: Deploy to Vercel

```powershell
# Login to Vercel (first time only)
npx vercel login

# Deploy (will prompt for configuration)
npx vercel
```

**Prompts you'll see**:
1. "Set up and deploy?" → **Y**
2. "Which scope?" → Select your account
3. "Link to existing project?" → **N** (first time)
4. "What's your project's name?" → **ai-chatbot-widget** (or custom name)
5. "In which directory is your code located?" → **./** (press Enter)
6. "Want to override the settings?" → **N**

**This will give you a preview URL** like: `https://ai-chatbot-widget-xxxxx.vercel.app`

### Step 3: Set Environment Variables

```powershell
# Set your backend API URL
npx vercel env add REACT_APP_API_URL

# When prompted:
# - Value: [Your backend URL, e.g., https://your-backend.railway.app/api]
# - Environments: Production, Preview, Development (select all)
```

### Step 4: Deploy to Production

```powershell
npx vercel --prod
```

**Your chatbot is now live!** 🎉

---

## 🔧 Deployment Options

### Option A: Frontend (Vercel) + Backend (Railway) ⭐ RECOMMENDED

**Advantages**:
- Simpler setup
- Separate scaling
- Backend can use traditional Node.js
- Easier to debug

**Backend Setup (Railway)**:

1. Visit: https://railway.app/
2. Sign up with GitHub
3. Click "New Project" → "Deploy from GitHub repo"
4. Select your backend folder (or upload manually)
5. Add environment variables:
   - `ANTHROPIC_API_KEY`: Your Claude API key
   - `NODE_ENV`: production
   - `PORT`: (Railway sets this automatically)
   - `COMPANY_NAME`: Your company name
   - `SEND_EMAIL_NOTIFICATIONS`: false (or configure email)

6. Railway will give you a URL like: `https://your-app.up.railway.app`

7. **Set this URL in Vercel**:
   ```powershell
   npx vercel env add REACT_APP_API_URL
   # Value: https://your-app.up.railway.app/api
   ```

8. Redeploy frontend:
   ```powershell
   npx vercel --prod
   ```

---

### Option B: Both on Vercel (Serverless Functions)

**Advantages**:
- All-in-one platform
- Free tier generous
- Automatic scaling

**Disadvantages**:
- Need to convert Express to serverless functions
- More complex setup

**Setup**:

1. Create `api/` folder in frontend directory
2. Convert Express routes to Vercel serverless functions
3. Deploy together

*Note: This requires code refactoring. Let me know if you want me to set this up.*

---

## 🌐 Custom Domain Setup (Optional)

### Add Custom Domain to Vercel

1. Go to your project on Vercel dashboard
2. Click "Settings" → "Domains"
3. Add your domain (e.g., `chatbot.yourdomain.com`)
4. Follow DNS setup instructions

**DNS Records** (Add these to your domain registrar):

For subdomain (chatbot.yourdomain.com):
```
Type: CNAME
Name: chatbot
Value: cname.vercel-dns.com
```

For root domain (yourdomain.com):
```
Type: A
Name: @
Value: 76.76.21.21
```

---

## 🔐 Environment Variables Setup

### Required Environment Variables on Vercel:

```bash
REACT_APP_API_URL=https://your-backend-url.com/api
```

### Set via CLI:

```powershell
# Production environment
npx vercel env add REACT_APP_API_URL production

# Preview environment (for testing)
npx vercel env add REACT_APP_API_URL preview

# Development environment
npx vercel env add REACT_APP_API_URL development
```

### Set via Vercel Dashboard:

1. Go to: https://vercel.com/dashboard
2. Select your project
3. Click "Settings" → "Environment Variables"
4. Add: `REACT_APP_API_URL` = `https://your-backend.com/api`
5. Select environments: Production, Preview, Development

---

## 🧪 Testing Your Deployment

### Test 1: Health Check

Visit: `https://your-frontend-url.vercel.app`

**Expected**: Chat widget appears in bottom-right corner

### Test 2: Open Chat Widget

Click the chat icon

**Expected**: Chat window opens with welcome message

### Test 3: Test FAQ (No Backend Needed)

Type: "What are your business hours?"

**Expected**: Instant response from local FAQs

### Test 4: Test AI Response (Backend Required)

Type: "Tell me about artificial intelligence"

**Expected**: Response from Claude AI within 2-3 seconds

### Test 5: Check Console

Open browser DevTools (F12) → Console

**Expected**: No errors
**If errors**: Check backend URL and CORS settings

---

## 🔧 Troubleshooting

### Problem: "Failed to fetch" error

**Cause**: Backend URL not configured or incorrect

**Solution**:
1. Check environment variable: `npx vercel env ls`
2. Verify backend is running: Visit `https://your-backend.com/api/health`
3. Redeploy: `npx vercel --prod`

### Problem: CORS errors

**Cause**: Backend not allowing requests from Vercel domain

**Solution**: Update backend CORS configuration

In `backend/server.js`, update CORS:
```javascript
const cors = require('cors');

app.use(cors({
  origin: [
    'http://localhost:3000',
    'http://localhost:3001',
    'https://your-frontend.vercel.app',
    'https://*.vercel.app' // Allow all Vercel preview deployments
  ],
  credentials: true
}));
```

Then redeploy backend.

### Problem: Environment variables not updating

**Solution**:
```powershell
# Remove old variable
npx vercel env rm REACT_APP_API_URL production

# Add new variable
npx vercel env add REACT_APP_API_URL production

# Redeploy
npx vercel --prod
```

### Problem: Build fails on Vercel

**Common causes**:
1. Missing dependencies in `package.json`
2. Build errors in code
3. Wrong Node version

**Solution**:
```powershell
# Test build locally first
npm run build

# If successful, deploy again
npx vercel --prod
```

### Problem: Chat widget not appearing

**Cause**: Build issue or JavaScript error

**Solution**:
1. Check browser console for errors
2. Verify build completed successfully
3. Clear browser cache (Ctrl+Shift+Delete)

---

## 📊 Monitoring & Analytics

### Vercel Analytics (Free)

1. Go to project dashboard
2. Click "Analytics"
3. View page loads, performance, etc.

### Backend Monitoring

If using Railway:
1. View logs in Railway dashboard
2. Set up alerts for errors
3. Monitor API usage

---

## 💰 Cost Breakdown

### Free Tier Limits:

**Vercel Free Tier**:
- ✅ 100 GB bandwidth/month
- ✅ Unlimited projects
- ✅ Automatic HTTPS
- ✅ Custom domains (1 per project)
- ✅ Preview deployments

**Railway Free Tier**:
- ✅ $5 credit/month
- ✅ ~500 hours runtime
- ✅ Enough for 1-2 small apps

### When You'll Need to Upgrade:

- **Vercel Pro ($20/month)**: If you exceed 100GB bandwidth
- **Railway ($5/month variable)**: Pay-as-you-go after free credits
- **Claude API**: $0.05-0.15 per conversation (pass cost to clients)

### Client Billing Strategy:

For each chatbot project ($500-800):
- **Include**: First month hosting (covered by free tiers)
- **Charge**: $25-50/month maintenance (covers hosting + API costs)
- **Your profit**: $15-35/month per client

---

## 🔄 Automatic Deployments (Git Integration)

### Connect GitHub to Vercel:

1. Push code to GitHub repository
2. Go to Vercel dashboard → "Import Project"
3. Select your GitHub repo
4. Vercel auto-deploys on every push to main branch

**Benefits**:
- Automatic deployments
- Preview URLs for pull requests
- Rollback capability
- Team collaboration

---

## 🚀 Performance Optimization

### Frontend Optimizations:

```javascript
// In frontend/package.json, ensure:
"scripts": {
  "build": "GENERATE_SOURCEMAP=false react-scripts build"
}
```

**Why**: Reduces build size, faster loading

### Backend Optimizations:

1. Enable compression:
   ```javascript
   const compression = require('compression');
   app.use(compression());
   ```

2. Add rate limiting:
   ```javascript
   const rateLimit = require('express-rate-limit');
   const limiter = rateLimit({
     windowMs: 15 * 60 * 1000, // 15 minutes
     max: 100 // limit each IP to 100 requests per windowMs
   });
   app.use('/api/', limiter);
   ```

---

## 📱 Embed in Client Websites

### Option 1: IFrame (Simplest)

```html
<!-- Client adds this to their website -->
<iframe
  src="https://your-chatbot.vercel.app"
  width="100%"
  height="600px"
  frameborder="0"
  style="position: fixed; bottom: 0; right: 0; width: 400px; height: 600px; z-index: 9999;"
></iframe>
```

### Option 2: Script Tag (Recommended)

**Step 1**: Build as standalone widget
**Step 2**: Host on Vercel
**Step 3**: Client adds:

```html
<script src="https://your-chatbot.vercel.app/widget.js"></script>
<script>
  AIChatbot.init({
    apiUrl: 'https://your-backend.com/api',
    companyName: 'Client Company Name'
  });
</script>
```

---

## 📋 Deployment Checklist

### Pre-Deployment:
- [ ] Frontend builds successfully locally (`npm run build`)
- [ ] Backend running and accessible
- [ ] Claude API key configured and working
- [ ] CORS configured to allow Vercel domain
- [ ] Environment variables documented

### Deployment:
- [ ] Frontend deployed to Vercel
- [ ] Backend deployed (Railway/Render/Vercel)
- [ ] Environment variables set on Vercel
- [ ] Custom domain configured (if applicable)

### Post-Deployment:
- [ ] Health check endpoint returns 200 OK
- [ ] Chat widget appears on page
- [ ] FAQ responses work instantly
- [ ] AI responses work (Claude API)
- [ ] No console errors
- [ ] Mobile responsive
- [ ] HTTPS enabled (automatic on Vercel)

---

## 🎉 Success!

**Your chatbot is now live and ready for clients!**

### Next Steps:

1. **Create Demo Variations**: Customize for 3 different industries
2. **Add to Portfolio**: Show live demo to potential clients
3. **Start Marketing**: List on Fiverr/Upwork with live demo link
4. **Monitor Usage**: Track conversations and API costs
5. **Iterate**: Improve based on user feedback

---

## 🆘 Quick Reference Commands

### Development:
```powershell
# Frontend
cd frontend
npm start

# Backend
cd backend
npm start
```

### Deployment:
```powershell
# Deploy to preview
npx vercel

# Deploy to production
npx vercel --prod

# Check environment variables
npx vercel env ls

# View logs
npx vercel logs
```

### Maintenance:
```powershell
# Rollback to previous deployment
npx vercel rollback

# List all deployments
npx vercel ls

# Remove deployment
npx vercel rm [deployment-url]
```

---

## 📞 Support Resources

- **Vercel Docs**: https://vercel.com/docs
- **Railway Docs**: https://docs.railway.app
- **Claude API Docs**: https://docs.anthropic.com
- **Your Template**: See `README.md` and `CHATBOT_SETUP_GUIDE.md`

---

**Estimated deployment time**: 10-15 minutes for first deployment
**Subsequent deployments**: 2-3 minutes

**Ready to make your chatbot live? Follow the Quick Deployment section above!** 🚀
