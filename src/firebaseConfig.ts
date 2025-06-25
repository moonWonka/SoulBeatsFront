import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getAnalytics } from "firebase/analytics";

// Función para obtener variables de entorno con validación
const getEnvVar = (name: string): string => {
  const value = import.meta.env[name];
  if (!value) {
    console.error(`Variable de entorno ${name} no está definida`);
    throw new Error(`Variable de entorno ${name} es requerida`);
  }
  return value;
};

// Configuración de Firebase usando variables de entorno con Vite
const firebaseConfig = {
  apiKey: getEnvVar('VITE_FIREBASE_API_KEY'),
  authDomain: getEnvVar('VITE_FIREBASE_AUTH_DOMAIN'),
  projectId: getEnvVar('VITE_FIREBASE_PROJECT_ID'),
  storageBucket: getEnvVar('VITE_FIREBASE_STORAGE_BUCKET'),
  messagingSenderId: getEnvVar('VITE_FIREBASE_MESSAGING_SENDER_ID'),
  appId: getEnvVar('VITE_FIREBASE_APP_ID'),
  measurementId: getEnvVar('VITE_FIREBASE_MEASUREMENT_ID'),
};

// Inicializa Firebase
const app = initializeApp(firebaseConfig);

// Inicializa los servicios de Firebase
export const auth = getAuth(app);

// Inicializa Analytics solo si estamos en producción y tenemos measurementId
export const analytics = typeof window !== 'undefined' && import.meta.env.PROD 
  ? getAnalytics(app) 
  : null;