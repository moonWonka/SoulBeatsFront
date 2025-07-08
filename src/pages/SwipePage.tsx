import React from 'react';
import { Chatbot } from '../components/chatbot/Chatbot'; // Adjusted path
import './SwipePage.css'; // Keep if it contains styles relevant to the page layout, otherwise can be cleaned up later

export const SwipePage: React.FC = () => {
  return (
    <div className="page-container swipe-page-container"> {/* Added a specific class for potential styling */}
      <Chatbot />
    </div>
  );
};

export default SwipePage;
