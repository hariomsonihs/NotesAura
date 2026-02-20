import React, { useState } from 'react';
import './ChatBot.css';

const ChatBot = () => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <button 
        className="chatbot-fab gradient-green" 
        onClick={() => setIsOpen(!isOpen)}
        title="AI Assistant"
      >
        {isOpen ? '✕' : '🤖'}
      </button>

      {isOpen && (
        <>
          <div className="chatbot-overlay" onClick={() => setIsOpen(false)} />
          <div className="chatbot-popup">
            <div className="chatbot-popup-header">
              <h3>🤖 AI Assistant</h3>
              <button className="close-btn" onClick={() => setIsOpen(false)}>✕</button>
            </div>
            <iframe
              src="https://notesaura-ai.onrender.com/"
              title="NotesAura AI Assistant"
              className="chatbot-iframe"
            />
          </div>
        </>
      )}
    </>
  );
};

export default ChatBot;
