import React from 'react';
import { Calendar, TrendingDown, Users } from 'lucide-react';

export default function FareCalendar({ days = [], passengers = 1, cabinClass = 'Economy', onSelectDate }) {
  if (!days.length) return null;

  return (
    <div
      className="w-full rounded-2xl p-3 sm:p-4 mb-6 shadow-sm overflow-hidden"
      style={{
        background: 'var(--bg-secondary)',
        border: '1.5px solid var(--border-base)',
      }}
    >
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1.5 sm:gap-2 mb-3 px-1">
        <div className="flex items-center gap-2 flex-wrap">
          <Calendar className="w-4 h-4 flex-shrink-0" style={{ color: 'var(--accent)' }} />
          <h4 className="text-xs font-bold uppercase tracking-wider" style={{ color: 'var(--text-primary)' }}>
            7-Day Fare Matrix (INR ₹)
          </h4>
          <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded-full badge-blue flex items-center gap-1">
            Per traveler
          </span>
        </div>
        <span className="text-[11px] font-medium flex items-center gap-1" style={{ color: 'var(--accent)' }}>
          <TrendingDown className="w-3.5 h-3.5 flex-shrink-0" /> Save up to ₹1,200 with flexible dates
        </span>
      </div>

      {/* Horizontal Scroll on Mobile, 7-Column Grid on Tablet/Desktop */}
      <div className="flex sm:grid sm:grid-cols-7 gap-2 overflow-x-auto pb-2 sm:pb-0 scrollbar-none snap-x -mx-1 px-1">
        {days.map((item, idx) => {
          const price = item.priceInr || item.price || 5400;
          return (
            <button
              key={idx}
              type="button"
              onClick={() => onSelectDate(item.date, item.fullDate)}
              className="min-w-[92px] sm:min-w-0 flex-1 p-2.5 sm:p-3 rounded-xl text-center transition-all duration-200 cursor-pointer flex-shrink-0 sm:flex-shrink snap-start flex flex-col items-center justify-between min-h-[78px] sm:min-h-[86px]"
              style={{
                background: item.isSelected ? 'var(--accent-light)' : 'var(--bg-sidebar)',
                border: item.isSelected ? '2px solid var(--accent)' : '1.5px solid var(--border-base)',
                color: item.isSelected ? 'var(--accent-text)' : 'var(--text-primary)',
              }}
            >
              <div className="text-[11px] font-semibold whitespace-nowrap" style={{ color: item.isSelected ? 'var(--accent-text)' : 'var(--text-muted)' }}>
                {item.date}
              </div>
              <div
                className="text-xs sm:text-sm font-extrabold font-mono my-0.5 whitespace-nowrap"
                style={{ color: item.isCheapest ? 'var(--tag-green-text)' : (item.isSelected ? 'var(--accent-text)' : 'var(--text-primary)') }}
              >
                ₹{price.toLocaleString('en-IN')}
              </div>
              <div className="h-4 flex items-center justify-center">
                {item.isCheapest && (
                  <span className="inline-block text-[9px] font-extrabold uppercase tracking-tight badge-green px-1.5 py-0.5 rounded leading-none whitespace-nowrap">
                    Cheapest
                  </span>
                )}
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}
