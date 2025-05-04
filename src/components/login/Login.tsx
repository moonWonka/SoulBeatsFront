import "./login.css";
import { useState } from "react";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "../../firebaseConfig";

interface LoginProps {
  onSetUser: (user: string) => void;
}

export function Login({ onSetUser }: LoginProps) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleLogin = async () => {
    try {
      // Inicia sesión con Firebase
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const token = await userCredential.user.getIdToken();

      // Envía el token al backend
      const response = await fetch("http://tu-backend.com/api/auth", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ token }),
      });

      if (response.ok) {
        const data = await response.json();
        onSetUser(data.username); // Actualiza el usuario con la respuesta del backend
      } else {
        const errorData = await response.json();
        setError(errorData.message || "Error al autenticar con el backend");
      }
    } catch (err: unknown) {
      // Verifica si el error es una instancia de Error
      if (err instanceof Error) {
        setError(`Error al iniciar sesión: ${err.message}`);
      } else {
        setError("Ocurrió un error desconocido.");
      }
    }
  };

  return (
    <div className="login-container">
      <h2>Iniciar Sesión</h2>
      {error && <p className="error">{error}</p>}
      <input
        type="email"
        placeholder="Correo electrónico"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />
      <input
        type="password"
        placeholder="Contraseña"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />
      <button onClick={handleLogin}>Iniciar Sesión</button>
    </div>
  );
}
