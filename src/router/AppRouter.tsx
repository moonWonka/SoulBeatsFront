import React from 'react';
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
import ProtectedRoute from './ProtectedRoute';
import { useAuth } from '../context/AuthContext';

const AppRouter: React.FC = () => {
  const { user, logout } = useAuth();

  return (
    <Router>
      <div className="App min-h-screen flex flex-col">        {user && (
          <nav className="flex-shrink-0 bg-gradient-to-r from-fuchsia-600 to-pink-600 text-white py-4 shadow-lg">
            <div className="max-w-6xl mx-auto px-4">
              <div className="flex justify-between items-center">
                <div className="flex space-x-6">
                  <NavLink
                    to="/dashboard"
                    className={({ isActive }) =>
                      `px-3 py-2 rounded-lg font-medium transition-colors duration-200 ${
                        isActive
                          ? 'bg-white/20 text-white shadow-lg'
                          : 'text-white/80 hover:text-white hover:bg-white/10'
                      }`
                    }
                  >
                    Dashboard
                  </NavLink>
                  <NavLink
                    to="/swipe"
                    className={({ isActive }) =>
                      `px-3 py-2 rounded-lg font-medium transition-colors duration-200 ${
                        isActive
                          ? 'bg-white/20 text-white shadow-lg'
                          : 'text-white/80 hover:text-white hover:bg-white/10'
                      }`
                    }
                  >
                    Discover
                  </NavLink>
                  <NavLink
                    to="/about"
                    className={({ isActive }) =>
                      `px-3 py-2 rounded-lg font-medium transition-colors duration-200 ${
                        isActive
                          ? 'bg-white/20 text-white shadow-lg'
                          : 'text-white/80 hover:text-white hover:bg-white/10'
                      }`
                    }
                  >
                    About
                  </NavLink>
                </div>                <div className="flex items-center space-x-4">
                  <span className="text-white/90 text-sm">
                    Welcome, {user.email}
                  </span>
                  <button
                    onClick={logout}
                    className="px-4 py-2 bg-white/10 hover:bg-white/20 text-white border border-white/30 hover:border-white/50 rounded-lg font-medium transition-all duration-200"
                  >
                    Logout
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
