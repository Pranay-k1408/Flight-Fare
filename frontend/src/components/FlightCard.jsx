import React from 'react';
import { Plane, Wifi, Luggage, CheckSquare, Square, Info } from 'lucide-react';

export default function FlightCard({
  flight,
  currency,
  isSelectedForCompare,
  onToggleCompare,
  onSelectFlight,
  onOpenDetails
}) {
  const priceInr = flight.pricePerPersonInr || flight.priceInr || flight.price;
  let symbol = '₹';
  let formattedPrice = priceInr;

  if (currency === 'USD') { symbol = '$'; formattedPrice = Math.round(priceInr / 83.2); }
  else if (currency === 'EUR') { symbol = '€'; formattedPrice = Math.round(priceInr / 90.5); }
  else if (currency === 'GBP') { symbol = '£'; formattedPrice = Math.round(priceInr / 105.8); }

  // Tag color mapping
  const tagStyle = () => {
    const t = (flight.tag || '').toLowerCase();
    if (t.includes('cheapest') || t.includes('best value') || t.includes('direct')) {
      return { bg: 'var(--tag-green-bg)', color: 'var(--tag-green-text)' };
    }
    if (t.includes('business') || t.includes('premium') || t.includes('first')) {
      return { bg: 'var(--tag-purple-bg)', color: 'var(--tag-purple-text)' };
    }
    return { bg: 'var(--accent-light)', color: 'var(--accent-text)' };
  };

  return (
    <div
      className="w-full rounded-2xl mb-4 relative transition-all duration-200 flight-card group overflow-visible"
      style={{ background: 'var(--bg-card)', border: '1.5px solid var(--border-base)', boxShadow: 'var(--shadow-card)' }}
    >
      {/* Top Header Tag Pill */}
      {flight.tag && (
        <div className="px-5 pt-3.5 pb-0 flex items-center">
          <span
            className="px-2.5 py-0.5 rounded-md text-[10px] uppercase font-extrabold tracking-wider"
            style={{ ...tagStyle(), border: `1px solid ${tagStyle().color}33` }}
          >
            {flight.tag}
          </span>
        </div>
      )}

      <div className="p-5 pt-3 flex flex-col md:flex-row items-stretch md:items-center justify-between gap-5">
        {/* Left — Airline Info */}
        <div className="flex items-center gap-4 min-w-[200px]">
          <div
            className="w-12 h-12 rounded-xl flex items-center justify-center p-1.5 overflow-hidden flex-shrink-0"
            style={{ background: 'var(--bg-sidebar)', border: '1.5px solid var(--border-base)' }}
          >
            <img
              src={flight.airline.logo}
              alt={flight.airline.name}
              className="w-full h-full object-contain"
              onError={(e) => {
                e.target.style.display = 'none';
                e.target.nextSibling.style.display = 'flex';
              }}
            />
            <div
              className="hidden w-full h-full font-bold text-sm items-center justify-center rounded-lg"
              style={{ background: 'var(--accent-light)', color: 'var(--accent-text)' }}
            >
              {flight.airline.code}
            </div>
          </div>

          <div>
            <h4 className="text-base font-bold font-sans-ui" style={{ color: 'var(--text-primary)' }}>
              {flight.airline.name}
            </h4>
            <span className="text-xs font-mono font-semibold" style={{ color: 'var(--text-secondary)' }}>
              {flight.flightNumber} · {flight.aircraft || 'Boeing 787'}
            </span>
          </div>
        </div>

        {/* Center — Route Timeline */}
        <div className="flex-1 flex items-center justify-between gap-4 px-2">
          {/* Dep */}
          <div className="text-left min-w-[70px]">
            <div className="text-[10px] font-bold uppercase tracking-wider mb-0.5" style={{ color: 'var(--text-muted)' }}>
              Dep Time
            </div>
            <div className="text-2xl font-extrabold tracking-tight" style={{ color: 'var(--text-primary)' }}>
              {flight.depTime}
            </div>
            <div className="text-xs font-bold" style={{ color: 'var(--accent)' }}>
              {flight.origin}
            </div>
          </div>

          {/* Flight Line */}
          <div className="flex-1 flex flex-col items-center px-3">
            <div className="text-[11px] font-semibold mb-1.5 flex items-center gap-1.5" style={{ color: 'var(--text-secondary)' }}>
              <span style={{ color: 'var(--text-muted)' }}>{flight.stopsText}</span>
              <span style={{ color: 'var(--border-strong)' }}>·</span>
              <span className="font-bold" style={{ color: 'var(--accent)' }}>{flight.duration}</span>
            </div>
            <div className="w-full relative flex items-center justify-center">
              <div
                className="w-full h-[1.5px]"
                style={{ background: `linear-gradient(to right, var(--border-base), var(--accent), var(--border-base))` }}
              />
              <div
                className="absolute px-1.5 rounded-full"
                style={{ background: 'var(--bg-card)' }}
              >
                <Plane className="w-3.5 h-3.5 rotate-90" style={{ color: 'var(--accent)' }} />
              </div>
            </div>
            <div className="text-[10px] font-mono font-semibold mt-1" style={{ color: 'var(--text-muted)' }}>
              {flight.stopsCount === 0 ? 'Non-stop' : `Via ${flight.layoverInfo?.city || 'Hub'}`}
            </div>
          </div>

          {/* Arr */}
          <div className="text-right min-w-[70px]">
            <div className="text-[10px] font-bold uppercase tracking-wider mb-0.5" style={{ color: 'var(--text-muted)' }}>
              Arr Time
            </div>
            <div className="text-2xl font-extrabold tracking-tight" style={{ color: 'var(--text-primary)' }}>
              {flight.arrTime}
            </div>
            <div className="text-xs font-bold" style={{ color: 'var(--accent)' }}>
              {flight.destination}
            </div>
          </div>
        </div>

        {/* Right — Price & Actions */}
        <div
          className="flex md:flex-col items-center md:items-end justify-between md:justify-center pt-4 md:pt-0 md:pl-5 gap-4 min-w-[155px]"
          style={{ borderTop: '1px solid var(--border-base)', marginTop: '0' }}
        >
          <div
            className="md:border-l md:pl-5 md:border-t-0"
            style={{ borderColor: 'var(--border-base)' }}
          >
            <div
              className="text-3xl font-extrabold tracking-tight leading-none price-accent"
              style={{ color: 'var(--accent)', fontFamily: 'Inter, sans-serif' }}
            >
              {symbol}{formattedPrice.toLocaleString('en-IN')}
            </div>
            <div className="text-[10px] uppercase font-bold tracking-wider mt-0.5" style={{ color: 'var(--text-muted)' }}>
              Per Traveler
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => onOpenDetails(flight)}
              className="w-9 h-9 rounded-xl flex items-center justify-center transition-all cursor-pointer"
              style={{ background: 'var(--bg-sidebar)', border: '1.5px solid var(--border-base)', color: 'var(--text-secondary)' }}
              title="Flight Details & Seat Map"
              onMouseEnter={e => { e.currentTarget.style.borderColor = 'var(--accent)'; e.currentTarget.style.color = 'var(--accent)'; }}
              onMouseLeave={e => { e.currentTarget.style.borderColor = 'var(--border-base)'; e.currentTarget.style.color = 'var(--text-secondary)'; }}
            >
              <Info className="w-4 h-4" />
            </button>

            <button
              onClick={() => onSelectFlight(flight)}
              className="btn-glow px-5 py-2 rounded-xl text-xs font-bold uppercase tracking-wide cursor-pointer"
            >
              Select Flight
            </button>
          </div>
        </div>
      </div>

      {/* Bottom — Perks & Compare */}
      <div
        className="px-5 pb-3.5 pt-2.5 flex items-center justify-between text-xs"
        style={{ borderTop: '1px solid var(--border-base)' }}
      >
        <label className="flex items-center gap-2 cursor-pointer transition-colors" style={{ color: 'var(--text-secondary)' }}>
          <input
            type="checkbox"
            checked={isSelectedForCompare}
            onChange={() => onToggleCompare(flight)}
            className="hidden"
          />
          {isSelectedForCompare ? (
            <CheckSquare className="w-4 h-4" style={{ color: 'var(--accent)' }} />
          ) : (
            <Square className="w-4 h-4" style={{ color: 'var(--border-strong)' }} />
          )}
          <span className="text-[11px] font-bold">Compare Flight</span>
        </label>

        <div className="flex items-center gap-4 text-[11px]" style={{ color: 'var(--text-secondary)' }}>
          <span className="flex items-center gap-1 font-semibold">
            <Luggage className="w-3.5 h-3.5" />
            {flight.baggageAllowance?.checked || '15kg Checked'}
          </span>
          <span className="hidden sm:flex items-center gap-1 font-semibold">
            <Wifi className="w-3.5 h-3.5" />
            Wi-Fi Available
          </span>
        </div>
      </div>
    </div>
  );
}
