import React from 'react';
import { TrendingUp, CloudSun, ArrowDown, ArrowUp } from 'lucide-react';

export default function SmartInsightsBar({ analytics, weather, prediction }) {
  if (!analytics && !weather && !prediction) return null;

  const bestPrice = analytics?.bestPrice || 5400;
  const worstPrice = analytics?.worstPrice || 9200;
  const avgPrice = analytics?.avgPrice || 6850;

  return (
    <div
      className="w-full rounded-2xl p-5 mb-6 shadow-sm relative overflow-hidden"
      style={{
        background: 'var(--bg-secondary)',
        border: '1.5px solid var(--border-base)',
      }}
    >
      <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-center">
        {/* Section 1: AI Fare Prediction */}
        <div
          className="md:col-span-4 border-b md:border-b-0 md:border-r pb-4 md:pb-0 md:pr-4 space-y-2"
          style={{ borderColor: 'var(--border-base)' }}
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider" style={{ color: 'var(--accent)' }}>
              <TrendingUp className="w-4 h-4" />
              <span>Smart Price Prediction</span>
            </div>
            <span className="px-2.5 py-0.5 rounded-full text-[10px] uppercase font-extrabold tracking-wider badge-green">
              {prediction?.recommendation || 'BUY NOW'}
            </span>
          </div>

          <p className="text-xs font-medium leading-relaxed" style={{ color: 'var(--text-primary)' }}>
            {prediction?.adviceText || 'Prices on this route are projected to increase by ~14% within 48 hours.'}
          </p>

          <div className="flex items-center gap-2 text-[11px] font-mono" style={{ color: 'var(--text-muted)' }}>
            <span className="font-semibold" style={{ color: 'var(--tag-green-text)' }}>
              {prediction?.confidence || '92% Confidence'}
            </span>
            <span>•</span>
            <span style={{ color: 'var(--text-secondary)' }}>Trend: {prediction?.trend || 'Upward 📈'}</span>
          </div>
        </div>

        {/* Section 2: Best Price, Worst Price & Average Price Metrics */}
        <div
          className="md:col-span-4 border-b md:border-b-0 md:border-r pb-4 md:pb-0 md:px-4 space-y-2"
          style={{ borderColor: 'var(--border-base)' }}
        >
          <div className="text-xs font-bold uppercase tracking-wider flex items-center justify-between" style={{ color: 'var(--text-muted)' }}>
            <span>Price Analytics (INR ₹)</span>
            <span className="text-[10px] font-mono font-bold" style={{ color: 'var(--accent)' }}>Real-Time Range</span>
          </div>

          <div className="grid grid-cols-3 gap-2 text-center pt-1">
            {/* Best Price */}
            <div
              className="p-2.5 rounded-xl border"
              style={{ background: 'var(--tag-green-bg)', borderColor: 'var(--tag-green-text)44' }}
            >
              <div className="text-[10px] uppercase font-bold flex items-center justify-center gap-0.5" style={{ color: 'var(--tag-green-text)' }}>
                <ArrowDown className="w-3 h-3" /> Best
              </div>
              <div className="text-sm font-extrabold font-mono mt-0.5" style={{ color: 'var(--tag-green-text)' }}>
                ₹{bestPrice.toLocaleString('en-IN')}
              </div>
            </div>

            {/* Average Price */}
            <div
              className="p-2.5 rounded-xl border"
              style={{ background: 'var(--bg-sidebar)', borderColor: 'var(--border-base)' }}
            >
              <div className="text-[10px] uppercase font-bold" style={{ color: 'var(--text-muted)' }}>
                Average
              </div>
              <div className="text-sm font-bold font-mono mt-0.5" style={{ color: 'var(--text-primary)' }}>
                ₹{avgPrice.toLocaleString('en-IN')}
              </div>
            </div>

            {/* Worst Price */}
            <div
              className="p-2.5 rounded-xl border"
              style={{ background: 'var(--tag-orange-bg)', borderColor: 'var(--tag-orange-text)44' }}
            >
              <div className="text-[10px] uppercase font-bold flex items-center justify-center gap-0.5" style={{ color: 'var(--tag-orange-text)' }}>
                <ArrowUp className="w-3 h-3" /> Worst
              </div>
              <div className="text-sm font-extrabold font-mono mt-0.5" style={{ color: 'var(--tag-orange-text)' }}>
                ₹{worstPrice.toLocaleString('en-IN')}
              </div>
            </div>
          </div>
        </div>

        {/* Section 3: Weather Forecast at Destination */}
        <div className="md:col-span-4 md:pl-4 space-y-2">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider" style={{ color: 'var(--text-secondary)' }}>
              <CloudSun className="w-4 h-4 text-amber-500" />
              <span>Weather at Destination</span>
            </div>
            <span className="text-[11px] font-bold" style={{ color: 'var(--accent)' }}>{weather?.city || 'Destination'}</span>
          </div>

          <div
            className="flex items-center justify-between p-2.5 rounded-xl border text-xs"
            style={{ background: 'var(--bg-sidebar)', borderColor: 'var(--border-base)' }}
          >
            <div className="flex items-center gap-2">
              <span className="text-2xl font-extrabold font-mono" style={{ color: 'var(--text-primary)' }}>
                {weather?.temp || '29°C'}
              </span>
              <div>
                <div className="font-semibold" style={{ color: 'var(--text-primary)' }}>{weather?.condition || 'Partly Cloudy ⛅'}</div>
                <div className="text-[10px] font-mono" style={{ color: 'var(--text-muted)' }}>Wind: {weather?.wind || '12 km/h'} • Humidity: {weather?.humidity || '74%'}</div>
              </div>
            </div>

            <div className="text-right pl-3" style={{ borderLeft: '1px solid var(--border-base)' }}>
              <div className="text-[10px] uppercase font-bold" style={{ color: 'var(--text-muted)' }}>Delay Risk</div>
              <div className="text-xs font-bold" style={{ color: 'var(--tag-green-text)' }}>{weather?.delayRisk || 'Low (4%)'}</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
