import React, { useState, useEffect } from "react";
import { 
  IconCalendar, IconMapPin, IconClock, IconCloud, IconBriefcase, 
  IconCheck, IconVolume, IconPlane, IconTrain, IconHotel, IconCompass, IconInfo, IconDollar
} from "./Icons";

export default function DashboardView({ itinerary, expenses, updateItinerary, showTaxiHelper, showFlightModal }) {
  const [chinaTime, setChinaTime] = useState("");
  const [localTime, setLocalTime] = useState("");
  const [previewDayId, setPreviewDayId] = useState("day-1");

  // Emergency Modal / Translate card state
  const [emergencyText, setEmergencyText] = useState(null);

  // Quick Currency Converter States
  const [exchangeRate] = useState(7.8); // 1 EUR = 7.8 CNY
  const [calcEur, setCalcEur] = useState("");
  const [calcCny, setCalcCny] = useState("");

  const handleCalcEurChange = (val) => {
    setCalcEur(val);
    if (val === "" || isNaN(val)) {
      setCalcCny("");
    } else {
      setCalcCny((parseFloat(val) * exchangeRate).toFixed(2));
    }
  };

  const handleCalcCnyChange = (val) => {
    setCalcCny(val);
    if (val === "" || isNaN(val)) {
      setCalcEur("");
    } else {
      setCalcEur((parseFloat(val) / exchangeRate).toFixed(2));
    }
  };

  // Essentials checklist state
  const [essentials, setEssentials] = useState([
    { id: "e1", text: "Pasaporte físico listo (vigente > 6 meses)", checked: false },
    { id: "e2", text: "Instalar y configurar Alipay con tarjeta", checked: false },
    { id: "e3", text: "Instalar WeChat y activar WeChat Pay", checked: false },
    { id: "e4", text: "Contratar e instalar eSIM de datos / VPN (LetsVPN)", checked: false },
    { id: "e5", text: "Descargar mapas offline en Apple/Baidu Maps y MetroMan", checked: false },
  ]);

  useEffect(() => {
    const saved = localStorage.getItem("china_trip_essentials");
    if (saved) {
      try { setEssentials(JSON.parse(saved)); } catch (e) {}
    }
  }, []);

  const toggleEssential = (id) => {
    const updated = essentials.map(item => 
      item.id === id ? { ...item, checked: !item.checked } : item
    );
    setEssentials(updated);
    localStorage.setItem("china_trip_essentials", JSON.stringify(updated));
  };

  useEffect(() => {
    const timer = setInterval(() => {
      const d = new Date();
      const optionsChina = { timeZone: "Asia/Shanghai", hour: "2-digit", minute: "2-digit", second: "2-digit", hour12: false };
      setChinaTime(new Intl.DateTimeFormat("es-ES", optionsChina).format(d));
      
      const optionsLocal = { hour: "2-digit", minute: "2-digit", second: "2-digit", hour12: false };
      setLocalTime(new Intl.DateTimeFormat("es-ES", optionsLocal).format(d));
    }, 1000);

    return () => clearInterval(timer);
  }, []);
  // Today's active day calculations
  const getCityAbbrev = (city) => {
    if (!city) return "TRN";
    if (city.includes("Shanghái")) return "SHA";
    if (city.includes("Chongqing")) return "CKG";
    if (city.includes("Chengdu")) return "CTU";
    if (city.includes("Xi'an")) return "SIA";
    if (city.includes("Pekín") || city.includes("Beijing")) return "PEK";
    return "TRN";
  };

  const getTodayDay = () => {
    if (typeof window === "undefined" || !Array.isArray(itinerary) || itinerary.length === 0) return { day: null, label: "" };

    const todayStr = new Date().toISOString().split("T")[0]; // YYYY-MM-DD
    const matchedDay = itinerary.find(day => day && day.date === todayStr);

    if (matchedDay) {
      return { day: matchedDay, label: "Hoy en tu viaje" };
    }
    
    // Default fallback to preview selected day
    const previewDay = itinerary.find(day => day && day.id === previewDayId) || itinerary[0];
    return { day: previewDay, label: `Vista Previa: Día Seleccionado` };
  };

  const { day: activeDay, label: dayLabel } = getTodayDay();

  // Stats Calculations
  const safeItinerary = Array.isArray(itinerary) ? itinerary : [];
  const safeExpenses = Array.isArray(expenses) ? expenses : [];
  
  const totalDays = safeItinerary.length;
  
  const formatDateDisplay = (dateStr) => {
    if (!dateStr) return "";
    const parts = dateStr.split("-");
    if (parts.length !== 3) return dateStr;
    const day = parseInt(parts[2], 10);
    const monthIndex = parseInt(parts[1], 10);
    const months = ["ene", "feb", "mar", "abr", "may", "jun", "jul", "ago", "sep", "oct", "nov", "dic"];
    return `${day} ${months[monthIndex - 1] || "jul"}`;
  };
  const uniqueCities = [...new Set(safeItinerary.filter(d => d && d.city !== "En tránsito" && d.city !== "Tu casa").map(d => d.city))];
  const totalExpenses = safeExpenses.reduce((acc, curr) => acc + curr.amountEur, 0);
  const flights = safeItinerary.filter(d => d?.transport?.type === "flight").length;
  const trains = safeItinerary.filter(d => d?.transport?.type === "train").length;
  const bookedHotels = safeItinerary.filter(d => d?.lodging?.bookingStatus === "booked" && d.lodging.name !== "Noche a bordo del avión" && d.lodging.name !== "Tu casa").length;

  const weatherGuides = [
    { city: "Shanghái", temp: "28°C - 36°C", desc: "Monzones cortos, mucha humedad y calor." },
    { city: "Chongqing", temp: "29°C - 39°C", desc: "El 'horno' chino. Calor sofocante en julio." },
    { city: "Chengdu", temp: "25°C - 33°C", desc: "Clima templado-caliente, cielos nublados y llovizna." },
    { city: "Xi'an", temp: "26°C - 36°C", desc: "Calor seco durante el día, fresco de noche." },
    { city: "Pekín", temp: "26°C - 35°C", desc: "Calor bochornoso con posibles tormentas eléctricas." }
  ];

  // Emergency translations
  const emergencyPhrases = [
    { esp: "Tengo una urgencia médica, llame a una ambulancia", hanzi: "我有医疗紧急情况，请叫救护车！", pinyin: "Wǒ yǒu yīliáo jǐnjí qíngkuàng, qǐng jiào jiùhùchē!" },
    { esp: "Estoy perdido, ¿dónde está la estación de metro más cercana?", hanzi: "我迷路了，请问最近 de 地铁站在哪里？", pinyin: "Wǒ mìlù le, qǐngwèn zuìjìn de dìtiě zhàn zài nǎlǐ?" },
    { esp: "Llamen a la policía, me han robado", hanzi: "请叫警察，我的东西被偷了。", pinyin: "Qǐng jiào jǐngchá, wǒ de dōngxī bèi tōu le." },
    { esp: "Por favor, ayúdeme", hanzi: "请帮帮我，谢谢！", pinyin: "Qǐng bāngbāng wǒ, xièxie!" }
  ];

  const handleSpeak = (text) => {
    if ("speechSynthesis" in window) {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = "zh-CN";
      utterance.rate = 0.85;
      window.speechSynthesis.speak(utterance);
    }
  };

  const getTransportIcon = (type) => {
    switch (type) {
      case "flight": return <IconPlane className="w-5 h-5 text-blue" />;
      case "train": return <IconTrain className="w-5 h-5 text-gold" />;
      default: return <IconCompass className="w-5 h-5 text-gray" />;
    }
  };

  // Extracts flight code from string
  const handleFlightTrackClick = (details) => {
    const flightMatch = (details || "").match(/(CA\d+|3U\d+)/i);
    const flightCode = flightMatch ? flightMatch[0].toUpperCase() : "CA840";
    showFlightModal(flightCode);
  };

  return (
    <div className="dashboard-container">
      
      {/* Hero Welcome Card without Countdown */}
      <div className="hero-card glass-panel" style={{ marginBottom: "10px" }}>
        <div className="hero-content">
          <span className="badge">VIAJE COMPLETO 🇨🇳</span>
          <h1 className="hero-title">Rumbo a China</h1>
          <p className="hero-subtitle">17 de Julio al 31 de Julio de 2026</p>
          <div className="hero-dates-badge-box">
            <span className="badge bg-gold text-dark font-bold">Barcelona ✈️ Shanghái ➔ Chongqing ➔ Chengdu ➔ Xi'an ➔ Pekín ✈️ Barcelona</span>
          </div>
        </div>
        <div className="hero-artwork">
          <div className="pagoda-silhouette"></div>
        </div>
      </div>

      {/* Compact Clocks strip at the top */}
      <div className="glass-panel" style={{ display: "flex", justifyContent: "space-around", alignItems: "center", padding: "6px 12px", marginBottom: "10px", borderRadius: "10px", fontSize: "0.75rem" }}>
        <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
          <span style={{ color: "#94a3b8" }}>🇪🇸 España:</span>
          <strong style={{ fontSize: "0.85rem", color: "#fff" }}>{localTime ? localTime.slice(0, 5) : "--:--"}</strong>
        </div>
        <div style={{ width: "1px", height: "12px", background: "rgba(255,255,255,0.15)" }}></div>
        <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
          <span style={{ color: "#94a3b8" }}>🇨🇳 China:</span>
          <strong style={{ fontSize: "0.85rem", color: "#eab308" }}>{chinaTime ? chinaTime.slice(0, 5) : "--:--"}</strong>
          <span style={{ fontSize: "0.6rem", color: "#64748b" }}>(+6h)</span>
        </div>
      </div>

      {/* CALENDARIO DE RUTA INTERACTIVO */}
      <div className="card glass-panel route-calendar-card" style={{ marginBottom: "10px", padding: "10px" }}>
        <h3 className="card-title" style={{ fontSize: "0.8rem", color: "#eab308", marginBottom: "6px", display: "flex", alignItems: "center", gap: "4px" }}>
          📅 Calendario de Ruta (Toca un día para ver su plan)
        </h3>
        <div className="calendar-grid" style={{ display: "grid", gridTemplateColumns: "repeat(5, 1fr)", gap: "5px" }}>
          {safeItinerary.map((d, index) => {
            const isSelected = d.id === previewDayId;
            const isToday = d.date === new Date().toISOString().split("T")[0];
            const cityAbbr = getCityAbbrev(d.city);
            const dateParts = d.date.split("-");
            const dayNum = dateParts[2];
            
            // Icon overlays
            const hasFlight = d.transport?.type === "flight";
            const hasTrain = d.transport?.type === "train";
            
            return (
              <button
                key={d.id}
                type="button"
                onClick={() => setPreviewDayId(d.id)}
                className={`calendar-tile ${isSelected ? "selected" : ""} ${isToday ? "today" : ""}`}
                style={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  justifyContent: "space-between",
                  padding: "4px 2px",
                  background: isSelected ? "rgba(234, 179, 8, 0.18)" : isToday ? "rgba(255, 255, 255, 0.05)" : "rgba(255, 255, 255, 0.02)",
                  border: isSelected ? "1px solid #eab308" : isToday ? "1px dashed rgba(234, 179, 8, 0.5)" : "1px solid rgba(255,255,255,0.05)",
                  borderRadius: "8px",
                  color: isSelected ? "#eab308" : "#fff",
                  cursor: "pointer",
                  minHeight: "52px",
                  position: "relative",
                  transition: "all 0.2s ease"
                }}
              >
                {/* Small indicator badges */}
                <div style={{ display: "flex", gap: "2px", position: "absolute", top: "2px", right: "2px" }}>
                  {hasFlight && <span style={{ fontSize: "0.5rem" }}>✈️</span>}
                  {hasTrain && <span style={{ fontSize: "0.5rem" }}>🚄</span>}
                </div>
                {isToday && (
                  <span style={{ position: "absolute", bottom: "2px", right: "2px", width: "4px", height: "4px", background: "#ef4444", borderRadius: "50%" }}></span>
                )}

                <span style={{ fontSize: "0.55rem", color: isSelected ? "#eab308" : "#94a3b8", fontWeight: "bold" }}>D{index + 1}</span>
                <span style={{ fontSize: "0.9rem", fontWeight: "800", margin: "1px 0", color: isSelected ? "#eab308" : "#fff" }}>{dayNum}</span>
                <span style={{ fontSize: "0.55rem", background: "rgba(255,255,255,0.05)", padding: "1px 3px", borderRadius: "3px", color: isSelected ? "#eab308" : "#cbd5e1" }}>
                  {cityAbbr}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* DYNAMIC CARD: TODAY ON YOUR TRIP / PREVIEW */}
      {activeDay && (
        <div className="today-itinerary-card glass-panel" style={{ marginBottom: "10px", padding: "12px" }}>
          <div className="today-card-header" style={{ marginBottom: "8px" }}>
            <div className="today-title-info">
              <span className="today-badge">{dayLabel}</span>
              <span className="today-date-text" style={{ fontSize: "0.75rem" }}>{formatDateDisplay(activeDay.date)} ({activeDay.dayOfWeek}) - {activeDay.city}</span>
            </div>
          </div>

          <div className="today-card-body-grid">
            {/* Main Info */}
            <div className="today-main-info">
              <h3 className="today-day-title" style={{ fontSize: "0.95rem", margin: "0 0 8px 0" }}>{activeDay.title}</h3>
              
              {/* Lodging Box with Taxi Helper */}
              {activeDay.lodging && activeDay.lodging.name !== "Noche a bordo del avión" && activeDay.lodging.name !== "Tu casa" && (
                <div className="today-lodging-box" style={{ padding: "8px", gap: "6px", marginBottom: "8px" }}>
                  <div className="today-lodging-details" style={{ gap: "6px" }}>
                    <IconHotel className="w-5 h-5 text-jade shrink-0" />
                    <div>
                      <span className="today-hotel-lbl" style={{ fontSize: "0.65rem" }}>Hotel:</span>
                      <span className="today-hotel-name" style={{ fontSize: "0.75rem" }}>{activeDay.lodging.name}</span>
                      {activeDay.lodging.nameChinese && <span className="lodging-chinese-sub block font-bold text-gold" style={{ fontSize: "0.65rem" }}>{activeDay.lodging.nameChinese}</span>}
                      <span className="today-hotel-address" style={{ fontSize: "0.65rem" }}>{activeDay.lodging.address}</span>
                    </div>
                  </div>
                  <button 
                    type="button" 
                    className="btn-taxi-trigger bg-gold text-dark font-bold"
                    onClick={() => showTaxiHelper(activeDay.lodging)}
                    style={{ padding: "4px 8px", fontSize: "0.65rem" }}
                  >
                    🚕 Dirección al Taxista (Chino)
                  </button>
                </div>
              )}

              {/* Transport details */}
              {activeDay.transport && (
                <div className="today-transport-box flex-wrap gap-2" style={{ padding: "8px", marginBottom: "8px" }}>
                  <div className="flex items-center gap-2" style={{ fontSize: "0.75rem" }}>
                    {getTransportIcon(activeDay.transport.type)}
                    <span><strong>Trayecto:</strong> {activeDay.transport.details}</span>
                  </div>
                  <div className="flex items-center gap-2 ml-auto">
                    <span className={`status-tag ${activeDay.transport.bookingStatus}`} style={{ fontSize: "0.65rem", padding: "2px 6px" }}>
                      {activeDay.transport.bookingStatus === "booked" ? "Reservado" : "Pendiente"}
                    </span>
                    {activeDay.transport.type === "flight" && (
                      <button
                        type="button"
                        className="btn-flight-track-pill bg-blue text-white"
                        style={{ padding: "3px 8px", fontSize: "0.65rem", borderRadius: "4px", fontWeight: "bold" }}
                        onClick={() => handleFlightTrackClick(activeDay.transport.details)}
                      >
                        ✈️ Estado Vuelo
                      </button>
                    )}
                  </div>
                </div>
              )}
            </div>

            {/* Activities checklist */}
            <div className="today-activities-box">
              <h4 style={{ fontSize: "0.75rem", margin: "0 0 6px 0" }}>Actividades del Día</h4>
              {(!activeDay.activities || activeDay.activities.length === 0) ? (
                <p className="no-acts" style={{ fontSize: "0.7rem" }}>No hay actividades planificadas para hoy.</p>
              ) : (
                <ul className="today-activities-list" style={{ gap: "4px" }}>
                  {activeDay.activities.map(act => (
                    <li key={act.id} className="today-act-item" style={{ padding: "4px 0" }}>
                      <span className="act-time-lbl" style={{ fontSize: "0.65rem", padding: "2px 4px" }}>{act.time}</span>
                      <div className="act-bullet-text">
                        <span className="act-title-lbl" style={{ fontSize: "0.75rem" }}>{act.title}</span>
                        {act.description && <span className="act-desc-lbl" style={{ fontSize: "0.65rem" }}>{act.description}</span>}
                      </div>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </div>
        </div>
      )}

      {/* COMPACT CONVERTER CARD */}
      <div className="card glass-panel quick-converter-card" style={{ marginBottom: "14px", padding: "10px" }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "6px" }}>
          <h3 className="card-title" style={{ fontSize: "0.8rem", color: "#eab308", margin: "0", display: "flex", alignItems: "center", gap: "4px" }}>
            <IconDollar className="w-4 h-4 text-gold" /> Cambio Rápido (1 € = {exchangeRate} ¥)
          </h3>
        </div>
        <div className="converter-flex" style={{ display: "flex", alignItems: "center", gap: "6px" }}>
          <div style={{ flex: 1, display: "flex", alignItems: "center", gap: "4px", background: "rgba(0,0,0,0.2)", padding: "4px 8px", borderRadius: "6px", border: "1px solid rgba(255,255,255,0.05)" }}>
            <span style={{ fontSize: "0.75rem", color: "#94a3b8", fontWeight: "bold" }}>EUR</span>
            <input 
              type="number" 
              placeholder="0"
              value={calcEur}
              onChange={(e) => handleCalcEurChange(e.target.value)}
              style={{ width: "100%", background: "transparent", border: "none", color: "#fff", outline: "none", fontSize: "0.8rem", textAlign: "right", padding: "0" }}
            />
          </div>
          <div style={{ fontSize: "0.9rem", color: "#eab308" }}>⇄</div>
          <div style={{ flex: 1, display: "flex", alignItems: "center", gap: "4px", background: "rgba(0,0,0,0.2)", padding: "4px 8px", borderRadius: "6px", border: "1px solid rgba(255,255,255,0.05)" }}>
            <span style={{ fontSize: "0.75rem", color: "#94a3b8", fontWeight: "bold" }}>CNY</span>
            <input 
              type="number" 
              placeholder="0"
              value={calcCny}
              onChange={(e) => handleCalcCnyChange(e.target.value)}
              style={{ width: "100%", background: "transparent", border: "none", color: "#fff", outline: "none", fontSize: "0.8rem", textAlign: "right", padding: "0" }}
            />
          </div>
        </div>
      </div>

      {/* Emergency Phrase Fullscreen Modal */}
      {emergencyText && (
        <div className="taxi-modal-overlay" onClick={() => setEmergencyText(null)}>
          <div className="taxi-modal-content high-contrast" onClick={(e) => e.stopPropagation()}>
            <button className="taxi-close-btn" onClick={() => setEmergencyText(null)}>CERRAR</button>
            <div className="taxi-modal-header">
              <span className="taxi-card-badge bg-red text-white">MENSAJE DE AUXILIO</span>
              <button 
                type="button" 
                className="speak-btn-large"
                onClick={() => handleSpeak(emergencyText.hanzi)}
              >
                🔊 Pronunciar
              </button>
            </div>
            <div className="taxi-card-body">
              <p className="taxi-chinese-intro text-center">Enseña este mensaje a un policía o transeúnte:</p>
              <div className="taxi-address-box">
                <span className="taxi-hotel-name-chinese block" style={{ fontSize: "2.4rem", fontWeight: "bold" }}>{emergencyText.hanzi}</span>
                <span className="taxi-hotel-address-chinese block text-sm mt-4">{emergencyText.pinyin}</span>
              </div>
              <div className="taxi-address-english-box text-center">
                <span className="taxi-hotel-name-english">{emergencyText.esp}</span>
              </div>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
