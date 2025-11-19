/**
 * MessageList Component
 * Displays chat messages with styling
 */

import React from 'react';
import config from '../config';
import './MessageList.css';

const MessageList = ({ messages, isTyping }) => {
  const formatTime = (timestamp) => {
    const date = new Date(timestamp);
    return date.toLocaleTimeString('en-US', {
      hour: 'numeric',
      minute: '2-digit',
      hour12: true
    });
  };

  return (
    <div className="message-list">
      {messages.map((message) => (
        <div
          key={message.id}
          className={`message ${message.sender === 'user' ? 'message-user' : 'message-bot'}`}
        >
          <div
            className="message-bubble"
            style={{
              backgroundColor:
                message.sender === 'user'
                  ? config.primaryColor
                  : '#F3F4F6',
              color: message.sender === 'user' ? '#FFFFFF' : config.textColor
            }}
          >
            <p className="message-text">{message.text}</p>
            <span className="message-time">{formatTime(message.timestamp)}</span>
          </div>
        </div>
      ))}

      {/* Typing Indicator */}
      {isTyping && (
        <div className="message message-bot">
          <div className="message-bubble typing-indicator">
            <div className="typing-dots">
              <span></span>
              <span></span>
              <span></span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MessageList;
