// Obtiene la URL base desde las variables de entorno de Vite
const BASE_API_URL = import.meta.env.VITE_BACKEND_URL;

/**
 * Obtiene la información del usuario desde el backend.
 * @param userId - ID del usuario.
 * @param token - Token de autenticación generado por Firebase.
 * @returns Información del usuario.
 */
export async function getUserInfo(userId: string, token: string): Promise<any> {
  try {
    const response = await fetch(`${BASE_API_URL}/user/${userId}/info`, {
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