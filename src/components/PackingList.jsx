import React, { useState } from "react";
import { IconCheck, IconPlus, IconTrash, IconBriefcase } from "./Icons";

export default function PackingList({ packing, updatePacking }) {
  const [selectedCategory, setSelectedCategory] = useState("Todos");
  const [newItemText, setNewItemText] = useState("");
  const [newItemCategory, setNewItemCategory] = useState("Documentos");

  const categories = ["Todos", "Documentos", "Electrónica", "Ropa", "Botiquín", "Otros"];

  const toggleItemChecked = (id) => {
    const updated = packing.map(item => 
      item.id === id ? { ...item, checked: !item.checked } : item
    );
    updatePacking(updated);
  };

  const handleAddItem = (e) => {
    e.preventDefault();
    if (!newItemText.trim()) return;

    const itemObj = {
      id: `pack-${Date.now()}`,
      category: newItemCategory,
      item: newItemText.trim(),
      checked: false
    };

    updatePacking([...packing, itemObj]);
    setNewItemText("");
  };

  const handleDeleteItem = (id) => {
    updatePacking(packing.filter(item => item.id !== id));
  };

  // Calculations
  const totalItems = packing.length;
  const packedItems = packing.filter(item => item.checked).length;
  const percentage = totalItems > 0 ? Math.round((packedItems / totalItems) * 100) : 0;

  const filteredPacking = packing.filter(item => {
    if (selectedCategory === "Todos") return true;
    return item.category === selectedCategory;
  });

  return (
    <div className="packing-container">
      {/* Summary Packing Stats */}
      <div className="packing-summary-card glass-panel">
        <div className="packing-summary-info">
          <IconBriefcase className="w-8 h-8 text-jade" />
          <div className="packing-summary-texts">
            <h3>Progreso del Equipaje</h3>
            <p>{packedItems} de {totalItems} artículos guardados en la maleta</p>
          </div>
        </div>
        
        <div className="packing-progress-bar-section">
          <div className="progress-bar-container">
            <div 
              className="progress-bar-fill bg-jade" 
              style={{ width: `${percentage}%` }}
            ></div>
          </div>
          <span className="progress-percentage">{percentage}%</span>
        </div>
      </div>

      {/* Grid: Categories and Items List */}
      <div className="packing-grid">
        
        {/* Left Column: Category selector & Add Item Form */}
        <div className="packing-sidebar-col">
          {/* Category Filter */}
          <div className="card glass-panel">
            <h3 className="card-title">Categorías</h3>
            <div className="packing-category-list">
              {categories.map(cat => {
                const count = cat === "Todos" ? packing.length : packing.filter(i => i.category === cat).length;
                const completed = cat === "Todos" ? packing.filter(i => i.checked).length : packing.filter(i => i.category === cat && i.checked).length;
                
                return (
                  <button
                    key={cat}
                    className={`packing-cat-btn ${selectedCategory === cat ? "active" : ""}`}
                    onClick={() => setSelectedCategory(cat)}
                  >
                    <span>{cat}</span>
                    <span className="packing-cat-badge">{completed}/{count}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Add Item Form */}
          <div className="card glass-panel">
            <h3 className="card-title">Añadir Artículo</h3>
            <form onSubmit={handleAddItem} className="add-packing-item-form">
              <div className="form-group">
                <label>Nombre del artículo</label>
                <input
                  type="text"
                  placeholder="Ej. Protector solar, Pasaporte..."
                  value={newItemText}
                  onChange={(e) => setNewItemText(e.target.value)}
                  required
                />
              </div>
              <div className="form-group">
                <label>Categoría</label>
                <select
                  value={newItemCategory}
                  onChange={(e) => setNewItemCategory(e.target.value)}
                >
                  <option value="Documentos">Documentos</option>
                  <option value="Electrónica">Electrónica</option>
                  <option value="Ropa">Ropa</option>
                  <option value="Botiquín">Botiquín</option>
                  <option value="Otros">Otros</option>
                </select>
              </div>
              <button type="submit" className="btn-primary w-full">
                <IconPlus className="w-4 h-4" /> Añadir a la lista
              </button>
            </form>
          </div>
        </div>

        {/* Right Column: Interactive Checklist */}
        <div className="packing-list-col">
          <div className="card glass-panel">
            <h3 className="card-title">Checklist ({selectedCategory})</h3>
            
            {filteredPacking.length === 0 ? (
              <p className="no-items-packing">No hay artículos en esta categoría.</p>
            ) : (
              <div className="packing-items-checklist">
                {filteredPacking.map(item => (
                  <div 
                    key={item.id} 
                    className={`packing-item-row ${item.checked ? "checked" : ""}`}
                    onClick={() => toggleItemChecked(item.id)}
                  >
                    <div className="packing-item-main">
                      <div className="checkbox">
                        {item.checked && <IconCheck className="w-4 h-4 text-white" />}
                      </div>
                      <div className="packing-item-details">
                        <span className="packing-item-text">{item.item}</span>
                        {selectedCategory === "Todos" && (
                          <span className="packing-item-category-tag">{item.category}</span>
                        )}
                      </div>
                    </div>
                    <button
                      className="delete-packing-item-btn"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDeleteItem(item.id);
                      }}
                      title="Eliminar artículo"
                    >
                      <IconTrash className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

      </div>
    </div>
  );
}
