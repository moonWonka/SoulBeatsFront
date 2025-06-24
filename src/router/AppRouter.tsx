import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Link, useLocation } from 'react-router-dom';
import { HomePage } from '../pages/HomePage';
import { AboutPage } from '../pages/AboutPage';
import { LoginPage } from '../pages/LoginPage';
import { SwipePage } from '../pages/SwipePage';
import ProtectedRoute from './ProtectedRoute';
import Navbar from '../components/Navbar';
import MatchesPage from '../pages/MatchesPage'; // Import MatchesPage
import { AppView } from '../types'; // Assuming AppView is in types.ts

// Export AppRouterContent for testing
export const AppRouterContent: React.FC = () => {
  const location = useLocation();
  const [currentView, setCurrentView] = useState<AppView>('swipe');
  const [matchCount, setMatchCount] = useState<number>(0); // Hardcoded for now

  useEffect(() => {
    const path = location.pathname;
    if (path.includes('/swipe')) {
      setCurrentView('swipe');
    } else if (path.includes('/matches')) {
      setCurrentView('matches');
    }
    // Add other view conditions if needed
  }, [location.pathname]);

  return (
    <div className="App min-h-screen flex flex-col">
      {/* Navbar */}
      <Navbar currentView={currentView} matchCount={matchCount} />

      {/* Main Routes */}
      <div className="flex-grow pt-16"> {/* Added pt-16 for padding below fixed navbar */}
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
            <Route
              path="/matches" // New route for matches
              element={
                <ProtectedRoute>
                  <MatchesPage />
                </ProtectedRoute>
              }
            />
          </Routes>
        </div>
      </div>
  );
}

const AppRouter: React.FC = () => {
  return (
    <Router>
      <AppRouterContent />
    </Router>
  );
};

export default AppRouter;