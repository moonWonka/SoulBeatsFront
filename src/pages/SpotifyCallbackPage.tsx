import React, { useEffect, useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { extractSpotifyCodeFromUrl, clearStoredLogs } from '../services/spotifyAuth';
import { linkSpotifyAccount } from '../services/spotifyBackendService';
import { SuccessMessage } from '../components/shared/SuccessMessage';
import { useSpotifyAuthLoading } from '../hooks/useSpotifyAuth';

const SpotifyCallbackPage: React.FC = () => {
  const navigate = useNavigate();
  const { user, loading, refreshSpotifyStatus } = useAuth();
  const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading');
  const [message, setMessage] = useState('Recibiendo respuesta de Spotify...');
  const { clearSpotifyAuthLoading } = useSpotifyAuthLoading();
  const hasProcessed = useRef(false);

  useEffect(() => {
    const handleSpotifyCallback = async () => {
      // Prevenir múltiples ejecuciones
      if (hasProcessed.current) {
        return;
      }

      try {
        // Check for immediate errors in URL first
        const { code, error } = extractSpotifyCodeFromUrl();
        
        if (error) {
          hasProcessed.current = true;
          clearSpotifyAuthLoading();
          setStatus('error');
          
          // Mensaje más específico para state mismatch
          const errorMessage = error.includes('State mismatch') 
            ? 'Sesión de autenticación expirada. Por favor, inténtalo de nuevo.'
            : `Error en la autenticación: ${error}`;
          
          setMessage(errorMessage);
          setTimeout(() => navigate('/dashboard'), 3000);
          return;
        }

        if (!code) {
          hasProcessed.current = true;
          clearSpotifyAuthLoading();
          setStatus('error');
          setMessage('No se recibió el código de autorización de Spotify.');
          setTimeout(() => navigate('/dashboard'), 3000);
          return;
        }

        // Wait for auth state to load
        if (loading) {
          setMessage('Verificando autenticación...');
          return;
        }
        
        if (!user) {
          hasProcessed.current = true;
          clearSpotifyAuthLoading();
          setStatus('error');
          setMessage('Usuario no autenticado. Por favor, inicia sesión primero.');
          setTimeout(() => navigate('/login'), 3000);
          return;
        }

        // Marcar como procesado ANTES de hacer la llamada al backend
        hasProcessed.current = true;
        setMessage('Intercambiando tokens con Spotify...');

        const { state } = extractSpotifyCodeFromUrl();
        
        const token = await user.getIdToken();
        
        // Enviar código de autorización al backend (flujo tradicional)
        await linkSpotifyAccount(token, code, state || undefined, user.uid);

        // Clear stored data
        clearStoredLogs();

        // Refresh the Spotify status in the context
        await refreshSpotifyStatus();

        // Clear loading state
        clearSpotifyAuthLoading();

        setStatus('success');
        setMessage('Tu cuenta de Spotify ha sido vinculada exitosamente. Ahora puedes disfrutar de recomendaciones musicales personalizadas.');

      } catch (error) {
        console.error('Error linking Spotify account:', error);
        hasProcessed.current = true;
        clearSpotifyAuthLoading();
        setStatus('error');
        
        // Mensaje de error más específico
        let errorMessage = 'Error al vincular cuenta de Spotify. Inténtalo de nuevo.';
        if (error instanceof Error) {
          errorMessage = error.message.includes('already linked') 
            ? 'Esta cuenta de Spotify ya está vinculada a otro usuario.'
            : `Error: ${error.message}`;
        }
        
        setMessage(errorMessage);
        setTimeout(() => navigate('/dashboard'), 5000);
      }
    };

    handleSpotifyCallback();
  }, [user, loading, navigate, refreshSpotifyStatus, clearSpotifyAuthLoading]);

  // Cleanup: Limpiar estado de loading si el componente se desmonta
  useEffect(() => {
    return () => {
      // Solo limpiar si hubo un error y no se completó exitosamente
      if (hasProcessed.current && status === 'error') {
        clearSpotifyAuthLoading();
      }
    };
  }, [clearSpotifyAuthLoading, status]);

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
          <div className="flex flex-col items-center space-y-4">
            <div className="relative">
              <div className="animate-spin rounded-full h-12 w-12 border-4 border-fuchsia-200 border-t-fuchsia-600"></div>
              <div className="absolute inset-2 rounded-full bg-fuchsia-50 dark:bg-gray-700"></div>
            </div>
            <div className="flex items-center space-x-1 text-sm text-gray-500 dark:text-gray-400">
              <span className="animate-pulse">●</span>
              <span className="animate-pulse delay-75">●</span>
              <span className="animate-pulse delay-150">●</span>
            </div>
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