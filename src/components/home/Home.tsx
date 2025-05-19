import { useState } from "react";
import { Login } from "../login/Login";
import { GradientButton } from "../shared/GradientButton";
import { VideoPanel } from "../video/VideoPanel";
import "./home.css";

interface HomeProps {
  user: string;
  onSetUser: (user: string) => void;
}



const defaultUser = "usuarioPrueba";

export function Home({ user, onSetUser }: HomeProps) {
  const [currentUser, setCurrentUser] = useState<string>(defaultUser);

  const handleSetUser = (newUser: string) => {
    setCurrentUser(newUser);
    onSetUser(newUser);
  };

  return (
    <main className="home-container">
      {/* Columna Izquierda: Video (60% de la pantalla) */}
      {/* <div className="home-left">
        <VideoPanel />
      </div> */}

      {/* Columna Derecha: Login o Datos del Usuario (40% de la pantalla) */}
      <div className="home-right">
        {currentUser ? (
          <>
            <h2>Bienvenido, {currentUser}!</h2>
            {/* Si quieres que el botón cierre sesión, puedes pasar "" */}
            <GradientButton onClick={() => handleSetUser("")}>
              Cerrar sesión
            </GradientButton>
          </>
        ) : (
          <Login onSetUser={handleSetUser} />
        )}
      </div>
    </main>
  );
}
