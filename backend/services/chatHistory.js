/**
 * Chat History Service
 * Manages conversation history in memory
 * For production, consider using Redis or a database
 */

class ChatHistoryService {
  constructor() {
    // In-memory storage: sessionId -> messages[]
    this.sessions = new Map();

    // Auto-cleanup old sessions after 24 hours
    this.maxAge = 24 * 60 * 60 * 1000; // 24 hours
    this.startCleanupTimer();
  }

  /**
   * Add message to session history
   * @param {string} sessionId - Session identifier
   * @param {string} role - 'user' or 'assistant'
   * @param {string} content - Message content
   */
  addMessage(sessionId, role, content) {
    if (!this.sessions.has(sessionId)) {
      this.sessions.set(sessionId, {
        messages: [],
        createdAt: Date.now(),
        lastActivity: Date.now()
      });
    }

    const session = this.sessions.get(sessionId);
    session.messages.push({
      role,
      content,
      timestamp: new Date().toISOString()
    });
    session.lastActivity = Date.now();

    console.log(`[History] Message added to session ${sessionId} (${session.messages.length} total)`);
  }

  /**
   * Get session history
   * @param {string} sessionId - Session identifier
   * @returns {Array} - Array of messages
   */
  getHistory(sessionId) {
    if (!this.sessions.has(sessionId)) {
      return [];
    }

    const session = this.sessions.get(sessionId);
    session.lastActivity = Date.now();

    return session.messages;
  }

  /**
   * Clear session history
   * @param {string} sessionId - Session identifier
   */
  clearHistory(sessionId) {
    if (this.sessions.has(sessionId)) {
      this.sessions.delete(sessionId);
      console.log(`[History] Session ${sessionId} cleared`);
    }
  }

  /**
   * Get all active sessions
   * @returns {Array} - Array of session IDs
   */
  getActiveSessions() {
    return Array.from(this.sessions.keys());
  }

  /**
   * Get session count
   * @returns {number} - Number of active sessions
   */
  getSessionCount() {
    return this.sessions.size;
  }

  /**
   * Get session info
   * @param {string} sessionId - Session identifier
   * @returns {Object|null} - Session metadata
   */
  getSessionInfo(sessionId) {
    if (!this.sessions.has(sessionId)) {
      return null;
    }

    const session = this.sessions.get(sessionId);
    return {
      messageCount: session.messages.length,
      createdAt: session.createdAt,
      lastActivity: session.lastActivity,
      age: Date.now() - session.createdAt
    };
  }

  /**
   * Cleanup old sessions
   */
  cleanup() {
    const now = Date.now();
    let cleaned = 0;

    for (const [sessionId, session] of this.sessions.entries()) {
      const age = now - session.lastActivity;
      if (age > this.maxAge) {
        this.sessions.delete(sessionId);
        cleaned++;
      }
    }

    if (cleaned > 0) {
      console.log(`[History] Cleaned up ${cleaned} old sessions`);
    }

    return cleaned;
  }

  /**
   * Start automatic cleanup timer
   */
  startCleanupTimer() {
    // Run cleanup every hour
    setInterval(() => {
      this.cleanup();
    }, 60 * 60 * 1000);

    console.log('[History] Cleanup timer started (runs every hour)');
  }

  /**
   * Get statistics
   * @returns {Object} - Usage statistics
   */
  getStats() {
    let totalMessages = 0;
    let oldestSession = Date.now();
    let newestSession = 0;

    for (const session of this.sessions.values()) {
      totalMessages += session.messages.length;
      if (session.createdAt < oldestSession) oldestSession = session.createdAt;
      if (session.createdAt > newestSession) newestSession = session.createdAt;
    }

    return {
      activeSessions: this.sessions.size,
      totalMessages,
      oldestSessionAge: oldestSession < Date.now() ? Date.now() - oldestSession : 0,
      newestSessionAge: newestSession > 0 ? Date.now() - newestSession : 0
    };
  }
}

// Singleton instance
const chatHistory = new ChatHistoryService();

module.exports = chatHistory;
