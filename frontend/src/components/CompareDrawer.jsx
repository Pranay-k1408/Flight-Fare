import React from 'react';
import { X, Scale } from 'lucide-react';

export default function CompareDrawer({ compareList, onClose, onRemove, onSelectFlight }) {
  if (!compareList.length) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 modal-overlay">
      <div 
        className="w-full max-w-4xl rounded-2xl overflow-hidden shadow-2xl animate-fade-in flex flex-col max-h-[90vh]"
        style={{ background: 'var(--bg-secondary)', border: '1.5px solid var(--border-base)' }}
      >
        {/* Drawer Header */}
        <div 
          className="p-5 flex items-center justify-between"
          style={{ borderBottom: '1px solid var(--border-base)', background: 'var(--bg-sidebar)' }}
        >
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl" style={{ background: 'var(--accent-light)', color: 'var(--accent)' }}>
              <Scale className="w-5 h-5" />
            </div>
            <h3 className="text-base font-bold font-sans-ui" style={{ color: 'var(--text-primary)' }}>
              Side-by-Side Flight Comparison ({compareList.length} Selected)
            </h3>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full flex items-center justify-center cursor-pointer transition-colors"
            style={{ background: 'var(--bg-input)', border: '1px solid var(--border-base)', color: 'var(--text-secondary)' }}
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Side-by-side Table */}
        <div className="p-6 overflow-x-auto">
          <table className="w-full text-left border-collapse min-w-[600px]">
            <thead>
              <tr style={{ borderBottom: '1px solid var(--border-base)' }}>
                <th className="p-3 text-xs font-bold uppercase w-1/4" style={{ color: 'var(--text-muted)' }}>Metric</th>
                {compareList.map((flight) => (
                  <th key={flight.id} className="p-3 w-1/4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <img src={flight.airline.logo} alt="" className="w-6 h-6 object-contain" />
                        <span className="font-bold text-sm" style={{ color: 'var(--text-primary)' }}>{flight.airline.name}</span>
                      </div>
                      <button
                        onClick={() => onRemove(flight.id)}
                        className="text-slate-400 hover:text-rose-500 cursor-pointer"
                        title="Remove"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="text-xs" style={{ color: 'var(--text-secondary)' }}>
              {/* Row 1: Price */}
              <tr style={{ borderBottom: '1px solid var(--border-base)' }}>
                <td className="p-3 font-semibold" style={{ color: 'var(--text-muted)' }}>Total Fare</td>
                {compareList.map((f) => (
                  <td key={f.id} className="p-3 font-extrabold text-base font-mono" style={{ color: 'var(--accent)' }}>
                    ₹{(f.priceInr || (f.price ? f.price * 83 : 4999)).toLocaleString('en-IN')}
                  </td>
                ))}
              </tr>

              {/* Row 2: Duration */}
              <tr style={{ borderBottom: '1px solid var(--border-base)' }}>
                <td className="p-3 font-semibold" style={{ color: 'var(--text-muted)' }}>Travel Duration</td>
                {compareList.map((f) => (
                  <td key={f.id} className="p-3 font-semibold" style={{ color: 'var(--text-primary)' }}>
                    {f.duration}
                  </td>
                ))}
              </tr>

              {/* Row 3: Stops */}
              <tr style={{ borderBottom: '1px solid var(--border-base)' }}>
                <td className="p-3 font-semibold" style={{ color: 'var(--text-muted)' }}>Layovers / Stops</td>
                {compareList.map((f) => (
                  <td key={f.id} className="p-3 font-semibold" style={{ color: 'var(--text-primary)' }}>
                    {f.stopsCount === 0 ? 'Direct (Non-Stop)' : `${f.stopsCount} stop (${f.layoverInfo?.city || 'Layover'})`}
                  </td>
                ))}
              </tr>

              {/* Row 4: Departure Time */}
              <tr style={{ borderBottom: '1px solid var(--border-base)' }}>
                <td className="p-3 font-semibold" style={{ color: 'var(--text-muted)' }}>Departure Time</td>
                {compareList.map((f) => (
                  <td key={f.id} className="p-3 font-mono" style={{ color: 'var(--text-primary)' }}>
                    {f.depTime} ({f.origin})
                  </td>
                ))}
              </tr>

              {/* Row 5: Aircraft */}
              <tr style={{ borderBottom: '1px solid var(--border-base)' }}>
                <td className="p-3 font-semibold" style={{ color: 'var(--text-muted)' }}>Aircraft Model</td>
                {compareList.map((f) => (
                  <td key={f.id} className="p-3" style={{ color: 'var(--text-secondary)' }}>
                    {f.aircraft || 'Boeing 777-300ER'}
                  </td>
                ))}
              </tr>

              {/* Row 6: Carbon Emissions */}
              <tr style={{ borderBottom: '1px solid var(--border-base)' }}>
                <td className="p-3 font-semibold" style={{ color: 'var(--text-muted)' }}>Carbon Footprint</td>
                {compareList.map((f) => (
                  <td key={f.id} className="p-3 font-mono font-semibold" style={{ color: '#10b981' }}>
                    {f.carbonEmissionsKg} kg CO₂
                  </td>
                ))}
              </tr>

              {/* Row 7: Action */}
              <tr>
                <td className="p-3"></td>
                {compareList.map((f) => (
                  <td key={f.id} className="p-3">
                    <button
                      onClick={() => {
                        onClose();
                        onSelectFlight(f);
                      }}
                      className="w-full py-2 rounded-xl btn-glow font-bold text-xs uppercase shadow-md cursor-pointer"
                    >
                      Book This
                    </button>
                  </td>
                ))}
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
