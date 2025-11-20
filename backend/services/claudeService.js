/**
 * Claude AI Service
 * Handles interactions with Anthropic Claude API
 */

const Anthropic = require('@anthropic-ai/sdk');

class ClaudeService {
  constructor() {
    this.client = new Anthropic({
      apiKey: process.env.ANTHROPIC_API_KEY,
    });

    this.model = process.env.CLAUDE_MODEL || 'claude-3-haiku-20240307';
    this.maxTokens = parseInt(process.env.CLAUDE_MAX_TOKENS) || 1000;
    this.temperature = parseFloat(process.env.CLAUDE_TEMPERATURE) || 0.7;
  }

  /**
   * Generate AI response
   * @param {string} userMessage - User's message
   * @param {Object} options - Additional options
   * @returns {Promise<string>} - AI response
   */
  async generateResponse(userMessage, options = {}) {
    try {
      const { history = [], context = {} } = options;

      // Build system prompt
      const systemPrompt = this.buildSystemPrompt(context);

      // Build message history
      const messages = this.buildMessages(history, userMessage);

      console.log(`[Claude] Generating response...`);

      // Call Claude API
      const response = await this.client.messages.create({
        model: this.model,
        max_tokens: this.maxTokens,
        temperature: this.temperature,
        system: systemPrompt,
        messages: messages
      });

      const reply = response.content[0].text;
      console.log(`[Claude] Response generated (${reply.length} chars)`);

      return reply;

    } catch (error) {
      console.error('[Claude Service Error]', error);

      // Handle rate limiting
      if (error.status === 429) {
        return "I'm receiving a lot of requests right now. Please try again in a moment.";
      }

      // Handle API key issues
      if (error.status === 401) {
        return "I'm having trouble connecting to the AI service. Please contact support.";
      }

      // Generic error
      return "I apologize, but I'm having trouble processing your request right now. Please try again or contact us directly.";
    }
  }

  /**
   * Build system prompt with context
   * @param {Object} context - Conversation context
   * @returns {string} - System prompt
   */
  buildSystemPrompt(context) {
    const { companyName = 'our company', faqs = [] } = context;

    let prompt = `You are an AI customer service assistant for ${companyName}. `;
    prompt += `Your goal is to help customers with their questions in a friendly, professional, and helpful manner.\n\n`;

    prompt += `Guidelines:\n`;
    prompt += `- Be concise but informative\n`;
    prompt += `- Use a friendly, conversational tone\n`;
    prompt += `- If you don't know something, be honest and offer to connect them with a human\n`;
    prompt += `- Never make up information\n`;
    prompt += `- Keep responses under 200 words\n`;
    prompt += `- Use proper formatting for lists and important information\n\n`;

    if (faqs && faqs.length > 0) {
      prompt += `Here are some frequently asked questions to help you:\n\n`;
      faqs.forEach((faq, index) => {
        prompt += `${index + 1}. Q: ${faq.question}\n   A: ${faq.answer}\n\n`;
      });
    }

    prompt += `Remember: Be helpful, professional, and empathetic. Your goal is to solve the customer's problem or route them to the right help.`;

    return prompt;
  }

  /**
   * Build message history for Claude
   * @param {Array} history - Previous messages
   * @param {string} newMessage - Current user message
   * @returns {Array} - Formatted messages
   */
  buildMessages(history, newMessage) {
    const messages = [];

    // Add history (limit to last 10 messages to save tokens)
    const recentHistory = history.slice(-10);
    recentHistory.forEach(msg => {
      messages.push({
        role: msg.role === 'user' ? 'user' : 'assistant',
        content: msg.content
      });
    });

    // Add current message
    messages.push({
      role: 'user',
      content: newMessage
    });

    return messages;
  }

  /**
   * Test API connection
   * @returns {Promise<boolean>} - Connection status
   */
  async testConnection() {
    try {
      const response = await this.generateResponse('Hello', {
        context: { companyName: 'Test Company' }
      });
      return response && response.length > 0;
    } catch (error) {
      console.error('[Claude] Connection test failed:', error);
      return false;
    }
  }
}

// Singleton instance
const claudeService = new ClaudeService();

module.exports = claudeService;
