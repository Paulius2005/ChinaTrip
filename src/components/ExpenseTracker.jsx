import React, { useState } from "react";
import { IconDollar, IconPlus, IconTrash, IconCalendar } from "./Icons";

export default function ExpenseTracker({ expenses, budget, updateExpenses, updateBudget }) {
  const [exchangeRate, setExchangeRate] = useState(7.8); // 1 EUR = 7.8 CNY by default
  const [isAdding, setIsAdding] = useState(false);
  const [newExpense, setNewExpense] = useState({
    title: "",
    amount: "",
    currency: "EUR", // EUR or CNY
    category: "Comida",
    date: "2026-07-17"
  });

  // Standalone calculator state
  const [calcEur, setCalcEur] = useState("");
  const [calcCny, setCalcCny] = useState("");

  const handleCalcEurChange = (val) => {
    setCalcEur(val);
    if (val === "" || isNaN(val)) {
      setCalcCny("");
    } else {
      setCalcCny((parseFloat(val) * exchangeRate).toFixed(2));
    }
  };

  const handleCalcCnyChange = (val) => {
    setCalcCny(val);
    if (val === "" || isNaN(val)) {
      setCalcEur("");
    } else {
      setCalcEur((parseFloat(val) / exchangeRate).toFixed(2));
    }
  };

  const categories = ["Vuelos", "Hoteles", "Trenes", "Comida", "Entradas", "Compras", "Otros"];

  // Colors for categories
  const categoryColors = {
    Vuelos: "bg-blue",
    Hoteles: "bg-jade",
    Trenes: "bg-gold",
    Comida: "bg-orange",
    Entradas: "bg-purple",
    Compras: "bg-pink",
    Otros: "bg-gray"
  };

  const handleAddExpense = (e) => {
    e.preventDefault();
    if (!newExpense.title || !newExpense.amount || isNaN(newExpense.amount)) return;

    const amountNum = parseFloat(newExpense.amount);
    let amountEur = 0;
    let amountCny = 0;

    if (newExpense.currency === "EUR") {
      amountEur = amountNum;
      amountCny = Math.round(amountNum * exchangeRate * 100) / 100;
    } else {
      amountCny = amountNum;
      amountEur = Math.round((amountNum / exchangeRate) * 100) / 100;
    }

    const expenseObj = {
      id: `exp-${Date.now()}`,
      title: newExpense.title,
      amountEur,
      amountCny,
      category: newExpense.category,
      date: newExpense.date
    };

    updateExpenses([...expenses, expenseObj]);
    setIsAdding(false);
    setNewExpense({
      title: "",
      amount: "",
      currency: "EUR",
      category: "Comida",
      date: "2026-07-17"
    });
  };

  const handleDeleteExpense = (id) => {
    if (!confirm("¿Deseas eliminar este gasto?")) return;
    updateExpenses(expenses.filter(exp => exp.id !== id));
  };

  // Calculations
  const totalSpentEur = expenses.reduce((sum, exp) => sum + exp.amountEur, 0);
  const totalSpentCny = expenses.reduce((sum, exp) => sum + exp.amountCny, 0);
  const remainingEur = budget - totalSpentEur;
  const percentageSpent = Math.min(Math.round((totalSpentEur / budget) * 100), 100);

  // Category breakdown
  const categoryTotals = expenses.reduce((acc, exp) => {
    acc[exp.category] = (acc[exp.category] || 0) + exp.amountEur;
    return acc;
  }, {});

  return (
    <div className="expenses-container">
      {/* Budget Summary Card */}
      <div className="expenses-summary-card glass-panel">
        <div className="budget-settings">
          <div className="budget-input-group">
            <label>Presupuesto Total (€)</label>
            <input 
              type="number" 
              value={budget} 
              onChange={(e) => updateBudget(parseFloat(e.target.value) || 0)} 
            />
          </div>
          <div className="budget-input-group">
            <label>Tipo de Cambio (1€ = X ¥)</label>
            <input 
              type="number" 
              step="0.01"
              value={exchangeRate} 
              onChange={(e) => {
                const val = parseFloat(e.target.value) || 1;
                setExchangeRate(val);
                // recalculate calculator if values present
                if (calcEur !== "") setCalcCny((parseFloat(calcEur) * val).toFixed(2));
              }} 
            />
          </div>
        </div>

        <div className="budget-progress-section">
          <div className="budget-progress-labels">
            <span>Gastado: <strong>{totalSpentEur.toFixed(2)} €</strong> ({totalSpentCny.toFixed(0)} ¥)</span>
            <span>Restante: <strong className={remainingEur < 0 ? "text-red" : "text-jade"}>{remainingEur.toFixed(2)} €</strong></span>
          </div>
          <div className="progress-bar-container">
            <div 
              className={`progress-bar-fill ${percentageSpent > 90 ? "bg-red" : percentageSpent > 60 ? "bg-gold" : "bg-jade"}`} 
              style={{ width: `${percentageSpent}%` }}
            ></div>
          </div>
          <div className="progress-bar-percentage">{percentageSpent}% gastado del presupuesto</div>
        </div>
      </div>

      {/* Grid: Charts & Expense List */}
      <div className="expenses-grid">
        
        {/* Left Column: Category Breakdown & Instant Calculator */}
        <div className="expenses-col">
          {/* Charts card */}
          <div className="card glass-panel">
            <h3 className="card-title">Desglose por Categoría</h3>
            <div className="category-chart-list">
              {categories.map(cat => {
                const amt = categoryTotals[cat] || 0;
                const pct = totalSpentEur > 0 ? Math.round((amt / totalSpentEur) * 100) : 0;
                
                return (
                  <div key={cat} className="chart-item">
                    <div className="chart-labels">
                      <span className="chart-cat-name">{cat}</span>
                      <span className="chart-cat-val">{amt.toFixed(2)} € ({pct}%)</span>
                    </div>
                    <div className="chart-bar-container">
                      <div 
                        className={`chart-bar-fill ${categoryColors[cat] || "bg-gray"}`} 
                        style={{ width: `${pct}%` }}
                      ></div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* INSTANT CONVERTER WIDGET (TRAVEL UX ENHANCEMENT) */}
          <div className="card glass-panel quick-converter-card">
            <h3 className="card-title">
              <IconDollar className="w-5 h-5 text-gold" /> Calculadora de Cambio Rápido
            </h3>
            <p className="card-description">Convierte importes al instante sin guardarlos en el historial:</p>
            <div className="converter-flex">
              <div className="converter-input-box">
                <label>Euros (€)</label>
                <input 
                  type="number" 
                  placeholder="0.00"
                  value={calcEur}
                  onChange={(e) => handleCalcEurChange(e.target.value)}
                />
              </div>
              <div className="converter-sign">⇄</div>
              <div className="converter-input-box">
                <label>Yuanes (¥)</label>
                <input 
                  type="number" 
                  placeholder="0.00"
                  value={calcCny}
                  onChange={(e) => handleCalcCnyChange(e.target.value)}
                />
              </div>
            </div>
            <p className="converter-note">Basado en tu tipo de cambio actual: 1€ = {exchangeRate} ¥</p>
          </div>
        </div>

        {/* Right Column: List & Add Form */}
        <div className="expenses-col">
          <div className="card glass-panel">
            <div className="expenses-list-header">
              <h3 className="card-title">Registro de Gastos</h3>
              {!isAdding && (
                <button className="btn-primary btn-sm" onClick={() => setIsAdding(true)}>
                  <IconPlus className="w-4 h-4" /> Añadir Gasto
                </button>
              )}
            </div>

            {isAdding && (
              <form onSubmit={handleAddExpense} className="add-expense-form">
                <h4>Nuevo Gasto</h4>
                <div className="form-group">
                  <label>Concepto / Detalle</label>
                  <input 
                    type="text" 
                    placeholder="Ej. Comida en Shanghai..." 
                    value={newExpense.title}
                    onChange={(e) => setNewExpense({ ...newExpense, title: e.target.value })}
                    required
                  />
                </div>
                <div className="form-row-3">
                  <div className="form-group">
                    <label>Importe</label>
                    <input 
                      type="number" 
                      step="0.01" 
                      placeholder="0.00" 
                      value={newExpense.amount}
                      onChange={(e) => setNewExpense({ ...newExpense, amount: e.target.value })}
                      required
                    />
                  </div>
                  <div className="form-group">
                    <label>Moneda</label>
                    <select 
                      value={newExpense.currency} 
                      onChange={(e) => setNewExpense({ ...newExpense, currency: e.target.value })}
                    >
                      <option value="EUR">Euros (€)</option>
                      <option value="CNY">Yuanes (¥)</option>
                    </select>
                  </div>
                  <div className="form-group">
                    <label>Categoría</label>
                    <select 
                      value={newExpense.category} 
                      onChange={(e) => setNewExpense({ ...newExpense, category: e.target.value })}
                    >
                      {categories.map(cat => (
                        <option key={cat} value={cat}>{cat}</option>
                      ))}
                    </select>
                  </div>
                </div>
                <div className="form-group">
                  <label>Fecha</label>
                  <input 
                    type="date" 
                    value={newExpense.date}
                    onChange={(e) => setNewExpense({ ...newExpense, date: e.target.value })}
                    required
                  />
                </div>
                <div className="form-actions">
                  <button type="button" className="btn-secondary btn-sm" onClick={() => setIsAdding(false)}>Cancelar</button>
                  <button type="submit" className="btn-primary btn-sm">Añadir Gasto</button>
                </div>
              </form>
            )}

            {expenses.length === 0 ? (
              <p className="no-expenses">No hay gastos registrados todavía. ¡Añade tu primer gasto!</p>
            ) : (
              <div className="expense-items-list">
                {expenses.slice().sort((a, b) => new Date(b.date) - new Date(a.date)).map(exp => (
                  <div key={exp.id} className="expense-list-item">
                    <div className="expense-item-info">
                      <span className={`expense-cat-dot ${categoryColors[exp.category] || "bg-gray"}`}></span>
                      <div className="expense-title-details">
                        <span className="expense-item-title">{exp.title}</span>
                        <span className="expense-item-meta">
                          <IconCalendar className="w-3 h-3" /> {exp.date} | {exp.category}
                        </span>
                      </div>
                    </div>
                    <div className="expense-item-money-actions">
                      <div className="expense-item-amounts">
                        <span className="amount-eur">{exp.amountEur.toFixed(2)} €</span>
                        <span className="amount-cny">{exp.amountCny.toFixed(0)} ¥</span>
                      </div>
                      <button 
                        className="delete-expense-btn"
                        onClick={() => handleDeleteExpense(exp.id)}
                        title="Eliminar gasto"
                      >
                        <IconTrash className="w-4 h-4" />
                      </button>
                    </div>
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
