import React, { useState, useEffect } from "react";
import { 
  IconCalendar, IconMapPin, IconClock, IconCloud, IconBriefcase, 
  IconCheck, IconVolume, IconPlane, IconTrain, IconHotel, IconCompass 
} from "./Icons";

export default function DashboardView({ itinerary, packing, expenses, updateItinerary, showTaxiHelper }) {
  const [timeLeft, setTimeLeft] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0 });
  const [chinaTime, setChinaTime] = useState("");
  const [localTime, setLocalTime] = useState("");
  const [previewDayId, setPreviewDayId] = useState("day-1");

  // Emergency Modal / Translate card state
  const [emergencyText, setEmergencyText] = useState(null);

  const targetDate = new Date("2026-07-17T12:00:00"); // Departure date

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
      const now = new Date();
      const difference = targetDate.getTime() - now.getTime();
      
      if (difference <= 0) {
        setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0 });
      } else {
        const days = Math.floor(difference / (1000 * 60 * 60 * 24));
        const hours = Math.floor((difference / (1000 * 60 * 60)) % 24);
        const minutes = Math.floor((difference / 1000 / 60) % 60);
        const seconds = Math.floor((difference / 1000) % 60);
        setTimeLeft({ days, hours, minutes, seconds });
      }

      const d = new Date();
      const optionsChina = { timeZone: "Asia/Shanghai", hour: "2-digit", minute: "2-digit", second: "2-digit", hour12: false };
      setChinaTime(new Intl.DateTimeFormat("es-ES", optionsChina).format(d));
      
      const optionsLocal = { hour: "2-digit", minute: "2-digit", second: "2-digit", hour12: false };
      setLocalTime(new Intl.DateTimeFormat("es-ES", optionsLocal).format(d));
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  // Today's active day calculations
  const getTodayDay = () => {
    if (typeof window === "undefined") return itinerary[0];

    const todayStr = new Date().toISOString().split("T")[0]; // YYYY-MM-DD
    const matchedDay = itinerary.find(day => day.date === todayStr);

    if (matchedDay) {
      return { day: matchedDay, label: "Hoy en tu viaje" };
    }
    
    // Default fallback to preview selected day
    const previewDay = itinerary.find(day => day.id === previewDayId) || itinerary[0];
    return { day: previewDay, label: `Día de Vista Previa (Simulación)` };
  };

  const { day: activeDay, label: dayLabel } = getTodayDay();

  // Stats Calculations
  const totalDays = itinerary.length;
  const uniqueCities = [...new Set(itinerary.filter(d => d.city !== "En tránsito" && d.city !== "Tu casa").map(d => d.city))];
  const totalExpenses = expenses.reduce((acc, curr) => acc + curr.amountEur, 0);
  const flights = itinerary.filter(d => d.transport?.type === "flight").length;
  const trains = itinerary.filter(d => d.transport?.type === "train").length;
  const bookedHotels = itinerary.filter(d => d.lodging?.bookingStatus === "booked" && d.lodging.name !== "Noche a bordo del avión" && d.lodging.name !== "Tu casa").length;

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
    { esp: "Estoy perdido, ¿dónde está la estación de metro más cercana?", hanzi: "我迷路了，请问最近的地铁站在哪里？", pinyin: "Wǒ mílù le, qǐngwèn zuìjìn de dìtiě zhàn zài nǎlǐ?" },
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
      case "flight": return <IconPlane className="w-4 h-4 text-blue" />;
      case "train": return <IconTrain className="w-4 h-4 text-gold" />;
      default: return <IconCompass className="w-4 h-4 text-gray" />;
    }
  };

  return (
    <div className="dashboard-container">
      
      {/* Hero Welcome Card with Countdown */}
      <div className="hero-card glass-panel">
        <div className="hero-content">
          <span className="badge">VIAJE A CHINA 🇨🇳</span>
          <h1 className="hero-title">¡Rumbo a China!</h1>
          <p className="hero-subtitle">Del 17 al 31 de Julio de 2026 | Barcelona - Pekín - Shanghái</p>

          <div className="countdown-grid">
            <div className="countdown-box">
              <span className="countdown-value">{timeLeft.days}</span>
              <span className="countdown-label">Días</span>
            </div>
            <div className="countdown-box">
              <span className="countdown-value">{timeLeft.hours}</span>
              <span className="countdown-label">Horas</span>
            </div>
            <div className="countdown-box">
              <span className="countdown-value">{timeLeft.minutes}</span>
              <span className="countdown-label">Mins</span>
            </div>
            <div className="countdown-box">
              <span className="countdown-value">{timeLeft.seconds}</span>
              <span className="countdown-label">Segs</span>
            </div>
          </div>
        </div>
        <div className="hero-artwork">
          <div className="pagoda-silhouette"></div>
        </div>
      </div>

      {/* DYNAMIC CARD: TODAY ON YOUR TRIP / PREVIEW */}
      <div className="today-itinerary-card glass-panel">
        <div className="today-card-header">
          <div className="today-title-info">
            <span className="today-badge">{dayLabel}</span>
            <span className="today-date-text">{activeDay.date} ({activeDay.dayOfWeek}) - {activeDay.city}</span>
          </div>
          
          {/* Dropdown to simulate other days */}
          <div className="preview-selector">
            <label htmlFor="preview-day-select">Ver otro día:</label>
            <select 
              id="preview-day-select"
              value={previewDayId} 
              onChange={(e) => setPreviewDayId(e.target.value)}
            >
              {itinerary.map((d, index) => (
                <option key={d.id} value={d.id}>Día {index + 1}: {d.city} ({d.date})</option>
              ))}
            </select>
          </div>
        </div>

        <div className="today-card-body-grid">
          {/* Main Info */}
          <div className="today-main-info">
            <h3 className="today-day-title">{activeDay.title}</h3>
            
            {/* Lodging Box with Taxi Helper */}
            {activeDay.lodging && activeDay.lodging.name !== "Noche a bordo del avión" && activeDay.lodging.name !== "Tu casa" && (
              <div className="today-lodging-box">
                <div className="today-lodging-details">
                  <IconHotel className="w-5 h-5 text-jade" />
                  <div>
                    <span className="today-hotel-lbl">Hotel de hoy:</span>
                    <span className="today-hotel-name">{activeDay.lodging.name}</span>
                    <span className="today-hotel-address">{activeDay.lodging.address}</span>
                  </div>
                </div>
                <button 
                  type="button" 
                  className="btn-taxi-trigger bg-gold text-dark"
                  onClick={() => showTaxiHelper(activeDay.lodging)}
                >
                  🚕 Mostrar dirección al Taxista (Chino)
                </button>
              </div>
            )}

            {/* Transport details */}
            {activeDay.transport && (
              <div className="today-transport-box">
                {getTransportIcon(activeDay.transport.type)}
                <span><strong>Trayecto:</strong> {activeDay.transport.details}</span>
                <span className={`status-tag ${activeDay.transport.bookingStatus}`}>
                  {activeDay.transport.bookingStatus === "booked" ? "Reservado" : "Pendiente"}
                </span>
              </div>
            )}
          </div>

          {/* Activities checklist */}
          <div className="today-activities-box">
            <h4>Actividades del Día</h4>
            {(!activeDay.activities || activeDay.activities.length === 0) ? (
              <p className="no-acts">No hay actividades planificadas para hoy.</p>
            ) : (
              <ul className="today-activities-list">
                {activeDay.activities.map(act => (
                  <li key={act.id} className="today-act-item">
                    <span className="act-time-lbl">{act.time}</span>
                    <div className="act-bullet-text">
                      <span className="act-title-lbl">{act.title}</span>
                      {act.description && <span className="act-desc-lbl">{act.description}</span>}
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
      </div>

      {/* Grid: Stats, Clocks, Weather, Emergency, Essentials */}
      <div className="dashboard-grid">
        
        {/* Left Column: Stats & Clocks & Emergency */}
        <div className="dashboard-col">
          {/* Stats Card */}
          <div className="card glass-panel">
            <h2 className="card-title">
              <IconBriefcase className="w-5 h-5 text-red" /> Resumen del Viaje
            </h2>
            <div className="stats-grid">
              <div className="stat-item">
                <span className="stat-label">Duración</span>
                <span className="stat-val">{totalDays} días</span>
              </div>
              <div className="stat-item">
                <span className="stat-label">Ciudades</span>
                <span className="stat-val">{uniqueCities.length}</span>
              </div>
              <div className="stat-item">
                <span className="stat-label">Vuelos</span>
                <span className="stat-val">{flights}</span>
              </div>
              <div className="stat-item">
                <span className="stat-label">Trenes Bala</span>
                <span className="stat-val">{trains}</span>
              </div>
              <div className="stat-item">
                <span className="stat-label">Hoteles</span>
                <span className="stat-val">{bookedHotels} res.</span>
              </div>
              <div className="stat-item">
                <span className="stat-label">Coste Estimado</span>
                <span className="stat-val">{totalExpenses} €</span>
              </div>
            </div>
            <div className="cities-badge-list">
              {uniqueCities.map(city => (
                <span key={city} className="city-pill">
                  <IconMapPin className="w-3.5 h-3.5" /> {city}
                </span>
              ))}
            </div>
          </div>

          {/* Clocks Card */}
          <div className="card glass-panel clock-card">
            <h2 className="card-title">
              <IconClock className="w-5 h-5 text-gold" /> Reloj de Viaje (Husos Horarios)
            </h2>
            <div className="clock-flex">
              <div className="clock-item">
                <span className="clock-city">España (Local)</span>
                <span className="clock-time">{localTime || "--:--:--"}</span>
              </div>
              <div className="clock-divider"></div>
              <div className="clock-item">
                <span className="clock-city text-red">Pekín (China)</span>
                <span className="clock-time text-gold">{chinaTime || "--:--:--"}</span>
                <span className="clock-diff">+6 horas de diferencia</span>
              </div>
            </div>
          </div>

          {/* EMERGENCY CARD (CRITICAL UX TRAVEL HELP) */}
          <div className="card glass-panel emergency-card">
            <h2 className="card-title text-red">
              🚨 Teléfonos de Emergencia y Ayuda
            </h2>
            <div className="emergency-numbers-grid">
              <a href="tel:110" className="emg-call-btn">
                <span className="emg-num">110</span>
                <span className="emg-lbl">Policía</span>
              </a>
              <a href="tel:120" className="emg-call-btn">
                <span className="emg-num">120</span>
                <span className="emg-lbl">Ambulancia</span>
              </a>
              <a href="tel:119" className="emg-call-btn">
                <span className="emg-num">119</span>
                <span className="emg-lbl">Bomberos</span>
              </a>
            </div>

            <div className="consular-info-box">
              <h5>Consulado Español en China (Emergencia Consular)</h5>
              <p>Embajada en Pekín: <a href="tel:+8613911283186">+86 139 1128 3186</a></p>
              <p>Consulado en Shanghái: <a href="tel:+8613917471591">+86 139 1747 1591</a></p>
              <p>Consulado en Chengdu: <a href="tel:+8618382498259">+86 183 8249 8259</a></p>
            </div>

            <div className="emergency-translations-section">
              <h5>Frases de Emergencia Rápida (Toca para escuchar)</h5>
              <div className="emg-phrases-list">
                {emergencyPhrases.map(phr => (
                  <div 
                    key={phr.esp} 
                    className="emg-phrase-row" 
                    onClick={() => {
                      handleSpeak(phr.hanzi);
                      setEmergencyText(phr);
                    }}
                  >
                    <div className="emg-phrase-meanings">
                      <span className="emg-phrase-esp">{phr.esp}</span>
                      <span className="emg-phrase-hanzi">{phr.hanzi}</span>
                    </div>
                    <button type="button" className="emg-speak-btn">
                      <IconVolume className="w-4 h-4 text-white" />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Essentials & Weather */}
        <div className="dashboard-col">
          {/* Essentials Checklist */}
          <div className="card glass-panel">
            <h2 className="card-title">
              <IconCheck className="w-5 h-5 text-jade" /> Preparativos Críticos
            </h2>
            <ul className="essentials-list">
              {essentials.map(item => (
                <li 
                  key={item.id} 
                  className={`essential-item ${item.checked ? "checked" : ""}`}
                  onClick={() => toggleEssential(item.id)}
                >
                  <div className="checkbox">
                    {item.checked && <IconCheck className="w-4 h-4 text-white" />}
                  </div>
                  <span className="essential-text">{item.text}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Weather Card */}
          <div className="card glass-panel">
            <h2 className="card-title">
              <IconCloud className="w-5 h-5 text-blue" /> Clima en Julio
            </h2>
            <p className="card-description">
              Julio es verano húmedo en China. Se caracteriza por altas temperaturas y lluvias breves pero intensas (monzones).
            </p>
            <div className="weather-list">
              {weatherGuides.map(item => (
                <div key={item.city} className="weather-item">
                  <div className="weather-city-info">
                    <span className="weather-city">{item.city}</span>
                    <span className="weather-desc">{item.desc}</span>
                  </div>
                  <span className="weather-temp">{item.temp}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

      </div>

      {/* EMERGENCY TRANSLATION FULLSCREEN DISPLAY */}
      {emergencyText && (
        <div className="taxi-modal-overlay" onClick={() => setEmergencyText(null)}>
          <div className="taxi-modal-content high-contrast" onClick={(e) => e.stopPropagation()}>
            <button className="taxi-close-btn" onClick={() => setEmergencyText(null)}>✕ Cerrar</button>
            <div className="taxi-modal-header">
              <span className="taxi-card-badge">AYUDA DE EMERGENCIA / 紧急求助</span>
              <button 
                type="button" 
                className="speak-btn-large" 
                onClick={() => handleSpeak(emergencyText.hanzi)}
              >
                🔊 Pronunciar en Mandarín
              </button>
            </div>
            <div className="taxi-card-body text-center">
              <p className="taxi-chinese-intro text-red" style={{ fontSize: "1.2rem", fontWeight: "bold" }}>请帮帮我！/ ¡Por favor ayúdeme!</p>
              
              <div className="taxi-address-box">
                <h1 className="taxi-hotel-name-chinese" style={{ fontSize: "2.8rem", lineHeight: "1.3", margin: "20px 0" }}>
                  {emergencyText.hanzi}
                </h1>
                <p className="taxi-hotel-address-chinese" style={{ fontSize: "1.3rem" }}>
                  Pinyin: {emergencyText.pinyin}
                </p>
              </div>

              <div className="taxi-address-english-box">
                <h3 className="taxi-hotel-name-english" style={{ fontSize: "1.5rem" }}>
                  {emergencyText.esp}
                </h3>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
