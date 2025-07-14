export const initiateSpotifyAuth = (): void => {
  const clientId = import.meta.env.VITE_SPOTIFY_CLIENT_ID;
  const redirectUri = import.meta.env.VITE_SPOTIFY_REDIRECT_URI;
  
  if (!clientId || !redirectUri) {
    console.error('Spotify configuration missing. Please check environment variables.');
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
  
  // Store state for validation later
  localStorage.setItem('spotify_auth_state', state);
  
  // Use redirect instead of popup for better compatibility
  window.location.href = authUrl;
};

export const extractSpotifyCodeFromUrl = (): { code: string | null; error: string | null; state: string | null } => {
  const urlParams = new URLSearchParams(window.location.search);
  
  const result = {
    code: urlParams.get('code'),
    error: urlParams.get('error'),
    state: urlParams.get('state')
  };
  
  // Validate state if present
  if (result.state) {
    const storedState = localStorage.getItem('spotify_auth_state');
    
    if (storedState && result.state !== storedState) {
      console.warn('⚠️ State mismatch - possible CSRF attack');
      result.error = 'State mismatch - possible CSRF attack';
    }
  }
  
  return result;
};

export const clearStoredLogs = (): void => {
  localStorage.removeItem('spotify_auth_state');
};