import { Login } from '../components/login/Login';
import { useTheme } from '../context/ThemeContext';
import { Moon, Sun } from 'lucide-react';

export function LoginPage() {
  const { darkMode, toggleDarkMode } = useTheme();

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-fuchsia-500 via-pink-400 to-fuchsia-600 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      <header className="flex-shrink-0 text-white py-4 shadow-lg" 
        style={{
          background: 'linear-gradient(to right, var(--color-primary-from), var(--color-primary-to))'
        }}>
        <div className="max-w-6xl mx-auto px-4 flex justify-between items-center">
          <h1 className="text-2xl font-bold">
            Bienvenido a SoulBeats
          </h1>
          <button
            onClick={toggleDarkMode}
            className="p-2 bg-white/10 hover:bg-white/20 text-white border border-white/30 hover:border-white/50 rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-white/20"
            aria-label={`Cambiar a modo ${darkMode ? 'claro' : 'oscuro'}`}
            title={`Cambiar a modo ${darkMode ? 'claro' : 'oscuro'}`}
          >
            {darkMode ? <Sun size={18} /> : <Moon size={18} />}
          </button>
        </div>
      </header>
      <main className="flex-grow flex items-center justify-center">
        <Login />
      </main>
      <footer className="flex-shrink-0 text-white py-4 text-center text-sm"
        style={{
          background: 'linear-gradient(to right, var(--color-primary-from), var(--color-primary-to))'
        }}>
        &copy; {new Date().getFullYear()} SoulBeats. Todos los derechos reservados.
      </footer>
    </div>
  );
}

export default LoginPage;