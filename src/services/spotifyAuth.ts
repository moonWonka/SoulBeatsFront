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

  const params = new URLSearchParams({
    client_id: clientId,
    response_type: 'code',
    redirect_uri: redirectUri,
    scope: scopes,
    state: crypto.randomUUID()
  });

  const authUrl = `https://accounts.spotify.com/authorize?${params.toString()}`;
  window.location.href = authUrl;
};

export const extractSpotifyCodeFromUrl = (): { code: string | null; error: string | null; state: string | null } => {
  const urlParams = new URLSearchParams(window.location.search);
  
  return {
    code: urlParams.get('code'),
    error: urlParams.get('error'),
    state: urlParams.get('state')
  };
};