import React, { useState } from "react";
import { IconBookOpen, IconVolume, IconSearch, IconInfo, IconPlus, IconTrash } from "./Icons";

export default function SurvivalGuide({ survival, updateSurvival }) {
  const [activeTab, setActiveTab] = useState("apps"); // apps, phrases, tips
  const [searchTerm, setSearchTerm] = useState("");

  // Custom Phrase adding state
  const [isAddingPhrase, setIsAddingPhrase] = useState(false);
  const [newPhrase, setNewPhrase] = useState({ esp: "", pinyin: "", hanzi: "" });

  const handleSpeak = (text) => {
    if ("speechSynthesis" in window) {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = "zh-CN";
      utterance.rate = 0.8;
      window.speechSynthesis.speak(utterance);
    } else {
      alert("La síntesis de voz no está soportada en tu navegador.");
    }
  };

  const handleAddPhrase = (e) => {
    e.preventDefault();
    if (!newPhrase.esp || !newPhrase.hanzi) return;

    const updatedPhrases = [
      ...(survival.phrases || []),
      {
        esp: newPhrase.esp.trim(),
        pinyin: newPhrase.pinyin.trim() || "N/A",
        hanzi: newPhrase.hanzi.trim()
      }
    ];

    updateSurvival({
      ...survival,
      phrases: updatedPhrases
    });

    setIsAddingPhrase(false);
    setNewPhrase({ esp: "", pinyin: "", hanzi: "" });
  };

  const handleDeletePhrase = (espText) => {
    if (!confirm("¿Deseas eliminar esta frase?")) return;
    const updatedPhrases = survival.phrases.filter(p => p.esp !== espText);
    updateSurvival({
      ...survival,
      phrases: updatedPhrases
    });
  };

  // Safe checks for arrays in case database structure was corrupted
  const phrasesList = survival?.phrases || [];
  const appsList = survival?.apps || [];
  const tipsList = survival?.tips || [];

  const filteredPhrases = phrasesList.filter(phrase => 
    phrase.esp.toLowerCase().includes(searchTerm.toLowerCase()) ||
    phrase.pinyin.toLowerCase().includes(searchTerm.toLowerCase()) ||
    phrase.hanzi.includes(searchTerm)
  );

  const filteredApps = appsList.filter(app =>
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
          Diccionario de Viaje
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
            placeholder={activeTab === "apps" ? "Buscar aplicaciones..." : "Buscar frases..."}
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

      {/* Tab 2: Phrases with Custom Vocabulary Editor */}
      {activeTab === "phrases" && (
        <div className="phrases-section glass-panel">
          <div className="phrases-subheader">
            <div className="phrases-header-info">
              <IconInfo className="w-4 h-4 text-blue shrink-0" />
              <p>Pulsa en <IconVolume className="w-4 h-4 inline-block text-gold" /> para oír la pronunciación en chino mandarín. ¡Calculado por voz sintética!</p>
            </div>
            {!isAddingPhrase && (
              <button 
                type="button" 
                className="btn-primary btn-sm add-custom-phrase-btn"
                onClick={() => setIsAddingPhrase(true)}
              >
                <IconPlus className="w-4.5 h-4.5" /> Añadir Vocabulario
              </button>
            )}
          </div>

          {/* Add Phrase Form Inline */}
          {isAddingPhrase && (
            <form onSubmit={handleAddPhrase} className="add-phrase-inline-form">
              <h4>Añadir Vocabulario Propio</h4>
              <div className="form-row-3">
                <div className="form-group">
                  <label>Español</label>
                  <input 
                    type="text" 
                    placeholder="Ej. Pollo con arroz..."
                    value={newPhrase.esp}
                    onChange={(e) => setNewPhrase({ ...newPhrase, esp: e.target.value })}
                    required
                  />
                </div>
                <div className="form-group">
                  <label>Pinyin (Pronunciación)</label>
                  <input 
                    type="text" 
                    placeholder="Ej. Jīròu fàn..."
                    value={newPhrase.pinyin}
                    onChange={(e) => setNewPhrase({ ...newPhrase, pinyin: e.target.value })}
                  />
                </div>
                <div className="form-group">
                  <label>Caracteres Chinos (Hanzi)</label>
                  <input 
                    type="text" 
                    placeholder="Ej. 鸡肉饭..."
                    value={newPhrase.hanzi}
                    onChange={(e) => setNewPhrase({ ...newPhrase, hanzi: e.target.value })}
                    required
                  />
                </div>
              </div>
              <div className="form-actions">
                <button type="button" className="btn-secondary btn-sm" onClick={() => setIsAddingPhrase(false)}>Cancelar</button>
                <button type="submit" className="btn-primary btn-sm">Guardar Vocabulario</button>
              </div>
            </form>
          )}

          <div className="phrases-list-grid">
            {filteredPhrases.map(phrase => (
              <div key={phrase.esp} className="phrase-card">
                <div className="phrase-meanings">
                  <span className="phrase-esp">{phrase.esp}</span>
                  <span className="phrase-pinyin">{phrase.pinyin}</span>
                  <span className="phrase-hanzi">{phrase.hanzi}</span>
                </div>
                <div className="phrase-actions">
                  <button 
                    className="speak-btn"
                    onClick={() => handleSpeak(phrase.hanzi)}
                    title="Escuchar pronunciación"
                  >
                    <IconVolume className="w-5 h-5 text-white" />
                  </button>
                  {/* Delete button for phrases */}
                  <button 
                    className="delete-phrase-btn-card"
                    onClick={() => handleDeletePhrase(phrase.esp)}
                    title="Eliminar frase"
                  >
                    <IconTrash className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
            {filteredPhrases.length === 0 && <p className="no-results">No se encontraron frases en el diccionario.</p>}
          </div>
        </div>
      )}

      {/* Tab 3: Cultural Tips */}
      {activeTab === "tips" && (
        <div className="tips-list-grid">
          {tipsList.map(tip => (
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
