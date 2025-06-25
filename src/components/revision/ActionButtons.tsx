
import React from 'react';
import { X, Heart } from 'lucide-react';

interface ActionButtonsProps {
  onNope: () => void;
  onLike: () => void;
  disabled?: boolean;
}

const ActionButtons: React.FC<ActionButtonsProps> = ({ onNope, onLike, disabled }) => {
  return (
    <div className="flex justify-center items-center space-x-6 py-4 px-4">
      <button
        onClick={onNope}
        disabled={disabled}
        className="p-3 bg-white rounded-full shadow-lg hover:bg-gray-50 focus:outline-none focus:ring-3 focus:ring-gray-300 focus:ring-opacity-50 transition-all duration-200 ease-in-out hover:scale-110 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed border-2 border-gray-200 hover:border-gray-300"
        aria-label="No me gusta"
        title="No me gusta"
      >
        <X className="w-6 h-6 text-gray-600" strokeWidth={2.5} />
      </button>
      
      <button
        onClick={onLike}
        disabled={disabled}
        className="p-3.5 bg-gradient-to-r from-fuchsia-500 to-pink-500 rounded-full shadow-lg hover:from-fuchsia-600 hover:to-pink-600 focus:outline-none focus:ring-3 focus:ring-fuchsia-300 focus:ring-opacity-50 transition-all duration-200 ease-in-out hover:scale-110 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed border-2 border-fuchsia-400"
        aria-label="Me gusta"
        title="Me gusta"
      >
        <Heart className="w-6 h-6 text-white" strokeWidth={2.5} fill="currentColor" />
      </button>
    </div>
  );
};

export default ActionButtons;
