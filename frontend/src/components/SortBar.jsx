import React from 'react';
import { ArrowUpDown, Zap, DollarSign, Clock, Award } from 'lucide-react';

export default function SortBar({ sortBy, onSortChange, totalCount }) {
  const sortOptions = [
    { id: 'price', label: 'Cheapest', icon: DollarSign },
    { id: 'duration', label: 'Fastest', icon: Zap },
    { id: 'value', label: 'Best Value', icon: Award },
    { id: 'departure', label: 'Earliest', icon: Clock }
  ];

  return (
    <div
      className="w-full rounded-xl p-3 mb-5 flex flex-col sm:flex-row items-center justify-between gap-4"
      style={{ background: 'var(--bg-card)', border: '1.5px solid var(--border-base)' }}
    >
      <div className="text-xs font-semibold" style={{ color: 'var(--text-secondary)' }}>
        Showing{' '}
        <span className="font-bold" style={{ color: 'var(--accent)' }}>{totalCount}</span>
        {' '}available flights
      </div>

      <div className="flex items-center gap-1.5 overflow-x-auto max-w-full pb-1 sm:pb-0">
        <span
          className="text-[11px] font-bold uppercase tracking-wider mr-1.5 flex items-center gap-1 whitespace-nowrap"
          style={{ color: 'var(--text-muted)' }}
        >
          <ArrowUpDown className="w-3 h-3" style={{ color: 'var(--accent)' }} /> Sort:
        </span>
        {sortOptions.map((opt) => {
          const Icon = opt.icon;
          const isActive = sortBy === opt.id;
          return (
            <button
              key={opt.id}
              onClick={() => onSortChange(opt.id)}
              className="px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-all whitespace-nowrap cursor-pointer"
              style={{
                background: isActive ? 'var(--accent)' : 'var(--bg-sidebar)',
                color: isActive ? '#ffffff' : 'var(--text-secondary)',
                border: isActive ? '1.5px solid var(--accent)' : '1.5px solid var(--border-base)',
                fontWeight: isActive ? 700 : 500
              }}
            >
              <Icon className="w-3.5 h-3.5" />
              {opt.label}
            </button>
          );
        })}
      </div>
    </div>
  );
}
