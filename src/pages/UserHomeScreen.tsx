import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { GradientButton } from '../components/shared/GradientButton';
import { OutlineButton } from '../components/shared/OutlineButton';
import { UserCircle2, Link as LinkIcon, Music } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { initiateSpotifyAuth } from '../services/spotifyAuth';
import { unlinkSpotifyAccount, getSpotifyPlaylists } from '../services/spotifyBackendService';
import { useSpotifyAuthLoading } from '../hooks/useSpotifyAuth';
import { PlaylistCarousel } from '../components/shared/PlaylistCarousel';
import { MenuDropdown } from '../components/shared/MenuDropdown';
import { SpotifyPlaylistModel } from '../types';

const UserHomeScreen: React.FC = () => {
  const { user, spotifyLinked, spotifyProfile, refreshSpotifyStatus } = useAuth();
  const navigate = useNavigate();
  const [isUnlinkLoading, setIsUnlinkLoading] = useState(false);
  const { isSpotifyAuthLoading, setSpotifyAuthLoading, clearSpotifyAuthLoading } = useSpotifyAuthLoading();
  
  // Playlist state
  const [playlists, setPlaylists] = useState<SpotifyPlaylistModel[]>([]);
  const [playlistsLoading, setPlaylistsLoading] = useState(false);
  const [playlistsError, setPlaylistsError] = useState<string | null>(null);

  // Load playlists when Spotify is connected
  const loadPlaylists = async () => {
    if (!user || !spotifyLinked) return;

    setPlaylistsLoading(true);
    setPlaylistsError(null);
    
    try {
      const token = await user.getIdToken();
      const response = await getSpotifyPlaylists(token, 12); // Load 12 playlists
      setPlaylists(response.playlists || []);
    } catch (error) {
      console.error('Error loading playlists:', error);
      setPlaylistsError('No se pudieron cargar las playlists');
    } finally {
      setPlaylistsLoading(false);
    }
  };

  // Load playlists when component mounts and user is connected
  useEffect(() => {
    if (spotifyLinked && user) {
      loadPlaylists();
    }
  }, [spotifyLinked, user]);

  const handleSpotifyAction = async () => {
    if (spotifyLinked) {
      // This case is now handled by MenuDropdown
      return;
    } else {
      // Solo iniciar auth si realmente no estamos vinculados
      if (spotifyLinked) {
        console.warn('Intento de vincular Spotify cuando ya está vinculado');
        return;
      }
      
      try {
        setSpotifyAuthLoading(true);
        initiateSpotifyAuth(false); // No forzar diálogo - usar permisos existentes
      } catch (error) {
        console.error('Error initiating Spotify auth:', error);
        clearSpotifyAuthLoading();
      }
    }
  };

  const handleUnlinkSpotify = async () => {
    try {
      setIsUnlinkLoading(true);
      if (!user) return;
      const token = await user.getIdToken();
      await unlinkSpotifyAccount(token);
      await refreshSpotifyStatus();
      setPlaylists([]); // Clear playlists
    } catch (error) {
      console.error('Error unlinking Spotify:', error);
    } finally {
      setIsUnlinkLoading(false);
    }
  };


  if (!spotifyLinked) {
    // Show original layout for non-connected users
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
                Conecta con Spotify para descubrir tu música.
              </p>
            </div>

            <div className="space-y-4 w-full">
              <GradientButton onClick={() => navigate('/profile/edit')}>
                Configurar Perfil
              </GradientButton>
              
              <OutlineButton onClick={handleSpotifyAction} disabled={isSpotifyAuthLoading}>
                {isSpotifyAuthLoading ? (
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-current mr-2" />
                ) : (
                  <LinkIcon className="w-5 h-5 mr-2" />
                )}
                {isSpotifyAuthLoading ? 'Conectando con Spotify...' : 'Vincular con Spotify'}
              </OutlineButton>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // New layout for connected users
  return (
    <div className="min-h-full bg-gradient-to-br from-fuchsia-500 via-pink-400 to-fuchsia-600 dark:from-gray-900 dark:to-gray-800">
      {/* Header with user info and menu */}
      <div className="bg-white/10 backdrop-blur-sm border-b border-white/20">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            {/* Left side - App title or logo */}
            <div>
              <h1 className="text-2xl font-bold text-white">SoulBeats</h1>
            </div>

            {/* Right side - User info and menu */}
            <div className="flex items-center space-x-4">
              {/* User Avatar and Name */}
              <div className="flex items-center space-x-3">
                <div className="hidden sm:block text-right">
                  <p className="text-white font-medium">
                    {user?.displayName || user?.email || 'Usuario'}
                  </p>
                  <p className="text-white/70 text-sm">
                    {spotifyProfile?.displayName || 'Conectado a Spotify'}
                  </p>
                </div>
                <div className="h-10 w-10 rounded-full bg-white/20 flex items-center justify-center">
                  <UserCircle2 className="w-6 h-6 text-white" />
                </div>
              </div>

              {/* Menu Dropdown */}
              <MenuDropdown
                onConfigureProfile={() => navigate('/profile/edit')}
                onUnlinkSpotify={handleUnlinkSpotify}
                isUnlinkLoading={isUnlinkLoading}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Welcome Section */}
        <div className="text-center mb-8">
          <h2 className="text-3xl sm:text-4xl font-bold text-white mb-2">
            ¡Bienvenido de vuelta!
          </h2>
          <p className="text-white/80 text-lg">
            Descubre tus playlists de Spotify
          </p>
        </div>

        {/* Playlists Section */}
        <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-2xl font-semibold text-white flex items-center">
              <Music className="w-6 h-6 mr-2" />
              Tus Playlists
            </h3>
            {playlists.length > 0 && (
              <button
                onClick={loadPlaylists}
                disabled={playlistsLoading}
                className="text-white/80 hover:text-white text-sm font-medium transition-colors"
              >
                {playlistsLoading ? 'Actualizando...' : 'Actualizar'}
              </button>
            )}
          </div>

          {/* Playlist Carousel */}
          {playlistsError ? (
            <div className="text-center py-8">
              <p className="text-white/80 mb-4">{playlistsError}</p>
              <button
                onClick={loadPlaylists}
                className="px-4 py-2 bg-white/20 hover:bg-white/30 text-white rounded-lg transition-colors"
              >
                Reintentar
              </button>
            </div>
          ) : (
            <PlaylistCarousel playlists={playlists} loading={playlistsLoading} />
          )}
        </div>
      </div>
    </div>
  );
};

export default UserHomeScreen;
