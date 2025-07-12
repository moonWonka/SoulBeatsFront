// Obtiene la URL base desde las variables de entorno de Vite
const BASE_API_URL = import.meta.env.VITE_BACKEND_URL;

/**
 * Vincula la cuenta de Spotify del usuario.
 * @param token - Token de autenticación generado por Firebase.
 * @param spotifyAuthCode - Código de autorización de Spotify.
 * @returns Respuesta del backend.
 */
export async function linkSpotifyAccount(
  token: string, 
  spotifyAuthCode: string
): Promise<import('../types').SpotifyAuthResponse> {
  try {
    const response = await fetch(`${BASE_API_URL}/auth/spotify/link`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        authorizationCode: spotifyAuthCode,
        redirectUri: import.meta.env.VITE_SPOTIFY_REDIRECT_URI
      }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || 'Error al vincular cuenta de Spotify');
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
export async function getSpotifyStatus(token: string): Promise<import('../types').SpotifyStatusResponse> {
  try {
    const response = await fetch(`${BASE_API_URL}/auth/spotify/status`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || 'Error al obtener estado de Spotify');
    }

    return await response.json();
  } catch (error) {
    throw error;
  }
}

/**
 * Desvincula la cuenta de Spotify del usuario.
 * @param token - Token de autenticación generado por Firebase.
 * @returns Respuesta del backend.
 */
export async function unlinkSpotifyAccount(token: string): Promise<import('../types').BaseResponse> {
  try {
    const response = await fetch(`${BASE_API_URL}/auth/spotify/unlink`, {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || 'Error al desvincular cuenta de Spotify');
    }

    return await response.json();
  } catch (error) {
    throw error;
  }
}