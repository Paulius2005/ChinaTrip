import React, { useState } from "react";
import { IconBookOpen, IconVolume, IconSearch, IconInfo } from "./Icons";

export default function SurvivalGuide({ survival }) {
  const [activeTab, setActiveTab] = useState("apps"); // apps, phrases, tips
  const [searchTerm, setSearchTerm] = useState("");

  const handleSpeak = (text) => {
    if ("speechSynthesis" in window) {
      // Cancel any ongoing speech first
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = "zh-CN";
      utterance.rate = 0.8; // slightly slower for learning
      window.speechSynthesis.speak(utterance);
    } else {
      alert("La síntesis de voz no está soportada en tu navegador.");
    }
  };

  const filteredPhrases = survival.phrases.filter(phrase => 
    phrase.esp.toLowerCase().includes(searchTerm.toLowerCase()) ||
    phrase.pinyin.toLowerCase().includes(searchTerm.toLowerCase()) ||
    phrase.hanzi.includes(searchTerm)
  );

  const filteredApps = survival.apps.filter(app =>
    app.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    app.desc.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="survival-container">
      {/* Navigation tabs within survival guide */}
      <div className="survival-nav glass-panel">
        <button 
          className={`survival-tab-btn ${activeTab === "apps" ? "active" : ""}`}
          onClick={() => { setActiveTab("apps"); setSearchTerm(""); }}
        >
          Aplicaciones Esenciales
        </button>
        <button 
          className={`survival-tab-btn ${activeTab === "phrases" ? "active" : ""}`}
          onClick={() => { setActiveTab("phrases"); setSearchTerm(""); }}
        >
          Frases de Supervivencia
        </button>
        <button 
          className={`survival-tab-btn ${activeTab === "tips" ? "active" : ""}`}
          onClick={() => { setActiveTab("tips"); setSearchTerm(""); }}
        >
          Consejos Culturales
        </button>
      </div>

      {/* Search Input for Apps and Phrases */}
      {activeTab !== "tips" && (
        <div className="search-bar-container glass-panel">
          <IconSearch className="w-5 h-5 text-gray" />
          <input
            type="text"
            placeholder={activeTab === "apps" ? "Buscar aplicaciones..." : "Buscar frases en español o pinyin..."}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      )}

      {/* Tab 1: Apps */}
      {activeTab === "apps" && (
        <div className="apps-grid">
          {filteredApps.map(app => (
            <div key={app.name} className="app-card glass-panel">
              <div className="app-card-header">
                <span className="app-category">{app.category}</span>
                <h3 className="app-name">{app.name}</h3>
              </div>
              <p className="app-desc">{app.desc}</p>
            </div>
          ))}
          {filteredApps.length === 0 && <p className="no-results">No se encontraron aplicaciones.</p>}
        </div>
      )}

      {/* Tab 2: Phrases with text-to-speech */}
      {activeTab === "phrases" && (
        <div className="phrases-section glass-panel">
          <div className="phrases-header-info">
            <IconInfo className="w-4 h-4 text-gold shrink-0" />
            <p>Haz clic en el icono del altavoz <IconVolume className="w-4 h-4 inline-block text-gold" /> para escuchar la pronunciación correcta en mandarín.</p>
          </div>
          <div className="phrases-list-grid">
            {filteredPhrases.map(phrase => (
              <div key={phrase.esp} className="phrase-card">
                <div className="phrase-meanings">
                  <span className="phrase-esp">{phrase.esp}</span>
                  <span className="phrase-pinyin">{phrase.pinyin}</span>
                  <span className="phrase-hanzi">{phrase.hanzi}</span>
                </div>
                <button 
                  className="speak-btn"
                  onClick={() => handleSpeak(phrase.hanzi)}
                  title="Escuchar pronunciación"
                >
                  <IconVolume className="w-5 h-5 text-white" />
                </button>
              </div>
            ))}
            {filteredPhrases.length === 0 && <p className="no-results">No se encontraron frases.</p>}
          </div>
        </div>
      )}

      {/* Tab 3: Cultural Tips */}
      {activeTab === "tips" && (
        <div className="tips-list-grid">
          {survival.tips.map(tip => (
            <div key={tip.title} className="tip-card glass-panel">
              <h3 className="tip-card-title">{tip.title}</h3>
              <p className="tip-card-content">{tip.content}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
