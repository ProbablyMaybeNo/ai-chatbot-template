/**
 * Email Service
 * Sends email notifications using Nodemailer
 */

const nodemailer = require('nodemailer');

class EmailService {
  constructor() {
    this.transporter = null;
    this.from = process.env.EMAIL_FROM || 'noreply@example.com';
    this.enabled = process.env.SEND_EMAIL_NOTIFICATIONS === 'true';

    if (this.enabled) {
      this.initializeTransporter();
    }
  }

  /**
   * Initialize email transporter
   */
  initializeTransporter() {
    try {
      this.transporter = nodemailer.createTransporter({
        host: process.env.EMAIL_HOST || 'smtp.gmail.com',
        port: parseInt(process.env.EMAIL_PORT) || 587,
        secure: process.env.EMAIL_SECURE === 'true',
        auth: {
          user: process.env.EMAIL_USER,
          pass: process.env.EMAIL_PASSWORD
        }
      });

      console.log('[Email] Service initialized');
    } catch (error) {
      console.error('[Email] Failed to initialize:', error.message);
      this.enabled = false;
    }
  }

  /**
   * Send chat notification to company
   * @param {Object} data - Notification data
   */
  async sendChatNotification(data) {
    if (!this.enabled || !this.transporter) {
      console.log('[Email] Notifications disabled, skipping');
      return;
    }

    const { sessionId, userMessage, botReply, companyName } = data;
    const notificationEmail = process.env.NOTIFICATION_EMAIL;

    if (!notificationEmail) {
      console.log('[Email] No notification email configured');
      return;
    }

    try {
      const mailOptions = {
        from: this.from,
        to: notificationEmail,
        subject: `New Chat Message - ${companyName}`,
        html: `
          <h2>New Chat Message Received</h2>
          <p><strong>Session ID:</strong> ${sessionId}</p>
          <p><strong>Time:</strong> ${new Date().toLocaleString()}</p>

          <h3>User Message:</h3>
          <p>${userMessage}</p>

          <h3>Bot Reply:</h3>
          <p>${botReply}</p>

          <hr>
          <p style="color: #666; font-size: 12px;">
            This is an automated notification from your AI chatbot system.
          </p>
        `
      };

      await this.transporter.sendMail(mailOptions);
      console.log(`[Email] Notification sent to ${notificationEmail}`);

    } catch (error) {
      console.error('[Email] Failed to send notification:', error.message);
    }
  }

  /**
   * Send chat transcript to user
   * @param {string} email - User's email
   * @param {Array} messages - Chat messages
   * @param {string} sessionId - Session ID
   */
  async sendTranscript(email, messages, sessionId) {
    if (!this.enabled || !this.transporter) {
      throw new Error('Email service is not enabled');
    }

    try {
      const transcript = messages
        .map(msg => {
          const time = new Date(msg.timestamp).toLocaleTimeString();
          const sender = msg.role === 'user' ? 'You' : 'AI Assistant';
          return `[${time}] ${sender}: ${msg.content}`;
        })
        .join('\n\n');

      const mailOptions = {
        from: this.from,
        to: email,
        subject: 'Chat Transcript',
        html: `
          <h2>Your Chat Transcript</h2>
          <p><strong>Session ID:</strong> ${sessionId}</p>
          <p><strong>Date:</strong> ${new Date().toLocaleString()}</p>

          <hr>

          <pre style="font-family: monospace; background: #f5f5f5; padding: 15px; border-radius: 5px;">
${transcript}
          </pre>

          <hr>

          <p style="color: #666; font-size: 12px;">
            Thank you for chatting with us!
          </p>
        `
      };

      await this.transporter.sendMail(mailOptions);
      console.log(`[Email] Transcript sent to ${email}`);

    } catch (error) {
      console.error('[Email] Failed to send transcript:', error.message);
      throw error;
    }
  }

  /**
   * Test email configuration
   * @returns {Promise<boolean>} - Success status
   */
  async testConnection() {
    if (!this.enabled || !this.transporter) {
      return false;
    }

    try {
      await this.transporter.verify();
      console.log('[Email] Connection verified');
      return true;
    } catch (error) {
      console.error('[Email] Connection test failed:', error.message);
      return false;
    }
  }
}

// Singleton instance
const emailService = new EmailService();

module.exports = emailService;
