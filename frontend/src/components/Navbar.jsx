import React, { useState, useEffect, useRef } from 'react';
import { Globe, User, Compass, Plane, Bell, Ticket, LogIn, Sun, Moon, ChevronDown, Check } from 'lucide-react';

const CURRENCIES = [
  { code: 'INR', symbol: '₹', name: 'Indian Rupee', flag: '🇮🇳' },
  { code: 'USD', symbol: '$', name: 'US Dollar', flag: '🇺🇸' },
  { code: 'EUR', symbol: '€', name: 'Euro', flag: '🇪🇺' },
  { code: 'GBP', symbol: '£', name: 'British Pound', flag: '🇬🇧' },
];

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
  const [showCurrencyDropdown, setShowCurrencyDropdown] = useState(false);
  const currencyRef = useRef(null);

  // Close dropdown on click outside
  useEffect(() => {
    function handleClickOutside(e) {
      if (currencyRef.current && !currencyRef.current.contains(e.target)) {
        setShowCurrencyDropdown(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const activeCurrencyObj = CURRENCIES.find(c => c.code === currency) || CURRENCIES[0];

  return (
    <header
      className="w-full px-3 sm:px-6 py-2.5 sm:py-3.5 flex items-center justify-between z-30 relative navbar"
      style={{
        background: 'var(--bg-nav)',
        borderBottom: '1px solid var(--border-base)',
        boxShadow: '0 1px 0 var(--border-base)',
        position: 'sticky',
        top: 0,
      }}
    >
      {/* Left — Brand */}
      <div className="flex items-center gap-2 sm:gap-3 flex-shrink-0">
        <div
          className="w-8 h-8 sm:w-9 sm:h-9 rounded-xl flex items-center justify-center shadow-sm flex-shrink-0"
          style={{ background: 'var(--accent)' }}
        >
          <Plane className="w-4 h-4 sm:w-4.5 sm:h-4.5 text-white transform -rotate-45" size={18} />
        </div>
        <div className="flex flex-col leading-tight">
          <span className="font-bold text-sm sm:text-base tracking-wide font-sans-ui whitespace-nowrap" style={{ color: 'var(--text-primary)' }}>
            Skyward <span style={{ color: 'var(--accent)', fontWeight: 600 }}>Global</span>
          </span>
          <span className="hidden sm:block text-[10px] font-medium tracking-widest uppercase" style={{ color: 'var(--text-muted)' }}>
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
      <div className="flex items-center gap-1.5 sm:gap-2.5 flex-shrink-0">
        {/* Custom Styled Currency Dropdown */}
        <div className="relative" ref={currencyRef}>
          <button
            type="button"
            onClick={() => setShowCurrencyDropdown(!showCurrencyDropdown)}
            className="h-8 sm:h-9 flex items-center gap-1.5 rounded-lg px-2 sm:px-2.5 text-xs font-semibold transition-all cursor-pointer whitespace-nowrap"
            style={{
              background: 'var(--bg-input)',
              border: '1.5px solid var(--border-base)',
              color: 'var(--text-primary)'
            }}
            onMouseEnter={e => { e.currentTarget.style.borderColor = 'var(--accent)'; }}
            onMouseLeave={e => { if (!showCurrencyDropdown) e.currentTarget.style.borderColor = 'var(--border-base)'; }}
          >
            <span className="text-sm leading-none">{activeCurrencyObj.flag}</span>
            <span className="font-bold text-[11px] sm:text-xs">{activeCurrencyObj.code}</span>
            <span className="hidden sm:inline text-[11px]" style={{ color: 'var(--text-muted)' }}>({activeCurrencyObj.symbol})</span>
            <ChevronDown
              className={`w-3 h-3 transition-transform duration-200 ${showCurrencyDropdown ? 'rotate-180' : ''}`}
              style={{ color: 'var(--text-muted)' }}
            />
          </button>

          {/* Sleek Popover Menu */}
          {showCurrencyDropdown && (
            <div
              className="absolute right-0 top-full mt-2 w-52 rounded-xl p-1.5 shadow-2xl z-50 animate-in fade-in zoom-in-95 duration-150"
              style={{
                background: 'var(--bg-secondary)',
                border: '1.5px solid var(--border-base)',
                boxShadow: 'var(--shadow-popup)'
              }}
            >
              <div
                className="px-2.5 py-1.5 text-[10px] font-bold uppercase tracking-wider mb-1"
                style={{ color: 'var(--text-muted)', borderBottom: '1px solid var(--border-base)' }}
              >
                Select Display Currency
              </div>
              <div className="space-y-0.5">
                {CURRENCIES.map((c) => {
                  const isSelected = c.code === currency;
                  return (
                    <button
                      key={c.code}
                      type="button"
                      onClick={() => {
                        setCurrency(c.code);
                        setShowCurrencyDropdown(false);
                      }}
                      className="w-full px-2.5 py-2 rounded-lg text-xs font-semibold flex items-center justify-between transition-all cursor-pointer"
                      style={{
                        background: isSelected ? 'var(--accent-light)' : 'transparent',
                        color: isSelected ? 'var(--accent-text)' : 'var(--text-primary)',
                      }}
                      onMouseEnter={e => {
                        if (!isSelected) e.currentTarget.style.background = 'var(--bg-card-hover)';
                      }}
                      onMouseLeave={e => {
                        if (!isSelected) e.currentTarget.style.background = 'transparent';
                      }}
                    >
                      <div className="flex items-center gap-2">
                        <span className="text-sm">{c.flag}</span>
                        <div className="text-left">
                          <span className="font-bold">{c.code}</span>
                          <span className="text-[11px] ml-1.5" style={{ color: 'var(--text-muted)' }}>
                            {c.symbol} • {c.name}
                          </span>
                        </div>
                      </div>
                      {isSelected && (
                        <Check className="w-3.5 h-3.5" style={{ color: 'var(--accent)' }} />
                      )}
                    </button>
                  );
                })}
              </div>
            </div>
          )}
        </div>

        {/* Theme Toggle */}
        <button
          onClick={onToggleTheme}
          title={isDark ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
          className="w-8 h-8 sm:w-9 sm:h-9 rounded-lg flex items-center justify-center transition-all cursor-pointer flex-shrink-0"
          style={{
            background: 'var(--bg-input)',
            border: '1.5px solid var(--border-base)',
            color: 'var(--text-secondary)',
          }}
          onMouseEnter={e => { e.currentTarget.style.borderColor = 'var(--accent)'; e.currentTarget.style.color = 'var(--accent)'; }}
          onMouseLeave={e => { e.currentTarget.style.borderColor = 'var(--border-base)'; e.currentTarget.style.color = 'var(--text-secondary)'; }}
        >
          {isDark
            ? <Sun className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
            : <Moon className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
          }
        </button>

        {/* User / Auth */}
        {user ? (
          <button
            onClick={onOpenAccount}
            className="h-8 sm:h-9 flex items-center gap-1.5 px-2 sm:px-3 rounded-lg transition-all cursor-pointer flex-shrink-0"
            style={{ background: 'var(--bg-input)', border: '1.5px solid var(--border-base)' }}
            onMouseEnter={e => { e.currentTarget.style.borderColor = 'var(--accent)'; }}
            onMouseLeave={e => { e.currentTarget.style.borderColor = 'var(--border-base)'; }}
          >
            <div
              className="w-5 h-5 sm:w-6 sm:h-6 rounded-full font-bold text-[10px] sm:text-[11px] flex items-center justify-center text-white flex-shrink-0"
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
            className="btn-glow h-8 sm:h-9 flex items-center gap-1 sm:gap-1.5 px-2.5 sm:px-4 rounded-lg text-xs font-bold tracking-wide cursor-pointer flex-shrink-0 whitespace-nowrap"
          >
            <LogIn className="w-3.5 h-3.5" /> Sign In
          </button>
        )}
      </div>
    </header>
  );
}
