import "./login.css";
import { useState } from "react";

interface LogProps {
  onSetUser: (user: string) => void;
}

interface User {
  username: string;
  password: string;
}

// Simulando una base de datos de usuarios
const usersDB: User[] = [{ username: "admin", password: "1234" }];

export function Login({ onSetUser }: LogProps) {
  const [user, setUser] = useState("");
  const [pass, setPass] = useState("");
  const [error, setError] = useState(false);
  const [corretLogin, setCorretLogin] = useState(false);
  const [isRegistering, setIsRegistering] = useState(false);

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>): void => {
    event.preventDefault();

    if (user === "" || pass === "") {
      setError(true);
      return;
    }

    if (isRegistering) {
      // Registro
      const userExists = usersDB.some((u) => u.username === user);
      if (userExists) {
        setError(true);
      } else {
        usersDB.push({ username: user, password: pass });
        setError(false);
        setCorretLogin(true);
        onSetUser(user);
      }
    } else {
      // Login
      const validUser = usersDB.find((u) => u.username === user && u.password === pass);
      if (validUser) {
        setError(false);
        setCorretLogin(true);
        onSetUser(user);
      } else {
        setError(true);
      }
    }
  };

  return (
    <section className="login-container">
      <img
        src="/public/images/soulBeats.webp"
        alt="soulBeats logo"
        className="login-logo"
      />
      <h1>{isRegistering ? "Registro" : "Inicio Sesion"}</h1>

      <form className="formulario" onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Ingrese UserName"
          value={user}
          onChange={(e) => setUser(e.target.value)}
        />
        <input
          type="password"
          placeholder="Ingrese contraseña"
          value={pass}
          onChange={(e) => setPass(e.target.value)}
        />

        <button type="submit">
          {isRegistering ? "Registrarse" : "Iniciar Sesión"}
        </button>
      </form>

      {error && (
        <p className="login-error">
          Error: {isRegistering ? "El usuario ya existe" : "Credenciales incorrectas"}
        </p>
      )}
      {corretLogin && (
        <p className="login-success">
          {isRegistering ? "Registro exitoso" : "Login correcto"}
        </p>
      )}

      <button
        onClick={() => {
          setIsRegistering(!isRegistering);
          // Resetea los estados de error/correct
          setError(false);
          setCorretLogin(false);
        }}
        className="toggle-button"
      >
        {isRegistering
          ? "¿Ya tienes una cuenta? Inicia sesión"
          : "¿No tienes cuenta? Regístrate"}
      </button>
    </section>
  );
}
