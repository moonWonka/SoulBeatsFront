// Obtiene la URL base desde las variables de entorno de Vite
const BASE_API_URL = import.meta.env.VITE_BACKEND_URL;


/**
 * Vincula la cuenta de Spotify del usuario usando el endpoint correcto de la API.
 * @param token - Token de autenticación generado por Firebase.
 * @param spotifyAuthCode - Código de autorización de Spotify.
 * @param state - Estado de la autorización para validación.
 * @param firebaseUid - UID del usuario en Firebase.
 * @returns Respuesta del backend.
 */
export async function linkSpotifyAccount(
  token: string, 
  spotifyAuthCode: string,
  state?: string,
  firebaseUid?: string
): Promise<import('../types').PostSpotifyTokenExchangeResponse> {
  try {
    const requestBody: import('../types').PostSpotifyTokenExchangeRequest = {
      code: spotifyAuthCode,
      state: state,
      redirectUri: import.meta.env.VITE_SPOTIFY_REDIRECT_URI,
      firebaseUid: firebaseUid
    };


    const response = await fetch(`${BASE_API_URL}/Spotify/token-exchange`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(requestBody),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.userFriendly || errorData.description || 'Error al vincular cuenta de Spotify');
    }

    return await response.json();
  } catch (error) {
    throw error;
  }
}

/**
 * Obtiene el estado de vinculación con Spotify del usuario.
 * @param token - Token de autenticación generado por Firebase.
 * @returns Estado de vinculación y perfil de Spotify.
 */
export async function getSpotifyStatus(token: string): Promise<import('../types').GetSpotifyStatusResponse> {
  try {
    const response = await fetch(`${BASE_API_URL}/Spotify/status`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.userFriendly || errorData.description || 'Error al obtener estado de Spotify');
    }

    return await response.json();
  } catch (error) {
    throw error;
  }
}

/**
 * Desvincula la cuenta de Spotify del usuario usando el endpoint correcto de la API.
 * @param token - Token de autenticación generado por Firebase.
 * @returns Respuesta del backend.
 */
export async function unlinkSpotifyAccount(token: string): Promise<void> {
  try {
    const response = await fetch(`${BASE_API_URL}/Spotify/disconnect`, {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.userFriendly || errorData.description || 'Error al desvincular cuenta de Spotify');
    }

    // API returns 200 OK with no content according to spec
  } catch (error) {
    throw error;
  }
}

/**
 * Obtiene las playlists de Spotify del usuario.
 * @param token - Token de autenticación generado por Firebase.
 * @param limit - Número máximo de playlists a obtener (default: 20).
 * @param offset - Offset para paginación (default: 0).
 * @returns Lista de playlists del usuario.
 */
export async function getSpotifyPlaylists(
  token: string,
  limit: number = 20,
  offset: number = 0
): Promise<import('../types').GetSpotifyPlaylistsResponse> {
  try {
    const params = new URLSearchParams({
      limit: limit.toString(),
      offset: offset.toString()
    });

    const response = await fetch(`${BASE_API_URL}/Spotify/playlists?${params}`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.userFriendly || errorData.description || 'Error al obtener playlists de Spotify');
    }

    return await response.json();
  } catch (error) {
    throw error;
  }
}