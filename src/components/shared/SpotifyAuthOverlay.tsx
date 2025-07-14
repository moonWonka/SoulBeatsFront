import React from 'react';
import { Music } from 'lucide-react';

interface SpotifyAuthOverlayProps {
  isVisible: boolean;
  message?: string;
}

export const SpotifyAuthOverlay: React.FC<SpotifyAuthOverlayProps> = ({ 
  isVisible, 
  message = 'Conectando con Spotify...' 
}) => {
  if (!isVisible) return null;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center">
      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl p-8 max-w-sm w-full mx-4 text-center">
        <div className="mb-6">
          <div className="mx-auto mb-4 h-16 w-16 rounded-full bg-gradient-to-br from-green-400 to-green-600 flex items-center justify-center">
            <Music className="w-8 h-8 text-white" />
          </div>
          <h3 className="text-xl font-semibold text-gray-800 dark:text-gray-200 mb-2">
            Spotify
          </h3>
          <p className="text-gray-600 dark:text-gray-400">
            {message}
          </p>
        </div>
        
        <div className="flex flex-col items-center space-y-4">
          <div className="relative">
            <div className="animate-spin rounded-full h-12 w-12 border-4 border-green-200 border-t-green-600"></div>
            <div className="absolute inset-2 rounded-full bg-green-50 dark:bg-gray-700"></div>
          </div>
          <div className="flex items-center space-x-1 text-sm text-gray-500 dark:text-gray-400">
            <span className="animate-pulse">●</span>
            <span className="animate-pulse delay-75">●</span>
            <span className="animate-pulse delay-150">●</span>
          </div>
        </div>
      </div>
    </div>
  );
};