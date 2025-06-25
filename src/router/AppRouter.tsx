import React from 'react';
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Link,
  Navigate,
} from 'react-router-dom';
import { HomePage } from '../pages/HomePage'; // La HomePage actual parece ser una landing genérica
import { AboutPage } from '../pages/AboutPage';
import { LoginPage } from '../pages/LoginPage';
import { SwipePage } from '../pages/SwipePage';
import UserHomeScreen from '../pages/UserHomeScreen'; // Importar la nueva pantalla
import ProtectedRoute from './ProtectedRoute';
import { useAuth } from '../context/AuthContext';

const AppRouter: React.FC = () => {
  const { user } = useAuth();

  return (
    <Router>
      <div className="App min-h-screen flex flex-col">
        {user && (
          <nav className="flex-shrink-0 bg-gray-800 text-white py-4">
            <ul className="flex justify-center space-x-4">
              <li>
                {/* Este 'Home' podría llevar a UserHomeScreen ahora o a la HomePage genérica */}
                <Link to="/userhome" className="hover:text-rose-500">
                  My Home
                </Link>
              </li>
              <li>
                <Link to="/about" className="hover:text-rose-500">
                  About
                </Link>
              </li>
              <li>
                <Link to="/swipe" className="hover:text-rose-500">
                  Swipe
                </Link>
              </li>
              {/* Considerar si el HomePage original (landing) sigue teniendo un lugar en el nav una vez logueado */}
              {/* <li>
                <Link to="/" className="hover:text-rose-500">
                  Landing
                </Link>
              </li> */}
            </ul>
          </nav>
        )}

        <div className="flex-grow">
          {!user ? (
            <Routes>
              <Route path="/login" element={<LoginPage />} />
              <Route path="*" element={<Navigate to="/login" />} />
            </Routes>
          ) : (
            <Routes>
              {/* La ruta raíz '/' actualmente lleva a HomePage.
                  Podríamos cambiar esto para que '/' lleve a UserHomeScreen para usuarios logueados,
                  y mover HomePage a otra ruta si aún es necesaria post-login.
                  Por ahora, agregaré /userhome como nueva ruta explícita.
              */}
              <Route path="/" element={<HomePage />} />
              <Route path="/about" element={<AboutPage />} />
              <Route
                path="/swipe"
                element={
                  <ProtectedRoute>
                    <SwipePage />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/userhome" // Nueva ruta para la pantalla de inicio del usuario
                element={
                  <ProtectedRoute>
                    <UserHomeScreen />
                  </ProtectedRoute>
                }
              />
              <Route path="*" element={<Navigate to="/" />} /> {/* O redirigir a /userhome si es la principal post-login */}
            </Routes>
          )}
        </div>
      </div>
    </Router>
  );
};

export default AppRouter;
