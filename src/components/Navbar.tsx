import React from 'react';
import { Link } from 'react-router-dom';
import { AppView } from '../types';

interface NavbarProps {
  currentView: AppView;
  matchCount: number;
}

const Navbar: React.FC<NavbarProps> = ({ currentView, matchCount }) => {
  const NavButton: React.FC<{
    to: string; // Changed from view to 'to' for Link path
    viewName: AppView; // To keep track of the view for styling
    label: string;
  }> = ({ to, viewName, label }) => (
    <Link
      to={to}
      className={`flex-1 py-3 px-2 text-center transition-colors duration-200 relative ${
        currentView === viewName ? 'text-rose-500' : 'text-gray-400 hover:text-rose-400'
      }`}
      aria-label={`Go to ${label}`}
    >
      <div className="flex flex-col items-center">
        <span className={`text-xs mt-1 font-medium ${currentView === viewName ? 'text-rose-500' : 'text-gray-500'}`}>
          {label}
        </span>
      </div>
      {viewName === 'matches' && matchCount > 0 && (
        <span className="absolute top-1 right-1/4 -mr-2 transform translate-x-1/2 bg-rose-500 text-white text-xs w-5 h-5 rounded-full flex items-center justify-center">
          {matchCount}
        </span>
      )}
      {currentView === viewName && (
        <div className="absolute bottom-0 left-0 right-0 h-1 bg-rose-500 rounded-t-full"></div>
      )}
    </Link>
  );

  return (
    <nav className="flex w-full border-b border-gray-200 bg-white fixed top-0 left-0 right-0 z-50 h-16"> {/* Ensure navbar is fixed and has height */}
      <NavButton to="/swipe" viewName="swipe" label="Discover" />
      <NavButton to="/matches" viewName="matches" label="Matches" />
    </nav>
  );
};

export default Navbar;
