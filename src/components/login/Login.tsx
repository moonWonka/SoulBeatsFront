import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import HeartIcon from '../icons/HeartIcon';
import { GradientButton } from '../shared/GradientButton';
import { OutlineButton } from '../shared/OutlineButton';
import { Eye, EyeOff } from 'lucide-react'; // Íconos para mostrar/ocultar
import { register, registerGoogleUser } from '../../services/backendService';
import { GoogleAuthProvider, signInWithPopup, signInWithRedirect, getRedirectResult, createUserWithEmailAndPassword } from 'firebase/auth';
import { auth } from '../../firebaseConfig';
import { useAuth } from '../../context/AuthContext';

export function Login() {
  const { login, user } = useAuth(); // Usa el contexto para manejar el estado del usuario
  const navigate = useNavigate();
  const location = useLocation();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [isRegistering, setIsRegistering] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  // Get the intended destination from location state, or default to dashboard
  const from = location.state?.from?.pathname || '/dashboard';

  // Flag para saber si estamos esperando un resultado de redirect
  const [isWaitingForRedirect, setIsWaitingForRedirect] = useState(() => {
    return localStorage.getItem('expecting_google_redirect') === 'true';
  });

  // Función para detectar si el popup puede fallar (casos muy específicos)
  const shouldUseRedirect = () => {
    // Solo usar redirect en casos muy específicos donde popup definitivamente no funciona
    return /OPR\/.*Version\/.*Mobile/i.test(navigator.userAgent) || // Opera Mini móvil
           /(?:FBAN|FBAV)/i.test(navigator.userAgent) || // Facebook in-app browser
           /(?:Instagram|IGAB)/i.test(navigator.userAgent); // Instagram in-app browser
  };

  // Redirect to intended destination if user is already logged in
  useEffect(() => {
    if (user) {
      navigate(from, { replace: true });
    }
  }, [user, navigate, from]);

  // Solo manejar redirect result si estamos esperando uno
  useEffect(() => {
    const handleRedirectResult = async () => {
      // Solo verificar getRedirectResult si tenemos un flag que indica que esperamos uno
      const expectingRedirect = localStorage.getItem('expecting_google_redirect') === 'true';
      
      if (!expectingRedirect) {
        return;
      }

      try {
        console.log('Verificando resultado de redirect de Google...');
        const result = await getRedirectResult(auth);
        
        // Limpiar el flag independientemente del resultado
        localStorage.removeItem('expecting_google_redirect');
        setIsWaitingForRedirect(false);
        
        if (result) {
          console.log('Usuario autenticado con Google (redirect):', result.user);
          
          // Registrar usuario en el backend (duplicado aquí por scope)
          try {
            const token = await result.user.getIdToken();
            const userData = {
              email: result.user.email || '',
              displayName: result.user.displayName || '',
              photoURL: result.user.photoURL || '',
              uid: result.user.uid
            };
            
            console.log('Registrando usuario en backend (redirect):', userData);
            await registerGoogleUser(token, userData);
            console.log('Usuario registrado exitosamente en backend (redirect)');
          } catch (backendError) {
            console.log('Error al registrar en backend (redirect, usuario posiblemente ya existe):', backendError);
          }
          
          navigate(from, { replace: true });
        } else {
          // Si no hay resultado pero esperábamos uno, mostrar error
          setError('No se pudo completar la autenticación. Inténtalo de nuevo.');
        }
      } catch (err: unknown) {
        localStorage.removeItem('expecting_google_redirect');
        setIsWaitingForRedirect(false);
        
        if (err instanceof Error) {
          setError(`Error con Google: ${err.message}`);
        } else {
          setError('Error desconocido al iniciar sesión con Google.');
        }
      }
    };

    handleRedirectResult();
  }, [navigate, from]);

  // Timeout de seguridad para limpiar estado de redirect
  useEffect(() => {
    if (isWaitingForRedirect) {
      const timeout = setTimeout(() => {
        console.warn('Timeout: limpiando estado de redirect después de 60 segundos');
        localStorage.removeItem('expecting_google_redirect');
        setIsWaitingForRedirect(false);
        setError('La autenticación tardó demasiado. Por favor, inténtalo de nuevo.');
      }, 60000); // 60 segundos timeout

      return () => clearTimeout(timeout);
    }
  }, [isWaitingForRedirect]);

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
        // Primero registrar en el backend
        const response = await register(email, password);
        console.log('Usuario registrado en backend:', response);
        
        // Si el backend responde exitosamente, crear cuenta en Firebase
        if (response.statusCode === 200) {
          try {
            // Crear cuenta en Firebase Auth
            const userCredential = await createUserWithEmailAndPassword(auth, email, password);
            console.log('Usuario creado en Firebase:', userCredential.user);
            
            // El contexto AuthContext debería detectar automáticamente el nuevo usuario
            // y redirigir, pero por si acaso, navegamos manualmente
            navigate(from, { replace: true });
          } catch (firebaseError: unknown) {
            // Si falla Firebase pero el backend fue exitoso, intentar hacer login
            console.log('Error en Firebase, intentando login:', firebaseError);
            try {
              await login(email, password);
              navigate(from, { replace: true });
            } catch (loginError: unknown) {
              if (loginError instanceof Error) {
                setError(`Cuenta creada pero error al iniciar sesión: ${loginError.message}`);
              } else {
                setError('Cuenta creada. Por favor, inicia sesión manualmente.');
              }
            }
          }
        } else {
          setError('Error inesperado al registrarse.');
        }
      } catch (err: unknown) {
        if (err instanceof Error) {
          setError(err.message || 'Error al registrarse.');
        } else {
          setError('Error al registrarse.');
        }
      }    } else {      try {
        await login(email, password); // Usa el método `login` del contexto
        navigate(from, { replace: true }); // Redirect to intended destination after successful login
      } catch (err: unknown) {
        if (err instanceof Error) {
          setError(`Error al iniciar sesión: ${err.message}`);
        } else {
          setError('Ocurrió un error desconocido.');
        }
      }
    }
  };  const handleGoogleAuth = async () => {
    setError('');
    
    try {
      const provider = new GoogleAuthProvider();
      
      // Estrategia: Intentar popup primero, fallback a redirect si falla
      if (shouldUseRedirect()) {
        console.log('Usando redirect directamente (navegador in-app detectado)');
        await performRedirectAuth(provider);
        return;
      }

      console.log('Intentando autenticación con popup...');
      
      try {
        // Intentar popup primero
        const result = await signInWithPopup(auth, provider);
        console.log('Popup exitoso, procesando usuario...');
        await processGoogleUser(result.user);
        navigate(from, { replace: true });
        
      } catch (popupError: unknown) {
        console.log('Popup falló, intentando fallback a redirect:', popupError);
        
        // Si el popup falla, usar redirect como fallback
        if (popupError instanceof Error) {
          // Errores comunes que indican que popup no funciona
          if (popupError.message.includes('popup') || 
              popupError.message.includes('blocked') ||
              popupError.message.includes('closed')) {
            
            console.log('Fallback: usando redirect...');
            await performRedirectAuth(provider);
            return;
          }
        }
        
        // Si no es error de popup, re-lanzar el error
        throw popupError;
      }
      
    } catch (err: unknown) {
      if (err instanceof Error) {
        setError(`Error con Google: ${err.message}`);
      } else {
        setError('Error desconocido al iniciar sesión con Google.');
      }
    }
  };

  // Función auxiliar para manejar el registro en backend
  const processGoogleUser = async (user: { getIdToken: () => Promise<string>; email: string | null; displayName: string | null; photoURL: string | null; uid: string }) => {
    try {
      const token = await user.getIdToken();
      const userData = {
        email: user.email || '',
        displayName: user.displayName || '',
        photoURL: user.photoURL || '',
        uid: user.uid
      };
      
      console.log('Registrando usuario en backend:', userData);
      await registerGoogleUser(token, userData);
      console.log('Usuario registrado exitosamente en backend');
    } catch (backendError) {
      console.log('Error al registrar en backend (usuario posiblemente ya existe):', backendError);
      // No bloqueamos el login por errores de backend
    }
  };

  // Función auxiliar para realizar redirect
  const performRedirectAuth = async (provider: GoogleAuthProvider) => {
    localStorage.setItem('expecting_google_redirect', 'true');
    setIsWaitingForRedirect(true);
    console.log('Iniciando redirect a Google...');
    await signInWithRedirect(auth, provider);
  };

  return (
    <div className="w-full min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-fuchsia-50 to-pink-50 dark:from-gray-900 dark:to-gray-800 p-4">
      <div className="w-full max-w-md">
        <div className="bg-white dark:bg-gray-800 shadow-2xl rounded-xl p-8 md:p-12">
          <div className="flex flex-col items-center mb-8">
            <HeartIcon className="w-12 h-12 text-fuchsia-600 dark:text-violet-400 mb-3" />
            <h1 className="text-3xl font-bold text-transparent bg-clip-text" 
                style={{
                  background: 'linear-gradient(to right, var(--color-primary-from), var(--color-primary-to))',
                  WebkitBackgroundClip: 'text',
                  backgroundClip: 'text',
                  WebkitTextFillColor: 'transparent'
                }}>
              {isRegistering ? 'Crea una cuenta' : 'Explora y Conecta'}
            </h1>
            <p className="text-gray-600 dark:text-gray-300 mt-1">
              {isRegistering ? '¡Únete a nosotros hoy!' : '¡Bienvenido de nuevo!'}
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-1">
                Correo electrónico
              </label>
              <input
                id="email"
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="appearance-none block w-full px-4 py-3 border border-gray-300 dark:border-gray-700 rounded-lg shadow-sm placeholder-gray-400 dark:placeholder-gray-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-fuchsia-500 dark:focus:ring-violet-500 focus:border-fuchsia-500 dark:focus:border-violet-500 sm:text-sm transition-colors"
                placeholder="tucorreo@ejemplo.com"
              />
            </div>

            <div className="relative">
              <label htmlFor="password" className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-1">
                Contraseña
              </label>
              <input
                id="password"
                type={showPassword ? 'text' : 'password'}
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="appearance-none block w-full px-4 py-3 border border-gray-300 dark:border-gray-700 rounded-lg shadow-sm placeholder-gray-400 dark:placeholder-gray-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-fuchsia-500 dark:focus:ring-violet-500 focus:border-fuchsia-500 dark:focus:border-violet-500 sm:text-sm transition-colors pr-10"
                placeholder="••••••••"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute inset-y-10 right-3 text-gray-500 dark:text-gray-400 hover:text-fuchsia-600 dark:hover:text-violet-400"
                aria-label="Mostrar u ocultar contraseña"
                title={showPassword ? 'Ocultar contraseña' : 'Mostrar contraseña'}
              >
                {showPassword ? <EyeOff size={22} /> : <Eye size={22} />}
              </button>
            </div>

            {isRegistering && (
              <div className="relative">
                <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-1">
                  Repite tu contraseña
                </label>
                <input
                  id="confirmPassword"
                  type={showConfirmPassword ? 'text' : 'password'}
                  required
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="appearance-none block w-full px-4 py-3 border border-gray-300 dark:border-gray-700 rounded-lg shadow-sm placeholder-gray-400 dark:placeholder-gray-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-fuchsia-500 dark:focus:ring-violet-500 focus:border-fuchsia-500 dark:focus:border-violet-500 sm:text-sm transition-colors pr-10"
                  placeholder="••••••••"
                  onPaste={(e) => e.preventDefault()}
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute inset-y-10 right-3 flex text-gray-500 dark:text-gray-400 hover:text-fuchsia-600 dark:hover:text-violet-400"
                  aria-label="Mostrar u ocultar confirmación"
                  title={showConfirmPassword ? 'Ocultar contraseña' : 'Mostrar contraseña'}
                >
                  {showConfirmPassword ? <EyeOff size={22} /> : <Eye size={22} />}
                </button>
              </div>
            )}

            {error && (
              <p className="text-sm text-red-600 dark:text-red-400 bg-red-100 dark:bg-red-900/30 p-2 rounded-md text-center">
                {error}
              </p>
            )}

            <div className="space-y-4">
              <GradientButton type="submit" disabled={isWaitingForRedirect}>
                {isRegistering ? 'Registrarse' : 'Iniciar Sesión'}
              </GradientButton>
              <OutlineButton onClick={handleGoogleAuth} disabled={isWaitingForRedirect}>
                {isWaitingForRedirect ? (
                  <div className="flex items-center justify-center">
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-current mr-2" />
                    Redirigiendo a Google...
                  </div>
                ) : (
                  isRegistering ? 'Registrarse con Google' : 'Iniciar Sesión con Google'
                )}
              </OutlineButton>
            </div>
          </form>

          <div className="mt-8 text-center">
            <p className="text-sm text-gray-600 dark:text-gray-300">
              {isRegistering ? '¿Ya tienes una cuenta?' : '¿No tienes una cuenta?'}{' '}
              <button
                type="button"
                onClick={() => setIsRegistering(!isRegistering)}
                className="font-medium text-fuchsia-600 dark:text-violet-400 hover:text-fuchsia-500 dark:hover:text-violet-300"
              >
                {isRegistering ? 'Inicia Sesión' : 'Regístrate'}
              </button>
            </p>
          </div>
        </div>
      </div>
      <footer className="text-center mt-8 text-gray-600 dark:text-gray-400 text-sm">
        <p>&copy; {new Date().getFullYear()} SoulBeats</p>
      </footer>
    </div>
  );
}

export default Login;
