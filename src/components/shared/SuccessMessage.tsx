import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { CheckCircle2, Music, ArrowRight } from 'lucide-react';

interface SuccessMessageProps {
  title: string;
  message: string;
  icon?: React.ReactNode;
  redirectPath: string;
  autoRedirectDelay?: number;
  onManualRedirect?: () => void;
  showSpotifyDetails?: boolean;
}

export const SuccessMessage: React.FC<SuccessMessageProps> = ({
  title,
  message,
  icon,
  redirectPath,
  autoRedirectDelay = 3000,
  onManualRedirect,
  showSpotifyDetails = false
}) => {
  const navigate = useNavigate();
  const [countdown, setCountdown] = useState(Math.ceil(autoRedirectDelay / 1000));
  const [isRedirecting, setIsRedirecting] = useState(false);

  useEffect(() => {
    const timer = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  // Separate useEffect for redirect to avoid setState during render
  useEffect(() => {
    if (countdown === 0 && !isRedirecting) {
      handleRedirect();
    }
  }, [countdown, isRedirecting, navigate, onManualRedirect, redirectPath]);

  const handleRedirect = () => {
    setIsRedirecting(true);
    if (onManualRedirect) {
      onManualRedirect();
    } else {
      navigate(redirectPath);
    }
  };

  const handleManualRedirect = () => {
    setCountdown(0);
    handleRedirect();
  };

  const defaultIcon = showSpotifyDetails ? (
    <div className="relative">
      <div className="absolute inset-0 bg-green-400 rounded-full animate-ping opacity-75"></div>
      <div className="relative bg-green-500 rounded-full p-4">
        <Music className="w-8 h-8 text-white" />
      </div>
    </div>
  ) : (
    <div className="relative">
      <div className="absolute inset-0 bg-green-400 rounded-full animate-ping opacity-75"></div>
      <CheckCircle2 className="relative w-16 h-16 text-green-500" />
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-fuchsia-500 via-pink-400 to-fuchsia-600 dark:from-gray-900 dark:to-gray-800 flex items-center justify-center px-4">
      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl p-8 max-w-md w-full text-center transform transition-all duration-500 hover:scale-105">
        
        {/* Icon Section */}
        <div className="mb-6 flex justify-center">
          {icon || defaultIcon}
        </div>

        {/* Title */}
        <h1 className="text-2xl sm:text-3xl font-bold text-gray-800 dark:text-gray-200 mb-4">
          {title}
        </h1>

        {/* Message */}
        <p className="text-gray-600 dark:text-gray-400 text-lg mb-6 leading-relaxed">
          {message}
        </p>

        {/* Spotify Integration Success Details */}
        {showSpotifyDetails && (
          <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg p-4 mb-6">
            <div className="flex items-center justify-center mb-2">
              <Music className="w-5 h-5 text-green-600 mr-2" />
              <span className="text-green-700 dark:text-green-300 font-medium">
                Spotify Conectado
              </span>
            </div>
            <p className="text-sm text-green-600 dark:text-green-400">
              Ya puedes disfrutar de recomendaciones personalizadas basadas en tu música
            </p>
          </div>
        )}

        {/* Countdown Section */}
        {!isRedirecting && countdown > 0 && (
          <div className="mb-6">
            <div className="flex items-center justify-center mb-3">
              <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-fuchsia-600 mr-2"></div>
              <span className="text-gray-500 dark:text-gray-400">
                Redirigiendo en {countdown} segundo{countdown !== 1 ? 's' : ''}...
              </span>
            </div>
            
            {/* Progress Bar */}
            <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
              <div 
                className="bg-gradient-to-r from-fuchsia-500 to-pink-500 h-2 rounded-full transition-all duration-1000"
                style={{ 
                  width: `${((Math.ceil(autoRedirectDelay / 1000) - countdown) / Math.ceil(autoRedirectDelay / 1000)) * 100}%` 
                }}
              ></div>
            </div>
          </div>
        )}

        {/* Action Buttons */}
        <div className="space-y-3">
          {!isRedirecting && (
            <button
              onClick={handleManualRedirect}
              className="w-full flex justify-center items-center py-3 px-4 border border-transparent rounded-lg shadow-sm text-base font-medium text-white bg-gradient-to-r from-fuchsia-600 to-pink-600 hover:from-fuchsia-700 hover:to-pink-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-fuchsia-500 transition-all duration-200 transform hover:scale-105 active:scale-95"
            >
              <span>Continuar ahora</span>
              <ArrowRight className="ml-2 w-5 h-5" />
            </button>
          )}

          {isRedirecting && (
            <div className="flex items-center justify-center py-3">
              <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-fuchsia-600 mr-2"></div>
              <span className="text-fuchsia-600 font-medium">Redirigiendo...</span>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="mt-6 pt-4 border-t border-gray-200 dark:border-gray-700">
          <p className="text-xs text-gray-400 dark:text-gray-500">
            ¡Gracias por usar SoulBeats!
          </p>
        </div>
      </div>
    </div>
  );
};