import React, { useState, useEffect, useRef } from 'react';
import { Plane, Calendar, Users, ArrowRightLeft, Search, ChevronDown, ChevronLeft, ChevronRight, Check, MapPin } from 'lucide-react';
import { searchAirportsApi } from '../services/api';

export default function SearchCard({ searchParams, onSearch }) {
  const [tripType, setTripType] = useState(searchParams.tripType || 'One Way');
  const [originCode, setOriginCode] = useState(searchParams.originCode || '');
  const [destCode, setDestCode] = useState(searchParams.destCode || '');

  // Real-time current system date initialization
  const today = new Date();
  const initialYear = today.getFullYear(); // e.g. 2026
  const initialMonth = today.getMonth();   // 0-indexed (August = 7)
  const initialDay = today.getDate();       // e.g. 12

  const [currentYear, setCurrentYear] = useState(initialYear);
  const [currentMonth, setCurrentMonth] = useState(initialMonth);
  const [selectedDay, setSelectedDay] = useState(initialDay);

  // Calendar View Mode: 'days', 'months', 'years'
  const [viewMode, setViewMode] = useState('days');

  // Formatted date text
  const [displayDateText, setDisplayDateText] = useState('');

  const [passengers, setPassengers] = useState(searchParams.passengers || 1);
  const [cabinClass, setCabinClass] = useState(searchParams.cabinClass || 'Economy');

  // Autocomplete states
  const [originQuery, setOriginQuery] = useState(searchParams.originQuery || '');
  const [destQuery, setDestQuery] = useState(searchParams.destQuery || '');
  const [originResults, setOriginResults] = useState([]);
  const [destResults, setDestResults] = useState([]);

  // Popover Visibility Toggles
  const [showOriginDrop, setShowOriginDrop] = useState(false);
  const [showDestDrop, setShowDestDrop] = useState(false);
  const [showPaxModal, setShowPaxModal] = useState(false);
  const [showDateModal, setShowDateModal] = useState(false);

  // Sync local state when searchParams prop updates
  useEffect(() => {
    if (searchParams.cabinClass) setCabinClass(searchParams.cabinClass);
    if (searchParams.passengers) setPassengers(searchParams.passengers);
    if (searchParams.originCode) setOriginCode(searchParams.originCode);
    if (searchParams.destCode) setDestCode(searchParams.destCode);
    if (searchParams.originQuery) setOriginQuery(searchParams.originQuery);
    if (searchParams.destQuery) setDestQuery(searchParams.destQuery);
  }, [searchParams]);

  const originRef = useRef(null);
  const destRef = useRef(null);
  const paxRef = useRef(null);
  const dateRef = useRef(null);

  const monthNames = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];

  const shortMonthNames = [
    'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
    'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'
  ];

  // Restricted strictly to Current System Year up to +2 years max (e.g. 2026, 2027, 2028)
  const availableYears = [initialYear, initialYear + 1, initialYear + 2];

  // Search origin airports
  useEffect(() => {
    if (showOriginDrop) {
      searchAirportsApi(originQuery).then(res => setOriginResults(res));
    }
  }, [originQuery, showOriginDrop]);

  // Search destination airports
  useEffect(() => {
    if (showDestDrop) {
      searchAirportsApi(destQuery).then(res => setDestResults(res));
    }
  }, [destQuery, showDestDrop]);

  // Click outside listener
  useEffect(() => {
    function handleClickOutside(e) {
      if (originRef.current && !originRef.current.contains(e.target)) setShowOriginDrop(false);
      if (destRef.current && !destRef.current.contains(e.target)) setShowDestDrop(false);
      if (paxRef.current && !paxRef.current.contains(e.target)) setShowPaxModal(false);
      if (dateRef.current && !dateRef.current.contains(e.target)) {
        setShowDateModal(false);
        setViewMode('days');
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Update date text dynamically
  useEffect(() => {
    const monthStr = shortMonthNames[currentMonth];
    const departStr = `${monthStr} ${selectedDay}, ${currentYear}`;
    
    if (tripType === 'Round Trip') {
      const returnDateObj = new Date(currentYear, currentMonth, selectedDay + 7);
      const retMonthStr = shortMonthNames[returnDateObj.getMonth()];
      const returnStr = `${retMonthStr} ${returnDateObj.getDate()}, ${returnDateObj.getFullYear()}`;
      setDisplayDateText(`${departStr} - ${returnStr}`);
    } else {
      setDisplayDateText(departStr);
    }
  }, [selectedDay, currentMonth, currentYear, tripType]);

  // Swap locations
  const handleSwap = () => {
    if (!originQuery && !destQuery) return;
    const tempOrig = originQuery;
    const tempCode = originCode;
    setOriginQuery(destQuery);
    setOriginCode(destCode);
    setDestQuery(tempOrig);
    setDestCode(tempCode);
  };

  // Calendar Days Computation
  const getDaysInMonth = (year, month) => new Date(year, month + 1, 0).getDate();
  const getFirstDayOfMonth = (year, month) => new Date(year, month, 1).getDay();

  const daysInCurrentMonth = getDaysInMonth(currentYear, currentMonth);
  const firstDay = getFirstDayOfMonth(currentYear, currentMonth);

  const handleSelectDay = (dayNum) => {
    setSelectedDay(dayNum);
    setShowDateModal(false);
    setViewMode('days');
  };

  const resolveAirportCode = (code, query) => {
    if (code) return code.toUpperCase();
    if (!query) return '';
    const q = query.trim().toLowerCase();
    
    // Exact city & code map
    const map = {
      'delhi': 'DEL',
      'new delhi': 'DEL',
      'del': 'DEL',
      'mumbai': 'BOM',
      'bombay': 'BOM',
      'bom': 'BOM',
      'bengaluru': 'BLR',
      'bangalore': 'BLR',
      'blr': 'BLR',
      'hyderabad': 'HYD',
      'hyd': 'HYD',
      'chennai': 'MAA',
      'madras': 'MAA',
      'maa': 'MAA',
      'kolkata': 'CCU',
      'calcutta': 'CCU',
      'ccu': 'CCU',
      'goa': 'GOI',
      'goi': 'GOI',
      'london': 'LHR',
      'london heathrow': 'LHR',
      'heathrow': 'LHR',
      'lhr': 'LHR',
      'gatwick': 'LGW',
      'lgw': 'LGW',
      'dubai': 'DXB',
      'dxb': 'DXB',
      'new york': 'JFK',
      'nyc': 'JFK',
      'jfk': 'JFK',
      'singapore': 'SIN',
      'sin': 'SIN',
      'tokyo': 'HND',
      'hnd': 'HND',
      'paris': 'CDG',
      'cdg': 'CDG'
    };

    if (map[q]) return map[q];
    for (const [key, val] of Object.entries(map)) {
      if (q.includes(key)) return val;
    }
    return query.substring(0, 3).toUpperCase();
  };

  const handleTriggerSearch = (e) => {
    e.preventDefault();

    const monthStr = (currentMonth + 1).toString().padStart(2, '0');
    const dayStr = selectedDay.toString().padStart(2, '0');
    const isoDate = `${currentYear}-${monthStr}-${dayStr}`;

    const resolvedOrig = resolveAirportCode(originCode, originQuery) || 'DEL';
    const resolvedDest = resolveAirportCode(destCode, destQuery) || 'BOM';

    onSearch({
      tripType,
      origin: resolvedOrig,
      originFull: originQuery || resolvedOrig,
      destination: resolvedDest,
      destFull: destQuery || resolvedDest,
      date: isoDate,
      dateRange: displayDateText,
      passengers,
      cabinClass
    });
  };

  // shared dropdown style
  const dropdownStyle = {
    background: 'var(--bg-secondary)',
    border: '1.5px solid var(--border-base)',
    borderRadius: '14px',
    boxShadow: 'var(--shadow-modal)',
  };

  const fieldStyle = {
    background: 'var(--bg-input)',
    border: '1.5px solid var(--border-base)',
    borderRadius: '12px',
    padding: '10px 14px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    cursor: 'pointer',
    transition: 'border-color 0.2s',
  };

  return (
    <div
      className="w-full rounded-2xl p-4 md:p-6 relative z-20"
      style={{ background: 'var(--bg-secondary)', border: '1.5px solid var(--border-base)', boxShadow: 'var(--shadow-card)' }}
    >
      {/* Trip Type Tabs */}
      <div className="flex items-center gap-2 mb-4">
        {['One Way', 'Round Trip', 'Multi-City'].map((tab) => (
          <button
            key={tab}
            type="button"
            onClick={() => setTripType(tab)}
            className="px-4 py-1.5 rounded-full text-xs font-semibold transition-all cursor-pointer"
            style={{
              background: tripType === tab ? 'var(--accent)' : 'transparent',
              color: tripType === tab ? '#fff' : 'var(--text-secondary)',
              fontWeight: tripType === tab ? 700 : 500,
            }}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* Main Search Inputs Grid */}
      <form onSubmit={handleTriggerSearch} className="grid grid-cols-1 md:grid-cols-12 gap-3 items-center">

        {/* ── Origin ── */}
        <div className="md:col-span-3 relative" ref={originRef}>
          <div style={fieldStyle}
            onFocus={() => {}}
          >
            <div className="flex-1 min-w-0 pr-2">
              <label className="block text-[10px] uppercase tracking-wider font-bold mb-0.5" style={{ color: 'var(--text-muted)' }}>
                Origin
              </label>
              <input
                type="text"
                value={originQuery}
                onChange={(e) => { setOriginQuery(e.target.value); setOriginCode(''); setShowOriginDrop(true); }}
                onFocus={() => setShowOriginDrop(true)}
                className="w-full bg-transparent font-semibold text-sm outline-none truncate"
                style={{ color: 'var(--text-primary)', caretColor: 'var(--accent)' }}
                placeholder="From where? (e.g. DEL)"
              />
            </div>
            <Plane className="w-4 h-4 transform -rotate-45 flex-shrink-0" style={{ color: 'var(--accent)' }} />
          </div>

          {/* Origin Dropdown */}
          {showOriginDrop && (
            <div className="absolute top-full left-0 right-0 mt-2 z-50 max-h-60 overflow-y-auto" style={dropdownStyle}>
              <div className="px-3 py-1.5 text-[10px] uppercase font-bold tracking-wider" style={{ color: 'var(--text-muted)', borderBottom: '1px solid var(--border-base)' }}>
                Select Origin Airport
              </div>
              {originResults.map((item) => (
                <div
                  key={item.code}
                  onClick={() => { setOriginQuery(`${item.city} (${item.code})`); setOriginCode(item.code); setShowOriginDrop(false); }}
                  className="p-3 cursor-pointer flex items-center justify-between transition-colors"
                  style={{ borderBottom: '1px solid var(--border-base)' }}
                  onMouseEnter={e => e.currentTarget.style.background = 'var(--bg-card-hover)'}
                  onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
                >
                  <div className="flex items-center gap-2.5">
                    <span className="text-base">{item.flag}</span>
                    <div>
                      <div className="text-sm font-bold" style={{ color: 'var(--text-primary)' }}>{item.city} ({item.code})</div>
                      <div className="text-xs truncate" style={{ color: 'var(--text-muted)' }}>{item.name}</div>
                    </div>
                  </div>
                  <span className="text-xs font-mono font-bold px-2 py-0.5 rounded" style={{ background: 'var(--accent-light)', color: 'var(--accent-text)' }}>
                    {item.code}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* ── Swap Button ── */}
        <div className="md:col-span-1 flex items-center justify-center">
          <button
            type="button"
            onClick={handleSwap}
            className="w-9 h-9 rounded-full flex items-center justify-center transition-all hover:rotate-180 duration-300 cursor-pointer"
            style={{ background: 'var(--bg-sidebar)', border: '1.5px solid var(--border-base)', color: 'var(--text-secondary)' }}
            title="Swap Origin & Destination"
            onMouseEnter={e => { e.currentTarget.style.borderColor = 'var(--accent)'; e.currentTarget.style.color = 'var(--accent)'; }}
            onMouseLeave={e => { e.currentTarget.style.borderColor = 'var(--border-base)'; e.currentTarget.style.color = 'var(--text-secondary)'; }}
          >
            <ArrowRightLeft className="w-4 h-4" />
          </button>
        </div>

        {/* ── Destination ── */}
        <div className="md:col-span-3 relative" ref={destRef}>
          <div style={fieldStyle}>
            <div className="flex-1 min-w-0 pr-2">
              <label className="block text-[10px] uppercase tracking-wider font-bold mb-0.5" style={{ color: 'var(--text-muted)' }}>
                Destination
              </label>
              <input
                type="text"
                value={destQuery}
                onChange={(e) => { setDestQuery(e.target.value); setDestCode(''); setShowDestDrop(true); }}
                onFocus={() => setShowDestDrop(true)}
                className="w-full bg-transparent font-semibold text-sm outline-none truncate"
                style={{ color: 'var(--text-primary)', caretColor: 'var(--accent)' }}
                placeholder="Where to? (e.g. BOM)"
              />
            </div>
            <Plane className="w-4 h-4 transform rotate-45 flex-shrink-0" style={{ color: 'var(--accent)' }} />
          </div>

          {/* Destination Dropdown */}
          {showDestDrop && (
            <div className="absolute top-full left-0 right-0 mt-2 z-50 max-h-60 overflow-y-auto" style={dropdownStyle}>
              <div className="px-3 py-1.5 text-[10px] uppercase font-bold tracking-wider" style={{ color: 'var(--text-muted)', borderBottom: '1px solid var(--border-base)' }}>
                Select Destination Airport
              </div>
              {destResults.map((item) => (
                <div
                  key={item.code}
                  onClick={() => { setDestQuery(`${item.city} (${item.code})`); setDestCode(item.code); setShowDestDrop(false); }}
                  className="p-3 cursor-pointer flex items-center justify-between transition-colors"
                  style={{ borderBottom: '1px solid var(--border-base)' }}
                  onMouseEnter={e => e.currentTarget.style.background = 'var(--bg-card-hover)'}
                  onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
                >
                  <div className="flex items-center gap-2.5">
                    <span className="text-base">{item.flag}</span>
                    <div>
                      <div className="text-sm font-bold" style={{ color: 'var(--text-primary)' }}>{item.city} ({item.code})</div>
                      <div className="text-xs truncate" style={{ color: 'var(--text-muted)' }}>{item.name}</div>
                    </div>
                  </div>
                  <span className="text-xs font-mono font-bold px-2 py-0.5 rounded" style={{ background: 'var(--accent-light)', color: 'var(--accent-text)' }}>
                    {item.code}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* ── Date Picker ── */}
        <div className="md:col-span-3 relative" ref={dateRef}>
          <div style={fieldStyle} onClick={() => setShowDateModal(!showDateModal)}>
            <div className="flex-1 min-w-0 pr-2">
              <label className="block text-[10px] uppercase tracking-wider font-bold mb-0.5" style={{ color: 'var(--text-muted)' }}>
                Date Picker
              </label>
              <div className="w-full font-semibold text-sm truncate font-mono" style={{ color: 'var(--text-primary)' }}>
                {displayDateText}
              </div>
            </div>
            <Calendar className="w-4 h-4 flex-shrink-0" style={{ color: 'var(--accent)' }} />
          </div>

          {/* Date Calendar Popover */}
          {showDateModal && (
            <div className="absolute top-full left-0 md:left-auto md:right-0 mt-2 w-72 z-50 p-4 space-y-3" style={dropdownStyle}>
              {/* Calendar Header */}
              <div className="flex items-center justify-between pb-2" style={{ borderBottom: '1px solid var(--border-base)' }}>
                <button
                  type="button"
                  onClick={() => {
                    if (currentMonth === 0) { if (currentYear > initialYear) { setCurrentMonth(11); setCurrentYear(currentYear - 1); } }
                    else setCurrentMonth(currentMonth - 1);
                  }}
                  className="p-1 rounded cursor-pointer transition-all"
                  style={{ background: 'var(--bg-sidebar)', color: 'var(--text-secondary)' }}
                >
                  <ChevronLeft className="w-4 h-4" />
                </button>

                <div className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider font-mono" style={{ color: 'var(--text-primary)' }}>
                  <button
                    type="button"
                    onClick={() => setViewMode(viewMode === 'months' ? 'days' : 'months')}
                    className="px-1.5 py-0.5 rounded flex items-center gap-1 cursor-pointer transition-all"
                    style={{ color: 'var(--text-primary)' }}
                    onMouseEnter={e => { e.currentTarget.style.color = 'var(--accent)'; e.currentTarget.style.background = 'var(--bg-card-hover)'; }}
                    onMouseLeave={e => { e.currentTarget.style.color = 'var(--text-primary)'; e.currentTarget.style.background = 'transparent'; }}
                  >
                    {monthNames[currentMonth]}
                    <ChevronDown className="w-3 h-3" style={{ color: 'var(--accent)' }} />
                  </button>
                  <button
                    type="button"
                    onClick={() => setViewMode(viewMode === 'years' ? 'days' : 'years')}
                    className="px-1.5 py-0.5 rounded flex items-center gap-1 cursor-pointer transition-all"
                    style={{ color: 'var(--text-primary)' }}
                    onMouseEnter={e => { e.currentTarget.style.color = 'var(--accent)'; e.currentTarget.style.background = 'var(--bg-card-hover)'; }}
                    onMouseLeave={e => { e.currentTarget.style.color = 'var(--text-primary)'; e.currentTarget.style.background = 'transparent'; }}
                  >
                    {currentYear}
                    <ChevronDown className="w-3 h-3" style={{ color: 'var(--accent)' }} />
                  </button>
                </div>

                <button
                  type="button"
                  onClick={() => {
                    if (currentMonth === 11) { if (currentYear < initialYear + 2) { setCurrentMonth(0); setCurrentYear(currentYear + 1); } }
                    else setCurrentMonth(currentMonth + 1);
                  }}
                  className="p-1 rounded cursor-pointer transition-all"
                  style={{ background: 'var(--bg-sidebar)', color: 'var(--text-secondary)' }}
                >
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>

              {/* Month Selector Grid */}
              {viewMode === 'months' ? (
                <div className="grid grid-cols-3 gap-2 py-2">
                  {shortMonthNames.map((mName, mIdx) => (
                    <button
                      key={mName}
                      type="button"
                      onClick={() => { setCurrentMonth(mIdx); setViewMode('days'); }}
                      className="py-2 rounded-xl text-xs font-bold font-mono transition-all cursor-pointer"
                      style={{
                        background: currentMonth === mIdx ? 'var(--accent)' : 'var(--bg-sidebar)',
                        color: currentMonth === mIdx ? '#fff' : 'var(--text-secondary)',
                        border: currentMonth === mIdx ? '1.5px solid var(--accent)' : '1.5px solid var(--border-base)',
                      }}
                    >
                      {mName}
                    </button>
                  ))}
                </div>
              ) : viewMode === 'years' ? (
                <div className="grid grid-cols-3 gap-2 py-2">
                  {availableYears.map((yr) => (
                    <button
                      key={yr}
                      type="button"
                      onClick={() => { setCurrentYear(yr); setViewMode('days'); }}
                      className="py-2 rounded-xl text-xs font-bold font-mono transition-all cursor-pointer"
                      style={{
                        background: currentYear === yr ? 'var(--accent)' : 'var(--bg-sidebar)',
                        color: currentYear === yr ? '#fff' : 'var(--text-secondary)',
                        border: currentYear === yr ? '1.5px solid var(--accent)' : '1.5px solid var(--border-base)',
                      }}
                    >
                      {yr}
                    </button>
                  ))}
                </div>
              ) : (
                <>
                  {/* Day-of-week headers */}
                  <div className="grid grid-cols-7 text-center text-[10px] uppercase font-bold tracking-wider" style={{ color: 'var(--text-muted)' }}>
                    {['Su','Mo','Tu','We','Th','Fr','Sa'].map(d => <span key={d}>{d}</span>)}
                  </div>
                  {/* Day grid */}
                  <div className="grid grid-cols-7 gap-1 text-center">
                    {Array.from({ length: firstDay }).map((_, i) => <div key={`e-${i}`} className="w-8 h-8" />)}
                    {Array.from({ length: daysInCurrentMonth }).map((_, idx) => {
                      const dayNum = idx + 1;
                      const isSelected = dayNum === selectedDay;
                      return (
                        <button
                          key={dayNum}
                          type="button"
                          onClick={() => handleSelectDay(dayNum)}
                          className="w-8 h-8 rounded-lg text-xs font-bold font-mono flex items-center justify-center transition-all cursor-pointer"
                          style={{
                            background: isSelected ? 'var(--accent)' : 'var(--bg-sidebar)',
                            color: isSelected ? '#fff' : 'var(--text-primary)',
                            transform: isSelected ? 'scale(1.05)' : 'scale(1)',
                            border: isSelected ? '1.5px solid var(--accent)' : '1.5px solid transparent',
                          }}
                        >
                          {dayNum}
                        </button>
                      );
                    })}
                  </div>
                </>
              )}
            </div>
          )}
        </div>

        {/* ── Cabin Class ── */}
        <div className="md:col-span-2 relative" ref={paxRef}>
          <div style={fieldStyle} onClick={() => setShowPaxModal(!showPaxModal)}>
            <div className="flex-1 min-w-0">
              <label className="block text-[10px] uppercase tracking-wider font-bold mb-0.5" style={{ color: 'var(--text-muted)' }}>
                Cabin Class
              </label>
              <div className="text-sm font-semibold truncate" style={{ color: 'var(--text-primary)' }}>
                {cabinClass}
              </div>
            </div>
            <ChevronDown className="w-4 h-4 flex-shrink-0 ml-1" style={{ color: 'var(--text-muted)' }} />
          </div>

          {/* Cabin Class Popover */}
          {showPaxModal && (
            <div className="absolute top-full right-0 mt-2 w-64 z-50 p-4 space-y-3" style={dropdownStyle}>
              <label className="block text-xs font-bold uppercase tracking-wider" style={{ color: 'var(--text-secondary)' }}>Select Cabin Class</label>
              <div className="space-y-1">
                {[
                  { name: 'Economy',         badge: '1.0x Base' },
                  { name: 'Premium Economy', badge: '1.6x Fares' },
                  { name: 'Business',        badge: '2.8x Premium' },
                  { name: 'First Class',     badge: '4.5x Luxury' },
                ].map((clsObj) => (
                  <button
                    key={clsObj.name}
                    type="button"
                    onClick={() => {
                      setCabinClass(clsObj.name);
                      setShowPaxModal(false);
                      const monthStr = (currentMonth + 1).toString().padStart(2, '0');
                      const dayStr = selectedDay.toString().padStart(2, '0');
                      onSearch({
                        tripType,
                        origin: originCode || originQuery.substring(0, 3).toUpperCase(),
                        originFull: originQuery,
                        destination: destCode || destQuery.substring(0, 3).toUpperCase(),
                        destFull: destQuery,
                        date: `${currentYear}-${monthStr}-${dayStr}`,
                        dateRange: displayDateText,
                        passengers,
                        cabinClass: clsObj.name
                      });
                    }}
                    className="w-full text-left px-3 py-2 rounded-xl text-xs font-semibold transition-all flex items-center justify-between cursor-pointer"
                    style={{
                      background: cabinClass === clsObj.name ? 'var(--accent-light)' : 'transparent',
                      color: cabinClass === clsObj.name ? 'var(--accent-text)' : 'var(--text-primary)',
                      border: cabinClass === clsObj.name ? '1.5px solid var(--accent)' : '1.5px solid transparent',
                    }}
                    onMouseEnter={e => { if (cabinClass !== clsObj.name) e.currentTarget.style.background = 'var(--bg-card-hover)'; }}
                    onMouseLeave={e => { if (cabinClass !== clsObj.name) e.currentTarget.style.background = 'transparent'; }}
                  >
                    <div className="flex items-center gap-1.5">
                      {clsObj.name}
                      {cabinClass === clsObj.name && <Check className="w-3.5 h-3.5" style={{ color: 'var(--accent)' }} />}
                    </div>
                    <span className="text-[10px] font-mono font-bold px-1.5 py-0.5 rounded" style={{ background: 'var(--bg-sidebar)', color: 'var(--text-muted)' }}>
                      {clsObj.badge}
                    </span>
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* ── Search Button ── */}
        <div className="md:col-span-12 mt-2 flex justify-end">
          <button
            type="submit"
            className="btn-glow w-full md:w-auto px-8 py-3.5 rounded-xl flex items-center justify-center gap-2.5 text-sm uppercase tracking-wider font-bold cursor-pointer"
          >
            <Search className="w-4 h-4" />
            Search Flights
          </button>
        </div>
      </form>
    </div>
  );
}

