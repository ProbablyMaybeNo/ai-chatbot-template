# Deployment Guide

## Quick Deploy (Recommended)

### Frontend: Vercel (Free)

```bash
cd frontend
npm install -g vercel
vercel
```

Follow prompts → Get URL like: `https://yourproject.vercel.app`

### Backend: Railway (Free tier available)

```bash
cd backend
npm install -g railway
railway login
railway init
railway up
```

Get URL like: `https://yourproject.railway.app`

**Update Frontend**: Edit `frontend/src/config.js`:
```javascript
apiEndpoint: "https://yourproject.railway.app/api"
```

Redeploy frontend: `vercel --prod`

---

## Alternative Options

### Frontend Options
- **Netlify**: `npm install -g netlify-cli` → `netlify deploy`
- **GitHub Pages**: Free static hosting
- **Client's domain**: Export build and upload

### Backend Options
- **Heroku**: `git push heroku main`
- **DigitalOcean**: $5/month droplet
- **AWS/Google Cloud**: More complex but scalable

---

## Environment Variables

### Backend (Railway/Heroku)

Set these in dashboard:
```
ANTHROPIC_API_KEY=sk-ant-...
PORT=5000
NODE_ENV=production
COMPANY_NAME=Client Company
```

### Frontend (Vercel)

```
REACT_APP_API_URL=https://yourproject.railway.app/api
```

---

## Custom Domain

### Frontend (Vercel)
1. Go to project settings
2. Add domain: `chat.clientsite.com`
3. Add DNS records (provided by Vercel)

### Backend (Railway)
1. Settings → Networking
2. Add custom domain
3. Update DNS

---

## Production Checklist

- [ ] Update `ANTHROPIC_API_KEY` with production key
- [ ] Set `NODE_ENV=production`
- [ ] Configure CORS for client domain
- [ ] Test on mobile devices
- [ ] Set up monitoring
- [ ] Enable HTTPS (automatic on Vercel/Railway)
- [ ] Add rate limiting if needed
- [ ] Backup chat history strategy

---

## Embed on Client Website

After deployment, give client this code:

```html
<!-- Add to client's website -->
<script src="https://yourproject.vercel.app/widget.js"></script>
```

Or as React component:
```jsx
import ChatWidget from './ChatWidget';

function App() {
  return (
    <div>
      {/* Client's content */}
      <ChatWidget />
    </div>
  );
}
```

---

## Monitoring

Free options:
- **Vercel Analytics**: Built-in
- **Railway Logs**: View in dashboard
- **Better Stack**: Free tier for logging

---

**Deployment complete!** Your chatbot is live and ready for clients! 🎉
