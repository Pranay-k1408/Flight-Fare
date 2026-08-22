import React from 'react';
import { Calendar, TrendingDown, Users } from 'lucide-react';

export default function FareCalendar({ days = [], passengers = 1, cabinClass = 'Economy', onSelectDate }) {
  if (!days.length) return null;

  return (
    <div
      className="w-full rounded-2xl p-4 mb-6 shadow-sm"
      style={{
        background: 'var(--bg-secondary)',
        border: '1.5px solid var(--border-base)',
      }}
    >
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-3.5 px-1">
        <div className="flex items-center gap-2 flex-wrap">
          <Calendar className="w-4 h-4" style={{ color: 'var(--accent)' }} />
          <h4 className="text-xs font-bold uppercase tracking-wider" style={{ color: 'var(--text-primary)' }}>
            7-Day Flexible Fare Calendar (INR ₹)
          </h4>
          <span className="text-[10px] font-mono font-bold px-2.5 py-0.5 rounded-full badge-blue flex items-center gap-1">
            Price per traveler
          </span>
        </div>
        <span className="text-[11px] font-medium flex items-center gap-1" style={{ color: 'var(--accent)' }}>
          <TrendingDown className="w-3.5 h-3.5" /> Save up to ₹1,200 by adjusting dates
        </span>
      </div>

      <div className="grid grid-cols-7 gap-2">
        {days.map((item, idx) => {
          const price = item.priceInr || item.price || 5400;
          return (
            <button
              key={idx}
              type="button"
              onClick={() => onSelectDate(item.date, item.fullDate)}
              className="p-3 rounded-xl text-center transition-all duration-200 cursor-pointer transform hover:-translate-y-0.5"
              style={{
                background: item.isSelected ? 'var(--accent-light)' : 'var(--bg-sidebar)',
                border: item.isSelected ? '2px solid var(--accent)' : '1.5px solid var(--border-base)',
                color: item.isSelected ? 'var(--accent-text)' : 'var(--text-primary)',
              }}
            >
              <div className="text-[11px] font-semibold" style={{ color: item.isSelected ? 'var(--accent-text)' : 'var(--text-muted)' }}>
                {item.date}
              </div>
              <div
                className="text-xs sm:text-sm font-extrabold font-mono mt-1"
                style={{ color: item.isCheapest ? 'var(--tag-green-text)' : (item.isSelected ? 'var(--accent-text)' : 'var(--text-primary)') }}
              >
                ₹{price.toLocaleString('en-IN')}
              </div>
              {item.isCheapest && (
                <span className="inline-block mt-1 text-[9px] font-extrabold uppercase tracking-tight badge-green">
                  Cheapest
                </span>
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
}
