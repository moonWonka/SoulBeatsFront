import { Login } from "../login/Login";
import { VideoPanel } from "../video/VideoPanel";
import "./home.css";

interface HomeProps {
  user: string;
  onSetUser: (user: string) => void;
}

export function Home({ user, onSetUser }: HomeProps) {
  return (
    <main className="home-container">
      {/* Columna Izquierda: Video (60% de la pantalla) */}
      <div className="home-left">
        <VideoPanel />
      </div>

      {/* Columna Derecha: Login o Datos del Usuario (40% de la pantalla) */}
      <div className="home-right">
        {user ? (
          <>
            <h2>Bienvenido, {user}!</h2>
            {/* Si quieres que el botón cierre sesión, puedes pasar "" */}
            <button onClick={() => onSetUser("")} className="logout-button">
              Cerrar Sesión
            </button>
          </>
        ) : (
          <Login onSetUser={onSetUser} />
        )}
      </div>
    </main>
  );
}
