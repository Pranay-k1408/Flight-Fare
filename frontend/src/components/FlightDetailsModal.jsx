import React, { useState } from 'react';
import { X, Users } from 'lucide-react';

const CABIN_MULTIPLIERS = {
  'Economy': 1.0,
  'Premium Economy': 1.6,
  'Business': 2.8,
  'First Class': 4.5
};

export default function FlightDetailsModal({ flight, passengersCount = 1, onClose, onBookNow }) {
  const [activeTab, setActiveTab] = useState('seatmap');
  const [paxCount, setPaxCount] = useState(Math.min(6, Math.max(1, Number(passengersCount) || 1)));
  const [localCabin, setLocalCabin] = useState(flight?.cabinClass || 'Economy');

  // Generate default seats for paxCount
  const defaultCols = ['A', 'B', 'C', 'D', 'E', 'F'];
  const getInitialSeats = (count) => {
    const seats = [];
    for (let i = 0; i < count; i++) {
      const r = 11 + Math.floor(i / 6);
      const c = defaultCols[i % 6];
      seats.push(`${r}${c}`);
    }
    return seats;
  };

  const [selectedSeats, setSelectedSeats] = useState(getInitialSeats(paxCount));

  if (!flight) return null;

  const rows = [10, 11, 12, 14, 15, 16];

  const handlePaxCountChange = (newCount) => {
    setPaxCount(newCount);
    if (selectedSeats.length > newCount) {
      setSelectedSeats(selectedSeats.slice(0, newCount));
    } else if (selectedSeats.length < newCount) {
      const needed = newCount - selectedSeats.length;
      const additional = [];
      for (let i = 0; i < 30 && additional.length < needed; i++) {
        const row = 11 + Math.floor(i / 6);
        const col = defaultCols[i % 6];
        const sId = `${row}${col}`;
        if (!selectedSeats.includes(sId) && !additional.includes(sId)) {
          additional.push(sId);
        }
      }
      setSelectedSeats([...selectedSeats, ...additional]);
    }
  };

  const handleSeatClick = (seatId) => {
    if (selectedSeats.includes(seatId)) {
      if (selectedSeats.length > 1) {
        const nextSeats = selectedSeats.filter((s) => s !== seatId);
        setSelectedSeats(nextSeats);
        setPaxCount(nextSeats.length);
      }
    } else {
      if (selectedSeats.length < 6) {
        const nextSeats = [...selectedSeats, seatId];
        setSelectedSeats(nextSeats);
        setPaxCount(nextSeats.length);
      }
    }
  };

  const perPersonBase = flight.pricePerPersonInr || flight.priceInr || flight.price;
  const currentPerPerson = Math.round(perPersonBase * CABIN_MULTIPLIERS[localCabin]);
  const currentTotal = currentPerPerson * paxCount;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 modal-overlay">
      <div
        className="w-full max-w-3xl rounded-2xl overflow-hidden shadow-2xl flex flex-col max-h-[90vh]"
        style={{ background: 'var(--bg-secondary)', border: '1.5px solid var(--border-base)' }}
      >
        {/* Header */}
        <div
          className="p-5 flex items-center justify-between"
          style={{ borderBottom: '1px solid var(--border-base)', background: 'var(--bg-sidebar)' }}
        >
          <div className="flex items-center gap-3">
            <div
              className="w-10 h-10 rounded-xl flex items-center justify-center p-1 overflow-hidden"
              style={{ background: 'var(--bg-card)', border: '1.5px solid var(--border-base)' }}
            >
              <img src={flight.airline.logo} alt={flight.airline.name} className="w-full h-full object-contain" />
            </div>
            <div>
              <h3 className="text-base font-bold font-sans-ui" style={{ color: 'var(--text-primary)' }}>
                {flight.airline.name} {flight.flightNumber}
              </h3>
              <p className="text-xs" style={{ color: 'var(--text-muted)' }}>
                {flight.origin} → {flight.destination} • {flight.aircraft || 'Boeing 777'}
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

        {/* Navigation Tabs */}
        <div className="flex px-6 pt-2" style={{ borderBottom: '1px solid var(--border-base)', background: 'var(--bg-sidebar)' }}>
          {[
            { id: 'seatmap', label: `Seat Selection (${selectedSeats.length}/${paxCount} Selected)` },
            { id: 'itinerary', label: 'Itinerary & Timeline' },
            { id: 'fare', label: 'Fare Rules & Baggage' }
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className="px-4 py-2.5 text-xs font-semibold transition-all mr-4 cursor-pointer"
              style={{
                borderBottom: activeTab === tab.id ? '2px solid var(--accent)' : '2px solid transparent',
                color: activeTab === tab.id ? 'var(--accent)' : 'var(--text-muted)',
                fontWeight: activeTab === tab.id ? 700 : 500
              }}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Body Content */}
        <div className="p-6 overflow-y-auto space-y-6 flex-1">
          {/* Tab 1: Seat Map */}
          {activeTab === 'seatmap' && (
            <div className="space-y-4">
              <div
                className="p-4 rounded-xl flex flex-col gap-3"
                style={{ background: 'var(--bg-sidebar)', border: '1px solid var(--border-base)' }}
              >
                {/* Passengers row */}
                <div className="flex items-center justify-between gap-3 flex-wrap">
                  <div className="flex items-center gap-2">
                    <Users className="w-4 h-4" style={{ color: 'var(--accent)' }} />
                    <span className="text-xs font-bold" style={{ color: 'var(--text-primary)' }}>Passengers (up to 6):</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    {[1, 2, 3, 4, 5, 6].map((num) => (
                      <button
                        key={num}
                        type="button"
                        onClick={() => handlePaxCountChange(num)}
                        className="w-8 h-8 rounded-lg text-xs font-bold font-mono transition-all cursor-pointer"
                        style={{
                          background: paxCount === num ? 'var(--accent)' : 'var(--bg-card)',
                          color: paxCount === num ? '#ffffff' : 'var(--text-primary)',
                          border: paxCount === num ? '1.5px solid var(--accent)' : '1.5px solid var(--border-base)',
                        }}
                      >
                        {num}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Cabin Class row */}
                <div className="flex items-center gap-2 pt-3" style={{ borderTop: '1px solid var(--border-base)' }}>
                  <span className="text-xs font-bold whitespace-nowrap" style={{ color: 'var(--text-secondary)' }}>Cabin Class:</span>
                  <div className="flex items-center gap-1.5 flex-wrap">
                    {Object.entries(CABIN_MULTIPLIERS).map(([cls, mult]) => (
                      <button
                        key={cls}
                        type="button"
                        onClick={() => setLocalCabin(cls)}
                        className="px-3 py-1 rounded-lg text-[11px] font-bold transition-all cursor-pointer"
                        style={{
                          background: localCabin === cls ? 'var(--accent-light)' : 'var(--bg-card)',
                          color: localCabin === cls ? 'var(--accent-text)' : 'var(--text-secondary)',
                          border: localCabin === cls ? '1.5px solid var(--accent)' : '1.5px solid var(--border-base)',
                        }}
                      >
                        {cls}
                        <span className="ml-1 text-[9px] opacity-70">{mult === 1.0 ? '' : `${mult}x`}</span>
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              <div
                className="flex items-center justify-between text-xs p-3 rounded-xl"
                style={{ background: 'var(--accent-light)', border: '1px solid var(--accent)', color: 'var(--accent-text)' }}
              >
                <span className="flex items-center gap-1.5 font-semibold">
                  <Users className="w-4 h-4" />
                  Select {paxCount} seat{paxCount > 1 ? 's' : ''} for {paxCount} traveler{paxCount > 1 ? 's' : ''}:
                </span>
                <span className="font-mono font-bold px-2 py-0.5 rounded" style={{ background: 'var(--bg-secondary)', color: 'var(--accent-text)' }}>
                  Selected ({selectedSeats.length}/{paxCount}): {selectedSeats.join(', ')}
                </span>
              </div>

              {/* Aircraft Seat Layout */}
              <div
                className="p-6 rounded-2xl max-w-md mx-auto space-y-3 shadow-sm"
                style={{ background: 'var(--bg-sidebar)', border: '1.5px solid var(--border-base)' }}
              >
                <div className="text-center text-[10px] uppercase font-bold tracking-widest mb-4" style={{ color: 'var(--text-muted)' }}>
                  Cockpit / Front of Aircraft
                </div>

                {rows.map((rowNum) => (
                  <div key={rowNum} className="flex items-center justify-center gap-3">
                    <span className="w-4 text-xs font-mono font-bold" style={{ color: 'var(--text-muted)' }}>{rowNum}</span>
                    <div className="flex gap-1.5">
                      {['A', 'B', 'C'].map((col) => {
                        const seatId = `${rowNum}${col}`;
                        const isSelected = selectedSeats.includes(seatId);
                        const isTaken = (rowNum + col.charCodeAt(0)) % 5 === 0 && !isSelected;
                        return (
                          <button
                            key={seatId}
                            disabled={isTaken}
                            onClick={() => handleSeatClick(seatId)}
                            className="w-8 h-8 rounded-lg text-xs font-bold font-mono transition-all cursor-pointer"
                            style={{
                              background: isTaken ? 'var(--border-base)' : isSelected ? 'var(--accent)' : 'var(--bg-card)',
                              color: isTaken ? 'var(--text-muted)' : isSelected ? '#ffffff' : 'var(--text-primary)',
                              border: isSelected ? '1.5px solid var(--accent)' : '1px solid var(--border-base)',
                              opacity: isTaken ? 0.4 : 1,
                            }}
                          >
                            {col}
                          </button>
                        );
                      })}
                    </div>

                    <div className="w-6 text-center text-[10px] font-mono" style={{ color: 'var(--text-muted)' }}>AISLE</div>

                    <div className="flex gap-1.5">
                      {['D', 'E', 'F'].map((col) => {
                        const seatId = `${rowNum}${col}`;
                        const isSelected = selectedSeats.includes(seatId);
                        const isTaken = (rowNum + col.charCodeAt(0)) % 4 === 0 && !isSelected;
                        return (
                          <button
                            key={seatId}
                            disabled={isTaken}
                            onClick={() => handleSeatClick(seatId)}
                            className="w-8 h-8 rounded-lg text-xs font-bold font-mono transition-all cursor-pointer"
                            style={{
                              background: isTaken ? 'var(--border-base)' : isSelected ? 'var(--accent)' : 'var(--bg-card)',
                              color: isTaken ? 'var(--text-muted)' : isSelected ? '#ffffff' : 'var(--text-primary)',
                              border: isSelected ? '1.5px solid var(--accent)' : '1px solid var(--border-base)',
                              opacity: isTaken ? 0.4 : 1,
                            }}
                          >
                            {col}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Tab 2: Itinerary */}
          {activeTab === 'itinerary' && (
            <div className="space-y-6">
              <div className="relative pl-6 space-y-8 before:absolute before:left-2 before:top-2 before:bottom-2 before:w-0.5" style={{ '--tw-before-bg': 'var(--border-base)' }}>
                <div className="relative">
                  <div className="absolute -left-6 top-1 w-4 h-4 rounded-full" style={{ background: 'var(--accent)' }}></div>
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="text-lg font-bold" style={{ color: 'var(--text-primary)' }}>{flight.depTime} • {flight.origin}</div>
                      <div className="text-xs" style={{ color: 'var(--text-muted)' }}>Departure Airport</div>
                    </div>
                    <span className="text-xs font-mono px-2 py-0.5 rounded badge-blue">
                      Non-stop ({flight.duration})
                    </span>
                  </div>
                </div>

                <div className="relative">
                  <div className="absolute -left-6 top-1 w-4 h-4 rounded-full" style={{ background: 'var(--accent)' }}></div>
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="text-lg font-bold" style={{ color: 'var(--text-primary)' }}>{flight.arrTime} • {flight.destination}</div>
                      <div className="text-xs" style={{ color: 'var(--text-muted)' }}>Destination Airport</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Tab 3: Fare Rules */}
          {activeTab === 'fare' && (
            <div className="space-y-4">
              <div className="p-4 rounded-xl space-y-3" style={{ background: 'var(--bg-sidebar)', border: '1px solid var(--border-base)' }}>
                <h4 className="text-xs font-bold uppercase tracking-wider" style={{ color: 'var(--text-secondary)' }}>Fare Policy & Baggage Rules</h4>
                <ul className="text-xs space-y-2 list-disc list-inside" style={{ color: 'var(--text-secondary)' }}>
                  <li>24-hour free cancellation on all refundable bookings</li>
                  <li>Flight change allowed up to 4 hours before departure for ₹1,500 fee + fare difference</li>
                  <li>Cabin Hand Bag: Up to 7kg per passenger included</li>
                  <li>Checked Baggage: Up to 15kg per passenger included for domestic flights</li>
                </ul>
              </div>
            </div>
          )}
        </div>

        {/* Footer Action */}
        <div
          className="p-5 flex items-center justify-between"
          style={{ borderTop: '1px solid var(--border-base)', background: 'var(--bg-sidebar)' }}
        >
          <div>
            <div className="text-[10px] uppercase font-bold" style={{ color: 'var(--text-muted)' }}>
              {localCabin} • {paxCount} Passenger{paxCount > 1 ? 's' : ''}
            </div>
            <div className="text-2xl font-extrabold font-mono" style={{ color: 'var(--accent)' }}>
              ₹{currentTotal.toLocaleString('en-IN')}
            </div>
            <div className="text-[10px] mt-0.5" style={{ color: 'var(--text-muted)' }}>
              ₹{currentPerPerson.toLocaleString('en-IN')} × {paxCount} person{paxCount > 1 ? 's' : ''}
            </div>
          </div>
          <button
            onClick={() => {
              const cabinFlight = {
                ...flight,
                cabinClass: localCabin,
                priceInr: currentTotal,
                price: currentTotal
              };
              onClose();
              onBookNow(cabinFlight, selectedSeats.join(', '), paxCount);
            }}
            className="px-8 py-3 rounded-xl btn-glow font-bold text-xs uppercase tracking-wider cursor-pointer"
          >
            Book {selectedSeats.length} Seat{selectedSeats.length > 1 ? 's' : ''} ({selectedSeats.join(', ')})
          </button>
        </div>
      </div>
    </div>
  );
}
