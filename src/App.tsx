import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
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
