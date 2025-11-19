import React from 'react';
import ChatWidget from './components/ChatWidget';
import './App.css';

function App() {
  return (
    <div className="App">
      {/* Chat Widget Component */}
      <ChatWidget />

      {/* Demo Page Content (Remove this for client projects) */}
      <div className="demo-content">
        <header>
          <h1>AI Chatbot Demo</h1>
          <p>Click the chat button in the bottom-right corner to start!</p>
        </header>

        <section className="features">
          <h2>Features</h2>
          <ul>
            <li>✅ Powered by Claude AI</li>
            <li>✅ Instant FAQ responses</li>
            <li>✅ Natural language understanding</li>
            <li>✅ Chat history</li>
            <li>✅ Fully customizable</li>
            <li>✅ Mobile responsive</li>
            <li>✅ Easy to embed</li>
          </ul>
        </section>

        <section className="customization">
          <h2>Customize for Your Client</h2>
          <p>Edit <code>src/config.js</code> to:</p>
          <ul>
            <li>Change company name and branding</li>
            <li>Update colors and styling</li>
            <li>Add custom FAQs</li>
            <li>Configure API endpoint</li>
            <li>Set quick action buttons</li>
          </ul>
        </section>

        <footer>
          <p>Built with React and Claude AI</p>
        </footer>
      </div>
    </div>
  );
}

export default App;
