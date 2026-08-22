import React, { useState } from 'react';
import { Globe, User, Compass, Plane, Bell, Ticket, LogIn, Sun, Moon } from 'lucide-react';

export default function Navbar({
  currency,
  setCurrency,
  savedCount,
  user,
  isDark,
  onToggleTheme,
  onOpenExplore,
  onOpenBookings,
  onOpenFareAlerts,
  onOpenAccount,
  onOpenAuth
}) {
  const [activeNav, setActiveNav] = useState('');

  return (
    <header
      className="w-full px-5 py-3.5 flex items-center justify-between z-30 relative navbar"
      style={{
        background: 'var(--bg-nav)',
        borderBottom: '1px solid var(--border-base)',
        boxShadow: '0 1px 0 var(--border-base)',
        position: 'sticky',
        top: 0,
      }}
    >
      {/* Left — Brand */}
      <div className="flex items-center gap-3">
        <div
          className="w-9 h-9 rounded-xl flex items-center justify-center shadow-sm flex-shrink-0"
          style={{ background: 'var(--accent)' }}
        >
          <Plane className="w-4.5 h-4.5 text-white transform -rotate-45" size={18} />
        </div>
        <div className="flex flex-col leading-tight">
          <span className="font-bold text-base tracking-wide font-sans-ui" style={{ color: 'var(--text-primary)' }}>
            Skyward <span style={{ color: 'var(--accent)', fontWeight: 400 }}>Global</span>
          </span>
          <span className="text-[10px] font-medium tracking-widest uppercase" style={{ color: 'var(--text-muted)' }}>
            Flight Fare Engine
          </span>
        </div>
      </div>

      {/* Center — Navigation */}
      <nav className="hidden md:flex items-center gap-1">
        {[
          { label: 'Explore', icon: Compass, action: onOpenExplore },
          { label: 'Bookings', icon: Ticket, action: onOpenBookings },
          { label: 'Fare Alerts', icon: Bell, action: onOpenFareAlerts },
        ].map(({ label, icon: Icon, action }) => (
          <button
            key={label}
            onClick={() => { setActiveNav(label); action(); }}
            className="px-3.5 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-all cursor-pointer"
            style={{
              background: activeNav === label ? 'var(--accent-light)' : 'transparent',
              color: activeNav === label ? 'var(--accent-text)' : 'var(--text-secondary)',
            }}
            onMouseEnter={e => {
              if (activeNav !== label) e.currentTarget.style.background = 'var(--bg-card-hover)';
            }}
            onMouseLeave={e => {
              if (activeNav !== label) e.currentTarget.style.background = 'transparent';
            }}
          >
            <Icon className="w-3.5 h-3.5" />
            {label}
          </button>
        ))}
      </nav>

      {/* Right — Controls */}
      <div className="flex items-center gap-2.5">
        {/* Currency */}
        <div
          className="flex items-center rounded-lg px-2.5 py-1.5 text-xs font-semibold"
          style={{ background: 'var(--bg-input)', border: '1.5px solid var(--border-base)', color: 'var(--text-secondary)' }}
        >
          <Globe className="w-3.5 h-3.5 mr-1.5" style={{ color: 'var(--accent)' }} />
          <select
            value={currency}
            onChange={(e) => setCurrency(e.target.value)}
            className="outline-none cursor-pointer"
            style={{ background: 'transparent', color: 'var(--text-primary)', border: 'none' }}
          >
            <option value="INR">INR (₹)</option>
            <option value="USD">USD ($)</option>
            <option value="EUR">EUR (€)</option>
            <option value="GBP">GBP (£)</option>
          </select>
        </div>

        {/* Theme Toggle */}
        <button
          onClick={onToggleTheme}
          title={isDark ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
          className="w-9 h-9 rounded-lg flex items-center justify-center transition-all cursor-pointer"
          style={{
            background: 'var(--bg-input)',
            border: '1.5px solid var(--border-base)',
            color: 'var(--text-secondary)',
          }}
          onMouseEnter={e => { e.currentTarget.style.borderColor = 'var(--accent)'; e.currentTarget.style.color = 'var(--accent)'; }}
          onMouseLeave={e => { e.currentTarget.style.borderColor = 'var(--border-base)'; e.currentTarget.style.color = 'var(--text-secondary)'; }}
        >
          {isDark
            ? <Sun className="w-4 h-4" />
            : <Moon className="w-4 h-4" />
          }
        </button>

        {/* User / Auth */}
        {user ? (
          <button
            onClick={onOpenAccount}
            className="flex items-center gap-2 px-3 py-1.5 rounded-lg transition-all cursor-pointer"
            style={{ background: 'var(--bg-input)', border: '1.5px solid var(--border-base)' }}
            onMouseEnter={e => { e.currentTarget.style.borderColor = 'var(--accent)'; }}
            onMouseLeave={e => { e.currentTarget.style.borderColor = 'var(--border-base)'; }}
          >
            <div
              className="w-6 h-6 rounded-full font-bold text-[11px] flex items-center justify-center text-white flex-shrink-0"
              style={{ background: 'var(--accent)' }}
            >
              {(user.name || 'U').charAt(0).toUpperCase()}
            </div>
            <span className="text-xs font-semibold hidden sm:inline" style={{ color: 'var(--text-primary)' }}>
              {user.name.split(' ')[0]}
            </span>
          </button>
        ) : (
          <button
            onClick={onOpenAuth}
            className="btn-glow flex items-center gap-1.5 px-4 py-1.5 rounded-lg text-xs font-bold tracking-wide cursor-pointer"
          >
            <LogIn className="w-3.5 h-3.5" /> Sign In
          </button>
        )}
      </div>
    </header>
  );
}
