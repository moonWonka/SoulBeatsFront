import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { extractSpotifyCodeFromUrl } from '../services/spotifyAuth';
import { linkSpotifyAccount } from '../services/spotifyBackendService';

const SpotifyCallbackPage: React.FC = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading');
  const [message, setMessage] = useState('Procesando autenticación con Spotify...');

  useEffect(() => {
    const handleSpotifyCallback = async () => {
      try {
        console.log('📱 SpotifyCallbackPage: Iniciando callback...');
        console.log('Current URL:', window.location.href);
        console.log('URL Params:', window.location.search);
        
        if (!user) {
          console.log('❌ Usuario no autenticado');
          setStatus('error');
          setMessage('Usuario no autenticado. Por favor, inicia sesión primero.');
          setTimeout(() => navigate('/login'), 3000);
          return;
        }

        const { code, error, state } = extractSpotifyCodeFromUrl();
        console.log('🔍 Datos extraídos de URL:');
        console.log('  - Code:', code);
        console.log('  - Error:', error);
        console.log('  - State:', state);

        if (error) {
          console.log('❌ Error en callback de Spotify:', error);
          setStatus('error');
          setMessage(`Error en la autenticación: ${error}`);
          setTimeout(() => navigate('/profile'), 3000);
          return;
        }

        if (!code) {
          console.log('❌ No se recibió código de autorización');
          setStatus('error');
          setMessage('No se recibió el código de autorización de Spotify.');
          setTimeout(() => navigate('/profile'), 3000);
          return;
        }

        console.log('✅ Código recibido, obteniendo token de usuario...');
        const token = await user.getIdToken();
        console.log('🔑 Token obtenido, vinculando cuenta...');
        
        await linkSpotifyAccount(token, code);
        console.log('🎉 Spotify vinculado exitosamente!');

        setStatus('success');
        setMessage('¡Spotify vinculado exitosamente!');
        setTimeout(() => navigate('/profile'), 2000);

      } catch (error) {
        console.error('💥 Error linking Spotify account:', error);
        setStatus('error');
        setMessage('Error al vincular cuenta de Spotify. Inténtalo de nuevo.');
        setTimeout(() => navigate('/profile'), 3000);
      }
    };

    handleSpotifyCallback();
  }, [user, navigate]);

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

  return (
    <div className="min-h-screen bg-gradient-to-br from-fuchsia-500 via-pink-400 to-fuchsia-600 dark:from-gray-900 dark:to-gray-800 flex items-center justify-center px-4">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl p-8 max-w-md w-full text-center">
        <div className="mb-6">
          <div className="text-6xl mb-4">{getStatusIcon()}</div>
          <h1 className="text-2xl font-bold text-gray-800 dark:text-gray-200 mb-4">
            Autenticación Spotify
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

        {status !== 'loading' && (
          <button
            onClick={() => navigate('/profile')}
            className="mt-4 px-6 py-2 bg-fuchsia-600 text-white rounded-lg hover:bg-fuchsia-700 transition-colors"
          >
            Volver al Perfil
          </button>
        )}
      </div>
    </div>
  );
};

export default SpotifyCallbackPage;