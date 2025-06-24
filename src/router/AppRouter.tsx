import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import { HomePage } from '../pages/HomePage';
import { AboutPage } from '../pages/AboutPage';
import { LoginPage } from '../pages/LoginPage';
import { SwipePage } from '../pages/SwipePage';
import ProtectedRoute from './ProtectedRoute';

const AppRouter: React.FC = () => {
  return (
    <Router>
      <div className="App min-h-screen flex flex-col">
        {/* Navbar */}
        <nav className="flex-shrink-0 bg-gray-800 text-white py-4">
          <ul className="flex justify-center space-x-4">
            <li><Link to="/" className="hover:text-rose-500">Home</Link></li>
            <li><Link to="/about" className="hover:text-rose-500">About</Link></li>
            <li><Link to="/login" className="hover:text-rose-500">Login</Link></li>
            <li><Link to="/swipe" className="hover:text-rose-500">Swipe</Link></li>
          </ul>
        </nav>

        {/* Main Routes */}
        <div className="flex-grow">
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/about" element={<AboutPage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route
              path="/swipe"
              element={
                <ProtectedRoute>
                  <SwipePage />
                </ProtectedRoute>
              }
            />
          </Routes>
        </div>
      </div>
    </Router>
  );
};

export default AppRouter;