import { useState } from 'react';
import { LoginPage } from './pages/LoginPage';
import { HomePage } from './pages/HomePage';

import './App.css';

function App() {
  const [user, setUser] = useState<string>("");

  // "Envolvemos" setUser para que coincida con la firma (user: string) => void
  const handleSetUser = (newUser: string) => {
    setUser(newUser);
  };

  return (
    <div className="App">
      {user ? (
        <HomePage user={user} />
      ) : (
        <LoginPage onSetUser={handleSetUser} />
      )}
    </div>
  );
}

export default App;
