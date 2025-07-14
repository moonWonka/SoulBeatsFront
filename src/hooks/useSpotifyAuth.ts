import { useState, useEffect } from 'react';

const SPOTIFY_AUTH_LOADING_KEY = 'spotify_auth_loading';

// Flag global para evitar múltiples limpiezas
let hasCheckedOrphanState = false;

export const useSpotifyAuthLoading = () => {
  const [isLoading, setIsLoading] = useState(() => {
    const stored = localStorage.getItem(SPOTIFY_AUTH_LOADING_KEY) === 'true';
    const currentPath = window.location.pathname;
    
    console.log(`🔍 SpotifyAuthLoading: Inicializando - stored: ${stored}, path: ${currentPath}, hasChecked: ${hasCheckedOrphanState}`);
    
    if (stored && !hasCheckedOrphanState) {
      hasCheckedOrphanState = true;
      
      // Si estamos en una página que no es callback y tenemos loading=true, es probable que sea un estado huérfano
      if (!currentPath.includes('/spotify/callback')) {
        console.log('🧹 SpotifyAuthLoading: Limpiando estado huérfano - no estamos en callback');
        localStorage.removeItem(SPOTIFY_AUTH_LOADING_KEY);
        return false;
      }
      console.log('✅ SpotifyAuthLoading: Manteniendo estado loading en página callback');
    }
    return stored;
  });

  const setSpotifyAuthLoading = (loading: boolean) => {
    console.log(`🔄 SpotifyAuthLoading: Cambiando estado a ${loading}`);
    setIsLoading(loading);
    if (loading) {
      localStorage.setItem(SPOTIFY_AUTH_LOADING_KEY, 'true');
    } else {
      localStorage.removeItem(SPOTIFY_AUTH_LOADING_KEY);
    }
  };

  const clearSpotifyAuthLoading = () => {
    setIsLoading(false);
    localStorage.removeItem(SPOTIFY_AUTH_LOADING_KEY);
  };

  useEffect(() => {
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === SPOTIFY_AUTH_LOADING_KEY) {
        setIsLoading(e.newValue === 'true');
      }
    };

    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);

  // Auto-cleanup después de 10 segundos para evitar estados de loading permanentes
  useEffect(() => {
    if (isLoading) {
      const timeout = setTimeout(() => {
        console.warn('Spotify auth loading state auto-cleared after 10 seconds');
        clearSpotifyAuthLoading();
      }, 10000);

      return () => clearTimeout(timeout);
    }
  }, [isLoading]);

  return {
    isSpotifyAuthLoading: isLoading,
    setSpotifyAuthLoading,
    clearSpotifyAuthLoading
  };
};