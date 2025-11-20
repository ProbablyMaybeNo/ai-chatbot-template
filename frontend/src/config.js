/**
 * Chatbot Configuration
 * Customize this file for each client
 */

export const config = {
  // Company Branding
  companyName: "Acme Corp",
  companyLogo: null, // URL to logo image or null

  // Visual Customization
  primaryColor: "#4F46E5", // Indigo-600
  secondaryColor: "#818CF8", // Indigo-400
  backgroundColor: "#FFFFFF",
  textColor: "#1F2937", // Gray-800

  // Widget Position
  position: "bottom-right", // Options: bottom-right, bottom-left, top-right, top-left

  // Welcome Message
  welcomeMessage: "Hi! I'm your AI assistant. How can I help you today?",
  placeholderText: "Type your message...",

  // Automated FAQs (Pre-programmed responses)
  faqs: [
    {
      question: "What are your business hours?",
      answer: "We're open Monday-Friday, 9 AM - 5 PM EST."
    },
    {
      question: "How can I contact support?",
      answer: "You can email us at support@acmecorp.com or use this chat for instant help!"
    },
    {
      question: "What services do you offer?",
      answer: "We offer a range of services including consulting, development, and support. Visit our Services page for more details."
    },
    {
      question: "Where are you located?",
      answer: "Our headquarters is in San Francisco, CA, but we serve clients worldwide."
    },
    {
      question: "Do you offer refunds?",
      answer: "Yes, we offer a 30-day money-back guarantee on all our services. Contact support for refund requests."
    }
  ],

  // Quick Action Buttons
  quickActions: [
    { label: "Business Hours", action: "What are your business hours?" },
    { label: "Contact Support", action: "How can I contact support?" },
    { label: "Services", action: "What services do you offer?" }
  ],

  // API Configuration
  apiEndpoint: process.env.REACT_APP_API_URL || "https://ai-chatbot-template-production.up.railway.app/api",

  // Features
  enableTypingIndicator: true,
  enableQuickActions: true,
  enableEmailTranscript: true,
  enableChatHistory: true,

  // Notifications
  notificationEmail: "support@acmecorp.com",
  sendEmailOnNewChat: true,

  // UI Customization
  chatWindowHeight: "500px",
  chatWindowWidth: "380px",
  borderRadius: "12px",

  // Behavior
  autoOpen: false, // Auto-open chat on page load
  autoOpenDelay: 5000, // Delay in ms before auto-opening (if enabled)
  minimizeOnSend: false, // Keep window open after sending message

  // Claude AI Settings (backend handles this, but useful for reference)
  aiModel: "claude-sonnet-4",
  aiTemperature: 0.7,
  maxTokens: 1000,

  // Rate Limiting
  maxMessagesPerSession: 50,
  rateLimitWarning: "You've reached the message limit for this session. Please contact us directly if you need further assistance."
};

export default config;
