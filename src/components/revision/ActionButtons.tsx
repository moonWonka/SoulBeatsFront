
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
        className="p-3 bg-white dark:bg-gray-700 rounded-full shadow-lg hover:bg-gray-50 dark:hover:bg-gray-600 focus:outline-none focus:ring-3 focus:ring-gray-300 dark:focus:ring-gray-600 focus:ring-opacity-50 transition-all duration-200 ease-in-out hover:scale-110 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed border-2 border-gray-200 dark:border-gray-600 hover:border-gray-300 dark:hover:border-gray-500"
        aria-label="No me gusta"
        title="No me gusta"
      >
        <X className="w-6 h-6 text-gray-600 dark:text-gray-300" strokeWidth={2.5} />
      </button>
      
      <button
        onClick={onLike}
        disabled={disabled}
        className="p-3.5 bg-gradient-to-r from-fuchsia-500 to-pink-500 rounded-full shadow-lg hover:from-fuchsia-600 hover:to-pink-600 focus:outline-none focus:ring-3 focus:ring-fuchsia-300 dark:focus:ring-fuchsia-600 focus:ring-opacity-50 transition-all duration-200 ease-in-out hover:scale-110 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed border-2 border-fuchsia-400 dark:border-fuchsia-500"
        aria-label="Me gusta"
        title="Me gusta"
      >
        <Heart className="w-6 h-6 text-white" strokeWidth={2.5} fill="currentColor" />
      </button>
    </div>
  );
};

export default ActionButtons;
