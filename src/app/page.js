"use client";

import React, { useState, useEffect } from "react";
import DashboardView from "@/components/DashboardView";
import ItineraryView from "@/components/ItineraryView";
import ExpenseTracker from "@/components/ExpenseTracker";
import PackingList from "@/components/PackingList";
import SurvivalGuide from "@/components/SurvivalGuide";
import { IconCalendar, IconBriefcase, IconDollar, IconBookOpen, IconCompass, IconShare, IconLock } from "@/components/Icons";

export default function Home() {
  const [activeTab, setActiveTab] = useState("dashboard");
  const [tripId, setTripId] = useState("default");
  
  // App State
  const [itinerary, setItinerary] = useState([]);
  const [packing, setPacking] = useState([]);
  const [survival, setSurvival] = useState(null);
  const [expenses, setExpenses] = useState([]);
  const [budget, setBudget] = useState(3000);

  // Sync States
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [synced, setSynced] = useState(false);
  const [shareCopied, setShareCopied] = useState(false);
  const [inputTripId, setInputTripId] = useState("");

  // Step 1: Detect Trip ID from URL and Load Data
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
        setItinerary(result.data.itinerary || []);
        setPacking(result.data.packing || []);
        setSurvival(result.data.survival || null);
        setExpenses(result.data.expenses || []);
        setBudget(result.data.budget || 3000);
        setSynced(result.synced);
        
        // Cache in local storage
        localStorage.setItem(`china_trip_${id}`, JSON.stringify(result.data));
      } else {
        throw new Error(result.error || "Failed to fetch");
      }
    } catch (error) {
      console.warn("Could not load from API, falling back to local storage:", error);
      // Fallback to local storage
      const cached = localStorage.getItem(`china_trip_${id}`);
      if (cached) {
        try {
          const cachedData = JSON.parse(cached);
          setItinerary(cachedData.itinerary || []);
          setPacking(cachedData.packing || []);
          setSurvival(cachedData.survival || null);
          setExpenses(cachedData.expenses || []);
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

  // Step 2: Save Data Function (local + remote API)
  const saveTripData = async (updatedFields) => {
    // Merge updates with current state
    const currentData = {
      itinerary: updatedFields.itinerary !== undefined ? updatedFields.itinerary : itinerary,
      packing: updatedFields.packing !== undefined ? updatedFields.packing : packing,
      survival: updatedFields.survival !== undefined ? updatedFields.survival : survival,
      expenses: updatedFields.expenses !== undefined ? updatedFields.expenses : expenses,
      budget: updatedFields.budget !== undefined ? updatedFields.budget : budget
    };

    // Update local react states
    if (updatedFields.itinerary !== undefined) setItinerary(updatedFields.itinerary);
    if (updatedFields.packing !== undefined) setPacking(updatedFields.packing);
    if (updatedFields.survival !== undefined) setSurvival(updatedFields.survival);
    if (updatedFields.expenses !== undefined) setExpenses(updatedFields.expenses);
    if (updatedFields.budget !== undefined) setBudget(updatedFields.budget);

    // Save to localStorage immediately
    localStorage.setItem(`china_trip_${tripId}`, JSON.stringify(currentData));

    // Send to API
    setSaving(true);
    try {
      const res = await fetch(`/api/trip?id=${tripId}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(currentData)
      });
      const result = await res.json();
      setSynced(result.synced);
    } catch (error) {
      console.error("Failed to sync to database:", error);
      setSynced(false);
    } finally {
      setSaving(false);
    }
  };

  // Action helpers to pass down
  const updateItinerary = (newItinerary) => saveTripData({ itinerary: newItinerary });
  const updatePacking = (newPacking) => saveTripData({ packing: newPacking });
  const updateExpenses = (newExpenses) => saveTripData({ expenses: newExpenses });
  const updateBudget = (newBudget) => saveTripData({ budget: newBudget });

  // Share link helper
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

  // Change Trip ID handler
  const handleChangeTripId = (e) => {
    e.preventDefault();
    const cleanId = inputTripId.trim().toLowerCase().replace(/[^a-z0-9_-]/g, "-");
    if (!cleanId) return;

    // Redirect to new trip URL
    if (typeof window !== "undefined") {
      const base = window.location.origin + window.location.pathname;
      window.location.href = cleanId === "default" ? base : `${base}?trip=${cleanId}`;
    }
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

  return (
    <div className="app-layout">
      {/* Top Header Navigation */}
      <header className="app-header glass-panel">
        <div className="header-brand">
          <span className="header-logo">🇨🇳</span>
          <div className="header-texts">
            <h1>China Trip Planner</h1>
            <span className="header-status">
              {synced ? (
                <span className="status-indicator synced" title="Datos sincronizados en la nube">
                  ● Conectado a la Nube ({tripId})
                </span>
              ) : (
                <span className="status-indicator offline" title="Datos guardados en este navegador">
                  ● Almacenamiento Local ({tripId})
                </span>
              )}
              {saving && <span className="saving-spinner"> Sincronizando...</span>}
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
          />
        )}
        {activeTab === "itinerary" && (
          <ItineraryView 
            itinerary={itinerary} 
            updateItinerary={updateItinerary} 
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
        {activeTab === "survival" && survival && (
          <SurvivalGuide 
            survival={survival} 
          />
        )}
      </main>

      {/* Footer & Collaboration Settings Panel */}
      <footer className="app-footer glass-panel">
        <div className="footer-flex">
          {/* Trip Share Link */}
          <div className="footer-share-section">
            <span className="footer-label">
              <IconShare className="w-4 h-4 inline-block text-gold mr-1" /> Compartir con tu pareja/amigos:
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
            <p className="share-desc">Cualquiera con este enlace podrá ver y editar el viaje en tiempo real.</p>
          </div>

          {/* Database Trip ID selector */}
          <div className="footer-trip-id-section">
            <span className="footer-label">
              <IconLock className="w-4 h-4 inline-block text-red mr-1" /> Crear o cargar otro código de viaje:
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
    </div>
  );
}
