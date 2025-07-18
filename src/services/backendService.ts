// Obtiene la URL base desde las variables de entorno de Vite
const BASE_API_URL = import.meta.env.VITE_BACKEND_URL;

/**
 * Obtiene la información del usuario desde el backend.
 * @param userId - ID del usuario.
 * @param token - Token de autenticación generado por Firebase.
 * @returns Información del usuario.
 */
export async function getUserInfo(userId: string, token: string): Promise<import('../types').GetUserInfoResponse> {
  try {
    const response = await fetch(`${BASE_API_URL}/User/${userId}/info`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || 'Error al obtener la información del usuario');
    }

    return await response.json();
  } catch (error) {
    throw error;
  }
}

/**
 * Registra un nuevo usuario en el backend.
 * @param email - Correo electrónico del usuario.
 * @param password - Contraseña del usuario.
 * @returns Respuesta del backend.
 */
export async function register(email: string, password: string): Promise<any> {
  try {
    const response = await fetch(`${BASE_API_URL}/auth/register`, {
      method: 'POST',
      headers: { 
        'Content-Type': 'application/json',
        'accept': 'application/json'
      },
      body: JSON.stringify({ userEmail: email, password }),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Error al registrarse.');
    }

    return await response.json(); // { token, user, ... }
  } catch (error) {
    throw error;
  }
}

/**
 * Registra o actualiza un usuario autenticado con Google en el backend.
 * @param token - Token de autenticación generado por Firebase.
 * @param userData - Datos del usuario de Google (email, name, photoURL, etc.).
 * @returns Respuesta del backend.
 */
export async function registerGoogleUser(token: string, userData: {
  email: string;
  displayName?: string;
  photoURL?: string;
  uid: string;
}): Promise<any> {
  try {
    const response = await fetch(`${BASE_API_URL}/auth/google`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
        'accept': 'application/json'
      },
      body: JSON.stringify({
        userEmail: userData.email,
        displayName: userData.displayName,
        photoURL: userData.photoURL,
        firebaseUid: userData.uid
      }),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Error al registrar usuario con Google.');
    }

    return await response.json();
  } catch (error) {
    throw error;
  }
}

/**
 * Obtiene la lista de géneros musicales disponibles.
 * @param token - Token de autenticación generado por Firebase.
 * @returns Lista de géneros musicales.
 */
export async function getGenres(token: string): Promise<import('../types').GetGenresResponse> {
  try {
    const response = await fetch(`${BASE_API_URL}/music/genres`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || 'Error al obtener géneros musicales');
    }

    return await response.json();
  } catch (error) {
    throw error;
  }
}

/**
 * Obtiene los artistas de un género específico.
 * @param genreId - ID del género musical.
 * @param token - Token de autenticación generado por Firebase.
 * @returns Lista de artistas del género.
 */
export async function getArtistsByGenre(genreId: number, token: string): Promise<import('../types').GetArtistsByGenreResponse> {
  try {
    const response = await fetch(`${BASE_API_URL}/music/genres/${genreId}/artists`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || 'Error al obtener artistas del género');
    }

    return await response.json();
  } catch (error) {
    throw error;
  }
}

/**
 * Obtiene las preferencias musicales del usuario.
 * @param token - Token de autenticación generado por Firebase.
 * @returns Preferencias musicales del usuario.
 */
export async function getUserPreferences(token: string): Promise<import('../types').GetUserPreferencesResponse> {
  try {
    const response = await fetch(`${BASE_API_URL}/music/preferences`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || 'Error al obtener preferencias del usuario');
    }

    return await response.json();
  } catch (error) {
    throw error;
  }
}

/**
 * Actualiza las preferencias de géneros del usuario.
 * @param firebaseUid - UID del usuario en Firebase.
 * @param preferences - Array de preferencias de géneros con nivel 1-5.
 * @param token - Token de autenticación generado por Firebase.
 * @returns Respuesta del backend.
 */
export async function updateGenrePreferences(
  firebaseUid: string,
  preferences: import('../types').GenrePreferenceDto[],
  token: string
): Promise<import('../types').UpdatePreferencesResponse> {
  try {
    const response = await fetch(`${BASE_API_URL}/music/preferences/genres`, {
      method: 'PUT',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        firebaseUid,
        preferences
      }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || 'Error al actualizar preferencias de géneros');
    }

    return await response.json();
  } catch (error) {
    throw error;
  }
}

/**
 * Actualiza las preferencias de artistas del usuario.
 * @param firebaseUid - UID del usuario en Firebase.
 * @param preferences - Array de preferencias de artistas con nivel 1-5.
 * @param token - Token de autenticación generado por Firebase.
 * @returns Respuesta del backend.
 */
export async function updateArtistPreferences(
  firebaseUid: string,
  preferences: import('../types').ArtistPreferenceDto[],
  token: string
): Promise<import('../types').UpdatePreferencesResponse> {
  try {
    const response = await fetch(`${BASE_API_URL}/music/preferences/artists`, {
      method: 'PUT',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        firebaseUid,
        preferences
      }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || 'Error al actualizar preferencias de artistas');
    }

    return await response.json();
  } catch (error) {
    throw error;
  }
}

/**
 * Actualiza la información del usuario en el backend.
 * @param userId - ID del usuario.
 * @param token - Token de autenticación generado por Firebase.
 * @param profileData - Datos del perfil a actualizar según especificación OpenAPI.
 * @returns Respuesta del backend.
 */
export async function updateUserInfo(
  userId: string,
  token: string,
  profileData: import('../types').UpdateUserProfileRequest
): Promise<import('../types').UpdateUserProfileResponse> {
  try {
    // Ensure userId is included in the request body as per API spec
    const requestBody: import('../types').UpdateUserProfileRequest = {
      userId,
      ...profileData
    };

    const response = await fetch(`${BASE_API_URL}/User/${userId}/profile`, {
      method: 'PUT',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(requestBody),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || 'Error al actualizar el perfil');
    }

    return await response.json();
  } catch (error) {
    throw error;
  }
}