import { Home } from './components/home/Home';
import { useState } from 'react';
import './App.css';

function App() {
  const [user, setUser] = useState<string>("");

  // "Envolvemos" setUser para que coincida con la firma (user: string) => void
  const handleSetUser = (newUser: string) => {
    setUser(newUser);
  };

  return (
    <div className="App">
      <Home user={user} onSetUser={handleSetUser} />
    </div>
  );
}

export default App;
