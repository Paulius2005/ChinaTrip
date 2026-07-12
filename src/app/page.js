"use client";

import React, { useState, useEffect } from "react";
import DashboardView from "@/components/DashboardView";
import ItineraryView from "@/components/ItineraryView";
import ExpenseTracker from "@/components/ExpenseTracker";
import SurvivalGuide from "@/components/SurvivalGuide";
import { 
  initialItinerary, initialSurvival, initialExpenses 
} from "@/data/initialData";
import { 
  IconCalendar, IconDollar, IconBookOpen, IconCompass, 
  IconShare, IconLock, IconCheck, IconInfo, IconClock, IconVolume, IconPlane
} from "@/components/Icons";

export default function Home() {
  const [activeTab, setActiveTab] = useState("dashboard");
  const [tripId, setTripId] = useState("default");
  
  // App States initialized with local templates (no more blank screens)
  const [itinerary, setItinerary] = useState(initialItinerary);
  const [survival, setSurvival] = useState(initialSurvival);
  const [expenses, setExpenses] = useState(initialExpenses);
  const [budget, setBudget] = useState(3000);

  // Sync and System States
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [synced, setSynced] = useState(false);
  const [shareCopied, setShareCopied] = useState(false);
  const [inputTripId, setInputTripId] = useState("");
  const [isOffline, setIsOffline] = useState(false);
  const [pendingSync, setPendingSync] = useState(false);

  // Taxi Helper State
  const [taxiHotel, setTaxiHotel] = useState(null);
  const [highContrast, setHighContrast] = useState(true);

  // Flight Tracker State
  const [activeFlight, setActiveFlight] = useState(null); // flight object or code

  // Monitor network connectivity
  useEffect(() => {
    if (typeof window !== "undefined") {
      setIsOffline(!navigator.onLine);
      
      const handleOnline = () => {
        setIsOffline(false);
        if (pendingSync) {
          triggerSync();
        }
      };
      
      const handleOffline = () => {
        setIsOffline(true);
        setSynced(false);
      };

      window.addEventListener("online", handleOnline);
      window.addEventListener("offline", handleOffline);

      return () => {
        window.removeEventListener("online", handleOnline);
        window.removeEventListener("offline", handleOffline);
      };
    }
  }, [pendingSync, itinerary, survival, expenses, budget]);

  // Detect Trip ID from URL and Load Data
  useEffect(() => {
    if (typeof window !== "undefined") {
      const params = new URLSearchParams(window.location.search);
      const tripParam = params.get("trip") || "default";
      setTripId(tripParam);
      setInputTripId(tripParam === "default" ? "" : tripParam);
      loadTripData(tripParam);
    }
  }, []);

  const loadTripData = async (id) => {
    setLoading(true);
    try {
      const res = await fetch(`/api/trip?id=${id}`);
      const result = await res.json();
      
      if (result.success && result.data) {
        setItinerary(result.data.itinerary || initialItinerary);
        setSurvival(result.data.survival || initialSurvival);
        setExpenses(result.data.expenses || initialExpenses);
        setBudget(result.data.budget || 3000);
        setSynced(result.synced);
        
        // Cache in local storage
        localStorage.setItem(`china_trip_${id}`, JSON.stringify(result.data));
      } else {
        throw new Error(result.error || "Failed to fetch");
      }
    } catch (error) {
      console.warn("Could not load from API, trying local storage cache:", error);
      const cached = localStorage.getItem(`china_trip_${id}`);
      if (cached) {
        try {
          const cachedData = JSON.parse(cached);
          setItinerary(cachedData.itinerary || initialItinerary);
          setSurvival(cachedData.survival || initialSurvival);
          setExpenses(cachedData.expenses || initialExpenses);
          setBudget(cachedData.budget || 3000);
        } catch (e) {
          console.error("Local cache parse error", e);
        }
      }
      setSynced(false);
    } finally {
      setLoading(false);
    }
  };

  // Immediate/Queued Sync trigger
  const triggerSync = async () => {
    if (isOffline) return;
    
    setSaving(true);
    const dataToSave = { itinerary, survival, expenses, budget };
    
    try {
      const res = await fetch(`/api/trip?id=${tripId}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(dataToSave)
      });
      const result = await res.json();
      setSynced(result.synced);
      if (result.synced) {
        setPendingSync(false);
      }
    } catch (error) {
      console.error("Failed to sync to database:", error);
      setSynced(false);
      setPendingSync(true);
    } finally {
      setSaving(false);
    }
  };

  // Save changes locally and try syncing
  const saveTripData = async (updatedFields) => {
    const currentData = {
      itinerary: updatedFields.itinerary !== undefined ? updatedFields.itinerary : itinerary,
      survival: updatedFields.survival !== undefined ? updatedFields.survival : survival,
      expenses: updatedFields.expenses !== undefined ? updatedFields.expenses : expenses,
      budget: updatedFields.budget !== undefined ? updatedFields.budget : budget
    };

    // Update local state immediately
    if (updatedFields.itinerary !== undefined) setItinerary(updatedFields.itinerary);
    if (updatedFields.survival !== undefined) setSurvival(updatedFields.survival);
    if (updatedFields.expenses !== undefined) setExpenses(updatedFields.expenses);
    if (updatedFields.budget !== undefined) setBudget(updatedFields.budget);

    // Save to localStorage immediately
    localStorage.setItem(`china_trip_${tripId}`, JSON.stringify(currentData));

    // Try API write
    if (isOffline) {
      setPendingSync(true);
      setSynced(false);
    } else {
      setSaving(true);
      try {
        const res = await fetch(`/api/trip?id=${tripId}`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(currentData)
        });
        const result = await res.json();
        setSynced(result.synced);
        setPendingSync(!result.synced);
      } catch (error) {
        console.error("Failed to sync to database:", error);
        setSynced(false);
        setPendingSync(true);
      } finally {
        setSaving(false);
      }
    }
  };

  const updateItinerary = (newItinerary) => saveTripData({ itinerary: newItinerary });
  const updateSurvival = (newSurvival) => saveTripData({ survival: newSurvival });
  const updateExpenses = (newExpenses) => saveTripData({ expenses: newExpenses });
  const updateBudget = (newBudget) => saveTripData({ budget: newBudget });

  // Share url helper
  const getShareUrl = () => {
    if (typeof window !== "undefined") {
      const base = window.location.origin + window.location.pathname;
      return tripId === "default" ? base : `${base}?trip=${tripId}`;
    }
    return "";
  };

  const handleCopyShare = () => {
    navigator.clipboard.writeText(getShareUrl());
    setShareCopied(true);
    setTimeout(() => setShareCopied(false), 2000);
  };

  const handleChangeTripId = (e) => {
    e.preventDefault();
    const cleanId = inputTripId.trim().toLowerCase().replace(/[^a-z0-9_-]/g, "-");
    if (!cleanId) return;

    if (typeof window !== "undefined") {
      const base = window.location.origin + window.location.pathname;
      window.location.href = cleanId === "default" ? base : `${base}?trip=${cleanId}`;
    }
  };

  const showTaxiHelper = (lodging) => {
    if (!lodging || lodging.name === "Noche a bordo del avión") return;
    setTaxiHotel(lodging);
  };

  // Flight Tracker details database
  const flightDatabase = {
    CA840: {
      number: "CA840",
      airline: "Air China",
      origin: "Barcelona",
      originCode: "BCN",
      originTerminal: "T1",
      destination: "Shanghái Pudong",
      destinationCode: "PVG",
      destinationTerminal: "T2",
      scheduleDep: "15:30",
      scheduleArr: "10:30 (+1)",
      duration: "12h 35m",
      aircraft: "Airbus A350-900",
      flightradarUrl: "https://www.flightradar24.com/data/flights/ca840",
      flightawareUrl: "https://flightaware.com/live/flight/CCA840",
      logo: "✈️"
    },
    CA571: {
      number: "CA571",
      airline: "Air China",
      origin: "Pekín Capital",
      originCode: "PEK",
      originTerminal: "T3",
      destination: "Barcelona",
      destinationCode: "BCN",
      destinationTerminal: "T1",
      scheduleDep: "02:30",
      scheduleArr: "08:15",
      duration: "11h 45m",
      aircraft: "Airbus A350-900",
      flightradarUrl: "https://www.flightradar24.com/data/flights/ca571",
      flightawareUrl: "https://flightaware.com/live/flight/CCA571",
      logo: "✈️"
    },
    "3U8974": {
      number: "3U8974",
      airline: "Sichuan Airlines",
      origin: "Shanghái Hongqiao",
      originCode: "SHA",
      originTerminal: "T2",
      destination: "Chongqing Jiangbei",
      destinationCode: "CKG",
      destinationTerminal: "T3",
      scheduleDep: "12:40",
      scheduleArr: "15:25",
      duration: "2h 45m",
      aircraft: "Airbus A321",
      flightradarUrl: "https://www.flightradar24.com/data/flights/3u8974",
      flightawareUrl: "https://flightaware.com/live/flight/CSC8974",
      logo: "✈️"
    }
  };

  const showFlightModal = (flightCode) => {
    const code = (flightCode || "").toUpperCase().replace(/\s/g, "");
    const flightObj = flightDatabase[code] || {
      number: code,
      airline: code.startsWith("CA") ? "Air China" : code.startsWith("3U") ? "Sichuan Airlines" : "Línea Aérea",
      origin: "Detectando...",
      originCode: "---",
      destination: "Detectando...",
      destinationCode: "---",
      scheduleDep: "--:--",
      scheduleArr: "--:--",
      duration: "--",
      aircraft: "Desconocido",
      flightradarUrl: `https://www.flightradar24.com/data/flights/${code.toLowerCase()}`,
      flightawareUrl: `https://flightaware.com/live/flight/${code}`
    };
    setActiveFlight(flightObj);
  };

  if (loading) {
    return (
      <div className="app-loading-screen">
        <div className="loader-container">
          <div className="loader-spinner"></div>
          <p>Cargando tu itinerario...</p>
        </div>
      </div>
    );
  }

  const survivalData = survival || initialSurvival;

  return (
    <div className="app-layout">
      {/* Offline Alert Banner */}
      {isOffline && (
        <div className="system-alert-banner bg-orange text-white">
          <IconInfo className="w-5 h-5 shrink-0" />
          <span>Estás sin conexión a Internet. Todos los cambios se guardarán localmente en tu móvil.</span>
        </div>
      )}

      {/* Sync Pending Alert Banner */}
      {!isOffline && pendingSync && (
        <div className="system-alert-banner bg-gold text-dark">
          <IconInfo className="w-5 h-5 shrink-0" />
          <span>Tienes cambios guardados en el dispositivo pendientes de subir a la nube.</span>
          <button className="sync-btn-banner" onClick={triggerSync}>
            Sincronizar ahora
          </button>
        </div>
      )}

      {/* Top Header Navigation */}
      <header className="app-header glass-panel">
        <div className="header-brand">
          <span className="header-logo">🇨🇳</span>
          <div className="header-texts">
            <h1>China Trip Planner</h1>
            <span className="header-status">
              {isOffline ? (
                <span className="status-indicator offline">● Modo Offline (Guardando Local)</span>
              ) : synced ? (
                <span className="status-indicator synced">● Nube Sincronizada ({tripId})</span>
              ) : (
                <span className="status-indicator pending" onClick={triggerSync}>
                  ● Cambios sin subir (Haz clic para Sincronizar)
                </span>
              )}
              {saving && <span className="saving-spinner"> Guardando...</span>}
            </span>
          </div>
        </div>

        {/* Tab Selector Desktop */}
        <nav className="header-nav">
          <button 
            className={`nav-tab-btn ${activeTab === "dashboard" ? "active" : ""}`}
            onClick={() => setActiveTab("dashboard")}
          >
            <IconCompass className="w-4 h-4" /> Inicio
          </button>
          <button 
            className={`nav-tab-btn ${activeTab === "itinerary" ? "active" : ""}`}
            onClick={() => setActiveTab("itinerary")}
          >
            <IconCalendar className="w-4 h-4" /> Itinerario
          </button>
          <button 
            className={`nav-tab-btn ${activeTab === "expenses" ? "active" : ""}`}
            onClick={() => setActiveTab("expenses")}
          >
            <IconDollar className="w-4 h-4" /> Gastos
          </button>
          <button 
            className={`nav-tab-btn ${activeTab === "survival" ? "active" : ""}`}
            onClick={() => setActiveTab("survival")}
          >
            <IconBookOpen className="w-4 h-4" /> Guía
          </button>
        </nav>
      </header>

      {/* Main Content Area */}
      <main className="app-main-content">
        {activeTab === "dashboard" && (
          <DashboardView 
            itinerary={itinerary} 
            expenses={expenses}
            updateItinerary={updateItinerary}
            showTaxiHelper={showTaxiHelper}
            showFlightModal={showFlightModal}
          />
        )}
        {activeTab === "itinerary" && (
          <ItineraryView 
            itinerary={itinerary} 
            updateItinerary={updateItinerary} 
            showTaxiHelper={showTaxiHelper}
            showFlightModal={showFlightModal}
          />
        )}
        {activeTab === "expenses" && (
          <ExpenseTracker 
            expenses={expenses} 
            budget={budget}
            updateExpenses={updateExpenses}
            updateBudget={updateBudget}
          />
        )}
        {activeTab === "survival" && (
          <SurvivalGuide 
            survival={survivalData} 
            updateSurvival={updateSurvival}
          />
        )}
      </main>

      {/* Footer & Settings */}
      <footer className="app-footer glass-panel">
        <div className="footer-flex">
          {/* Trip Share Link */}
          <div className="footer-share-section">
            <span className="footer-label">
              <IconShare className="w-4 h-4 inline-block text-gold mr-1" /> Compartir viaje:
            </span>
            <div className="share-link-group">
              <input 
                type="text" 
                readOnly 
                value={getShareUrl()} 
                onClick={(e) => e.target.select()}
              />
              <button 
                className={`btn-primary btn-sm ${shareCopied ? "copied" : ""}`}
                onClick={handleCopyShare}
              >
                {shareCopied ? "¡Copiado!" : "Copiar Enlace"}
              </button>
            </div>
            <p className="share-desc">Cualquiera con este enlace compartirá vuestro plan y gastos en tiempo real.</p>
          </div>

          {/* Database Trip ID selector */}
          <div className="footer-trip-id-section">
            <span className="footer-label">
              <IconLock className="w-4 h-4 inline-block text-red mr-1" /> Cargar otro código de viaje:
            </span>
            <form onSubmit={handleChangeTripId} className="trip-id-form">
              <input 
                type="text" 
                placeholder="Ej. nuria-viaje..." 
                value={inputTripId}
                onChange={(e) => setInputTripId(e.target.value)}
              />
              <button type="submit" className="btn-secondary btn-sm">Cargar</button>
            </form>
          </div>
        </div>
        <p className="copyright-tag">Planificador de Viaje a China 🇨🇳 © 2026. Diseñado para viajeros.</p>
      </footer>

      {/* Tab Selector Mobile Sticky */}
      <nav className="mobile-nav-bar glass-panel">
        <button 
          className={`mobile-tab-btn ${activeTab === "dashboard" ? "active" : ""}`}
          onClick={() => setActiveTab("dashboard")}
        >
          <IconCompass className="w-5 h-5" />
          <span>Inicio</span>
        </button>
        <button 
          className={`mobile-tab-btn ${activeTab === "itinerary" ? "active" : ""}`}
          onClick={() => setActiveTab("itinerary")}
        >
          <IconCalendar className="w-5 h-5" />
          <span>Itinerario</span>
        </button>
        <button 
          className={`mobile-tab-btn ${activeTab === "expenses" ? "active" : ""}`}
          onClick={() => setActiveTab("expenses")}
        >
          <IconDollar className="w-5 h-5" />
          <span>Gastos</span>
        </button>
        <button 
          className={`mobile-tab-btn ${activeTab === "survival" ? "active" : ""}`}
          onClick={() => setActiveTab("survival")}
        >
          <IconBookOpen className="w-5 h-5" />
          <span>Guía</span>
        </button>
      </nav>

      {/* TAXI DRIVER FULLSCREEN HELPER MODAL */}
      {taxiHotel && (
        <div className="taxi-modal-overlay">
          <div className={`taxi-modal-content ${highContrast ? "high-contrast" : ""}`}>
            <button className="taxi-close-btn" onClick={() => setTaxiHotel(null)}>✕ Cerrar</button>
            
            <div className="taxi-modal-header">
              <span className="taxi-card-badge">INSTRUCCIONES PARA EL TAXISTA / 给司机的指南</span>
              <button 
                type="button"
                className="contrast-toggle-btn"
                onClick={() => setHighContrast(!highContrast)}
              >
                {highContrast ? "Modo Normal" : "Contraste Máximo (Fondo Amarillo)"}
              </button>
            </div>

            <div className="taxi-card-body">
              <p className="taxi-chinese-intro">师傅，您好！请带我去这个地址，谢谢：</p>
              
              <div className="taxi-address-box">
                <h2 className="taxi-hotel-name-chinese">{taxiHotel.nameChinese || taxiHotel.name}</h2>
                <p className="taxi-hotel-address-chinese">{taxiHotel.addressChinese || taxiHotel.address}</p>
              </div>

              <div className="taxi-address-english-box">
                <h4 className="taxi-hotel-name-english">{taxiHotel.name}</h4>
                <p className="taxi-hotel-address-english">{taxiHotel.address}</p>
              </div>
            </div>

            <div className="taxi-modal-footer">
              <p>Muestra esta pantalla directamente al conductor de taxi. La combinación de color amarillo y negro de alto contraste facilita su lectura en la oscuridad o a través de la mampara del taxi.</p>
            </div>
          </div>
        </div>
      )}

      {/* FLIGHT STATUS TRACKER MODAL */}
      {activeFlight && (
        <div className="taxi-modal-overlay" onClick={() => setActiveFlight(null)}>
          <div className="taxi-modal-content" onClick={(e) => e.stopPropagation()} style={{ background: "#0b1528", border: "1px solid #1d4ed8", maxWidth: "580px" }}>
            <button className="taxi-close-btn" onClick={() => setActiveFlight(null)} style={{ background: "rgba(59, 130, 246, 0.2)", color: "#60a5fa" }}>✕ Cerrar</button>
            
            <div className="taxi-modal-header" style={{ borderBottom: "1px solid #1e3a8a" }}>
              <span className="taxi-card-badge" style={{ background: "#1e40af", color: "#93c5fd" }}>ESTADO DE VUELO EN TIEMPO REAL</span>
              <span style={{ fontSize: "0.85rem", color: "#93c5fd", fontWeight: "bold" }}>{activeFlight.airline}</span>
            </div>

            <div className="taxi-card-body" style={{ color: "#f8fafc" }}>
              <div className="text-center" style={{ marginBottom: "20px" }}>
                <span style={{ fontSize: "2.5rem", fontWeight: "900", color: "#3b82f6", letterSpacing: "1px" }}>{activeFlight.number}</span>
                <p style={{ fontSize: "0.85rem", color: "#94a3b8", marginTop: "2px" }}>Aeronave: {activeFlight.aircraft}</p>
              </div>

              <div className="flight-route-box" style={{ background: "rgba(0,0,0,0.3)", padding: "20px", borderRadius: "12px", border: "1px solid rgba(59, 130, 246, 0.15)", marginBottom: "24px" }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <div style={{ textAlign: "left" }}>
                    <span style={{ fontSize: "2rem", fontWeight: "800", display: "block" }}>{activeFlight.originCode}</span>
                    <span style={{ fontSize: "0.85rem", color: "#94a3b8" }}>{activeFlight.origin}</span>
                    {activeFlight.originTerminal && <span style={{ display: "block", fontSize: "0.75rem", color: "#fbbf24", marginTop: "2px" }}>Terminal {activeFlight.originTerminal}</span>}
                  </div>
                  <div style={{ flexGrow: 1, display: "flex", flexDirection: "column", alignItems: "center", position: "relative", padding: "0 10px" }}>
                    <span style={{ fontSize: "0.75rem", color: "#60a5fa", fontStyle: "italic", marginBottom: "4px" }}>Duración: {activeFlight.duration}</span>
                    <div style={{ width: "100%", height: "2px", background: "linear-gradient(to right, #1d4ed8, #60a5fa, #1d4ed8)", position: "relative" }}>
                      <span style={{ position: "absolute", left: "50%", top: "-10px", transform: "translateX(-50%)", fontSize: "1.1rem" }}>✈️</span>
                    </div>
                  </div>
                  <div style={{ textAlign: "right" }}>
                    <span style={{ fontSize: "2rem", fontWeight: "800", display: "block" }}>{activeFlight.destinationCode}</span>
                    <span style={{ fontSize: "0.85rem", color: "#94a3b8" }}>{activeFlight.destination}</span>
                    {activeFlight.destinationTerminal && <span style={{ display: "block", fontSize: "0.75rem", color: "#fbbf24", marginTop: "2px" }}>Terminal {activeFlight.destinationTerminal}</span>}
                  </div>
                </div>

                <div style={{ display: "flex", justifyContent: "space-between", borderTop: "1px dashed rgba(255,255,255,0.1)", marginTop: "16px", paddingTop: "12px", fontSize: "0.85rem" }}>
                  <div>
                    <span style={{ color: "#94a3b8", display: "block" }}>Salida Prevista:</span>
                    <strong style={{ fontSize: "1rem", color: "#f8fafc" }}>{activeFlight.scheduleDep}</strong>
                  </div>
                  <div style={{ textAlign: "right" }}>
                    <span style={{ color: "#94a3b8", display: "block" }}>Llegada Prevista:</span>
                    <strong style={{ fontSize: "1rem", color: "#f8fafc" }}>{activeFlight.scheduleArr}</strong>
                  </div>
                </div>
              </div>

              <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
                <p style={{ fontSize: "0.85rem", color: "#94a3b8", textAlign: "center", marginBottom: "4px" }}>
                  Sincronizar estado en tiempo real usando radares globales:
                </p>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px" }}>
                  <a 
                    href={activeFlight.flightradarUrl} 
                    target="_blank" 
                    rel="noopener noreferrer" 
                    className="btn-primary text-center flex items-center justify-center gap-2"
                    style={{ background: "#eab308", color: "#000", textDecoration: "none", borderRadius: "8px", padding: "12px", fontWeight: "bold" }}
                  >
                    🟡 Track en Flightradar24
                  </a>
                  <a 
                    href={activeFlight.flightawareUrl} 
                    target="_blank" 
                    rel="noopener noreferrer" 
                    className="btn-primary text-center flex items-center justify-center gap-2"
                    style={{ background: "#3b82f6", color: "#fff", textDecoration: "none", borderRadius: "8px", padding: "12px", fontWeight: "bold" }}
                  >
                    🔵 Track en FlightAware
                  </a>
                </div>
              </div>
            </div>

            <div className="taxi-modal-footer" style={{ borderTop: "1px solid #1e3a8a", color: "#64748b" }}>
              <p>Los datos en vivo dependen de la cobertura satelital de los radares de vuelo. Se recomienda comprobar el estado en el mostrador de facturación antes de pasar el control.</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
