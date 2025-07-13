import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import { ThemeProvider } from './context/ThemeContext'
import { showStoredLogs, clearStoredLogs } from './services/spotifyAuth'

// Mostrar logs de autenticación almacenados
showStoredLogs();

// Agregar funciones globales para debugging
(window as any).showSpotifyLogs = showStoredLogs;
(window as any).clearSpotifyLogs = clearStoredLogs;

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <ThemeProvider>
      <App />
    </ThemeProvider>
  </StrictMode>,
)
