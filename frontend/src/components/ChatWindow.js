/**
 * ChatWindow Component
 * Main chat interface with messages, input, and controls
 */

import React, { useState, useEffect, useRef } from 'react';
import MessageList from './MessageList';
import config from '../config';
import axios from 'axios';
import './ChatWindow.css';

const ChatWindow = ({ onClose, onNewMessage }) => {
  const [messages, setMessages] = useState([]);
  const [inputValue, setInputValue] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [sessionId] = useState(() => `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`);
  const [messageCount, setMessageCount] = useState(0);
  const messageEndRef = useRef(null);

  // Load chat history from localStorage
  useEffect(() => {
    if (config.enableChatHistory) {
      const savedMessages = localStorage.getItem(`chat_history_${sessionId}`);
      if (savedMessages) {
        setMessages(JSON.parse(savedMessages));
      } else {
        // Add welcome message
        addBotMessage(config.welcomeMessage);
      }
    } else {
      addBotMessage(config.welcomeMessage);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [sessionId]);

  // Save chat history
  useEffect(() => {
    if (config.enableChatHistory && messages.length > 0) {
      localStorage.setItem(`chat_history_${sessionId}`, JSON.stringify(messages));
    }
  }, [messages, sessionId]);

  // Auto-scroll to bottom
  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messageEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const addBotMessage = (text) => {
    const message = {
      id: Date.now(),
      text,
      sender: 'bot',
      timestamp: new Date().toISOString()
    };
    setMessages(prev => [...prev, message]);
    onNewMessage?.();
  };

  const addUserMessage = (text) => {
    const message = {
      id: Date.now(),
      text,
      sender: 'user',
      timestamp: new Date().toISOString()
    };
    setMessages(prev => [...prev, message]);
    setMessageCount(prev => prev + 1);
  };

  // Check if message matches any FAQ
  const findFAQAnswer = (userMessage) => {
    const lowerMessage = userMessage.toLowerCase();
    for (const faq of config.faqs) {
      const lowerQuestion = faq.question.toLowerCase();
      // Simple matching - check if key words from FAQ are in user message
      const keywords = lowerQuestion.split(' ').filter(word => word.length > 3);
      const matchCount = keywords.filter(keyword => lowerMessage.includes(keyword)).length;
      if (matchCount >= Math.ceil(keywords.length * 0.6)) {
        return faq.answer;
      }
    }
    return null;
  };

  // Send message to backend
  const sendMessage = async () => {
    if (!inputValue.trim()) return;

    // Check rate limit
    if (messageCount >= config.maxMessagesPerSession) {
      addBotMessage(config.rateLimitWarning);
      return;
    }

    const userMessage = inputValue.trim();
    setInputValue('');
    addUserMessage(userMessage);

    // Check FAQs first for instant response
    const faqAnswer = findFAQAnswer(userMessage);
    if (faqAnswer) {
      setTimeout(() => addBotMessage(faqAnswer), 500);
      return;
    }

    // Show typing indicator
    if (config.enableTypingIndicator) {
      setIsTyping(true);
    }

    try {
      // Call backend API
      const response = await axios.post(`${config.apiEndpoint}/chat`, {
        message: userMessage,
        sessionId: sessionId,
        context: {
          companyName: config.companyName,
          faqs: config.faqs
        }
      });

      setIsTyping(false);
      addBotMessage(response.data.reply);
    } catch (error) {
      setIsTyping(false);
      console.error('Chat API error:', error);
      addBotMessage(
        "I'm having trouble connecting right now. Please try again in a moment, or contact us directly at " +
        config.notificationEmail
      );
    }
  };

  const handleQuickAction = (action) => {
    setInputValue(action);
    setTimeout(() => sendMessage(), 100);
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  return (
    <div
      className="chat-window"
      style={{
        height: config.chatWindowHeight,
        width: config.chatWindowWidth,
        borderRadius: config.borderRadius
      }}
    >
      {/* Header */}
      <div
        className="chat-header"
        style={{ backgroundColor: config.primaryColor }}
      >
        <div className="chat-header-content">
          {config.companyLogo && (
            <img src={config.companyLogo} alt="Logo" className="chat-logo" />
          )}
          <div className="chat-header-text">
            <h3>{config.companyName}</h3>
            <span className="chat-status">Online</span>
          </div>
        </div>
        <button
          className="chat-close-button"
          onClick={onClose}
          aria-label="Close chat"
        >
          <svg width="20" height="20" viewBox="0 0 20 20" fill="currentColor">
            <path
              fillRule="evenodd"
              d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
              clipRule="evenodd"
            />
          </svg>
        </button>
      </div>

      {/* Messages */}
      <div className="chat-messages" style={{ backgroundColor: config.backgroundColor }}>
        <MessageList messages={messages} isTyping={isTyping} />
        <div ref={messageEndRef} />
      </div>

      {/* Quick Actions */}
      {config.enableQuickActions && messages.length === 1 && (
        <div className="quick-actions">
          {config.quickActions.map((action, index) => (
            <button
              key={index}
              className="quick-action-button"
              onClick={() => handleQuickAction(action.action)}
              style={{ borderColor: config.secondaryColor, color: config.primaryColor }}
            >
              {action.label}
            </button>
          ))}
        </div>
      )}

      {/* Input */}
      <div className="chat-input-container">
        <textarea
          className="chat-input"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          onKeyPress={handleKeyPress}
          placeholder={config.placeholderText}
          rows={1}
          style={{ color: config.textColor }}
        />
        <button
          className="chat-send-button"
          onClick={sendMessage}
          disabled={!inputValue.trim()}
          style={{ backgroundColor: config.primaryColor }}
          aria-label="Send message"
        >
          <svg width="20" height="20" viewBox="0 0 20 20" fill="currentColor">
            <path d="M10.894 2.553a1 1 0 00-1.788 0l-7 14a1 1 0 001.169 1.409l5-1.429A1 1 0 009 15.571V11a1 1 0 112 0v4.571a1 1 0 00.725.962l5 1.428a1 1 0 001.17-1.408l-7-14z" />
          </svg>
        </button>
      </div>

      {/* Powered By */}
      <div className="chat-footer">
        <span>Powered by AI</span>
      </div>
    </div>
  );
};

export default ChatWindow;
