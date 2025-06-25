import React from 'react';
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Link,
  Navigate,
} from 'react-router-dom';
import { HomePage } from '../pages/HomePage';
import { AboutPage } from '../pages/AboutPage';
import { LoginPage } from '../pages/LoginPage';
import { SwipePage } from '../pages/SwipePage';
import ProtectedRoute from './ProtectedRoute';
import { useAuth } from '../context/AuthContext';

const AppRouter: React.FC = () => {
  const { user } = useAuth();

  return (
    <Router>
      <div className="App min-h-screen flex flex-col">
        {/* Navbar visible sólo si el usuario está autenticado */}
        {user && (
          <nav className="flex-shrink-0 bg-gray-800 text-white py-4">
            <ul className="flex justify-center space-x-4">
              <li>
                <Link to="/" className="hover:text-rose-500">
                  Home
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
            </ul>
          </nav>
        )}

        {/* Main Routes */}
        <div className="flex-grow">
          {!user ? (
            <Routes>
              <Route path="/login" element={<LoginPage />} />
              <Route path="*" element={<Navigate to="/login" />} />
            </Routes>
          ) : (
            <Routes>
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
              <Route path="*" element={<Navigate to="/" />} />
            </Routes>
          )}
        </div>
      </div>
    </Router>
  );
};

export default AppRouter;
