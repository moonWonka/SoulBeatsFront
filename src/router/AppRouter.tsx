import React from 'react';
import { Moon, Sun } from 'lucide-react';
import {
  BrowserRouter as Router,
  Routes,
  Route,
  NavLink,
  Navigate,
} from 'react-router-dom';
import { AboutPage } from '../pages/AboutPage';
import { LoginPage } from '../pages/LoginPage';
import { SwipePage } from '../pages/SwipePage';
import UserHomeScreen from '../pages/UserHomeScreen';
import ExampleRevisionPage from '../pages/ExampleRevisionPage';
import ProtectedRoute from './ProtectedRoute';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';

const AppRouter: React.FC = () => {
  const { user, loading, logout } = useAuth();
  const { darkMode, toggleDarkMode } = useTheme();

  // Mostrar loading mientras se verifica el estado de autenticación
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-fuchsia-50 to-pink-50 dark:from-gray-900 dark:to-gray-800">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-fuchsia-600 mx-auto mb-4"></div>
          <p className="text-gray-600 dark:text-gray-300 text-lg">Cargando...</p>
        </div>
      </div>
    );
  }

  return (
    <Router>
      <div className="App min-h-screen flex flex-col dark:bg-gray-900">
        {user && (
          <nav className="flex-shrink-0 bg-gradient-to-r from-fuchsia-600 to-pink-600 text-white py-3 sm:py-4 shadow-lg">
            <div className="max-w-6xl mx-auto px-3 sm:px-4">
              <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center space-y-3 sm:space-y-0">
                <div className="flex flex-wrap justify-center sm:justify-start gap-2 sm:gap-6">
                  <NavLink
                    to="/dashboard"
                    className={({ isActive }) =>
                      `px-2 sm:px-3 py-1.5 sm:py-2 rounded-lg font-medium transition-colors duration-200 text-sm sm:text-base ${
                        isActive
                          ? 'bg-white/20 text-white shadow-lg'
                          : 'text-white/80 hover:text-white hover:bg-white/10'
                      }`
                    }
                  >
                    Inicio
                  </NavLink>
                  <NavLink
                    to="/swipe"
                    className={({ isActive }) =>
                      `px-2 sm:px-3 py-1.5 sm:py-2 rounded-lg font-medium transition-colors duration-200 text-sm sm:text-base ${
                        isActive
                          ? 'bg-white/20 text-white shadow-lg'
                          : 'text-white/80 hover:text-white hover:bg-white/10'
                      }`
                    }
                  >
                    Descubrir
                  </NavLink>
                  <NavLink
                    to="/about"
                    className={({ isActive }) =>
                      `px-2 sm:px-3 py-1.5 sm:py-2 rounded-lg font-medium transition-colors duration-200 text-sm sm:text-base ${
                        isActive
                          ? 'bg-white/20 text-white shadow-lg'
                          : 'text-white/80 hover:text-white hover:bg-white/10'
                      }`
                    }
                  >
                    Acerca de
                  </NavLink>
                  <NavLink
                    to="/revision"
                    className={({ isActive }) =>
                      `px-2 sm:px-3 py-1.5 sm:py-2 rounded-lg font-medium transition-colors duration-200 text-sm sm:text-base ${
                        isActive
                          ? 'bg-white/20 text-white shadow-lg'
                          : 'text-white/80 hover:text-white hover:bg-white/10'
                      }`
                    }
                  >
                    Demo
                  </NavLink>
                </div>
                
                <div className="flex flex-col sm:flex-row items-center justify-center sm:justify-end space-y-2 sm:space-y-0 sm:space-x-4">
                  <span className="text-white/90 text-xs sm:text-sm text-center sm:text-left">
                    Bienvenido, {user.email?.split('@')[0] || user.email}
                  </span>
                  <button
                    onClick={toggleDarkMode}
                    className="p-2 bg-white/10 hover:bg-white/20 text-white border border-white/30 hover:border-white/50 rounded-lg transition-colors"
                    aria-label="Toggle dark mode"
                  >
                    {darkMode ? <Sun size={18} /> : <Moon size={18} />}
                  </button>
                  <button
                    onClick={logout}
                    className="px-3 sm:px-4 py-1.5 sm:py-2 bg-white/10 hover:bg-white/20 text-white border border-white/30 hover:border-white/50 rounded-lg font-medium transition-all duration-200 text-sm sm:text-base"
                  >
                    Cerrar Sesión
                  </button>
                </div>
              </div>
            </div>
          </nav>
        )}

        <div className="flex-grow">
          {!user ? (
            <Routes>
              <Route path="/login" element={<LoginPage />} />
              <Route path="*" element={<Navigate to="/login" />} />
            </Routes>          ) : (
            <Routes>
              <Route 
                path="/dashboard" 
                element={
                  <ProtectedRoute>
                    <UserHomeScreen />
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/about" 
                element={
                  <ProtectedRoute>
                    <AboutPage />
                  </ProtectedRoute>
                } 
              />
              <Route
                path="/swipe"
                element={
                  <ProtectedRoute>
                    <SwipePage />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/revision"
                element={
                  <ProtectedRoute>
                    <ExampleRevisionPage />
                  </ProtectedRoute>
                }
              />
              <Route path="/" element={<Navigate to="/dashboard" replace />} />
              <Route path="*" element={<Navigate to="/dashboard" replace />} />
            </Routes>
          )}
        </div>
      </div>
    </Router>
  );
};

export default AppRouter;
