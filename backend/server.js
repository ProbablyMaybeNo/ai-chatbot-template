/**
 * AI Chatbot Backend Server
 * Powered by Claude API
 */

require('dotenv').config();
const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const claudeService = require('./services/claudeService');
const chatHistory = require('./services/chatHistory');
const emailService = require('./services/emailService');

const app = express();
const PORT = process.env.PORT || 5000;

// CORS Configuration - Production Ready
const allowedOrigins = [
  'http://localhost:3000',
  'http://localhost:3001',
  'https://ai-chatbot-widget-orcin.vercel.app',
  process.env.FRONTEND_URL
].filter(Boolean); // Remove undefined values

app.use((req, res, next) => {
  const origin = req.headers.origin;

  // Allow all origins in development, specific origins in production
  if (process.env.NODE_ENV === 'development' || allowedOrigins.includes(origin)) {
    res.header('Access-Control-Allow-Origin', origin || '*');
  } else {
    // Fallback for production without specific origin
    res.header('Access-Control-Allow-Origin', '*');
  }

  res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization, X-Requested-With, Accept');
  res.header('Access-Control-Allow-Credentials', 'true');
  res.header('Access-Control-Max-Age', '86400'); // 24 hours

  // Handle preflight requests
  if (req.method === 'OPTIONS') {
    console.log(`[CORS] Preflight request from: ${origin}`);
    return res.status(200).end();
  }

  console.log(`[CORS] ${req.method} request from: ${origin || 'unknown'}`);
  next();
});

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Request logging
app.use((req, res, next) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.path}`);
  next();
});

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({
    status: 'ok',
    timestamp: new Date().toISOString(),
    service: 'AI Chatbot API',
    version: '1.0.0'
  });
});

// Main chat endpoint
app.post('/api/chat', async (req, res) => {
  try {
    const { message, sessionId, context } = req.body;

    if (!message || !message.trim()) {
      return res.status(400).json({ error: 'Message is required' });
    }

    if (!sessionId) {
      return res.status(400).json({ error: 'Session ID is required' });
    }

    console.log(`[Chat] Session: ${sessionId} | Message: "${message.substring(0, 50)}..."`);

    // Get chat history for context
    const history = chatHistory.getHistory(sessionId);

    // Generate AI response using Claude
    const reply = await claudeService.generateResponse(message, {
      history,
      context: context || {}
    });

    // Save to history
    chatHistory.addMessage(sessionId, 'user', message);
    chatHistory.addMessage(sessionId, 'assistant', reply);

    // Send email notification if configured
    if (process.env.SEND_EMAIL_NOTIFICATIONS === 'true') {
      await emailService.sendChatNotification({
        sessionId,
        userMessage: message,
        botReply: reply,
        companyName: context?.companyName || 'Your Company'
      });
    }

    res.json({
      reply,
      sessionId,
      timestamp: new Date().toISOString()
    });

  } catch (error) {
    console.error('[Chat Error]', error);
    res.status(500).json({
      error: 'Failed to generate response',
      message: error.message
    });
  }
});

// Get chat history endpoint
app.get('/api/history/:sessionId', (req, res) => {
  try {
    const { sessionId } = req.params;
    const history = chatHistory.getHistory(sessionId);

    res.json({
      sessionId,
      messages: history,
      count: history.length
    });
  } catch (error) {
    console.error('[History Error]', error);
    res.status(500).json({
      error: 'Failed to retrieve history',
      message: error.message
    });
  }
});

// Clear chat history endpoint
app.delete('/api/history/:sessionId', (req, res) => {
  try {
    const { sessionId } = req.params;
    chatHistory.clearHistory(sessionId);

    res.json({
      success: true,
      message: 'Chat history cleared'
    });
  } catch (error) {
    console.error('[Clear History Error]', error);
    res.status(500).json({
      error: 'Failed to clear history',
      message: error.message
    });
  }
});

// Send chat transcript via email
app.post('/api/email-transcript', async (req, res) => {
  try {
    const { sessionId, email } = req.body;

    if (!sessionId || !email) {
      return res.status(400).json({ error: 'Session ID and email are required' });
    }

    const history = chatHistory.getHistory(sessionId);

    await emailService.sendTranscript(email, history, sessionId);

    res.json({
      success: true,
      message: 'Transcript sent successfully'
    });

  } catch (error) {
    console.error('[Email Transcript Error]', error);
    res.status(500).json({
      error: 'Failed to send transcript',
      message: error.message
    });
  }
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({
    error: 'Endpoint not found',
    path: req.path,
    method: req.method
  });
});

// Error handler
app.use((error, req, res, next) => {
  console.error('[Server Error]', error);
  res.status(500).json({
    error: 'Internal server error',
    message: error.message
  });
});

// Start server
app.listen(PORT, () => {
  console.log('\n' + '='.repeat(60));
  console.log('AI CHATBOT API SERVER');
  console.log('='.repeat(60));
  console.log(`Server running on: http://localhost:${PORT}`);
  console.log(`Health check: http://localhost:${PORT}/api/health`);
  console.log(`Environment: ${process.env.NODE_ENV || 'development'}`);
  console.log(`Claude API: ${process.env.ANTHROPIC_API_KEY ? '✓ Configured' : '✗ Missing'}`);
  console.log('='.repeat(60) + '\n');
});

// Graceful shutdown
process.on('SIGTERM', () => {
  console.log('\n[Server] Shutting down gracefully...');
  process.exit(0);
});

process.on('SIGINT', () => {
  console.log('\n[Server] Shutting down gracefully...');
  process.exit(0);
});

module.exports = app;
