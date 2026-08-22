import React, { useState } from 'react';
import { ChevronDown, ChevronUp, DollarSign, Clock, Plane, SlidersHorizontal, RefreshCw } from 'lucide-react';

export default function FilterSidebar({ filters, onFilterChange, onResetFilters }) {
  const [openSections, setOpenSections] = useState({
    price: true,
    stops: true,
    airlines: true,
    duration: false
  });

  const toggleSection = (section) => {
    setOpenSections((prev) => ({ ...prev, [section]: !prev[section] }));
  };

  const handleStopToggle = (stopVal) => {
    onFilterChange('stops', filters.stops === stopVal ? 'all' : stopVal);
  };

  const handleAirlineToggle = (code) => {
    const current = filters.airlines || [];
    const updated = current.includes(code)
      ? current.filter(c => c !== code)
      : [...current, code];
    onFilterChange('airlines', updated);
  };

  return (
    <aside
      className="w-full lg:w-72 rounded-2xl p-5 space-y-4 sidebar-panel"
      style={{ background: 'var(--bg-sidebar)', border: '1px solid var(--border-base)' }}
    >
      {/* Sidebar Header */}
      <div className="flex items-center justify-between pb-3" style={{ borderBottom: '1px solid var(--border-base)' }}>
        <div className="flex items-center gap-2">
          <SlidersHorizontal className="w-4 h-4" style={{ color: 'var(--accent)' }} />
          <h3 className="font-bold text-sm uppercase tracking-wider" style={{ color: 'var(--text-primary)' }}>
            Filters
          </h3>
        </div>
        <button
          onClick={onResetFilters}
          className="text-[11px] font-semibold flex items-center gap-1 transition-colors cursor-pointer"
          style={{ color: 'var(--accent)' }}
        >
          <RefreshCw className="w-3 h-3" /> Reset
        </button>
      </div>

      {/* Accordion 1: Price in INR */}
      <div className="pb-3" style={{ borderBottom: '1px solid var(--border-base)' }}>
        <button
          type="button"
          onClick={() => toggleSection('price')}
          className="w-full flex items-center justify-between text-sm font-semibold py-1.5 transition-colors cursor-pointer"
          style={{ color: 'var(--text-primary)' }}
        >
          <span>Price Range (Per Person ₹)</span>
          {openSections.price
            ? <ChevronUp className="w-4 h-4" style={{ color: 'var(--text-muted)' }} />
            : <ChevronDown className="w-4 h-4" style={{ color: 'var(--text-muted)' }} />}
        </button>

        {openSections.price && (
          <div className="mt-3 space-y-3">
            <div className="flex items-center justify-between text-xs font-mono font-bold" style={{ color: 'var(--text-muted)' }}>
              <span>₹3,000</span>
              <span className="font-extrabold text-sm" style={{ color: 'var(--accent)' }}>₹{(filters.maxPrice || 150000).toLocaleString('en-IN')}</span>
              <span>₹1,50,000</span>
            </div>
            <input
              type="range"
              min="3000"
              max="150000"
              step="1000"
              value={filters.maxPrice || 150000}
              onChange={(e) => onFilterChange('maxPrice', Number(e.target.value))}
              className="w-full h-1.5 rounded-lg cursor-pointer"
            />
          </div>
        )}
      </div>

      {/* Accordion 2: Stops */}
      <div className="pb-3" style={{ borderBottom: '1px solid var(--border-base)' }}>
        <button
          type="button"
          onClick={() => toggleSection('stops')}
          className="w-full flex items-center justify-between text-sm font-semibold py-1.5 transition-colors cursor-pointer"
          style={{ color: 'var(--text-primary)' }}
        >
          <span>Stops</span>
          {openSections.stops ? <ChevronUp className="w-4 h-4" style={{ color: 'var(--text-muted)' }} /> : <ChevronDown className="w-4 h-4" style={{ color: 'var(--text-muted)' }} />}
        </button>

        {openSections.stops && (
          <div className="mt-3 grid grid-cols-3 gap-2">
            {[
              { id: 'all', label: 'Any' },
              { id: 'direct', label: 'Direct' },
              { id: '1-stop', label: '1 Stop' }
            ].map((item) => {
              const isSelected = filters.stops === item.id;
              return (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => handleStopToggle(item.id)}
                  className="py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer"
                  style={{
                    background: isSelected ? 'var(--accent)' : 'var(--bg-card)',
                    color: isSelected ? '#ffffff' : 'var(--text-secondary)',
                    border: `1px solid ${isSelected ? 'var(--accent)' : 'var(--border-base)'}`
                  }}
                >
                  {item.label}
                </button>
              );
            })}
          </div>
        )}
      </div>

      {/* Accordion 3: Airlines */}
      <div className="pb-3" style={{ borderBottom: '1px solid var(--border-base)' }}>
        <button
          type="button"
          onClick={() => toggleSection('airlines')}
          className="w-full flex items-center justify-between text-sm font-semibold py-1.5 transition-colors cursor-pointer"
          style={{ color: 'var(--text-primary)' }}
        >
          <span>Airlines</span>
          {openSections.airlines ? <ChevronUp className="w-4 h-4" style={{ color: 'var(--text-muted)' }} /> : <ChevronDown className="w-4 h-4" style={{ color: 'var(--text-muted)' }} />}
        </button>

        {openSections.airlines && (
          <div className="mt-3 space-y-2 max-h-48 overflow-y-auto pr-1">
            {[
              { code: '6E', name: 'IndiGo' },
              { code: 'AI', name: 'Air India' },
              { code: 'UK', name: 'Vistara' },
              { code: 'QP', name: 'Akasa Air' },
              { code: 'BA', name: 'British Airways' },
              { code: 'EK', name: 'Emirates' }
            ].map((airline) => {
              const isChecked = (filters.airlines || []).includes(airline.code);
              return (
                <label
                  key={airline.code}
                  className="flex items-center justify-between text-xs cursor-pointer py-1 transition-colors"
                  style={{ color: 'var(--text-secondary)' }}
                >
                  <div className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      checked={isChecked}
                      onChange={() => handleAirlineToggle(airline.code)}
                      className="rounded cursor-pointer"
                      style={{ accentColor: 'var(--accent)' }}
                    />
                    <span>{airline.name}</span>
                  </div>
                  <span className="text-[10px] font-mono" style={{ color: 'var(--text-muted)' }}>{airline.code}</span>
                </label>
              );
            })}
          </div>
        )}
      </div>
    </aside>
  );
}
