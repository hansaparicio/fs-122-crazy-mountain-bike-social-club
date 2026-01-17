import { useNavigate } from "react-router-dom";

export default function RouteRegistrationBottomNav({ onStart, isRecording }) {
  const navigate = useNavigate();

  return (
    <div className="rr-bottom">
      <div className="rr-bottom-nav">
        <button
          type="button"
          className="rr-nav-item"
          onClick={() => navigate("/home")}
        >
          EXPLORAR
        </button>

        <button
          type="button"
          className="rr-nav-item"
          onClick={() => navigate("/routes")}
        >
          RUTAS
        </button>

        <button
          type="button"
          className="rr-fab"
          onClick={onStart}
          aria-label={isRecording ? "Detener registro" : "Iniciar registro"}
          title={isRecording ? "Stop" : "Start"}
        >
          {isRecording ? "■" : "▶"}
        </button>

        <button
          type="button"
          className="rr-nav-item"
          onClick={() => navigate("/taller")}
        >
          TALLER
        </button>

        <button
          type="button"
          className="rr-nav-item"
          onClick={() => navigate("/profile")}
        >
          PERFIL
        </button>
      </div>
    </div>
  );
}
