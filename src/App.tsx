import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { useState } from 'react';
import { LoginPage } from './pages/LoginPage';
import { HomePage } from './pages/HomePage';

import './App.css';
import { HomePage } from './pages/HomePage';
import { AboutPage } from './pages/AboutPage';

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
        </Routes>
      </div>
    </Router>
  );
}

export default App;
