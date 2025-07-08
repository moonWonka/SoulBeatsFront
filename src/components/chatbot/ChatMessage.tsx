import React from 'react';
import './chatbot.css';

interface ChatMessageProps {
  text: string;
  sender: 'user' | 'bot';
}

export const ChatMessage: React.FC<ChatMessageProps> = ({ text, sender }) => {
  return (
    <div className={`chat-message ${sender === 'user' ? 'user-message' : 'bot-message'}`}>
      <p>{text}</p>
    </div>
  );
};
