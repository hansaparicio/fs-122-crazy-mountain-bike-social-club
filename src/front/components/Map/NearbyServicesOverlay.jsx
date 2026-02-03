export default function NearbyServicesOverlay({ visible, data, onClose }) {
  if (!visible) return null;

  const fuel = data?.fuel?.length ?? 0;
  const food = data?.food?.length ?? 0;
  const hospital = data?.hospital?.length ?? 0;
  const bike = data?.bike?.length ?? 0;

  return (
    <div
      style={{
        position: "absolute",
        left: 12,
        right: 12,
        bottom: 92,
        background: "white",
        border: "1px solid rgba(0,0,0,.12)",
        borderRadius: 16,
        padding: 12,
        zIndex: 20,
      }}
    >
      <div style={{ display: "flex", justifyContent: "space-between", gap: 10 }}>
        <div style={{ fontWeight: 900 }}>SERVICIOS CERCA</div>
        <button
          onClick={onClose}
          style={{ border: 0, background: "transparent", fontWeight: 900, cursor: "pointer" }}
        >
          CERRAR
        </button>
      </div>

      <div style={{ marginTop: 8, display: "flex", gap: 10, flexWrap: "wrap", fontWeight: 800 }}>
        <span>⛽ {fuel}</span>
        <span>🥪 {food}</span>
        <span>🏥 {hospital}</span>
        <span>🚲 {bike}</span>
      </div>

      <div style={{ marginTop: 10, fontSize: 13, opacity: 0.85 }}>
        (MOCK) Luego: lista real + click para centrar mapa.
      </div>
    </div>
  );
}
