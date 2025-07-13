import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { extractSpotifyCodeFromUrl, showStoredLogs, clearStoredLogs } from '../services/spotifyAuth';
import { linkSpotifyAccount } from '../services/spotifyBackendService';
import { SuccessMessage } from '../components/shared/SuccessMessage';

const SpotifyCallbackPage: React.FC = () => {
  const navigate = useNavigate();
  const { user, refreshSpotifyStatus } = useAuth();
  const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading');
  const [message, setMessage] = useState('Procesando autenticación con Spotify...');

  useEffect(() => {
    const handleSpotifyCallback = async () => {
      try {
        console.log('📱 SpotifyCallbackPage: Processing callback...');
        showStoredLogs();
        
        if (!user) {
          console.log('❌ User not authenticated');
          setStatus('error');
          setMessage('Usuario no autenticado. Por favor, inicia sesión primero.');
          setTimeout(() => navigate('/login'), 3000);
          return;
        }

        const { code, error, state } = extractSpotifyCodeFromUrl();

        if (error) {
          console.log('❌ Error in callback:', error);
          setStatus('error');
          setMessage(`Error en la autenticación: ${error}`);
          setTimeout(() => navigate('/dashboard'), 3000);
          return;
        }

        if (!code) {
          console.log('❌ No authorization code received');
          setStatus('error');
          setMessage('No se recibió el código de autorización de Spotify.');
          setTimeout(() => navigate('/dashboard'), 3000);
          return;
        }

        console.log('✅ Code received, getting user token...');
        const token = await user.getIdToken();
        console.log('🔑 Linking Spotify account...');
        
        await linkSpotifyAccount(token, code);
        console.log('🎉 Spotify linked successfully!');

        // Refresh Spotify status to update the UI
        await refreshSpotifyStatus();

        setStatus('success');
        setMessage('Tu cuenta de Spotify ha sido vinculada exitosamente. Ahora puedes disfrutar de recomendaciones musicales personalizadas.');
        
        // Clear logs after success
        setTimeout(() => {
          clearStoredLogs();
        }, 1000);

      } catch (error) {
        console.error('❌ Error linking Spotify:', error);
        setStatus('error');
        setMessage('Error al vincular cuenta de Spotify. Por favor, inténtalo de nuevo.');
        setTimeout(() => navigate('/dashboard'), 3000);
      }
    };

    handleSpotifyCallback();
  }, [user, navigate, refreshSpotifyStatus]);

  // Loading state
  if (status === 'loading') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-fuchsia-500 via-pink-400 to-fuchsia-600 dark:from-gray-900 dark:to-gray-800 flex items-center justify-center px-4">
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-8 max-w-md w-full text-center">
          <div className="mb-6">
            <div className="text-6xl mb-4">⏳</div>
            <h1 className="text-2xl font-bold text-gray-800 dark:text-gray-200 mb-4">
              Procesando Autenticación
            </h1>
            <p className="text-blue-600 text-lg">
              {message}
            </p>
          </div>
          
          <div className="flex justify-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-fuchsia-600"></div>
          </div>
        </div>
      </div>
    );
  }

  // Success state
  if (status === 'success') {
    return (
      <SuccessMessage
        title="¡Spotify Conectado!"
        message={message}
        redirectPath="/dashboard"
        autoRedirectDelay={4000}
        showSpotifyDetails={true}
        onManualRedirect={() => {
          clearStoredLogs();
          navigate('/dashboard');
        }}
      />
    );
  }

  // Error state
  return (
    <div className="min-h-screen bg-gradient-to-br from-fuchsia-500 via-pink-400 to-fuchsia-600 dark:from-gray-900 dark:to-gray-800 flex items-center justify-center px-4">
      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-8 max-w-md w-full text-center">
        <div className="mb-6">
          <div className="text-6xl mb-4">❌</div>
          <h1 className="text-2xl font-bold text-gray-800 dark:text-gray-200 mb-4">
            Error en Autenticación
          </h1>
          <p className="text-red-600 text-lg">
            {message}
          </p>
        </div>
        
        <button
          onClick={() => navigate('/dashboard')}
          className="w-full py-3 px-4 bg-gradient-to-r from-fuchsia-600 to-pink-600 hover:from-fuchsia-700 hover:to-pink-700 text-white font-medium rounded-lg transition-all duration-200 transform hover:scale-105"
        >
          Volver al Dashboard
        </button>
      </div>
    </div>
  );
};

export default SpotifyCallbackPage;