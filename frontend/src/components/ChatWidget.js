/**
 * ChatWidget Component
 * Main entry point for the chatbot widget
 */

import React, { useState, useEffect } from 'react';
import ChatWindow from './ChatWindow';
import config from '../config';
import './ChatWidget.css';

const ChatWidget = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);
  const [hasNewMessage, setHasNewMessage] = useState(false);

  // Auto-open chat after delay (if enabled)
  useEffect(() => {
    if (config.autoOpen && config.autoOpenDelay) {
      const timer = setTimeout(() => {
        setIsOpen(true);
      }, config.autoOpenDelay);

      return () => clearTimeout(timer);
    }
  }, []);

  // Handle new messages from bot
  const handleNewMessage = () => {
    if (!isOpen) {
      setUnreadCount(prev => prev + 1);
      setHasNewMessage(true);
    }
  };

  // Toggle chat window
  const toggleChat = () => {
    setIsOpen(!isOpen);
    if (!isOpen) {
      setUnreadCount(0);
      setHasNewMessage(false);
    }
  };

  // Position class based on config
  const positionClass = `chat-widget-${config.position}`;

  return (
    <div className={`chat-widget-container ${positionClass}`}>
      {/* Chat Window */}
      {isOpen && (
        <ChatWindow
          onClose={() => setIsOpen(false)}
          onNewMessage={handleNewMessage}
        />
      )}

      {/* Chat Button */}
      {!isOpen && (
        <button
          className="chat-toggle-button"
          onClick={toggleChat}
          style={{ backgroundColor: config.primaryColor }}
          aria-label="Open chat"
        >
          {/* Chat Icon */}
          <svg
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
          </svg>

          {/* Unread Badge */}
          {unreadCount > 0 && (
            <span className="unread-badge">{unreadCount}</span>
          )}

          {/* New Message Pulse */}
          {hasNewMessage && <span className="pulse-ring" />}
        </button>
      )}
    </div>
  );
};

export default ChatWidget;
