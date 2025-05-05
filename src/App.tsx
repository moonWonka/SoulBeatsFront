import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import { useState } from 'react';

import './App.css';
import { HomePage } from './pages/HomePage';
import { AboutPage } from './pages/AboutPage';
import { LoginPage } from './pages/LoginPage';
import { SwipePage } from './pages/SwipePage';

function App() {
  const [user, setUser] = useState<string>("");

  const handleSetUser = (newUser: string) => {
    setUser(newUser);
  };

  return (
    <Router>
      <div className="App">
        {/* Navbar */}
        <nav className="navbar">
          <ul>
            <li>
              <Link to="/">Home</Link>
            </li>
            <li>
              <Link to="/about">About</Link>
            </li>
            <li>
              <Link to="/login">Login</Link>
            </li>
            <li>
              <Link to="/swipe">Swipe</Link>
            </li>
          </ul>
        </nav>

        {/* Routes */}
        <Routes>
          <Route path="/" element={<HomePage user={user} onSetUser={handleSetUser} />} />
          <Route path="/about" element={<AboutPage />} />
          <Route path="/login" element={<LoginPage onSetUser={handleSetUser} />} />
          <Route path="/swipe" element={<SwipePage />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
