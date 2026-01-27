
import React, { useEffect, useMemo, useRef, useState } from "react";


export default function AiChatDialog({ floating = true }) {
  const [open, setOpen] = useState(false);
  const [input, setInput] = useState("");
  const [sending, setSending] = useState(false);

  // Historial tipo chat
  const [messages, setMessages] = useState(() => [
    {
      role: "assistant",
      content:
        "👋 Soy GASTACOBRE. Dime qué tipo de bici buscas (carretera, gravel, XC, enduro, DH) y tu presupuesto aprox.",
    },
  ]);

  const listRef = useRef(null);

  
  useEffect(() => {
    if (!open) return;
    const el = listRef.current;
    if (el) el.scrollTop = el.scrollHeight;
  }, [open, messages]);

  const toggleOpen = () => setOpen((v) => !v);

  // --- MOCK ENGINE (sin backend) ---
  const mockRespond = useMemo(() => {
    const normalize = (t) => (t || "").toLowerCase();

    const guessMode = (t) => {
      const s = normalize(t);
      if (/\bdh\b|downhill|bikepark/.test(s)) return "DH";
      if (/enduro/.test(s)) return "Enduro";
      if (/\bxc\b|cross country/.test(s)) return "XC";
      if (/gravel/.test(s)) return "Gravel";
      if (/carretera|road|asfalto/.test(s)) return "Carretera";
      return "";
    };

    const guessBudget = (t) => {
      const s = (t || "").replaceAll(".", "").replaceAll(",", "");
      const m = s.match(/\b(\d{3,5})\b/);
      return m ? Number(m[1]) : null;
    };

    // Catálogo mínimo local (mock). Luego lo moveremos a backend en FASE 2/3.
    const catalog = [
      {
        id: "road-001",
        name: "Trek Domane AL 2",
        price_eur: 1199,
        mode: "Carretera",
        why: "Endurance cómoda para asfalto y tiradas largas.",
      },
      {
        id: "road-002",
        name: "Specialized Allez",
        price_eur: 1299,
        mode: "Carretera",
        why: "Ligera y polivalente para carretera.",
      },
      {
        id: "gravel-001",
        name: "Canyon Grizl",
        price_eur: 1899,
        mode: "Gravel",
        why: "Gravel estable para pistas y aventura.",
      },
      {
        id: "xc-001",
        name: "Scott Scale 970",
        price_eur: 1499,
        mode: "XC",
        why: "XC para subir bien y rodar rápido.",
      },
      {
        id: "end-001",
        name: "Canyon Spectral",
        price_eur: 2799,
        mode: "Enduro",
        why: "Trail/Enduro equilibrada para bajadas y polivalencia.",
      },
      {
        id: "dh-001",
        name: "Commencal Supreme DH",
        price_eur: 3999,
        mode: "DH",
        why: "Pura DH para bikepark y descenso agresivo.",
      },
    ];

    const pick = (mode, budget) => {
      const filtered = catalog.filter((b) => (mode ? b.mode === mode : true));
      const sorted = [...filtered].sort((a, b) => {
        if (budget == null) return a.price_eur - b.price_eur;
        return Math.abs(a.price_eur - budget) - Math.abs(b.price_eur - budget);
      });
      return sorted.slice(0, 3);
    };

    return async (userText) => {
      const mode = guessMode(userText);
      const budget = guessBudget(userText);

      
      if (!mode && budget == null) {
        return {
          assistant_message:
            "Vale 🙂 ¿Qué modalidad quieres (carretera / gravel / XC / enduro / DH) y presupuesto aproximado en €?",
          recommendations: [],
        };
      }

      if (!mode) {
        return {
          assistant_message:
            "Perfecto. Me falta solo una cosa: ¿qué modalidad prefieres (carretera / gravel / XC / enduro / DH)?",
          recommendations: [],
        };
      }

      if (budget == null) {
        return {
          assistant_message:
            `Genial, modalidad ${mode}. ¿Qué presupuesto aprox. tienes en €? (por ejemplo 1500, 2500, 4000)`,
          recommendations: [],
        };
      }

      const recs = pick(mode, budget);

      return {
        assistant_message:
          ` Te encajan estas opciones en ${mode} cerca de ${budget}€ (mock):`,
        recommendations: recs.map((r) => ({
          id: r.id,
          name: r.name,
          price_eur: r.price_eur,
          why: r.why,
        })),
      };
    };
  }, []);

  const send = async () => {
    const text = input.trim();
    if (!text || sending) return;

    setMessages((m) => [...m, { role: "user", content: text }]);
    setInput("");
    setSending(true);

    try {
      
      await new Promise((r) => setTimeout(r, 350));

      const data = await mockRespond(text);

      setMessages((m) => [
        ...m,
        { role: "assistant", content: data.assistant_message || "OK" },
      ]);

      const recs = Array.isArray(data.recommendations) ? data.recommendations : [];
      if (recs.length) {
        const lines = recs.map((r) => {
          const price = r.price_eur ? ` — ${r.price_eur}€` : "";
          const why = r.why ? `\n${r.why}` : "";
          return `• ${r.name || r.id}${price}${why}`;
        });

        setMessages((m) => [
          ...m,
          {
            role: "assistant",
            content: `📌 Recomendaciones (mock):\n\n${lines.join("\n\n")}`,
          },
        ]);
      }
    } finally {
      setSending(false);
    }
  };

  const onKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      send();
    }
  };

  return (
    <div className={floating ? "gc-fab-wrap" : ""}>
      {/* BOTÓN flotante */}
      {floating && (
        <button className="gc-fab" onClick={toggleOpen} aria-label="Abrir GASTACOBRE">
          <span className="gc-fab-icon">🤖</span>
          <span className="gc-fab-text">GASTACOBRE</span>
        </button>
      )}

      {/* DIALOG */}
      {open && (
        <div className="gc-overlay" onMouseDown={() => setOpen(false)}>
          <div className="gc-dialog" onMouseDown={(e) => e.stopPropagation()}>
            <div className="gc-header">
              <div>
                <div className="gc-title">GASTACOBRE</div>
                <div className="gc-subtitle">Asistente de compra (UI mock)</div>
              </div>
              <button className="gc-close" onClick={() => setOpen(false)} aria-label="Cerrar">
                ✕
              </button>
            </div>

            <div className="gc-messages" ref={listRef}>
              {messages.map((m, idx) => (
                <div
                  key={idx}
                  className={`gc-bubble ${m.role === "user" ? "gc-bubble-user" : "gc-bubble-assistant"}`}
                >
                  {m.content}
                </div>
              ))}
              {sending && (
                <div className="gc-bubble gc-bubble-assistant gc-typing">Escribiendo…</div>
              )}
            </div>

            <div className="gc-inputbar">
              <textarea
                className="gc-input"
                placeholder="Escribe aquí… (Enter envía · Shift+Enter salto de línea)"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={onKeyDown}
                rows={2}
              />
              <button className="gc-send" onClick={send} disabled={sending}>
                {sending ? "..." : "Enviar"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Si NO es floating, botón normal */}
      {!floating && (
        <button className="gc-inline-btn" onClick={toggleOpen}>
          Abrir GASTACOBRE
        </button>
      )}
    </div>
  );
}
