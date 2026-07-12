import React, { useState } from "react";
import { IconBookOpen, IconVolume, IconSearch, IconInfo, IconPlus, IconTrash } from "./Icons";

const defaultPhrases = [
  // Básico
  { esp: "Hola", pinyin: "Nǐ hǎo", hanzi: "你好", category: "Básico" },
  { esp: "Gracias", pinyin: "Xièxie", hanzi: "谢谢", category: "Básico" },
  { esp: "De nada", pinyin: "Bù kèqì", hanzi: "不客气", category: "Básico" },
  { esp: "Adiós", pinyin: "Zàijiàn", hanzi: "再见", category: "Básico" },
  { esp: "Por favor / Disculpe", pinyin: "Qǐng wèn", hanzi: "请问", category: "Básico" },
  { esp: "No entiendo", pinyin: "Wǒ tīng bù dǒng", hanzi: "听不懂", category: "Básico" },
  { esp: "¿Hablas inglés?", pinyin: "Nǐ huì shuō yīngyǔ ma?", hanzi: "你会说英语吗？", category: "Básico" },
  { esp: "Sí", pinyin: "Shì de", hanzi: "是的", category: "Básico" },
  { esp: "No", pinyin: "Bù shì", hanzi: "不是", category: "Básico" },
  
  // Comida
  { esp: "No picante", pinyin: "Bù là", hanzi: "不辣", category: "Comida" },
  { esp: "Muy poco picante", pinyin: "Wēi là", hanzi: "微辣", category: "Comida" },
  { esp: "Sin cilantro", pinyin: "Bù yào xiāngcài", hanzi: "不要香菜", category: "Comida" },
  { esp: "La cuenta", pinyin: "Mǎidān", hanzi: "买单", category: "Comida" },
  { esp: "Agua caliente (hervida)", pinyin: "Kāishuǐ", hanzi: "开水", category: "Comida" },
  { esp: "Agua fría embotellada", pinyin: "Bīng shuǐ", hanzi: "冰水", category: "Comida" },
  { esp: "Tenedor", pinyin: "Chāzi", hanzi: "叉子", category: "Comida" },
  { esp: "Palillos", pinyin: "Kuàizi", hanzi: "筷子", category: "Comida" },

  // Transporte
  { esp: "¿Dónde está el metro?", pinyin: "Dìtiě zhàn zài nǎlǐ?", hanzi: "地铁站在哪里？", category: "Transporte" },
  { esp: "¿Dónde está la parada de taxis?", pinyin: "Chūzūchē zhàn zài nǎlǐ?", hanzi: "出租车站在哪里？", category: "Transporte" },
  { esp: "Aeropuerto", pinyin: "Jīchǎng", hanzi: "机场", category: "Transporte" },
  { esp: "Estación de tren", pinyin: "Huǒchē zhàn", hanzi: "火车站", category: "Transporte" },
  { esp: "Gira a la derecha", pinyin: "Yòu guǎi", hanzi: "右拐", category: "Transporte" },
  { esp: "Gira a la izquierda", pinyin: "Zuǒ guǎi", hanzi: "左拐", category: "Transporte" },
  { esp: "Sigue recto", pinyin: "Yīzhí zǒu", hanzi: "一直走", category: "Transporte" },

  // Compras
  { esp: "¿Cuánto cuesta?", pinyin: "Duōshǎo qián?", hanzi: "多少钱？", category: "Compras" },
  { esp: "Es muy caro", pinyin: "Tài guì le", hanzi: "太贵了", category: "Compras" },
  { esp: "Más barato, por favor", pinyin: "Piányi yīdiǎn", hanzi: "便宜一点", category: "Compras" },
  { esp: "Pagar con Alipay", pinyin: "Zhīfùbǎo zhīfù", hanzi: "支付宝支付", category: "Compras" },
  { esp: "Pagar con WeChat", pinyin: "Wēixìn zhīfù", hanzi: "微信支付", category: "Compras" },

  // Urgencias
  { esp: "Necesito ayuda", pinyin: "Wǒ xūyào bāngzhù", hanzi: "我需要帮助", category: "Urgencias" },
  { esp: "Llama a la policía", pinyin: "Bāng wǒ bàojǐng", hanzi: "帮我报警", category: "Urgencias" },
  { esp: "Llama a una ambulancia", pinyin: "Bāng wǒ jiào jiùhùchē", hanzi: "帮我叫救护车", category: "Urgencias" },
  { esp: "Tengo dolor aquí", pinyin: "Wǒ zhèlǐ tòng", hanzi: "我这里痛", category: "Urgencias" }
];

export default function SurvivalGuide({ survival, updateSurvival }) {
  const [activeTab, setActiveTab] = useState("phrases"); // phrases, translator, tips
  const [selectedCategory, setSelectedCategory] = useState("Todas");
  const [searchTerm, setSearchTerm] = useState("");

  // Custom Phrase adding state
  const [isAddingPhrase, setIsAddingPhrase] = useState(false);
  const [newPhrase, setNewPhrase] = useState({ esp: "", pinyin: "", hanzi: "", category: "Favoritos" });

  // Translator State
  const [translatorText, setTranslatorText] = useState("");
  const [translatedText, setTranslatedText] = useState("");
  const [isTranslating, setIsTranslating] = useState(false);
  const [translateError, setTranslateError] = useState(null);

  const handleSpeak = (text) => {
    if ("speechSynthesis" in window) {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = "zh-CN";
      utterance.rate = 0.75; // slightly slower for absolute clarity
      window.speechSynthesis.speak(utterance);
    } else {
      alert("La síntesis de voz no está soportada en tu navegador.");
    }
  };

  const handleAddPhrase = (e) => {
    if (e) e.preventDefault();
    if (!newPhrase.esp || !newPhrase.hanzi) return;

    const updatedPhrases = [
      ...(survival.phrases || []),
      {
        esp: newPhrase.esp.trim(),
        pinyin: newPhrase.pinyin.trim() || "N/A",
        hanzi: newPhrase.hanzi.trim(),
        category: newPhrase.category || "Favoritos"
      }
    ];

    updateSurvival({
      ...survival,
      phrases: updatedPhrases
    });

    setIsAddingPhrase(false);
    setNewPhrase({ esp: "", pinyin: "", hanzi: "", category: "Favoritos" });
  };

  const handleDeletePhrase = (espText) => {
    if (!confirm("¿Deseas eliminar esta frase?")) return;
    const updatedPhrases = (survival.phrases || []).filter(p => p.esp !== espText);
    updateSurvival({
      ...survival,
      phrases: updatedPhrases
    });
  };

  const handleTranslate = async () => {
    if (!translatorText.trim()) return;
    setIsTranslating(true);
    setTranslateError(null);
    try {
      const res = await fetch(`https://api.mymemory.translated.net/get?q=${encodeURIComponent(translatorText.trim())}&langpair=es|zh-CN`);
      if (!res.ok) throw new Error("Error en el servidor de traducción.");
      const json = await res.json();
      if (json.responseData && json.responseData.translatedText) {
        setTranslatedText(json.responseData.translatedText);
      } else {
        throw new Error("Respuesta de traducción vacía.");
      }
    } catch (err) {
      setTranslateError(err.message);
    } finally {
      setIsTranslating(false);
    }
  };

  const handleSaveTranslationToDict = () => {
    if (!translatorText.trim() || !translatedText.trim()) return;
    const updatedPhrases = [
      ...(survival.phrases || []),
      {
        esp: translatorText.trim(),
        pinyin: "Traducido",
        hanzi: translatedText.trim(),
        category: "Favoritos"
      }
    ];
    updateSurvival({
      ...survival,
      phrases: updatedPhrases
    });
    alert("¡Frase agregada a la sección 'Favoritos' de tu Diccionario!");
  };

  // Merge default presets with user custom phrases from state
  const mergedPhrases = [...defaultPhrases];
  const userPhrases = survival?.phrases || [];
  
  // Ensure we don't display duplicates of defaults if they exist in user database
  userPhrases.forEach(up => {
    if (!mergedPhrases.some(dp => dp.esp.toLowerCase() === up.esp.toLowerCase())) {
      mergedPhrases.push(up);
    }
  });

  const categories = ["Todas", "Básico", "Comida", "Transporte", "Compras", "Urgencias", "Favoritos"];

  const filteredPhrases = mergedPhrases.filter(phrase => {
    const matchesSearch = phrase.esp.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          phrase.pinyin.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          phrase.hanzi.includes(searchTerm);
    const matchesCategory = selectedCategory === "Todas" || phrase.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const tipsList = survival?.tips || [];

  return (
    <div className="survival-container">
      {/* Navigation tabs within survival guide */}
      <div className="survival-nav glass-panel">
        <button 
          type="button"
          className={`survival-tab-btn ${activeTab === "phrases" ? "active" : ""}`}
          onClick={() => { setActiveTab("phrases"); setSearchTerm(""); }}
        >
          Diccionario de Viaje
        </button>
        <button 
          type="button"
          className={`survival-tab-btn ${activeTab === "translator" ? "active" : ""}`}
          onClick={() => { setActiveTab("translator"); }}
        >
          Traductor Online
        </button>
        <button 
          type="button"
          className={`survival-tab-btn ${activeTab === "tips" ? "active" : ""}`}
          onClick={() => { setActiveTab("tips"); setSearchTerm(""); }}
        >
          Consejos Culturales
        </button>
      </div>

      {/* Tab 1: Dictionary */}
      {activeTab === "phrases" && (
        <div className="phrases-section glass-panel">
          <div className="search-bar-container" style={{ display: "flex", alignItems: "center", gap: "8px", background: "rgba(0,0,0,0.2)", padding: "8px 12px", borderRadius: "8px", marginBottom: "12px", border: "1px solid rgba(255,255,255,0.05)" }}>
            <IconSearch className="w-5 h-5 text-gray" />
            <input
              type="text"
              placeholder="Buscar por español, pinyin o caracteres..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              style={{ background: "transparent", border: "none", color: "#fff", outline: "none", fontSize: "0.8rem", width: "100%" }}
            />
          </div>

          {/* Category Filter Buttons */}
          <div className="weather-city-tabs" style={{ marginBottom: "12px" }}>
            {categories.map(cat => (
              <button
                key={cat}
                type="button"
                className={`city-tab-btn ${selectedCategory === cat ? "active" : ""}`}
                onClick={() => setSelectedCategory(cat)}
                style={{ fontSize: "0.7rem", padding: "4px 8px" }}
              >
                {cat}
              </button>
            ))}
          </div>

          <div className="phrases-subheader" style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "12px", flexWrap: "wrap", gap: "8px" }}>
            <div className="phrases-header-info" style={{ display: "flex", alignItems: "center", gap: "4px", fontSize: "0.65rem", color: "#94a3b8" }}>
              <IconInfo className="w-4 h-4 text-blue shrink-0" />
              <span>Pulsa 🔊 para oír la pronunciación hablada en mandarín.</span>
            </div>
            {!isAddingPhrase && (
              <button 
                type="button" 
                className="btn-primary btn-sm add-custom-phrase-btn"
                onClick={() => setIsAddingPhrase(true)}
                style={{ fontSize: "0.7rem", padding: "4px 8px" }}
              >
                <IconPlus className="w-4 h-4" /> Añadir Frase
              </button>
            )}
          </div>

          {/* Add Phrase Form Inline */}
          {isAddingPhrase && (
            <form onSubmit={handleAddPhrase} className="add-phrase-inline-form" style={{ background: "rgba(0,0,0,0.3)", padding: "12px", borderRadius: "8px", border: "1px solid rgba(234,179,8,0.3)", marginBottom: "14px" }}>
              <h4 style={{ margin: "0 0 8px 0", fontSize: "0.75rem", color: "#eab308" }}>Nueva Frase Personalizada</h4>
              <div style={{ display: "flex", flexDirection: "column", gap: "8px", marginBottom: "8px" }}>
                <input 
                  type="text" 
                  placeholder="Español (ej: ¿Dónde hay agua fría?)" 
                  value={newPhrase.esp}
                  onChange={(e) => setNewPhrase({ ...newPhrase, esp: e.target.value })}
                  style={{ background: "rgba(0,0,0,0.2)", border: "1px solid rgba(255,255,255,0.1)", borderRadius: "4px", color: "#fff", padding: "5px", fontSize: "0.75rem" }}
                  required
                />
                <input 
                  type="text" 
                  placeholder="Caracteres Chinos / Hanzi (ej: 哪里有冷水？)" 
                  value={newPhrase.hanzi}
                  onChange={(e) => setNewPhrase({ ...newPhrase, hanzi: e.target.value })}
                  style={{ background: "rgba(0,0,0,0.2)", border: "1px solid rgba(255,255,255,0.1)", borderRadius: "4px", color: "#fff", padding: "5px", fontSize: "0.75rem" }}
                  required
                />
                <input 
                  type="text" 
                  placeholder="Pinyin (ej: Nǎlǐ yǒu lěng shuǐ? - Opcional)" 
                  value={newPhrase.pinyin}
                  onChange={(e) => setNewPhrase({ ...newPhrase, pinyin: e.target.value })}
                  style={{ background: "rgba(0,0,0,0.2)", border: "1px solid rgba(255,255,255,0.1)", borderRadius: "4px", color: "#fff", padding: "5px", fontSize: "0.75rem" }}
                />
              </div>
              <div style={{ display: "flex", justifyContent: "flex-end", gap: "6px" }}>
                <button type="button" className="btn-secondary btn-sm" onClick={() => setIsAddingPhrase(false)} style={{ fontSize: "0.65rem", padding: "2px 6px" }}>Cancelar</button>
                <button type="submit" className="btn-primary btn-sm" style={{ fontSize: "0.65rem", padding: "2px 6px" }}>Guardar</button>
              </div>
            </form>
          )}

          <div className="phrases-list-grid">
            {filteredPhrases.map(phrase => {
              // Only user added phrases can be deleted
              const isUserPhrase = userPhrases.some(up => up.esp.toLowerCase() === phrase.esp.toLowerCase());
              
              return (
                <div key={phrase.esp} className="phrase-card">
                  <div className="phrase-meanings">
                    <span className="phrase-esp" style={{ display: "flex", alignItems: "center", gap: "4px" }}>
                      {phrase.esp}
                      <span style={{ fontSize: "0.55rem", padding: "1px 3px", borderRadius: "3px", background: "rgba(255,255,255,0.05)", color: "#94a3b8" }}>
                        {phrase.category}
                      </span>
                    </span>
                    <span className="phrase-pinyin">{phrase.pinyin}</span>
                    <span className="phrase-hanzi">{phrase.hanzi}</span>
                  </div>
                  <div className="phrase-actions" style={{ display: "flex", gap: "4px" }}>
                    <button 
                      type="button"
                      className="speak-btn"
                      onClick={() => handleSpeak(phrase.hanzi)}
                      title="Escuchar pronunciación"
                    >
                      <IconVolume className="w-5 h-5 text-white" />
                    </button>
                    {isUserPhrase && (
                      <button 
                        type="button"
                        className="delete-phrase-btn-card"
                        onClick={() => handleDeletePhrase(phrase.esp)}
                        title="Eliminar frase"
                        style={{ background: "rgba(239, 68, 68, 0.1)", color: "#ef4444", border: "none", padding: "4px", borderRadius: "4px", cursor: "pointer" }}
                      >
                        <IconTrash className="w-4 h-4" />
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
            {filteredPhrases.length === 0 && <p className="no-results" style={{ textAlign: "center", gridColumn: "1/-1", color: "#94a3b8", fontSize: "0.75rem", padding: "20px 0" }}>No se encontraron frases en el diccionario.</p>}
          </div>
        </div>
      )}

      {/* Tab 2: Spanish to Chinese Online Translator */}
      {activeTab === "translator" && (
        <div className="card glass-panel" style={{ padding: "16px" }}>
          <h3 style={{ margin: "0 0 4px 0", fontSize: "0.95rem", color: "#eab308", display: "flex", alignItems: "center", gap: "6px" }}>
            🗣️ Traductor Online Español ⇄ Chino Mandarín
          </h3>
          <p style={{ margin: "0 0 12px 0", fontSize: "0.75rem", color: "#94a3b8" }}>
            Escribe cualquier frase para obtener una traducción instantánea adaptada y escuchar su pronunciación.
          </p>

          <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
            {/* Input Spanish */}
            <div>
              <label style={{ display: "block", fontSize: "0.7rem", color: "#94a3b8", marginBottom: "3px" }}>Escribe en Español:</label>
              <textarea
                rows="2"
                placeholder="Ej. Hola, ¿dónde puedo tomar un taxi al hotel?"
                value={translatorText}
                onChange={(e) => setTranslatorText(e.target.value)}
                style={{ width: "100%", padding: "8px", fontSize: "0.8rem", background: "rgba(0,0,0,0.3)", border: "1px solid rgba(255,255,255,0.1)", borderRadius: "6px", color: "#fff", resize: "none" }}
              />
            </div>

            <button
              type="button"
              className="btn-primary"
              onClick={handleTranslate}
              disabled={isTranslating || !translatorText.trim()}
              style={{ alignSelf: "flex-end", padding: "6px 16px", fontSize: "0.75rem", fontWeight: "bold" }}
            >
              {isTranslating ? "Traduciendo..." : "Traducir al Chino"}
            </button>

            {translateError && (
              <p style={{ color: "#ef4444", fontSize: "0.7rem", margin: "5px 0 0 0" }}>⚠️ {translateError}</p>
            )}

            {/* Translation Output */}
            {translatedText && (
              <div style={{ marginTop: "10px", background: "rgba(0,0,0,0.25)", padding: "12px", borderRadius: "8px", border: "1px solid rgba(59,130,246,0.2)" }}>
                <span style={{ display: "block", fontSize: "0.65rem", color: "#3b82f6", fontWeight: "bold", marginBottom: "4px" }}>TRADUCCIÓN (CARACTERES CHINOS)</span>
                
                <p style={{ fontSize: "1.4rem", fontWeight: "bold", color: "#fff", margin: "0 0 8px 0", letterSpacing: "0.5px", lineHeight: "1.3" }}>
                  {translatedText}
                </p>

                <div style={{ display: "flex", gap: "8px", marginTop: "10px" }}>
                  <button
                    type="button"
                    className="btn-primary btn-sm flex items-center gap-1"
                    onClick={() => handleSpeak(translatedText)}
                    style={{ background: "#10b981", fontSize: "0.7rem", padding: "4px 10px" }}
                  >
                    🔊 Pronunciar en Mandarín
                  </button>
                  <button
                    type="button"
                    className="btn-secondary btn-sm"
                    onClick={handleSaveTranslationToDict}
                    style={{ fontSize: "0.7rem", padding: "4px 10px" }}
                  >
                    ⭐ Guardar en Favoritos
                  </button>
                </div>
              </div>
            )}
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
