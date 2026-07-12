import React, { useState } from "react";
import { 
  IconCalendar, IconMapPin, IconPlane, IconTrain, IconHotel, 
  IconShoppingBag, IconUtensils, IconPlus, IconTrash, IconEdit, 
  IconCheck, IconInfo, IconChevronDown, IconChevronRight, IconClock
} from "./Icons";

export default function ItineraryView({ itinerary, updateItinerary }) {
  const [selectedCity, setSelectedCity] = useState("Todas");
  const [expandedDays, setExpandedDays] = useState({ "day-1": true, "day-2": true }); // Default expanded days
  
  // Modals / Edit State
  const [editingDay, setEditingDay] = useState(null); // Day object being edited
  const [addingActivityToDayId, setAddingActivityToDayId] = useState(null); // Day ID
  const [newActivity, setNewActivity] = useState({ time: "09:00", title: "", description: "", category: "sightseeing" });
  
  const cities = ["Todas", ...new Set(itinerary.map(d => d.city).filter(c => c !== "En tránsito" && c !== "Tu casa"))];

  const toggleDayExpanded = (dayId) => {
    setExpandedDays(prev => ({
      ...prev,
      [dayId]: !prev[dayId]
    }));
  };

  const toggleBookingStatus = (dayId, type) => {
    const updated = itinerary.map(day => {
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
    const updated = itinerary.map(day => day.id === editingDay.id ? editingDay : day);
    updateItinerary(updated);
    setEditingDay(null);
  };

  const handleAddActivity = (dayId) => {
    if (!newActivity.title) return;
    
    const activityId = `act-${Date.now()}`;
    const updated = itinerary.map(day => {
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
    
    const updated = itinerary.map(day => {
      if (day.id === dayId) {
        return {
          ...day,
          activities: day.activities.filter(act => act.id !== activityId)
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

  const filteredItinerary = itinerary.filter(day => {
    if (selectedCity === "Todas") return true;
    return day.city === selectedCity;
  });

  return (
    <div className="itinerary-container">
      {/* City Filters */}
      <div className="filters-row glass-panel">
        <span className="filters-label">Filtrar por ciudad:</span>
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

      {/* Timeline List */}
      <div className="timeline-wrapper">
        <div className="timeline-line"></div>
        
        {filteredItinerary.map((day, index) => {
          const isExpanded = !!expandedDays[day.id];
          
          return (
            <div key={day.id} className={`timeline-day-card ${isExpanded ? "expanded" : ""}`}>
              {/* Timeline marker */}
              <div className="timeline-marker">
                <span className="day-number">{index + 1}</span>
              </div>

              {/* Day Card Header */}
              <div className="day-header glass-panel" onClick={() => toggleDayExpanded(day.id)}>
                <div className="day-header-main">
                  <div className="day-header-dates">
                    <span className="day-date">{day.date}</span>
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
                          <button 
                            className={`status-badge ${day.transport.bookingStatus}`}
                            onClick={() => toggleBookingStatus(day.id, "transport")}
                            title="Haz clic para cambiar estado"
                          >
                            {day.transport.bookingStatus === "booked" ? "Reservado" : "Pendiente"}
                          </button>
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
                          <button 
                            className={`status-badge ${day.lodging.bookingStatus}`}
                            onClick={() => toggleBookingStatus(day.id, "lodging")}
                            title="Haz clic para cambiar estado"
                          >
                            {day.lodging.bookingStatus === "booked" ? "Reservado" : "Pendiente"}
                          </button>
                        </div>
                        <div className="meta-card-body">
                          <IconHotel className="w-5 h-5 text-jade" />
                          <div className="lodging-info">
                            <span className="lodging-name">{day.lodging.name}</span>
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
                        {day.activities.map(activity => (
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
                  <label>Nombre del Alojamiento</label>
                  <input 
                    type="text" 
                    value={editingDay.lodging?.name || ""} 
                    onChange={(e) => setEditingDay({
                      ...editingDay,
                      lodging: { ...(editingDay.lodging || { bookingStatus: "pending", address: "" }), name: e.target.value }
                    })}
                    placeholder="Ej. Hotel de la Campana"
                  />
                </div>
                {editingDay.lodging && (
                  <div className="form-group">
                    <label>Estado de Alojamiento</label>
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
              </div>
              {editingDay.lodging && (
                <div className="form-group">
                  <label>Dirección</label>
                  <input 
                    type="text" 
                    value={editingDay.lodging.address || ""} 
                    onChange={(e) => setEditingDay({
                      ...editingDay,
                      lodging: { ...editingDay.lodging, address: e.target.value }
                    })}
                  />
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
    </div>
  );
}
