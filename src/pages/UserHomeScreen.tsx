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

  const handleSpotifyAction = async () => {
    if (spotifyLinked) {
      try {
        if (!user) return;
        const token = await user.getIdToken();
        await unlinkSpotifyAccount(token);
        await refreshSpotifyStatus();
      } catch (error) {
        console.error('Error unlinking Spotify:', error);
      }
    } else {
      initiateSpotifyAuth();
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
              <OutlineButton onClick={handleSpotifyAction}>
                <LinkIcon className="w-5 h-5 mr-2" />
                Vincular con Spotify
              </OutlineButton>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserHomeScreen;
