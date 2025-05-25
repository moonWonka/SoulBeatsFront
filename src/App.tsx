// src/App.tsx

import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import { useState } from 'react';

import './App.css';

import { HomePage } from './pages/HomePage';
import { AboutPage } from './pages/AboutPage';
import { LoginPage } from './pages/LoginPage';
import { SwipePage } from './pages/SwipePage';

function App() {
  const [user, setUser] = useState<string>('');

  const handleSetUser = (newUser: string) => {
    setUser(newUser);
  };

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
            <Route
              path="/"
              element={<HomePage user={user} onSetUser={handleSetUser} />}
            />
            <Route path="/about" element={<AboutPage />} />
            <Route path="/login" element={<LoginPage onSetUser={handleSetUser} />} />
            <Route path="/swipe" element={<SwipePage />} />
          </Routes>
        </div>
      </div>
    </Router>
  );
}

export default App;
