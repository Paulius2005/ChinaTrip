import React, { useState, useEffect } from "react";
import { IconCalendar, IconMapPin, IconClock, IconCloud, IconBriefcase, IconCheck } from "./Icons";

export default function DashboardView({ itinerary, packing, expenses, updateItinerary }) {
  const [timeLeft, setTimeLeft] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0 });
  const [chinaTime, setChinaTime] = useState("");
  const [localTime, setLocalTime] = useState("");

  const targetDate = new Date("2026-07-17T12:00:00"); // Departure date

  // Essentials checklist state synced with localStorage or component state
  const [essentials, setEssentials] = useState([
    { id: "e1", text: "Pasaporte físico listo (vigente > 6 meses)", checked: false },
    { id: "e2", text: "Instalar y configurar Alipay con tarjeta", checked: false },
    { id: "e3", text: "Instalar WeChat y activar WeChat Pay", checked: false },
    { id: "e4", text: "Contratar e instalar eSIM de datos / VPN (LetsVPN)", checked: false },
    { id: "e5", text: "Descargar mapas offline en Apple/Baidu Maps y MetroMan", checked: false },
  ]);

  useEffect(() => {
    // Load essentials from localStorage if exists
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
      // Calculate Countdown
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

      // Calculate Clocks
      const d = new Date();
      // China Time (UTC+8)
      const optionsChina = { timeZone: "Asia/Shanghai", hour: "2-digit", minute: "2-digit", second: "2-digit", hour12: false };
      setChinaTime(new Intl.DateTimeFormat("es-ES", optionsChina).format(d));
      
      // Local Time (Spain/User Time)
      const optionsLocal = { hour: "2-digit", minute: "2-digit", second: "2-digit", hour12: false };
      setLocalTime(new Intl.DateTimeFormat("es-ES", optionsLocal).format(d));

    }, 1000);

    return () => clearInterval(timer);
  }, []);

  // Compute Trip Stats
  const totalDays = itinerary.length;
  const uniqueCities = [...new Set(itinerary.filter(d => d.city !== "En tránsito" && d.city !== "Tu casa").map(d => d.city))];
  const totalExpenses = expenses.reduce((acc, curr) => acc + curr.amountEur, 0);

  // Transport and Lodging counts
  const flights = itinerary.filter(d => d.transport?.type === "flight").length;
  const trains = itinerary.filter(d => d.transport?.type === "train").length;
  const bookedHotels = itinerary.filter(d => d.lodging?.bookingStatus === "booked" && d.lodging.name !== "Noche a bordo del avión").length;

  // Weather data in July
  const weatherGuides = [
    { city: "Shanghái", temp: "28°C - 36°C", desc: "Calor bochornoso, lluvias esporádicas de monzón." },
    { city: "Chongqing", temp: "29°C - 39°C", desc: "El 'Horno de China'. Humedad extrema y calor intenso." },
    { city: "Chengdu", temp: "25°C - 33°C", desc: "Cálido y mayormente nublado, lluvias frecuentes." },
    { city: "Xi'an", temp: "26°C - 36°C", desc: "Calor seco en el día, brisa agradable al atardecer." },
    { city: "Pekín", temp: "26°C - 35°C", desc: "Caluroso y húmedo, chubascos veraniegos." }
  ];

  return (
    <div className="dashboard-container">
      {/* Hero Welcome Card with Countdown */}
      <div className="hero-card glass-panel">
        <div className="hero-content">
          <span className="badge">VIAJE A CHINA 🇨🇳</span>
          <h1 className="hero-title">¡Barcelona rumbo a China!</h1>
          <p className="hero-subtitle">Del 17 de Julio al 31 de Julio, 2026</p>

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
          {/* Simple China temple styled graphic */}
          <div className="pagoda-silhouette"></div>
        </div>
      </div>

      {/* Grid: Stats, Clocks, Weather, Essentials */}
      <div className="dashboard-grid">
        
        {/* Left Column: Stats & Clocks */}
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
                <span className="stat-val">{bookedHotels} reservados</span>
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
              <IconClock className="w-5 h-5 text-gold" /> Husos Horarios (UTC+8)
            </h2>
            <div className="clock-flex">
              <div className="clock-item">
                <span className="clock-city">España (Local)</span>
                <span className="clock-time">{localTime || "--:--:--"}</span>
              </div>
              <div className="clock-divider"></div>
              <div className="clock-item">
                <span className="clock-city text-red">China (Pekín)</span>
                <span className="clock-time text-gold">{chinaTime || "--:--:--"}</span>
                <span className="clock-diff">+6 horas de diferencia</span>
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
    </div>
  );
}
