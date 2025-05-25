import { useState } from "react";
import {
  signInWithEmailAndPassword,
  signInWithPopup,
  GoogleAuthProvider,
} from "firebase/auth";
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
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const token = await userCredential.user.getIdToken();

      const response = await fetch("http://tu-backend.com/api/auth", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ token }),
      });

      if (response.ok) {
        const data = await response.json();
        onSetUser(data.username); // o data.uid, según tu backend
      } else {
        const errorData = await response.json();
        setError(errorData.message || "Error al autenticar con el backend");
      }
    } catch (err: unknown) {
      if (err instanceof Error) {
        setError(`Error al iniciar sesión: ${err.message}`);
      } else {
        setError("Ocurrió un error desconocido.");
      }
    }
  };

  const handleGoogleLogin = async () => {
    try {
      const provider = new GoogleAuthProvider();
      const result = await signInWithPopup(auth, provider);
      const token = await result.user.getIdToken();

      const response = await fetch("http://tu-backend.com/api/auth/google", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ idToken: token }),
      });

      if (response.ok) {
        const data = await response.json();
        onSetUser(data.username); // o lo que devuelva tu backend
      } else {
        const errorData = await response.json();
        setError(errorData.message || "Error al autenticar con Google");
      }
    } catch (err: unknown) {
      if (err instanceof Error) {
        setError(`Error con Google: ${err.message}`);
      } else {
        setError("Error desconocido al iniciar sesión con Google.");
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

      <hr style={{ margin: "1rem 0" }} />

      <button onClick={handleGoogleLogin}>Continuar con Google</button>
    </div>
  );
}
