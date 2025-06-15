import React, { useState } from 'react';
import HeartIcon from '../icons/HeartIcon';
import { GradientButton } from '../shared/GradientButton';
import { OutlineButton } from '../shared/OutlineButton';
import { Eye, EyeOff } from 'lucide-react'; // Íconos para mostrar/ocultar
import { register } from '../../services/backendService'; // Importa el servicio de registro
import { GoogleAuthProvider, signInWithPopup } from 'firebase/auth';
import { auth } from '../../firebaseConfig';
import { useAuth } from '../../context/AuthContext';

export function Login() {
  const { login, user } = useAuth(); // Usa el contexto para manejar el estado del usuario
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [isRegistering, setIsRegistering] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError('');

    if (!email.trim() || !password.trim()) {
      setError('Por favor, ingresa tu correo electrónico y contraseña.');
      return;
    }

    if (password.length < 6) {
      setError('La contraseña debe tener al menos 6 caracteres.');
      return;
    }

    if (isRegistering) {
      if (password !== confirmPassword) {
        setError('Las contraseñas no coinciden.');
        return;
      }

      try {
        const response = await register(email, password);
        console.log('Usuario registrado:', response);
      } catch (err: unknown) {
        if (err instanceof Error) {
          setError(err.message || 'Error al registrarse.');
        } else {
          setError('Error al registrarse.');
        }
      }
    } else {
      try {
        await login(email, password); // Usa el método `login` del contexto
      } catch (err: unknown) {
        if (err instanceof Error) {
          setError(`Error al iniciar sesión: ${err.message}`);
        } else {
          setError('Ocurrió un error desconocido.');
        }
      }
    }
  };

  const handleGoogleAuth = async () => {
    try {
      const provider = new GoogleAuthProvider();
      const result = await signInWithPopup(auth, provider);
      const token = await result.user.getIdToken();
      console.log('Usuario autenticado con Google:', result.user);
    } catch (err: unknown) {
      if (err instanceof Error) {
        setError(`Error con Google: ${err.message}`);
      } else {
        setError('Error desconocido al iniciar sesión con Google.');
      }
    }
  };

  return (
    <div className="w-full min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-rose-100 to-teal-100 p-4">
      <div className="w-full max-w-md">
        <div className="bg-white shadow-2xl rounded-xl p-8 md:p-12">
          <div className="flex flex-col items-center mb-8">
            <HeartIcon className="w-12 h-12 text-rose-500 mb-3" />
            <h1 className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-rose-500 to-pink-600">
              {isRegistering ? 'Crea una cuenta' : 'Explora y Conecta'}
            </h1>
            <p className="text-600 mt-1">
              {isRegistering ? '¡Únete a nosotros hoy!' : '¡Bienvenido de nuevo!'}
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                Correo electrónico
              </label>
              <input
                id="email"
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="appearance-none block w-full px-4 py-3 border border-gray-300 rounded-lg shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-rose-500 focus:border-rose-500 sm:text-sm transition-colors"
                placeholder="tucorreo@ejemplo.com"
              />
            </div>

            <div className="relative">
              <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
                Contraseña
              </label>
              <input
                id="password"
                type={showPassword ? 'text' : 'password'}
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="appearance-none block w-full px-4 py-3 border border-gray-300 rounded-lg shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-rose-500 focus:border-rose-500 sm:text-sm transition-colors pr-10"
                placeholder="••••••••"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute inset-y-10 right-3 text-gray-500 hover:text-rose-500"
                aria-label="Mostrar u ocultar contraseña"
                title={showPassword ? 'Ocultar contraseña' : 'Mostrar contraseña'}
              >
                {showPassword ? <EyeOff size={22} /> : <Eye size={22} />}
              </button>
            </div>

            {isRegistering && (
              <div className="relative">
                <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 mb-1">
                  Repite tu contraseña
                </label>
                <input
                  id="confirmPassword"
                  type={showConfirmPassword ? 'text' : 'password'}
                  required
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="appearance-none block w-full px-4 py-3 border border-gray-300 rounded-lg shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-rose-500 focus:border-rose-500 sm:text-sm transition-colors pr-10"
                  placeholder="••••••••"
                  onPaste={(e) => e.preventDefault()}
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute inset-y-10 right-3 flex text-gray-500 hover:text-rose-500"
                  aria-label="Mostrar u ocultar confirmación"
                  title={showConfirmPassword ? 'Ocultar contraseña' : 'Mostrar contraseña'}
                >
                  {showConfirmPassword ? <EyeOff size={22} /> : <Eye size={22} />}
                </button>
              </div>
            )}

            {error && (
              <p className="text-sm text-red-600 bg-red-100 p-2 rounded-md text-center">
                {error}
              </p>
            )}

            <div className="space-y-4">
              <GradientButton type="submit">
                {isRegistering ? 'Registrarse' : 'Iniciar Sesión'}
              </GradientButton>
              <OutlineButton onClick={handleGoogleAuth}>
                {isRegistering ? 'Registrarse con Google' : 'Iniciar Sesión con Google'}
              </OutlineButton>
            </div>
          </form>

          <div className="mt-8 text-center">
            <p className="text-sm text-gray-600">
              {isRegistering ? '¿Ya tienes una cuenta?' : '¿No tienes una cuenta?'}{' '}
              <button
                type="button"
                onClick={() => setIsRegistering(!isRegistering)}
                className="font-medium text-rose-600 hover:text-rose-500"
              >
                {isRegistering ? 'Inicia Sesión' : 'Regístrate'}
              </button>
            </p>
          </div>
        </div>
      </div>
      <footer className="text-center mt-8 text-gray-600 text-sm">
        <p>&copy; {new Date().getFullYear()} SoulBeats</p>
      </footer>
    </div>
  );
}

export default Login;
