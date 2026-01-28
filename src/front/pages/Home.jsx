import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

import "../styles/home.css";

import WeeklyKms from "../components/Home/WeeklyKms";
import StartRouteButton from "../components/Home/StartRouteButton";
import FeaturedRoutes from "../components/Home/FeaturedRoutes";
import FriendsActivity from "../components/Home/FriendsActivity";
import MaintenanceCard from "../components/Maintenance/MaintenanceCard";
import Garage from "../components/Profile/Garage";


import { useFetchWithLoader } from "../hooks/useFetchWithLoader";

const Home = () => {
  const navigate = useNavigate();


  const fetchWithLoader = useFetchWithLoader();


  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/login");
    }
  }, [navigate]);


  useEffect(() => {
    const loadData = async () => {
      await fetchWithLoader(
        `${import.meta.env.VITE_BACKEND_URL}/api/home-data`
      );
    };

    loadData();
  }, []);

  const handleLogout = () => {
    localStorage.clear();
    navigate("/login");
  };

  return (
    <div className="home">
      <div className="home-content">
        <header className="home-header">
          {/* IZQUIERDA → AVATAR */}
          <div className="home-user">
            <div
              className="user-avatar clickable"
              onClick={() => navigate("/profile")}
              role="button"
              tabIndex={0}
            >
              <img
                src="https://ca.slack-edge.com/T0BFXMWMV-U08U5P1CMT8-66334e023a99-512"
                alt="Perfil de usuario"
              />
            </div>

            <div className="home-greeting">
              <span className="home-hello">Hola Fernando 👋</span>
              <span className="home-subtitle">¿Listo para pedalear hoy?</span>
            </div>
          </div>

          {/* DERECHA → HOME + LOGOUT */}
          <div className="home-actions">
            <i
              className="fa-solid fa-house nav-home-icon active"
              onClick={() => navigate("/home")}
            />

            <button
              className="logout-btn"
              onClick={handleLogout}
              aria-label="Cerrar sesión"
            >
              <i className="fa-solid fa-power-off logout-icon"></i>
            </button>
          </div>
        </header>


        <main className="home-content">
          <WeeklyKms />
          <StartRouteButton className="ui-btn--cta" />
          <FeaturedRoutes />
          <div className="ui-panel">
            <Garage />
          </div>
          <FriendsActivity />
          <MaintenanceCard
            title="Mantenimiento"
            showTitle={true}
            showActionButton={false}
          />
         </main>
      </div>
    </div>
  );
};

export default Home;
