import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { extractSpotifyCodeFromUrl, clearStoredLogs } from '../services/spotifyAuth';
import { linkSpotifyAccount } from '../services/spotifyBackendService';
import { SuccessMessage } from '../components/shared/SuccessMessage';

const SpotifyCallbackPage: React.FC = () => {
  const navigate = useNavigate();
  const { user, loading, refreshSpotifyStatus } = useAuth();
  const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading');
  const [message, setMessage] = useState('Procesando autenticación con Spotify...');

  useEffect(() => {
    const handleSpotifyCallback = async () => {
      try {
        // Wait for auth state to load
        if (loading) {
          return;
        }
        
        if (!user) {
          setStatus('error');
          setMessage('Usuario no autenticado. Por favor, inicia sesión primero.');
          setTimeout(() => navigate('/login'), 3000);
          return;
        }

        const { code, error, state } = extractSpotifyCodeFromUrl();

        if (error) {
          setStatus('error');
          setMessage(`Error en la autenticación: ${error}`);
          setTimeout(() => navigate('/dashboard'), 3000);
          return;
        }

        if (!code) {
          setStatus('error');
          setMessage('No se recibió el código de autorización de Spotify.');
          setTimeout(() => navigate('/dashboard'), 3000);
          return;
        }
        
        const token = await user.getIdToken();
        
        // Enviar código de autorización al backend (flujo tradicional)
        const response = await linkSpotifyAccount(token, code, state || undefined, user.uid);

        // Clear stored data
        clearStoredLogs();

        // Refresh the Spotify status in the context
        await refreshSpotifyStatus();

        setStatus('success');
        setMessage('Tu cuenta de Spotify ha sido vinculada exitosamente. Ahora puedes disfrutar de recomendaciones musicales personalizadas.');

      } catch (error) {
        console.error('Error linking Spotify account:', error);
        setStatus('error');
        setMessage('Error al vincular cuenta de Spotify. Inténtalo de nuevo.');
        setTimeout(() => navigate('/profile'), 3000);
      }
    };

    handleSpotifyCallback();
  }, [user, loading, navigate, refreshSpotifyStatus]);

  const getStatusColor = () => {
    switch (status) {
      case 'loading': return 'text-blue-600';
      case 'success': return 'text-green-600';
      case 'error': return 'text-red-600';
      default: return 'text-gray-600';
    }
  };

  const getStatusIcon = () => {
    switch (status) {
      case 'loading': return '⏳';
      case 'success': return '✅';
      case 'error': return '❌';
      default: return '';
    }
  };

  // Success state - use full-screen SuccessMessage component
  if (status === 'success') {
    return (
      <SuccessMessage
        title="¡Spotify Conectado!"
        message={message}
        redirectPath="/dashboard"
        autoRedirectDelay={4000}
        showSpotifyDetails={true}
        onManualRedirect={() => navigate('/dashboard')}
      />
    );
  }

  // Loading and Error states
  return (
    <div className="min-h-screen bg-gradient-to-br from-fuchsia-500 via-pink-400 to-fuchsia-600 dark:from-gray-900 dark:to-gray-800 flex items-center justify-center px-4">
      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-8 max-w-md w-full text-center">
        <div className="mb-6">
          <div className="text-6xl mb-4">{getStatusIcon()}</div>
          <h1 className="text-2xl font-bold text-gray-800 dark:text-gray-200 mb-4">
            {status === 'loading' ? 'Procesando Autenticación' : 'Error en Autenticación'}
          </h1>
          <p className={`text-lg ${getStatusColor()}`}>
            {message}
          </p>
        </div>
        
        {status === 'loading' && (
          <div className="flex justify-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-fuchsia-600"></div>
          </div>
        )}

        {status === 'error' && (
          <button
            onClick={() => navigate('/dashboard')}
            className="w-full py-3 px-4 bg-gradient-to-r from-fuchsia-600 to-pink-600 hover:from-fuchsia-700 hover:to-pink-700 text-white font-medium rounded-lg transition-all duration-200 transform hover:scale-105"
          >
            Volver al Dashboard
          </button>
        )}
      </div>
    </div>
  );
};

export default SpotifyCallbackPage;