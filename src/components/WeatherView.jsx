import React, { useState, useEffect } from "react";
import { IconCloud, IconWind, IconInfo } from "./Icons";

const cityCoords = {
  "Shanghái": { lat: 31.2304, lon: 121.4737 },
  "Chongqing": { lat: 29.5630, lon: 106.5516 },
  "Chengdu": { lat: 30.5728, lon: 104.0668 },
  "Xi'an": { lat: 34.3416, lon: 108.9398 },
  "Pekín": { lat: 39.9042, lon: 116.4074 }
};

const getWeatherInfo = (code) => {
  const table = {
    0: { label: "Despejado", icon: "☀️" },
    1: { label: "Principalmente Despejado", icon: "🌤️" },
    2: { label: "Parcialmente Nublado", icon: "⛅" },
    3: { label: "Nublado", icon: "☁️" },
    45: { label: "Niebla", icon: "🌫️" },
    48: { label: "Niebla de Escarcha", icon: "🌫️" },
    51: { label: "Llovizna Ligera", icon: "🌦️" },
    53: { label: "Llovizna Moderada", icon: "🌦️" },
    55: { label: "Llovizna Densa", icon: "🌧️" },
    61: { label: "Lluvia Ligera", icon: "🌧️" },
    63: { label: "Lluvia Moderada", icon: "🌧️" },
    65: { label: "Lluvia Fuerte", icon: "🌧️" },
    80: { label: "Chubascos Ligeros", icon: "🌧️" },
    81: { label: "Chubascos Moderados", icon: "🌧️" },
    82: { label: "Chubascos Fuertes", icon: "🌧️" },
    95: { label: "Tormenta Eléctrica", icon: "⛈️" },
    96: { label: "Tormenta con Granizo", icon: "⛈️" },
    99: { label: "Tormenta Fuerte con Granizo", icon: "⛈️" }
  };
  return table[code] || { label: "Desconocido", icon: "🌡️" };
};

const getForecastDayLabel = (dateStr) => {
  if (!dateStr) return { dayName: "", dateFormatted: "" };
  const days = ["Dom", "Lun", "Mar", "Mié", "Jue", "Vie", "Sáb"];
  const parts = dateStr.split("-");
  if (parts.length !== 3) return { dayName: "", dateFormatted: dateStr };
  
  const dateObj = new Date(parseInt(parts[0], 10), parseInt(parts[1], 10) - 1, parseInt(parts[2], 10));
  const dayName = days[dateObj.getDay()];
  
  const dayNum = parseInt(parts[2], 10);
  const months = ["ene", "feb", "mar", "abr", "may", "jun", "jul", "ago", "sep", "oct", "nov", "dic"];
  const monthName = months[parseInt(parts[1], 10) - 1] || "";
  
  return { dayName, dateFormatted: `${dayNum} ${monthName}` };
};

export default function WeatherView() {
  const [selectedCity, setSelectedCity] = useState("Shanghái");
  const [weatherData, setWeatherData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    let active = true;
    const fetchWeather = async () => {
      setLoading(true);
      setError(null);
      const coords = cityCoords[selectedCity];
      try {
        const url = `https://api.open-meteo.com/v1/forecast?latitude=${coords.lat}&longitude=${coords.lon}&current=temperature_2m,relative_humidity_2m,apparent_temperature,is_day,precipitation,weather_code,wind_speed_10m&daily=weather_code,temperature_2m_max,temperature_2m_min,uv_index_max&timezone=Asia%2FShanghai`;
        const res = await fetch(url);
        if (!res.ok) throw new Error("Error cargando el clima del servidor.");
        const json = await res.json();
        
        if (active) {
          setWeatherData(json);
        }
      } catch (err) {
        if (active) {
          setError(err.message);
        }
      } finally {
        if (active) {
          setLoading(false);
        }
      }
    };

    fetchWeather();
    return () => { active = false; };
  }, [selectedCity]);

  return (
    <div className="weather-container">
      {/* City Selector Tabs */}
      <div className="weather-city-tabs">
        {Object.keys(cityCoords).map(city => (
          <button 
            key={city}
            type="button"
            className={`city-tab-btn ${selectedCity === city ? "active" : ""}`}
            onClick={() => setSelectedCity(city)}
          >
            {city}
          </button>
        ))}
      </div>

      {loading && (
        <div className="card glass-panel" style={{ padding: "30px", textAlign: "center" }}>
          <div className="saving-spinner" style={{ display: "inline-block", margin: "0 auto 10px auto" }}></div>
          <p style={{ color: "#94a3b8", fontSize: "0.8rem", margin: "0" }}>Consultando satélites climáticos en tiempo real...</p>
        </div>
      )}

      {error && !loading && (
        <div className="card glass-panel" style={{ padding: "20px", textAlign: "center", border: "1px solid rgba(239, 68, 68, 0.4)" }}>
          <p style={{ color: "#ef4444", fontSize: "0.8rem", margin: "0 0 10px 0" }}>⚠️ {error}</p>
          <button 
            type="button"
            className="btn-primary btn-sm"
            onClick={() => setSelectedCity(selectedCity)}
          >
            Reintentar
          </button>
        </div>
      )}

      {weatherData && !loading && !error && (
        <>
          {/* Current Weather Card */}
          <div className="card glass-panel current-weather-card">
            <h4 style={{ margin: "0", fontSize: "0.8rem", color: "#eab308" }}>CLIMA ACTUAL</h4>
            
            <div className="current-temp-display">
              {weatherData.current.temperature_2m.toFixed(1)}°C
            </div>
            
            <div className="current-weather-desc">
              <span style={{ fontSize: "1.8rem" }}>{getWeatherInfo(weatherData.current.weather_code).icon}</span>
              <span>{getWeatherInfo(weatherData.current.weather_code).label}</span>
            </div>

            <div className="weather-details-grid">
              <div className="weather-detail-item">
                <span className="weather-detail-label">Sensación</span>
                <span className="weather-detail-val">{weatherData.current.apparent_temperature.toFixed(1)}°C</span>
              </div>
              <div className="weather-detail-item">
                <span className="weather-detail-label">Humedad</span>
                <span className="weather-detail-val">{weatherData.current.relative_humidity_2m}%</span>
              </div>
              <div className="weather-detail-item">
                <span className="weather-detail-label">Viento</span>
                <span className="weather-detail-val" style={{ display: "flex", alignItems: "center", gap: "2px" }}>
                  <IconWind className="w-3 h-3 text-blue" /> {weatherData.current.wind_speed_10m.toFixed(0)} km/h
                </span>
              </div>
            </div>
          </div>

          {/* 5-Day Forecast Card */}
          <div className="card glass-panel" style={{ padding: "14px" }}>
            <h4 className="forecast-title" style={{ display: "flex", alignItems: "center", gap: "4px" }}>
              <IconCloud className="w-4 h-4 text-blue" /> Previsión para los próximos 7 días
            </h4>
            
            <div className="forecast-scroll-row">
              {weatherData.daily.time.map((timeStr, idx) => {
                const label = getForecastDayLabel(timeStr);
                const info = getWeatherInfo(weatherData.daily.weather_code[idx]);
                const uv = weatherData.daily.uv_index_max[idx];
                
                return (
                  <div key={timeStr} className="forecast-card">
                    <span className="forecast-day">{label.dayName}</span>
                    <span className="forecast-date">{label.dateFormatted}</span>
                    <span className="forecast-icon">{info.icon}</span>
                    <span className="forecast-temp">
                      {weatherData.daily.temperature_2m_max[idx].toFixed(0)}° / {weatherData.daily.temperature_2m_min[idx].toFixed(0)}°
                    </span>
                    <span className="forecast-uv" title={`Índice UV máximo: ${uv}`}>
                      UV {uv.toFixed(0)}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>

          <div style={{ display: "flex", gap: "6px", alignItems: "center", background: "rgba(0,0,0,0.15)", padding: "8px 10px", borderRadius: "8px", border: "1px solid rgba(255,255,255,0.02)", marginTop: "10px" }}>
            <IconInfo className="w-4 h-4 text-gold shrink-0" />
            <p style={{ margin: "0", fontSize: "0.6rem", color: "#94a3b8", lineHeight: "1.3" }}>
              Previsión en tiempo real obtenida de Open-Meteo. El clima de China en julio es húmedo y caluroso, con posibles tormentas repentinas. ¡Protección solar UV recomendada!
            </p>
          </div>
        </>
      )}
    </div>
  );
}
