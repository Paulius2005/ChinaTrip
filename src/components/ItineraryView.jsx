import React, { useState } from "react";
import { 
  IconCalendar, IconMapPin, IconPlane, IconTrain, IconHotel, 
  IconShoppingBag, IconUtensils, IconPlus, IconTrash, IconEdit, 
  IconCheck, IconInfo, IconChevronDown, IconChevronRight, IconClock, IconCompass
} from "./Icons";

export default function ItineraryView({ itinerary, updateItinerary, showTaxiHelper, showFlightModal }) {
  const [selectedCity, setSelectedCity] = useState("Todas");
  const [expandedDays, setExpandedDays] = useState({ "day-1": true, "day-2": true }); // Default expanded days
  
  // Modals / Edit State
  const [editingDay, setEditingDay] = useState(null); // Day object being edited
  const [addingActivityToDayId, setAddingActivityToDayId] = useState(null); // Day ID
  const [newActivity, setNewActivity] = useState({ time: "09:00", title: "", description: "", category: "sightseeing" });

  // Trip.com Import Modal State
  const [isImportModalOpen, setIsImportModalOpen] = useState(false);
  const [importType, setImportType] = useState("hotel"); // hotel | flight
  const [rawImportText, setRawImportText] = useState("");
  const [parsedData, setParsedData] = useState({ name: "", nameChinese: "", address: "", addressChinese: "", checkIn: "2026-07-18", checkOut: "2026-07-20", phone: "" });

  const handleTabChange = (type) => {
    setImportType(type);
    setRawImportText("");
    if (type === "hotel") {
      setParsedData({ name: "", nameChinese: "", address: "", addressChinese: "", checkIn: "2026-07-18", checkOut: "2026-07-20", phone: "" });
    } else {
      setParsedData({ flightNo: "", date: "2026-07-17", details: "" });
    }
  };

  const handleTextareaChange = (textVal) => {
    setRawImportText(textVal);
    if (!textVal.trim()) return;
    const result = parsePastedText(textVal, importType);
    setParsedData(result);
  };

  const parsePastedText = (text, type) => {
    const lines = text.split("\n").map(l => l.trim()).filter(Boolean);
    
    const extractDate = (line) => {
      const isoMatch = line.match(/(\d{4})[-/](\d{2})[-/](\d{2})/);
      if (isoMatch) return `${isoMatch[1]}-${isoMatch[2]}-${isoMatch[3]}`;
      
      const spanishMatch = line.match(/(\d{1,2})\s+(de\s+)?(ene|feb|mar|abr|may|jun|jul|ago|sep|oct|nov|dic)[a-z]*/i);
      if (spanishMatch) {
        const day = spanishMatch[1].padStart(2, "0");
        const months = {
          ene: "01", feb: "02", mar: "03", abr: "04", may: "05", jun: "06",
          jul: "07", ago: "08", sep: "09", oct: "10", nov: "11", dic: "12"
        };
        const monthAbbr = spanishMatch[3].toLowerCase();
        const monthNum = months[monthAbbr] || "07";
        return `2026-${monthNum}-${day}`;
      }
      return "";
    };

    if (type === "hotel") {
      let hotelData = {
        name: "",
        nameChinese: "",
        address: "",
        addressChinese: "",
        checkIn: "2026-07-18",
        checkOut: "2026-07-20",
        phone: ""
      };

      for (const line of lines) {
        if (line.includes("+86") || line.includes("+34") || line.toLowerCase().includes("tel") || line.toLowerCase().includes("phone") || line.includes("电话")) {
          const phoneMatch = line.match(/\+?\d[\d-\s()]{7,}\d/);
          if (phoneMatch) hotelData.phone = phoneMatch[0];
        }

        if (line.toLowerCase().includes("check-in") || line.toLowerCase().includes("entrada") || line.toLowerCase().includes("llegada") || line.includes("入住")) {
          const dateStr = extractDate(line);
          if (dateStr) hotelData.checkIn = dateStr;
        }

        if (line.toLowerCase().includes("check-out") || line.toLowerCase().includes("salida") || line.includes("退房")) {
          const dateStr = extractDate(line);
          if (dateStr) hotelData.checkOut = dateStr;
        }

        const lowercaseLine = line.toLowerCase();
        if ((lowercaseLine.includes("hotel") || lowercaseLine.includes("viewing") || lowercaseLine.includes("branch") || lowercaseLine.includes("hostel")) && !hotelData.name && !line.includes(":") && !line.includes("@")) {
          hotelData.name = line;
        }
      }

      const chineseBlocks = text.match(/[\u4e00-\u9fa5]{4,}/g) || [];
      if (chineseBlocks.length > 0) {
        const nameBlock = chineseBlocks.find(b => b.includes("店") || b.includes("酒") || b.length < 25);
        if (nameBlock) hotelData.nameChinese = nameBlock;
        
        const addressBlock = chineseBlocks.find(b => b.includes("路") || b.includes("街") || b.includes("区") || b.includes("省") || b.length >= 15);
        if (addressBlock) hotelData.addressChinese = addressBlock;
      }

      const addressKeywords = ["road", "street", "st", "rd", "district", "building", "floor", "no."];
      for (const line of lines) {
        if (addressKeywords.some(kw => line.toLowerCase().includes(kw)) && !line.includes("+") && !line.includes("@") && line !== hotelData.name) {
          hotelData.address = line;
          break;
        }
      }

      if (!hotelData.name && lines.length > 0) {
        hotelData.name = lines[0].slice(0, 80);
      }

      return hotelData;
    } else {
      let flightData = {
        flightNo: "",
        date: "2026-07-17",
        details: ""
      };

      const flightMatch = text.match(/(CA\d+|3U\d+|MU\d+|CZ\d+|FM\d+|G\d{3,4}|D\d{3,4})/i);
      if (flightMatch) flightData.flightNo = flightMatch[0].toUpperCase();

      for (const line of lines) {
        const dateStr = extractDate(line);
        if (dateStr) {
          flightData.date = dateStr;
          break;
        }
      }

      const routeKeywords = ["bcn", "pvg", "pek", "sha", "ckg", "t1", "t2", "t3", "terminal", "aeropuerto", "estación", "station", "airport"];
      const matchingLines = lines.filter(line => routeKeywords.some(kw => line.toLowerCase().includes(kw)));
      if (matchingLines.length > 0) {
        flightData.details = matchingLines.slice(0, 2).join(" | ");
      } else {
        flightData.details = lines.slice(0, 2).join(" | ");
      }

      return flightData;
    }
  };

  const handleConfirmImport = () => {
    if (importType === "hotel") {
      if (!parsedData.name || !parsedData.checkIn || !parsedData.checkOut) {
        alert("Por favor, asegúrate de rellenar el nombre del hotel y las fechas.");
        return;
      }
      
      const checkInDate = new Date(parsedData.checkIn);
      const checkOutDate = new Date(parsedData.checkOut);
      
      if (checkInDate >= checkOutDate) {
        alert("La fecha de salida debe ser posterior a la de entrada.");
        return;
      }
      
      const updated = safeItinerary.map(day => {
        const dayDate = new Date(day.date);
        dayDate.setHours(0,0,0,0);
        const compareIn = new Date(parsedData.checkIn);
        compareIn.setHours(0,0,0,0);
        const compareOut = new Date(parsedData.checkOut);
        compareOut.setHours(0,0,0,0);
        
        if (dayDate >= compareIn && dayDate < compareOut) {
          return {
            ...day,
            lodging: {
              name: parsedData.name,
              nameChinese: parsedData.nameChinese || "",
              address: parsedData.address || "",
              addressChinese: parsedData.addressChinese || "",
              bookingStatus: "booked"
            }
          };
        }
        return day;
      });
      
      updateItinerary(updated);
      alert(`¡Hotel "${parsedData.name}" importado con éxito para tu estancia!`);
    } else {
      if (!parsedData.flightNo || !parsedData.date) {
        alert("Por favor, introduce el número de vuelo/tren y la fecha.");
        return;
      }
      
      let foundDay = false;
      const updated = safeItinerary.map(day => {
        if (day.date === parsedData.date) {
          foundDay = true;
          return {
            ...day,
            transport: {
              type: parsedData.flightNo.match(/^(G|D)\d+/i) ? "train" : "flight",
              details: `Vuelo/Tren ${parsedData.flightNo}. ${parsedData.details}`,
              bookingStatus: "booked"
            }
          };
        }
        return day;
      });
      
      if (!foundDay) {
        alert(`No se encontró ningún día en tu itinerario que coincida con la fecha ${parsedData.date}.`);
        return;
      }
      
      updateItinerary(updated);
      alert(`¡Transporte ${parsedData.flightNo} importado con éxito!`);
    }
    
    setIsImportModalOpen(false);
  };

  const safeItinerary = Array.isArray(itinerary) ? itinerary : [];

  const formatDateDisplay = (dateStr) => {
    if (!dateStr) return "";
    const parts = dateStr.split("-");
    if (parts.length !== 3) return dateStr;
    const day = parseInt(parts[2], 10);
    const monthIndex = parseInt(parts[1], 10);
    const months = ["ene", "feb", "mar", "abr", "may", "jun", "jul", "ago", "sep", "oct", "nov", "dic"];
    return `${day} ${months[monthIndex - 1] || "jul"}`;
  };

  const cities = ["Todas", ...new Set(safeItinerary.map(d => d?.city || "").filter(c => c && c !== "En tránsito" && c !== "Tu casa"))];

  const hiddenGems = {
    "Shanghái": [
      {
        name: "1933 Old Millfun (1933老场坊)",
        desc: "Antigua factoría art déco convertida en laberinto creativo de hormigón. Escaleras cruzadas de película.",
        amap: "https://uri.amap.com/marker?position=121.494793,31.256268&name=1933%E8%80%81%E5%9C%BA%E5%9D%8A"
      },
      {
        name: "Fuxing Park (复兴公园)",
        desc: "Parque histórico de estilo francés. Excelente por la mañana para ver bailarines locales, caligrafía acuática en el suelo y partidas de mahjong.",
        amap: "https://uri.amap.com/marker?position=121.472714,31.218525&name=%E5%A4%8D%E5%85%B4%E5%85%AC%E5%9B%AD"
      }
    ],
    "Chongqing": [
      {
        name: "Testbed 2 (贰厂文创公园)",
        desc: "Fábrica de impresión militar reconvertida en zona hipster de cafés y tiendas creativas. Impresionantes vistas sobre el río Jialing.",
        amap: "https://uri.amap.com/marker?position=106.536098,29.553945&name=%E8%B4%B0%E5%8E%82%E6%96%87%E5%88%9B%E5%85%AC%E5%9B%AD"
      },
      {
        name: "Huangjueping Graffiti Street (黄桷坪涂鸦街)",
        desc: "1.2 km de edificios pintados con grafitis artísticos gigantes, pequeños cafés de estudiantes y galerías independientes.",
        amap: "https://uri.amap.com/marker?position=106.516597,29.497555&name=%E9%BB%84%E6%A7%94%E5%9D%AA%E6%B6%82%E9%B8%A6%E8%A1%9F"
      }
    ],
    "Chengdu": [
      {
        name: "Teahouse Heming (鹤鸣茶社)",
        desc: "Tetería centenaria al aire libre en People's Park. Siéntate en sillas tradicionales de bambú y pide té verde en hebras.",
        amap: "https://uri.amap.com/marker?position=104.05602,30.655883&name=%E9%B5%A4%E9%B8%A5%E8%8C%B6%E7%A4%BE"
      },
      {
        name: "Dongjiao Memory (东郊记忆)",
        desc: "Antigua planta electrónica soviética reconvertida en una inmensa zona indie de música, arte urbano y reliquias industriales.",
        amap: "https://uri.amap.com/marker?position=104.125091,30.672901&name=%E4%B8%9C%E9%83%8A%E8%AE%B0%E5%BF%86"
      }
    ],
    "Xi'an": [
      {
        name: "Templo Guangren (广仁寺)",
        desc: "El único templo budista tibetano en la provincia de Shaanxi. Muralla preciosa iluminada por las noches y molinillos de oración.",
        amap: "https://uri.amap.com/marker?position=108.924846,34.275811&name=%E5%B9%BF%E4%BB%81%E5%AF%BA"
      },
      {
        name: "Calle Defuxiang (德福巷)",
        desc: "Calle peatonal empedrada famosa por sus tradicionales casas de té de madera, acogedoras cafeterías y pubs de música acústica.",
        amap: "https://uri.amap.com/marker?position=108.940989,34.25801&name=%E5%BE%B7%E7%A6%8F%E5%B7%B7"
      }
    ],
    "Pekín": [
      {
        name: "Wudaoying Hutong (五道营胡同)",
        desc: "Callejón tradicional tradicional mucho menos aglomerado que Nanluoguxiang. Lleno de cafés de especialidad, gatos y boutiques de diseño.",
        amap: "https://uri.amap.com/marker?position=116.411682,39.946399&name=%E4%BA%94%E9%81%93%E8%90%A5%E8%83%A1%E5%90%8C"
      },
      {
        name: "Distrito de Arte 798 (798艺术区)",
        desc: "Fábricas de la época germano-oriental reconvertidas en el mayor distrito artístico de Pekín, con galerías modernas, cafeterías y grafitis.",
        amap: "https://uri.amap.com/marker?position=116.495089,39.988012&name=798%E8%89%BA%E6%9C%AF%E5%8C%BA"
      }
    ]
  };

  const toggleDayExpanded = (dayId) => {
    setExpandedDays(prev => ({
      ...prev,
      [dayId]: !prev[dayId]
    }));
  };

  const toggleBookingStatus = (dayId, type) => {
    const updated = safeItinerary.map(day => {
      if (day.id === dayId) {
        if (type === "transport" && day.transport) {
          return {
            ...day,
            transport: {
              ...day.transport,
              bookingStatus: day.transport.bookingStatus === "booked" ? "pending" : "booked"
            }
          };
        }
        if (type === "lodging" && day.lodging) {
          return {
            ...day,
            lodging: {
              ...day.lodging,
              bookingStatus: day.lodging.bookingStatus === "booked" ? "pending" : "booked"
            }
          };
        }
      }
      return day;
    });
    updateItinerary(updated);
  };

  const handleEditDaySave = (e) => {
    e.preventDefault();
    const updated = safeItinerary.map(day => day.id === editingDay.id ? editingDay : day);
    updateItinerary(updated);
    setEditingDay(null);
  };

  const handleAddActivity = (dayId) => {
    if (!newActivity.title) return;
    
    const activityId = `act-${Date.now()}`;
    const updated = safeItinerary.map(day => {
      if (day.id === dayId) {
        return {
          ...day,
          activities: [...(day.activities || []), { ...newActivity, id: activityId }]
        };
      }
      return day;
    });

    updateItinerary(updated);
    setAddingActivityToDayId(null);
    setNewActivity({ time: "09:00", title: "", description: "", category: "sightseeing" });
  };

  const handleDeleteActivity = (dayId, activityId) => {
    if (!confirm("¿Seguro que deseas eliminar esta actividad?")) return;
    
    const updated = safeItinerary.map(day => {
      if (day.id === dayId) {
        return {
          ...day,
          activities: (day.activities || []).filter(act => act.id !== activityId)
        };
      }
      return day;
    });
    updateItinerary(updated);
  };

  const getActivityIcon = (category) => {
    switch (category) {
      case "transit": return <IconPlane className="w-4 h-4 text-blue" />;
      case "dining": return <IconUtensils className="w-4 h-4 text-orange" />;
      case "hotel": return <IconHotel className="w-4 h-4 text-jade" />;
      case "shopping": return <IconShoppingBag className="w-4 h-4 text-pink" />;
      case "sightseeing": 
      default: 
        return <IconMapPin className="w-4 h-4 text-red" />;
    }
  };

  const getTransportIcon = (type) => {
    switch (type) {
      case "flight": return <IconPlane className="w-5 h-5 text-blue" />;
      case "train": return <IconTrain className="w-5 h-5 text-gold" />;
      default: return <IconCompass className="w-5 h-5 text-gray" />;
    }
  };

  const filteredItinerary = safeItinerary.filter(day => {
    if (!day) return false;
    if (selectedCity === "Todas") return true;
    return day.city === selectedCity;
  });

  return (
    <div className="itinerary-container">
      {/* City Filters & Import Action */}
      <div className="filters-row glass-panel" style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "8px", padding: "8px 10px" }}>
        <div style={{ display: "flex", alignItems: "center", gap: "6px", flexWrap: "wrap" }}>
          <span className="filters-label">Filtrar:</span>
          <div className="filters-list">
            {cities.map(city => (
              <button 
                key={city}
                className={`filter-btn ${selectedCity === city ? "active" : ""}`}
                onClick={() => setSelectedCity(city)}
              >
                {city}
              </button>
            ))}
          </div>
        </div>
        <button 
          type="button" 
          className="btn-primary btn-sm"
          style={{ background: "#2563eb", display: "flex", alignItems: "center", gap: "4px", padding: "4px 8px", fontSize: "0.7rem" }}
          onClick={() => {
            setRawImportText("");
            setParsedData({ name: "", nameChinese: "", address: "", addressChinese: "", checkIn: "2026-07-18", checkOut: "2026-07-20", phone: "" });
            setIsImportModalOpen(true);
          }}
        >
          📥 Importar
        </button>
      </div>

      {/* Hidden Gems Dynamic Widget */}
      {selectedCity !== "Todas" && hiddenGems[selectedCity] && (
        <div className="hidden-gems-card glass-panel" style={{ marginBottom: "14px", padding: "12px", border: "1px dashed rgba(234, 179, 8, 0.4)", borderRadius: "14px" }}>
          <h4 style={{ margin: "0 0 8px 0", fontSize: "0.85rem", color: "#eab308", display: "flex", alignItems: "center", gap: "6px" }}>
            💎 Joyas Ocultas en {selectedCity}
          </h4>
          <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
            {hiddenGems[selectedCity].map(gem => (
              <div key={gem.name} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: "10px", background: "rgba(255,255,255,0.03)", padding: "8px", borderRadius: "8px", border: "1px solid rgba(255,255,255,0.02)" }}>
                <div style={{ flex: 1 }}>
                  <h5 style={{ margin: "0 0 3px 0", fontSize: "0.75rem", color: "#fff", fontWeight: "bold" }}>{gem.name}</h5>
                  <p style={{ margin: "0", fontSize: "0.65rem", color: "#94a3b8", lineHeight: "1.3" }}>{gem.desc}</p>
                </div>
                <a 
                  href={gem.amap} 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className="btn-primary btn-sm"
                  style={{ background: "#10b981", fontSize: "0.6rem", padding: "4px 8px", borderRadius: "4px", textDecoration: "none", whiteSpace: "nowrap", display: "flex", alignItems: "center", gap: "2px", fontWeight: "bold" }}
                >
                  🗺️ Mapa Gaode
                </a>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Timeline List */}
      <div className="timeline-wrapper">
        <div className="timeline-line"></div>
        
        {filteredItinerary.map((day, index) => {
          if (!day) return null;
          const isExpanded = !!expandedDays[day.id];
          const isToday = day.date === new Date().toISOString().split("T")[0];
          
          return (
            <div key={day.id} className={`timeline-day-card ${isExpanded ? "expanded" : ""} ${isToday ? "today-day" : ""}`}>
              {/* Timeline marker */}
              <div className="timeline-marker">
                <span className="day-number">{index + 1}</span>
              </div>

              {/* Day Card Header */}
              <div className="day-header glass-panel" onClick={() => toggleDayExpanded(day.id)}>
                <div className="day-header-main">
                  <div className="day-header-dates">
                    <span className="day-date" style={{ display: "flex", alignItems: "center", gap: "4px" }}>
                      {formatDateDisplay(day.date)}
                      {isToday && <span className="today-badge-itinerary">HOY</span>}
                    </span>
                    <span className="day-week">{day.dayOfWeek}</span>
                  </div>
                  <div className="day-header-info">
                    <span className="day-city-badge">{day.city}</span>
                    <h3 className="day-title">{day.title}</h3>
                  </div>
                </div>
                <div className="day-header-actions">
                  <button 
                    className="edit-day-btn" 
                    onClick={(e) => {
                      e.stopPropagation();
                      setEditingDay({ ...day });
                    }}
                    title="Editar detalles del día"
                  >
                    <IconEdit className="w-4 h-4" />
                  </button>
                  <span className="expand-chevron">
                    {isExpanded ? <IconChevronDown className="w-5 h-5" /> : <IconChevronRight className="w-5 h-5" />}
                  </span>
                </div>
              </div>

              {/* Day Card Details Body */}
              {isExpanded && (
                <div className="day-details-panel glass-panel">
                  
                  {/* Grid layout for Transport, Lodging, Notes */}
                  <div className="day-meta-grid">
                    {/* Transport Card */}
                    {day.transport && (
                      <div className="meta-card">
                        <div className="meta-card-header">
                          <span className="meta-card-title">Transporte</span>
                          <div className="lodging-status-actions">
                            {day.transport.type === "flight" && (
                              <button
                                type="button"
                                className="taxi-trigger-pill bg-blue text-white"
                                onClick={() => {
                                  const detailsStr = day.transport.details || "";
                                  const flightMatch = detailsStr.match(/(CA\d+|3U\d+)/i);
                                  const flightCode = flightMatch ? flightMatch[0].toUpperCase() : "CA840";
                                  showFlightModal(flightCode);
                                }}
                                title="Ver detalles y seguimiento en vivo del vuelo"
                              >
                                ✈️ Estado Vuelo
                              </button>
                            )}
                            <button 
                              className={`status-badge ${day.transport.bookingStatus}`}
                              onClick={() => toggleBookingStatus(day.id, "transport")}
                              title="Haz clic para cambiar estado"
                            >
                              {day.transport.bookingStatus === "booked" ? "Reservado" : "Pendiente"}
                            </button>
                          </div>
                        </div>
                        <div className="meta-card-body">
                          {getTransportIcon(day.transport.type)}
                          <span className="meta-card-text">{day.transport.details}</span>
                        </div>
                      </div>
                    )}

                    {/* Lodging Card */}
                    {day.lodging && (
                      <div className="meta-card">
                        <div className="meta-card-header">
                          <span className="meta-card-title">Alojamiento</span>
                          <div className="lodging-status-actions">
                            {day.lodging.name !== "Noche a bordo del avión" && day.lodging.name !== "Tu casa" && (
                              <button 
                                type="button" 
                                className="taxi-trigger-pill bg-gold text-dark"
                                onClick={() => showTaxiHelper(day.lodging)}
                                title="Mostrar dirección en caracteres chinos grandes al taxista"
                              >
                                🚕 Taxista
                              </button>
                            )}
                            <button 
                              className={`status-badge ${day.lodging.bookingStatus}`}
                              onClick={() => toggleBookingStatus(day.id, "lodging")}
                              title="Haz clic para cambiar estado"
                            >
                              {day.lodging.bookingStatus === "booked" ? "Reservado" : "Pendiente"}
                            </button>
                          </div>
                        </div>
                        <div className="meta-card-body">
                          <IconHotel className="w-5 h-5 text-jade" />
                          <div className="lodging-info">
                            <span className="lodging-name">{day.lodging.name}</span>
                            {day.lodging.nameChinese && <span className="lodging-chinese-sub">{day.lodging.nameChinese}</span>}
                            <span className="lodging-address">{day.lodging.address}</span>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* General Day Notes */}
                  {day.notes && (
                    <div className="day-notes-box">
                      <IconInfo className="w-4 h-4 text-gold shrink-0" />
                      <p className="day-notes-text"><strong>Consejos:</strong> {day.notes}</p>
                    </div>
                  )}

                  {/* Activities List */}
                  <div className="activities-section">
                    <div className="activities-header">
                      <h4>Actividades del Día</h4>
                      <button 
                        className="add-act-btn btn-sm"
                        onClick={() => setAddingActivityToDayId(day.id)}
                      >
                        <IconPlus className="w-4 h-4" /> Añadir Actividad
                      </button>
                    </div>

                    {/* Add Activity Form Inline */}
                    {addingActivityToDayId === day.id && (
                      <div className="add-activity-inline-form">
                        <h5>Nueva Actividad</h5>
                        <div className="form-row">
                          <input 
                            type="time" 
                            value={newActivity.time} 
                            onChange={(e) => setNewActivity({ ...newActivity, time: e.target.value })} 
                          />
                          <select 
                            value={newActivity.category} 
                            onChange={(e) => setNewActivity({ ...newActivity, category: e.target.value })}
                          >
                            <option value="sightseeing">Turismo (Rojo)</option>
                            <option value="dining">Restaurante (Naranja)</option>
                            <option value="transit">Tránsito (Azul)</option>
                            <option value="hotel">Hotel (Verde)</option>
                            <option value="shopping">Compras (Rosa)</option>
                          </select>
                        </div>
                        <div className="form-row">
                          <input 
                            type="text" 
                            placeholder="Título de la actividad..." 
                            value={newActivity.title}
                            onChange={(e) => setNewActivity({ ...newActivity, title: e.target.value })} 
                          />
                        </div>
                        <div className="form-row">
                          <textarea 
                            placeholder="Descripción de la actividad..." 
                            value={newActivity.description}
                            onChange={(e) => setNewActivity({ ...newActivity, description: e.target.value })} 
                          />
                        </div>
                        <div className="form-actions">
                          <button className="btn-secondary btn-sm" onClick={() => setAddingActivityToDayId(null)}>Cancelar</button>
                          <button className="btn-primary btn-sm" onClick={() => handleAddActivity(day.id)}>Añadir</button>
                        </div>
                      </div>
                    )}

                    {(!day.activities || day.activities.length === 0) ? (
                      <p className="no-activities">Sin actividades planificadas para este día. ¡Pulsa el botón de arriba para añadir!</p>
                    ) : (
                      <div className="activities-timeline">
                        {(day.activities || []).map(activity => (
                          <div key={activity.id} className="activity-item">
                            <div className="activity-icon-bullet">
                              {getActivityIcon(activity.category)}
                            </div>
                            <div className="activity-content">
                              <div className="activity-time-row">
                                <span className="activity-time">
                                  <IconClock className="w-3 h-3" /> {activity.time}
                                </span>
                                <button 
                                  className="delete-activity-btn"
                                  onClick={() => handleDeleteActivity(day.id, activity.id)}
                                  title="Eliminar actividad"
                                >
                                  <IconTrash className="w-3.5 h-3.5" />
                                </button>
                              </div>
                              <h5 className="activity-title">{activity.title}</h5>
                              {activity.description && <p className="activity-desc">{activity.description}</p>}
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>

                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Edit Day Modal overlay */}
      {editingDay && (
        <div className="modal-overlay">
          <div className="modal-content glass-panel">
            <h3>Editar Detalles del Día</h3>
            <form onSubmit={handleEditDaySave}>
              <div className="form-group">
                <label>Título del Día</label>
                <input 
                  type="text" 
                  value={editingDay.title} 
                  onChange={(e) => setEditingDay({ ...editingDay, title: e.target.value })}
                  required
                />
              </div>

              <div className="form-row-2">
                <div className="form-group">
                  <label>Ciudad</label>
                  <input 
                    type="text" 
                    value={editingDay.city} 
                    onChange={(e) => setEditingDay({ ...editingDay, city: e.target.value })}
                    required
                  />
                </div>
                <div className="form-group">
                  <label>Fecha</label>
                  <input 
                    type="date" 
                    value={editingDay.date} 
                    onChange={(e) => setEditingDay({ ...editingDay, date: e.target.value })}
                    required
                  />
                </div>
              </div>

              <hr className="form-divider" />

              <h4>Transporte Principal</h4>
              <div className="form-row-2">
                <div className="form-group">
                  <label>Tipo de Transporte</label>
                  <select 
                    value={editingDay.transport?.type || "none"}
                    onChange={(e) => setEditingDay({
                      ...editingDay,
                      transport: e.target.value === "none" ? null : {
                        ...(editingDay.transport || { bookingStatus: "pending" }),
                        type: e.target.value
                      }
                    })}
                  >
                    <option value="none">Sin transporte</option>
                    <option value="flight">Vuelo</option>
                    <option value="train">Tren bala</option>
                    <option value="taxi">Taxi / Didi</option>
                    <option value="metro">Metro</option>
                  </select>
                </div>
                {editingDay.transport && (
                  <div className="form-group">
                    <label>Estado de Reserva</label>
                    <select 
                      value={editingDay.transport.bookingStatus}
                      onChange={(e) => setEditingDay({
                        ...editingDay,
                        transport: { ...editingDay.transport, bookingStatus: e.target.value }
                      })}
                    >
                      <option value="pending">Pendiente</option>
                      <option value="booked">Reservado</option>
                    </select>
                  </div>
                )}
              </div>
              {editingDay.transport && (
                <div className="form-group">
                  <label>Detalles del Transporte</label>
                  <input 
                    type="text" 
                    value={editingDay.transport.details || ""} 
                    onChange={(e) => setEditingDay({
                      ...editingDay,
                      transport: { ...editingDay.transport, details: e.target.value }
                    })}
                    placeholder="Ej. Vuelo BCN-PVG, Tren G123..."
                  />
                </div>
              )}

              <hr className="form-divider" />

              <h4>Alojamiento</h4>
              <div className="form-row-2">
                <div className="form-group">
                  <label>Nombre del Alojamiento (Español/Inglés)</label>
                  <input 
                    type="text" 
                    value={editingDay.lodging?.name || ""} 
                    onChange={(e) => setEditingDay({
                      ...editingDay,
                      lodging: { ...(editingDay.lodging || { bookingStatus: "pending", address: "" }), name: e.target.value }
                    })}
                    placeholder="Ej. The Bund Hotel"
                  />
                </div>
                <div className="form-group">
                  <label>Nombre del Alojamiento (Chino - Para Taxista)</label>
                  <input 
                    type="text" 
                    value={editingDay.lodging?.nameChinese || ""} 
                    onChange={(e) => setEditingDay({
                      ...editingDay,
                      lodging: { ...(editingDay.lodging || { bookingStatus: "pending", name: "", address: "" }), nameChinese: e.target.value }
                    })}
                    placeholder="Ej. 上海外滩大酒店"
                  />
                </div>
              </div>

              <div className="form-row-2">
                <div className="form-group">
                  <label>Dirección del Alojamiento (Inglés)</label>
                  <input 
                    type="text" 
                    value={editingDay.lodging?.address || ""} 
                    onChange={(e) => setEditingDay({
                      ...editingDay,
                      lodging: { ...(editingDay.lodging || { bookingStatus: "pending", name: "" }), address: e.target.value }
                    })}
                    placeholder="Ej. 528 Henan Middle Rd, Shanghai"
                  />
                </div>
                <div className="form-group">
                  <label>Dirección del Alojamiento (Chino - Para Taxista)</label>
                  <input 
                    type="text" 
                    value={editingDay.lodging?.addressChinese || ""} 
                    onChange={(e) => setEditingDay({
                      ...editingDay,
                      lodging: { ...(editingDay.lodging || { bookingStatus: "pending", name: "", address: "" }), addressChinese: e.target.value }
                    })}
                    placeholder="Ej. 上海市黄浦区河南中路528号"
                  />
                </div>
              </div>

              {editingDay.lodging && (
                <div className="form-group">
                  <label>Estado de Reserva de Alojamiento</label>
                  <select 
                    value={editingDay.lodging.bookingStatus}
                    onChange={(e) => setEditingDay({
                      ...editingDay,
                      lodging: { ...editingDay.lodging, bookingStatus: e.target.value }
                    })}
                  >
                    <option value="pending">Pendiente</option>
                    <option value="booked">Reservado</option>
                  </select>
                </div>
              )}

              <hr className="form-divider" />

              <div className="form-group">
                <label>Consejos / Notas Rápidas</label>
                <textarea 
                  value={editingDay.notes || ""} 
                  onChange={(e) => setEditingDay({ ...editingDay, notes: e.target.value })}
                  placeholder="Ej. Reservar entradas con 7 días de antelación..."
                />
              </div>

              <div className="modal-actions">
                <button type="button" className="btn-secondary" onClick={() => setEditingDay(null)}>Cancelar</button>
                <button type="submit" className="btn-primary">Guardar Cambios</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Trip.com Import Modal */}
      {isImportModalOpen && (
        <div className="modal-overlay" onClick={() => setIsImportModalOpen(false)}>
          <div className="modal-content glass-panel" onClick={(e) => e.stopPropagation()} style={{ maxWidth: "440px", padding: "14px" }}>
            <h3 style={{ margin: "0 0 10px 0", fontSize: "0.95rem", display: "flex", alignItems: "center", gap: "6px" }}>
              📥 Importador de Reservas
            </h3>
            
            {/* Modal Tabs */}
            <div style={{ display: "flex", gap: "4px", marginBottom: "10px", background: "rgba(0,0,0,0.25)", padding: "3px", borderRadius: "6px" }}>
              <button 
                type="button"
                className={`w-full text-center ${importType === "hotel" ? "bg-blue text-white" : "bg-transparent text-muted"}`}
                style={{ padding: "4px 8px", fontSize: "0.75rem", borderRadius: "4px", border: "none" }}
                onClick={() => handleTabChange("hotel")}
              >
                Alojamiento (Hotel)
              </button>
              <button 
                type="button"
                className={`w-full text-center ${importType === "flight" ? "bg-blue text-white" : "bg-transparent text-muted"}`}
                style={{ padding: "4px 8px", fontSize: "0.75rem", borderRadius: "4px", border: "none" }}
                onClick={() => handleTabChange("flight")}
              >
                Vuelo / Tren
              </button>
            </div>

            <div className="form-group" style={{ marginBottom: "10px" }}>
              <label style={{ fontSize: "0.7rem", color: "#94a3b8" }}>Pega el texto copiado de Trip.com:</label>
              <textarea 
                placeholder={importType === "hotel" ? "Ej: Hotel: TheMoss Hotel\nCheck-in: 2026-07-20..." : "Ej: Flight: CA840\nDate: 2026-07-17..."}
                value={rawImportText}
                onChange={(e) => handleTextareaChange(e.target.value)}
                style={{ height: "60px", fontSize: "0.7rem", background: "rgba(0,0,0,0.3)", color: "#fff", border: "1px solid rgba(255,255,255,0.1)", borderRadius: "4px", padding: "6px", width: "100%" }}
              />
            </div>

            <div style={{ background: "rgba(0,0,0,0.15)", padding: "8px 10px", borderRadius: "6px", border: "1px solid rgba(255,255,255,0.05)", marginBottom: "12px" }}>
              <h5 style={{ fontSize: "0.7rem", color: "#eab308", margin: "0 0 6px 0" }}>⚡ Campos autodetectados (puedes editarlos):</h5>
              
              {importType === "hotel" ? (
                <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
                  <div className="form-row-2">
                    <div className="form-group">
                      <label>Nombre del Hotel</label>
                      <input 
                        type="text" 
                        value={parsedData.name || ""} 
                        onChange={(e) => setParsedData({ ...parsedData, name: e.target.value })}
                        style={{ padding: "4px 6px", fontSize: "0.75rem" }}
                      />
                    </div>
                    <div className="form-group">
                      <label>Nombre en Chino</label>
                      <input 
                        type="text" 
                        value={parsedData.nameChinese || ""} 
                        onChange={(e) => setParsedData({ ...parsedData, nameChinese: e.target.value })}
                        style={{ padding: "4px 6px", fontSize: "0.75rem" }}
                      />
                    </div>
                  </div>
                  
                  <div className="form-row-2">
                    <div className="form-group">
                      <label>Entrada (Check-in)</label>
                      <input 
                        type="date" 
                        value={parsedData.checkIn || ""} 
                        onChange={(e) => setParsedData({ ...parsedData, checkIn: e.target.value })}
                        style={{ padding: "4px 6px", fontSize: "0.75rem" }}
                      />
                    </div>
                    <div className="form-group">
                      <label>Salida (Check-out)</label>
                      <input 
                        type="date" 
                        value={parsedData.checkOut || ""} 
                        onChange={(e) => setParsedData({ ...parsedData, checkOut: e.target.value })}
                        style={{ padding: "4px 6px", fontSize: "0.75rem" }}
                      />
                    </div>
                  </div>

                  <div className="form-group">
                    <label>Dirección en Inglés</label>
                    <input 
                      type="text" 
                      value={parsedData.address || ""} 
                      onChange={(e) => setParsedData({ ...parsedData, address: e.target.value })}
                      style={{ padding: "4px 6px", fontSize: "0.75rem" }}
                    />
                  </div>

                  <div className="form-group">
                    <label>Dirección en Chino</label>
                    <input 
                      type="text" 
                      value={parsedData.addressChinese || ""} 
                      onChange={(e) => setParsedData({ ...parsedData, addressChinese: e.target.value })}
                      style={{ padding: "4px 6px", fontSize: "0.75rem" }}
                    />
                  </div>
                </div>
              ) : (
                <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
                  <div className="form-row-2">
                    <div className="form-group">
                      <label>Vuelo / Tren #</label>
                      <input 
                        type="text" 
                        value={parsedData.flightNo || ""} 
                        onChange={(e) => setParsedData({ ...parsedData, flightNo: e.target.value })}
                        style={{ padding: "4px 6px", fontSize: "0.75rem" }}
                      />
                    </div>
                    <div className="form-group">
                      <label>Fecha</label>
                      <input 
                        type="date" 
                        value={parsedData.date || ""} 
                        onChange={(e) => setParsedData({ ...parsedData, date: e.target.value })}
                        style={{ padding: "4px 6px", fontSize: "0.75rem" }}
                      />
                    </div>
                  </div>

                  <div className="form-group">
                    <label>Detalles / Ruta</label>
                    <input 
                      type="text" 
                      value={parsedData.details || ""} 
                      onChange={(e) => setParsedData({ ...parsedData, details: e.target.value })}
                      style={{ padding: "4px 6px", fontSize: "0.75rem" }}
                    />
                  </div>
                </div>
              )}
            </div>

            <div className="modal-actions" style={{ marginTop: "10px" }}>
              <button type="button" className="btn-secondary btn-sm" onClick={() => setIsImportModalOpen(false)}>Cancelar</button>
              <button type="button" className="btn-primary btn-sm" onClick={handleConfirmImport}>Confirmar e Importar</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
