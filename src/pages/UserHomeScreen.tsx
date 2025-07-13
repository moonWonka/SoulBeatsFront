import React from 'react';
import { useAuth } from '../context/AuthContext';
import { GradientButton } from '../components/shared/GradientButton';
import { OutlineButton } from '../components/shared/OutlineButton';
import { UserCircle2, Settings, Link as LinkIcon, Unlink, Music } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { initiateSpotifyAuth } from '../services/spotifyAuth';
import { unlinkSpotifyAccount } from '../services/spotifyBackendService';

const UserHomeScreen: React.FC = () => {
  const { user, spotifyLinked, spotifyProfile, refreshSpotifyStatus } = useAuth();
  const navigate = useNavigate();
  const [isStartingSpotifyAuth, setIsStartingSpotifyAuth] = React.useState(false);

  // Log solo cuando cambia el estado de Spotify
  React.useEffect(() => {
    console.log('📱 Spotify status:', spotifyLinked ? 'Connected' : 'Not connected');
  }, [spotifyLinked]);

  const handleSpotifyAction = async () => {
    if (spotifyLinked) {
      console.log('🔗 Unlinking Spotify account...');
      try {
        if (!user) return;
        const token = await user.getIdToken();
        await unlinkSpotifyAccount(token);
        await refreshSpotifyStatus();
        console.log('✅ Spotify account unlinked successfully');
      } catch (error) {
        console.error('❌ Error unlinking Spotify:', error);
      }
    } else {
      console.log('🎵 Starting Spotify authentication...');
      
      setIsStartingSpotifyAuth(true);
      
      // Llamar directamente sin delay
      initiateSpotifyAuth();
      
      // Resetear el estado después de un momento
      setTimeout(() => {
        setIsStartingSpotifyAuth(false);
      }, 2000);
    }
  };

  return (
    <div className="min-h-full bg-gradient-to-br from-fuchsia-500 via-pink-400 to-fuchsia-600 dark:from-gray-900 dark:to-gray-800">
      <div className="flex flex-col items-center justify-center min-h-[calc(100vh-80px)] px-4 py-8">
        <div className="w-full max-w-sm mx-auto space-y-6">
          <div className="text-center">
            <div className="mx-auto mb-4 h-24 w-24 sm:h-28 sm:w-28 rounded-full bg-gradient-to-br from-fuchsia-100 to-pink-100 dark:from-fuchsia-800 dark:to-pink-800 flex items-center justify-center text-fuchsia-500 dark:text-fuchsia-300">
              <UserCircle2 size={56} strokeWidth={1.5} className="sm:w-16 sm:h-16" />
            </div>
            <h2 className="text-xl sm:text-2xl font-semibold text-gray-800 dark:text-gray-200 mb-2">
              {user?.displayName || user?.email || 'Usuario'}
            </h2>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Gestiona tu perfil y conecta tus servicios.
            </p>
          </div>

          <div className="space-y-4 w-full">
            <GradientButton onClick={() => navigate('/profile/edit')}>
              <Settings className="w-5 h-5 mr-2" />
              Configurar Perfil
            </GradientButton>
            
            {isStartingSpotifyAuth && (
              <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4 text-center">
                <div className="flex items-center justify-center mb-2">
                  <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600 mr-2"></div>
                  <span className="text-blue-700 dark:text-blue-300 font-medium">
                    Abriendo ventana de Spotify...
                  </span>
                </div>
                <p className="text-sm text-blue-600 dark:text-blue-400">
                  Revisa la consola para ver los logs del proceso
                </p>
              </div>
            )}
            
            {spotifyLinked ? (
              <div className="space-y-3">
                <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg p-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <Music className="w-5 h-5 text-green-600 mr-2" />
                      <div>
                        <p className="text-sm font-medium text-green-800 dark:text-green-200">
                          Spotify Conectado
                        </p>
                        <p className="text-xs text-green-600 dark:text-green-400">
                          {spotifyProfile?.displayName || 'Usuario'}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
                <OutlineButton onClick={handleSpotifyAction}>
                  <Unlink className="w-5 h-5 mr-2" />
                  Desvincular Spotify
                </OutlineButton>
              </div>
            ) : (
              <OutlineButton 
                onClick={handleSpotifyAction}
                disabled={isStartingSpotifyAuth}
              >
                {isStartingSpotifyAuth ? (
                  <>
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-current mr-2"></div>
                    Abriendo ventana...
                  </>
                ) : (
                  <>
                    <LinkIcon className="w-5 h-5 mr-2" />
                    Vincular con Spotify
                  </>
                )}
              </OutlineButton>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserHomeScreen;
