"use client";

import React, { useState, useEffect } from "react";
import DashboardView from "@/components/DashboardView";
import ItineraryView from "@/components/ItineraryView";
import ExpenseTracker from "@/components/ExpenseTracker";
import PackingList from "@/components/PackingList";
import SurvivalGuide from "@/components/SurvivalGuide";
import { 
  initialItinerary, initialPacking, initialSurvival, initialExpenses 
} from "@/data/initialData";
import { 
  IconCalendar, IconBriefcase, IconDollar, IconBookOpen, IconCompass, 
  IconShare, IconLock, IconCheck, IconInfo, IconClock, IconVolume 
} from "@/components/Icons";

export default function Home() {
  const [activeTab, setActiveTab] = useState("dashboard");
  const [tripId, setTripId] = useState("default");
  
  // App States initialized with local templates (no more blank screens)
  const [itinerary, setItinerary] = useState(initialItinerary);
  const [packing, setPacking] = useState(initialPacking);
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

  // Monitor network connectivity
  useEffect(() => {
    if (typeof window !== "undefined") {
      setIsOffline(!navigator.onLine);
      
      const handleOnline = () => {
        setIsOffline(false);
        // Auto-sync if online and changes are pending
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
  }, [pendingSync, itinerary, packing, survival, expenses, budget]);

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
        setPacking(result.data.packing || initialPacking);
        // Fallback to template if DB is empty or missing survival guides
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
      // Fallback to local storage
      const cached = localStorage.getItem(`china_trip_${id}`);
      if (cached) {
        try {
          const cachedData = JSON.parse(cached);
          setItinerary(cachedData.itinerary || initialItinerary);
          setPacking(cachedData.packing || initialPacking);
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
    const dataToSave = { itinerary, packing, survival, expenses, budget };
    
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
      packing: updatedFields.packing !== undefined ? updatedFields.packing : packing,
      survival: updatedFields.survival !== undefined ? updatedFields.survival : survival,
      expenses: updatedFields.expenses !== undefined ? updatedFields.expenses : expenses,
      budget: updatedFields.budget !== undefined ? updatedFields.budget : budget
    };

    // Update local state immediately
    if (updatedFields.itinerary !== undefined) setItinerary(updatedFields.itinerary);
    if (updatedFields.packing !== undefined) setPacking(updatedFields.packing);
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
  const updatePacking = (newPacking) => saveTripData({ packing: newPacking });
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

  // Double check fallback to survive guide (redundant safety)
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
            className={`nav-tab-btn ${activeTab === "packing" ? "active" : ""}`}
            onClick={() => setActiveTab("packing")}
          >
            <IconBriefcase className="w-4 h-4" /> Maleta
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
            packing={packing} 
            expenses={expenses}
            updateItinerary={updateItinerary}
            showTaxiHelper={showTaxiHelper}
          />
        )}
        {activeTab === "itinerary" && (
          <ItineraryView 
            itinerary={itinerary} 
            updateItinerary={updateItinerary} 
            showTaxiHelper={showTaxiHelper}
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
        {activeTab === "packing" && (
          <PackingList 
            packing={packing} 
            updatePacking={updatePacking} 
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
          className={`mobile-tab-btn ${activeTab === "packing" ? "active" : ""}`}
          onClick={() => setActiveTab("packing")}
        >
          <IconBriefcase className="w-5 h-5" />
          <span>Maleta</span>
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
              {/* Polite instructions in Chinese to the driver */}
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
    </div>
  );
}
