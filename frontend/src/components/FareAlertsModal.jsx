import React, { useState } from 'react';
import { X, Bell, ShieldCheck, Check, Plus, Trash2 } from 'lucide-react';

export default function FareAlertsModal({ onClose }) {
  const [alerts, setAlerts] = useState([
    { id: 1, route: 'DEL → BOM', targetPrice: 5000, currentPrice: 5400, active: true },
    { id: 2, route: 'DEL → DXB', targetPrice: 16000, currentPrice: 18500, active: true }
  ]);

  const [newRoute, setNewRoute] = useState('DEL → BLR');
  const [newTarget, setNewTarget] = useState('4500');

  const handleAddAlert = (e) => {
    e.preventDefault();
    if (!newTarget) return;
    setAlerts([
      ...alerts,
      {
        id: Date.now(),
        route: newRoute,
        targetPrice: Number(newTarget),
        currentPrice: Number(newTarget) + 800,
        active: true
      }
    ]);
    setNewTarget('');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 modal-overlay">
      <div 
        className="w-full max-w-xl rounded-2xl overflow-hidden shadow-2xl animate-fade-in flex flex-col max-h-[90vh]"
        style={{ background: 'var(--bg-secondary)', border: '1.5px solid var(--border-base)' }}
      >
        {/* Header */}
        <div 
          className="p-5 flex items-center justify-between"
          style={{ borderBottom: '1px solid var(--border-base)', background: 'var(--bg-sidebar)' }}
        >
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl" style={{ background: 'var(--accent-light)', color: 'var(--accent)' }}>
              <Bell className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold font-sans-ui" style={{ color: 'var(--text-primary)' }}>
                Price Drop Fare Alerts
              </h3>
              <p className="text-xs" style={{ color: 'var(--text-muted)' }}>
                Receive instant notifications when flight fares drop below your target price
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full flex items-center justify-center cursor-pointer transition-colors"
            style={{ background: 'var(--bg-input)', border: '1px solid var(--border-base)', color: 'var(--text-secondary)' }}
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Form & List */}
        <div className="p-6 overflow-y-auto space-y-6">
          {/* Add Alert Form */}
          <form 
            onSubmit={handleAddAlert} 
            className="p-4 rounded-xl space-y-3"
            style={{ background: 'var(--bg-sidebar)', border: '1px solid var(--border-base)' }}
          >
            <h4 className="text-xs font-bold uppercase tracking-wider" style={{ color: 'var(--text-secondary)' }}>
              Create New Price Alert
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div>
                <label className="block text-[10px] uppercase font-bold mb-1" style={{ color: 'var(--text-muted)' }}>Route</label>
                <input
                  type="text"
                  value={newRoute}
                  onChange={(e) => setNewRoute(e.target.value)}
                  className="w-full glass-input rounded-xl p-2 text-xs outline-none"
                />
              </div>

              <div>
                <label className="block text-[10px] uppercase font-bold mb-1" style={{ color: 'var(--text-muted)' }}>Target Price (₹)</label>
                <input
                  type="number"
                  placeholder="e.g. 5000"
                  value={newTarget}
                  onChange={(e) => setNewTarget(e.target.value)}
                  className="w-full glass-input rounded-xl p-2 text-xs outline-none"
                />
              </div>

              <div className="flex items-end">
                <button
                  type="submit"
                  className="w-full py-2 rounded-xl btn-glow font-bold text-xs uppercase flex items-center justify-center gap-1 shadow-md"
                >
                  <Plus className="w-4 h-4" /> Add Alert
                </button>
              </div>
            </div>
          </form>

          {/* Active Alerts List */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider" style={{ color: 'var(--text-secondary)' }}>
              Active Monitored Alerts ({alerts.length})
            </h4>

            {alerts.map((al) => (
              <div
                key={al.id}
                className="p-3.5 rounded-xl flex items-center justify-between text-xs transition-colors"
                style={{ background: 'var(--bg-card)', border: '1px solid var(--border-base)' }}
              >
                <div>
                  <div className="font-bold text-sm" style={{ color: 'var(--text-primary)' }}>{al.route}</div>
                  <div className="text-[11px]" style={{ color: 'var(--text-muted)' }}>
                    Target: <span className="font-mono font-bold" style={{ color: 'var(--accent)' }}>₹{al.targetPrice.toLocaleString('en-IN')}</span> • Current: <span className="font-mono" style={{ color: 'var(--text-secondary)' }}>₹{al.currentPrice.toLocaleString('en-IN')}</span>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <span 
                    className="px-2 py-0.5 rounded text-[10px] uppercase font-bold border"
                    style={{
                      background: 'var(--tag-green-bg)',
                      color: 'var(--tag-green-text)',
                      borderColor: 'rgba(34, 197, 94, 0.4)'
                    }}
                  >
                    Tracking Live
                  </span>
                  <button
                    onClick={() => setAlerts(alerts.filter(a => a.id !== al.id))}
                    className="text-slate-400 hover:text-rose-500 transition-colors cursor-pointer"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
