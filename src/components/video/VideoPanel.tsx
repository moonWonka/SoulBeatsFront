import { useRef, useState } from "react";
import "./VideoPanel.css";

export function VideoPanel() {
  // Referencia al elemento <video> para manipularlo
  const videoRef = useRef<HTMLVideoElement>(null);
  // Estado para saber si está silenciado o no
  const [isMuted, setIsMuted] = useState(true);

  const toggleMute = () => {
    if (videoRef.current) {
      // Invertimos el estado de mute en el <video>
      videoRef.current.muted = !videoRef.current.muted;
      // Actualizamos el estado local
      setIsMuted(videoRef.current.muted);
    }
  };

  return (
    <div className="video-panel">
      <video
        ref={videoRef}
        src="/videos/logIn.mp4"
        loop
        autoPlay
        muted={isMuted}
        style={{ width: "100%", height: "auto" }}
      >
        Tu navegador no soporta el elemento <code>video</code>.
      </video>

      <button onClick={toggleMute} className="mute-button">
        {isMuted ? "Activar Sonido" : "Silenciar"}
      </button>
    </div>
  );
}
