import React from 'react';
import { X, Compass, MapPin, ArrowRight, Sun, Sparkles } from 'lucide-react';

export default function ExploreModal({ onClose, onSelectDestination }) {
  const destinations = [
    {
      city: 'Goa',
      country: 'India 🇮🇳',
      airportCode: 'GOI',
      originCode: 'DEL',
      startingPriceInr: 4200,
      image: 'https://images.unsplash.com/photo-1512343879784-a960bf40e7f2?auto=format&fit=crop&w=400&q=80',
      weather: '28°C ☀️',
      tag: 'Popular Beach'
    },
    {
      city: 'Dubai',
      country: 'UAE 🇦🇪',
      airportCode: 'DXB',
      originCode: 'DEL',
      startingPriceInr: 18500,
      image: 'https://images.unsplash.com/photo-1512453979798-5ea266f8880c?auto=format&fit=crop&w=400&q=80',
      weather: '35°C ☀️',
      tag: 'Luxury Shopping'
    },
    {
      city: 'London',
      country: 'United Kingdom 🇬🇧',
      airportCode: 'LHR',
      originCode: 'DEL',
      startingPriceInr: 45000,
      image: 'https://images.unsplash.com/photo-1513635269975-59663e0ac1ad?auto=format&fit=crop&w=400&q=80',
      weather: '18°C ☁️',
      tag: 'Historic Landmark'
    },
    {
      city: 'Bengaluru',
      country: 'India 🇮🇳',
      airportCode: 'BLR',
      originCode: 'BOM',
      startingPriceInr: 3400,
      image: 'https://images.unsplash.com/photo-1596176530529-78163a4f7af2?auto=format&fit=crop&w=400&q=80',
      weather: '24°C 🌤️',
      tag: 'Silicon Valley'
    },
    {
      city: 'Singapore',
      country: 'Singapore 🇸🇬',
      airportCode: 'SIN',
      originCode: 'DEL',
      startingPriceInr: 22000,
      image: 'https://images.unsplash.com/photo-1525625293386-3f8f99389edd?auto=format&fit=crop&w=400&q=80',
      weather: '30°C 🌤️',
      tag: 'Garden City'
    },
    {
      city: 'Tokyo',
      country: 'Japan 🇯🇵',
      airportCode: 'HND',
      originCode: 'DEL',
      startingPriceInr: 52000,
      image: 'https://images.unsplash.com/photo-1503899036084-c55cdd92da26?auto=format&fit=crop&w=400&q=80',
      weather: '22°C 🌸',
      tag: 'Culture & Tech'
    }
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 modal-overlay">
      <div 
        className="w-full max-w-4xl rounded-2xl overflow-hidden shadow-2xl animate-fade-in flex flex-col max-h-[90vh]"
        style={{ background: 'var(--bg-secondary)', border: '1.5px solid var(--border-base)' }}
      >
        {/* Header */}
        <div 
          className="p-5 flex items-center justify-between"
          style={{ borderBottom: '1px solid var(--border-base)', background: 'var(--bg-sidebar)' }}
        >
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl" style={{ background: 'var(--accent-light)', color: 'var(--accent)' }}>
              <Compass className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold font-sans-ui" style={{ color: 'var(--text-primary)' }}>
                Explore Top Trending Destinations
              </h3>
              <p className="text-xs" style={{ color: 'var(--text-muted)' }}>
                Handpicked travel spots with live low fare predictions
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

        {/* Content Cards */}
        <div className="p-6 overflow-y-auto grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-5">
          {destinations.map((dest) => (
            <div
              key={dest.city}
              className="rounded-2xl overflow-hidden transition-all duration-300 group flex flex-col justify-between"
              style={{ background: 'var(--bg-card)', border: '1px solid var(--border-base)', boxShadow: 'var(--shadow-card)' }}
            >
              <div className="relative h-36 overflow-hidden">
                <img
                  src={dest.image}
                  alt={dest.city}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent"></div>
                <span className="absolute top-3 left-3 px-2.5 py-0.5 rounded-full text-[10px] uppercase font-bold tracking-wider bg-black/60 border border-white/20 text-white backdrop-blur-md">
                  {dest.tag}
                </span>
                <span className="absolute top-3 right-3 text-xs font-semibold px-2 py-0.5 rounded bg-black/60 text-amber-300 backdrop-blur-md border border-white/10">
                  {dest.weather}
                </span>

                <div className="absolute bottom-3 left-3 right-3">
                  <h4 className="text-lg font-bold text-white font-sans-ui leading-tight drop-shadow-sm">
                    {dest.city}
                  </h4>
                  <p className="text-xs text-white/90 font-medium drop-shadow-sm">{dest.country}</p>
                </div>
              </div>

              <div 
                className="p-4 flex items-center justify-between"
                style={{ background: 'var(--bg-sidebar)', borderTop: '1px solid var(--border-base)' }}
              >
                <div>
                  <div className="text-[10px] uppercase font-bold" style={{ color: 'var(--text-muted)' }}>Fares From</div>
                  <div className="text-base font-extrabold font-mono" style={{ color: 'var(--accent)' }}>
                    ₹{dest.startingPriceInr.toLocaleString('en-IN')}
                  </div>
                </div>

                <button
                  onClick={() => {
                    onSelectDestination(dest.originCode, dest.airportCode, dest.city);
                    onClose();
                  }}
                  className="px-3.5 py-2 rounded-xl btn-glow text-xs uppercase font-bold flex items-center gap-1.5 cursor-pointer shadow-md"
                >
                  Search <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
