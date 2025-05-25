import { API_URL } from '../config/config';

export async function login(email: string, password: string) {
  const response = await fetch(`${API_URL}/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password }),
  });

  if (!response.ok) {
    let errorMessage = 'Error al iniciar sesión.';
    try {
      const error = await response.json();
      errorMessage = error.message || errorMessage;
    } catch (e) {
      console.error('Failed to parse error response as JSON:', e);
    }
    throw new Error(errorMessage);
  }

  return response.json(); // { token, user, ... }
}

export async function register(email: string, password: string) {
  const response = await fetch(`${API_URL}/register`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password }),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || 'Error al registrarse.');
  }

  return response.json(); // { token, user, ... }
}
