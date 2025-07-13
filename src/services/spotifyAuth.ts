const logToStorage = (message: string) => {
  const timestamp = new Date().toISOString();
  const logEntry = `[${timestamp}] ${message}`;
  
  // Obtener logs existentes
  const existingLogs = localStorage.getItem('spotify_auth_logs') || '';
  const newLogs = existingLogs + logEntry + '\n';
  
  // Guardar en localStorage
  localStorage.setItem('spotify_auth_logs', newLogs);
  
  // También mostrar en consola
  console.log(message);
};

export const showStoredLogs = () => {
  const logs = localStorage.getItem('spotify_auth_logs');
  if (logs) {
    console.log('📋 ===== STORED SPOTIFY AUTH LOGS =====');
    console.log(logs);
    console.log('📋 ===== END STORED LOGS =====');
  }
};

export const clearStoredLogs = () => {
  localStorage.removeItem('spotify_auth_logs');
  console.log('🗑️ Spotify auth logs cleared');
};

export const initiateSpotifyAuth = (): void => {
  // Limpiar logs previos
  localStorage.removeItem('spotify_auth_logs');
  
  logToStorage('🎵 Starting Spotify authentication');
  
  const clientId = import.meta.env.VITE_SPOTIFY_CLIENT_ID;
  const redirectUri = import.meta.env.VITE_SPOTIFY_REDIRECT_URI;
  
  logToStorage(`🎵 Client ID: ${clientId ? 'Present' : 'Missing'}`);
  logToStorage(`🎵 Redirect URI: ${redirectUri}`);
  
  if (!clientId || !redirectUri) {
    logToStorage('❌ Spotify configuration missing');
    throw new Error('Spotify configuration incomplete');
  }

  const scopes = [
    'user-read-private',
    'user-read-email',
    'playlist-read-private',
    'playlist-read-collaborative',
    'user-top-read',
    'user-library-read'
  ].join(' ');

  const state = crypto.randomUUID();
  const params = new URLSearchParams({
    client_id: clientId,
    response_type: 'code',
    redirect_uri: redirectUri,
    scope: scopes,
    state: state,
    show_dialog: 'true'
  });

  const authUrl = `https://accounts.spotify.com/authorize?${params.toString()}`;
  logToStorage(`🎵 Opening Spotify authorization window`);
  
  // Abrir ventana de Spotify en lugar de hacer redirect
  const spotifyWindow = window.open(authUrl, 'spotify-auth', 'width=600,height=700,scrollbars=yes,resizable=yes');
  
  if (spotifyWindow) {
    logToStorage('✅ Spotify window opened successfully');
  } else {
    logToStorage('❌ Failed to open Spotify window - popup blocked?');
  }
};

export const extractSpotifyCodeFromUrl = (): { code: string | null; error: string | null; state: string | null } => {
  const urlParams = new URLSearchParams(window.location.search);
  
  return {
    code: urlParams.get('code'),
    error: urlParams.get('error'),
    state: urlParams.get('state')
  };
};