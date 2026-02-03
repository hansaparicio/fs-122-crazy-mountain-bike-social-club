import { useEffect, useState, useRef } from "react";
import Garage from "../components/Profile/Garage";

const Profile = () => {
  const [user, setUser] = useState(null);
  const [saved, setSaved] = useState(false);
  const fileInputRef = useRef();

  useEffect(() => {
    const stored = JSON.parse(localStorage.getItem("user"));
    setUser(stored);
  }, []);

  if (!user) return null;

  const handleChange = (key, value) => {
    setUser(prev => ({ ...prev, [key]: value }));
  };

  const handleAvatar = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = () => {
      handleChange("avatar", reader.result);
    };
    reader.readAsDataURL(file);
  };

  const saveProfile = () => {
    localStorage.setItem("user", JSON.stringify(user));
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  return (
    <div className="profile-wrapper" style={{ padding: 24 }}>

      {/* PERFIL */}

      <div className="ui-panel" style={{ marginBottom: 32 }}>

        <h2 style={{ marginBottom: 24 }}>Mi perfil</h2>

        {/* Avatar */}

        <div style={{ textAlign: "center", marginBottom: 24 }}>

          <img
            src={user.avatar || "https://via.placeholder.com/120"}
            alt="avatar"
            style={{
              width: 120,
              height: 120,
              borderRadius: "50%",
              objectFit: "cover",
              marginBottom: 12,
              cursor: "pointer"
            }}
            onClick={() => fileInputRef.current.click()}
          />

          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={handleAvatar}
            style={{ display: "none" }}
          />

          <button
            className="ui-btn ui-btn--secondary"
            onClick={() => fileInputRef.current.click()}
          >
            Cambiar avatar
          </button>

        </div>

        {/* Campos */}

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 1fr 1fr auto",
            gap: 12,
            alignItems: "end"
          }}
        >

          <div>
            <label>Email</label>
            <input value={user.email || ""} disabled />
          </div>

          <div>
            <label>Nombre</label>
            <input
              value={user.name || ""}
              onChange={(e) => handleChange("name", e.target.value)}
            />
          </div>

          <div>
            <label>Ubicación</label>
            <input
              value={user.location || ""}
              onChange={(e) => handleChange("location", e.target.value)}
            />
          </div>

          <button className="ui-btn ui-btn--secondary" onClick={saveProfile}>
            Guardar perfil
          </button>

        </div>

        {saved && (
          <p style={{ color: "#22c55e", marginTop: 12 }}>
            Perfil actualizado
          </p>
        )}

      </div>

      {/* GARAJE */}

      <div className="ui-panel">
        <Garage />
      </div>

    </div>
  );
};

export default Profile;
