import React, { useState } from 'react';
import { ChatMessage } from './ChatMessage';
import './chatbot.css';

export const Chatbot: React.FC = () => {
  const [messages, setMessages] = useState([
    { id: 1, text: 'Hello! How can I help you discover new music today?', sender: 'bot' },
  ]);
  const [inputValue, setInputValue] = useState('');

  const handleSendMessage = () => {
    if (inputValue.trim() === '') return;
    // For now, just add the user's message. Bot responses will be implemented later.
    setMessages([...messages, { id: Date.now(), text: inputValue, sender: 'user' }]);
    setInputValue('');
  };

  return (
    <div className="chatbot-container">
      <div className="chatbot-messages">
        {messages.map((msg) => (
          <ChatMessage key={msg.id} text={msg.text} sender={msg.sender} />
        ))}
      </div>
      <div className="chatbot-input">
        <input
          type="text"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
          placeholder="Type your message..."
        />
        <button onClick={handleSendMessage}>Send</button>
      </div>
    </div>
  );
};
