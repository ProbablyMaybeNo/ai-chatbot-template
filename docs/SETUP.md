# Setup Guide - AI Chatbot Template

## Quick Start (5 Minutes)

### Prerequisites

- Node.js 18+ installed
- Claude API key ([Get one here](https://console.anthropic.com/))
- Text editor (VS Code recommended)

---

## Step 1: Install Dependencies

### Backend Setup

```bash
cd backend
npm install
```

This installs:
- Express (API server)
- @anthropic-ai/sdk (Claude AI)
- cors, body-parser, dotenv
- nodemailer (email notifications)

### Frontend Setup

```bash
cd frontend
npm install
```

This installs:
- React 18
- axios (API client)
- react-scripts (build tools)

---

## Step 2: Configure Environment

### Backend Configuration

```bash
cd backend
cp .env.example .env
```

Edit `.env` with your settings:

```env
# REQUIRED - Get from https://console.anthropic.com/
ANTHROPIC_API_KEY=sk-ant-api03-your-key-here

# Server port (default: 5000)
PORT=5000

# Company info
COMPANY_NAME=Your Company Name

# Email notifications (optional)
SEND_EMAIL_NOTIFICATIONS=false
NOTIFICATION_EMAIL=your@email.com
```

**Important:** Never commit `.env` to version control!

### Frontend Configuration

Edit `frontend/src/config.js`:

```javascript
export const config = {
  companyName: "Acme Corp",          // Client's company name
  primaryColor: "#4F46E5",           // Brand color
  welcomeMessage: "Hi! How can I help?",

  // Add client's FAQs
  faqs: [
    {
      question: "What are your hours?",
      answer: "Monday-Friday, 9 AM - 5 PM EST."
    }
  ],

  apiEndpoint: "http://localhost:5000/api" // Backend URL
};
```

---

## Step 3: Run Locally

### Terminal 1 - Start Backend

```bash
cd backend
npm start
```

You should see:
```
============================================================
AI CHATBOT API SERVER
============================================================
Server running on: http://localhost:5000
Health check: http://localhost:5000/api/health
Claude API: ✓ Configured
============================================================
```

### Terminal 2 - Start Frontend

```bash
cd frontend
npm start
```

Browser opens automatically at `http://localhost:3000`

---

## Step 4: Test the Chatbot

1. Click the chat button (bottom-right corner)
2. Type a test message
3. You should get an AI response within 2-3 seconds

**Testing FAQs:**
- Type questions matching your FAQs
- Should get instant responses (no API call)

**Testing AI:**
- Ask questions not in FAQs
- Claude AI generates custom responses

---

## Troubleshooting

### Backend won't start

**Error:** `Claude API: ✗ Missing`
- **Fix:** Add your `ANTHROPIC_API_KEY` to `.env`

**Error:** `Port 5000 already in use`
- **Fix:** Change `PORT=5001` in `.env`
- Update `apiEndpoint` in frontend `config.js`

### Frontend can't connect to backend

**Error:** Network error / CORS error
- **Fix:** Ensure backend is running on correct port
- Check `apiEndpoint` in `config.js` matches backend URL
- Verify CORS is enabled in `backend/server.js`

### Chat not responding

**Problem:** Message sent but no reply
- Check browser console for errors (F12)
- Check backend terminal for error messages
- Verify Claude API key is valid
- Check you have API credits

---

## Next Steps

- **Customize**: See [CUSTOMIZATION.md](./CUSTOMIZATION.md)
- **Deploy**: See [DEPLOYMENT.md](./DEPLOYMENT.md)
- **Sell**: Ready to deliver to clients!

---

## Development Tips

### Hot Reload

Both frontend and backend support hot reload:
- **Frontend:** Changes auto-refresh browser
- **Backend:** Use `npm run dev` (requires nodemon)

### Debug Mode

Enable verbose logging:

```bash
# Backend
NODE_ENV=development npm start

# Frontend
REACT_APP_DEBUG=true npm start
```

### Test API Directly

```bash
# Health check
curl http://localhost:5000/api/health

# Send test message
curl -X POST http://localhost:5000/api/chat \
  -H "Content-Type: application/json" \
  -d '{
    "message": "Hello!",
    "sessionId": "test_123",
    "context": {"companyName": "Test Co"}
  }'
```

---

## Project Structure

```
ai-chatbot-basic/
├── frontend/                 # React widget
│   ├── src/
│   │   ├── components/      # ChatWidget, ChatWindow, MessageList
│   │   ├── config.js        # Customization settings
│   │   ├── App.js           # Main app
│   │   └── index.js         # Entry point
│   ├── public/
│   └── package.json
│
├── backend/                  # Node.js API
│   ├── services/
│   │   ├── claudeService.js # Claude AI integration
│   │   ├── chatHistory.js   # Message storage
│   │   └── emailService.js  # Notifications
│   ├── server.js            # Express API server
│   ├── .env                 # Environment config (create this!)
│   └── package.json
│
├── docs/                     # Documentation
│   ├── SETUP.md             # This file
│   ├── CUSTOMIZATION.md     # Styling & features
│   └── DEPLOYMENT.md        # Production deploy
│
└── README.md                 # Overview
```

---

## Common Customizations

### Change Colors

Edit `frontend/src/config.js`:
```javascript
primaryColor: "#FF6B6B",  // Buttons, header
secondaryColor: "#4ECDC4", // Accents
```

### Add More FAQs

Edit `frontend/src/config.js`:
```javascript
faqs: [
  {
    question: "Do you offer refunds?",
    answer: "Yes! 30-day money-back guarantee."
  }
]
```

### Change Position

Edit `frontend/src/config.js`:
```javascript
position: "bottom-left"  // Options: bottom-right, bottom-left, top-right, top-left
```

---

## Support

Need help?
- Check [CUSTOMIZATION.md](./CUSTOMIZATION.md) for styling options
- Check [DEPLOYMENT.md](./DEPLOYMENT.md) for deployment guides
- Review code comments for implementation details

---

**You're all set!** The chatbot is now running locally. Ready to customize for your first client! 🚀
