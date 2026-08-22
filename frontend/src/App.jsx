import React, { useState, useEffect } from 'react';
import Navbar from './components/Navbar';
import SearchCard from './components/SearchCard';
import SmartInsightsBar from './components/SmartInsightsBar';
import FareCalendar from './components/FareCalendar';
import FilterSidebar from './components/FilterSidebar';
import SortBar from './components/SortBar';
import FlightCard from './components/FlightCard';
import FlightDetailsModal from './components/FlightDetailsModal';
import CompareDrawer from './components/CompareDrawer';
import BookingModal from './components/BookingModal';
import ExploreModal from './components/ExploreModal';
import BookingsModal from './components/BookingsModal';
import FareAlertsModal from './components/FareAlertsModal';
import AccountModal from './components/AccountModal';
import AuthModal from './components/AuthModal';
import LegalModal from './components/LegalModal';
import InfoModal from './components/InfoModal';
import ToastNotification from './components/ToastNotification';
import Footer from './components/Footer';

import { searchFlightsApi, getFareCalendarApi } from './services/api';
import { Plane, MapPin, Sparkles, Scale, AlertCircle, Compass, Search, Sun, Moon } from 'lucide-react';

export default function App() {
  const [currency, setCurrency] = useState('INR');
  const [compareList, setCompareList] = useState([]);

  // ---- Theme (light / dark) ----
  const [isDark, setIsDark] = useState(() => {
    const saved = localStorage.getItem('skyward_theme');
    return saved ? saved === 'dark' : false;   // default: light
  });

  useEffect(() => {
    const root = document.documentElement;
    if (isDark) {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }
    localStorage.setItem('skyward_theme', isDark ? 'dark' : 'light');
  }, [isDark]);

  const toggleTheme = () => setIsDark(prev => !prev);

  // Sleek Toast Notification state
  const [toast, setToast] = useState(null);

  const showToast = (message, type = 'info') => {
    setToast({ message, type });
  };

  // Pending flight booking when user clicks "Select Flight" before signing in
  const [pendingFlightBooking, setPendingFlightBooking] = useState(null);
  
  // User Bookings State (Starts EMPTY by default!)
  const [userBookings, setUserBookings] = useState(() => {
    const saved = localStorage.getItem('skyward_user_bookings');
    return saved ? JSON.parse(saved) : [];
  });
  
  // Authenticated User State
  const [user, setUser] = useState(() => {
    const saved = localStorage.getItem('skyward_user');
    return saved ? JSON.parse(saved) : null;
  });

  // Real system date initialization
  const todayObj = new Date();
  const currentYearNum = todayObj.getFullYear();
  const currentMonthStr = todayObj.toLocaleString('en-US', { month: 'short' });
  const currentDayNum = todayObj.getDate();

  // Origin & Destination blank by default as requested!
  const [searchParams, setSearchParams] = useState({
    originCode: '',
    originQuery: '',
    destCode: '',
    destQuery: '',
    dateRange: `${currentMonthStr} ${currentDayNum}, ${currentYearNum}`,
    passengers: 1,
    cabinClass: 'Economy',
    tripType: 'One Way'
  });

  // Popular Indian & Global route presets
  const popularIndianRoutes = [
    { label: 'DEL 🇮🇳 → BOM 🇮🇳', origin: 'DEL', originFull: 'New Delhi (DEL)', dest: 'BOM', destFull: 'Mumbai (BOM)' },
    { label: 'BOM 🇮🇳 → BLR 🇮🇳', origin: 'BOM', originFull: 'Mumbai (BOM)', dest: 'BLR', destFull: 'Bengaluru (BLR)' },
    { label: 'DEL 🇮🇳 → BLR 🇮🇳', origin: 'DEL', originFull: 'New Delhi (DEL)', dest: 'BLR', destFull: 'Bengaluru (BLR)' },
    { label: 'DEL 🇮🇳 → DXB 🇦🇪', origin: 'DEL', originFull: 'New Delhi (DEL)', dest: 'DXB', destFull: 'Dubai (DXB)' },
    { label: 'DEL 🇮🇳 → LHR 🇬🇧', origin: 'DEL', originFull: 'New Delhi (DEL)', dest: 'LHR', destFull: 'London (LHR)' },
    { label: 'LHR 🇬🇧 → JFK 🇺🇸', origin: 'LHR', originFull: 'London (LHR)', dest: 'JFK', destFull: 'New York (JFK)' }
  ];

  // Flights & Filtering state
  const [flights, setFlights] = useState([]);
  const [analytics, setAnalytics] = useState(null);
  const [weather, setWeather] = useState(null);
  const [prediction, setPrediction] = useState(null);

  const [loading, setLoading] = useState(false);
  const [sortBy, setSortBy] = useState('price');
  const [filters, setFilters] = useState({
    maxPrice: 150000,
    stops: 'all',
    airlines: []
  });

  // Fare Calendar State
  const [calendarDays, setCalendarDays] = useState([]);

  // Modals state
  const [activeDetailsFlight, setActiveDetailsFlight] = useState(null);
  const [activeBookingFlight, setActiveBookingFlight] = useState(null);
  const [selectedSeat, setSelectedSeat] = useState('14A');
  const [showCompareDrawer, setShowCompareDrawer] = useState(false);

  // Navbar Modals
  const [showExploreModal, setShowExploreModal] = useState(false);
  const [showBookingsModal, setShowBookingsModal] = useState(false);
  const [showFareAlertsModal, setShowFareAlertsModal] = useState(false);
  const [showAccountModal, setShowAccountModal] = useState(false);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [showLegalModal, setShowLegalModal] = useState(false);
  const [activeLegalTab, setActiveLegalTab] = useState('privacy');
  const [showInfoModal, setShowInfoModal] = useState(false);
  const [activeInfoSection, setActiveInfoSection] = useState('about');

  // Fetch flights when search params, filters, or sorting changes
  useEffect(() => {
    if (searchParams.originCode || searchParams.destCode || searchParams.originQuery) {
      fetchFlightData();
    } else {
      setFlights([]);
      setAnalytics(null);
      setWeather(null);
      setPrediction(null);
    }
  }, [searchParams, filters, sortBy]);

  // Fetch fare calendar centered around picked date with dynamic scaling
  useEffect(() => {
    if (searchParams.originCode && searchParams.destCode) {
      getFareCalendarApi(
        searchParams.originCode,
        searchParams.destCode,
        searchParams.passengers,
        searchParams.cabinClass,
        searchParams.date
      ).then((res) => {
        if (res && res.days) setCalendarDays(res.days);
      });
    }
  }, [searchParams.originCode, searchParams.destCode, searchParams.passengers, searchParams.cabinClass, searchParams.date]);

  const fetchFlightData = async () => {
    setLoading(true);
    try {
      const orig = searchParams.originCode || (searchParams.originQuery ? searchParams.originQuery.substring(0, 3).toUpperCase() : 'DEL');
      const dest = searchParams.destCode || (searchParams.destQuery ? searchParams.destQuery.substring(0, 3).toUpperCase() : 'BOM');

      const data = await searchFlightsApi({
        origin: orig,
        destination: dest,
        date: searchParams.date || `${currentYearNum}-${(todayObj.getMonth() + 1).toString().padStart(2, '0')}-${currentDayNum}`,
        passengers: searchParams.passengers,
        cabinClass: searchParams.cabinClass,
        maxPrice: filters.maxPrice,
        stops: filters.stops,
        airlines: filters.airlines.join(','),
        sortBy
      });

      if (data) {
        if (data.flights) setFlights(data.flights);
        if (data.meta) {
          if (data.meta.analytics) setAnalytics(data.meta.analytics);
          setWeather(data.meta.weather || data.meta.insights?.weather || null);
          setPrediction(data.meta.prediction || data.meta.insights?.prediction || null);
        }
      }
    } catch (err) {
      console.error('Error fetching flights:', err);
    } finally {
      setLoading(false);
    }
  };

  // Helper: Require Login Before Booking
  const triggerFlightBooking = (flight, seat = '14A', paxCount = 1) => {
    if (paxCount) {
      setSearchParams((prev) => ({ ...prev, passengers: paxCount }));
    }
    if (!user) {
      setPendingFlightBooking({ flight, seat, paxCount });
      setShowAuthModal(true);
      showToast('🔐 Please sign in or register first to book your flight.', 'warning');
    } else {
      setSelectedSeat(seat);
      setActiveBookingFlight(flight);
    }
  };

  const handleBookingComplete = (newTicket) => {
    const updated = [newTicket, ...userBookings];
    setUserBookings(updated);
    localStorage.setItem('skyward_user_bookings', JSON.stringify(updated));
    showToast(`🎉 Flight Ticket Confirmed! PNR: ${newTicket.pnr}`, 'success');
  };

  const handleLoginSuccess = (userData) => {
    setUser(userData);
    localStorage.setItem('skyward_user', JSON.stringify(userData));
    showToast(`👋 Welcome back, ${userData.name}! Successfully signed in.`, 'success');
    setShowAuthModal(false);

    // If user clicked 'Select Flight' before signing in, proceed directly to booking checkout!
    if (pendingFlightBooking) {
      if (pendingFlightBooking.paxCount) {
        setSearchParams((prev) => ({ ...prev, passengers: pendingFlightBooking.paxCount }));
      }
      setActiveBookingFlight(pendingFlightBooking.flight);
      setSelectedSeat(pendingFlightBooking.seat || '14A');
      setPendingFlightBooking(null);
    }
  };

  const handleLogout = () => {
    setUser(null);
    localStorage.removeItem('skyward_user');
    showToast('Signed out successfully.', 'info');
  };

  const handleSearchSubmit = (newParams) => {
    setSearchParams({
      originCode: newParams.origin,
      originQuery: newParams.originFull,
      destCode: newParams.destination,
      destQuery: newParams.destFull,
      date: newParams.date || newParams.dateRange,
      dateRange: newParams.dateRange,
      passengers: newParams.passengers,
      cabinClass: newParams.cabinClass,
      tripType: newParams.tripType
    });
    showToast(`✈️ Searching flights for ${newParams.originFull || newParams.origin} → ${newParams.destFull || newParams.destination}`, 'info');
  };

  const handleQuickRouteSelect = (route) => {
    setSearchParams((prev) => ({
      ...prev,
      originCode: route.origin,
      originQuery: route.originFull,
      destCode: route.dest,
      destQuery: route.destFull
    }));
    showToast(`📍 Loaded route: ${route.label}`, 'info');
  };

  const handleSelectFlexibleDate = (dateStr, fullDate) => {
    const targetDate = fullDate || dateStr;
    setSearchParams((prev) => ({
      ...prev,
      date: targetDate,
      dateRange: `${dateStr}, ${currentYearNum}`
    }));
    setCalendarDays((prevDays) =>
      prevDays.map((d) => ({
        ...d,
        isSelected: d.date === dateStr
      }))
    );
    showToast(`📅 Updated flight search for ${dateStr}, ${currentYearNum}`, 'info');
  };

  const handleFilterChange = (key, value) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
  };

  const handleResetFilters = () => {
    setFilters({ maxPrice: 150000, stops: 'all', airlines: [] });
    showToast('Filters reset to default settings.', 'info');
  };

  const handleToggleCompare = (flight) => {
    if (compareList.some((f) => f.id === flight.id)) {
      setCompareList(compareList.filter((f) => f.id !== flight.id));
      showToast(`Removed ${flight.flightNumber} from comparison list.`, 'info');
    } else {
      if (compareList.length >= 3) {
        showToast('⚠️ You can compare up to 3 flights simultaneously.', 'warning');
        return;
      }
      setCompareList([...compareList, flight]);
      showToast(`Added ${flight.flightNumber} to comparison list (${compareList.length + 1}/3).`, 'success');
    }
  };

  return (
    <div
      className={`min-h-screen relative font-sans-ui overflow-x-hidden transition-colors duration-300`}
      style={{ background: 'var(--bg-primary)', color: 'var(--text-primary)' }}
    >
      {/* Sleek Toast Notification */}
      <ToastNotification toast={toast} onClose={() => setToast(null)} />

      {/* Background removed — clean white/gray design */}

      {/* Top Navigation */}
      <Navbar
        currency={currency}
        setCurrency={setCurrency}
        savedCount={userBookings.length}
        user={user}
        isDark={isDark}
        onToggleTheme={toggleTheme}
        onOpenExplore={() => setShowExploreModal(true)}
        onOpenBookings={() => setShowBookingsModal(true)}
        onOpenFareAlerts={() => setShowFareAlertsModal(true)}
        onOpenAccount={() => setShowAccountModal(true)}
        onOpenAuth={() => setShowAuthModal(true)}
      />

      {/* Main Container */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 py-6 relative z-10 space-y-6">
        {/* Page Header */}
        <div className="space-y-1 pt-2 pb-2">
          <div className="section-label">TRAVEL / FLIGHT SEARCH</div>
          <h1 className="text-4xl md:text-5xl font-bold tracking-tight" style={{ color: 'var(--text-primary)' }}>
            Flight Fare
          </h1>
          <p style={{ color: 'var(--text-secondary)' }} className="text-sm md:text-base">
            Find the right flight at the right price — simple, fast.
          </p>
        </div>

        {/* Quick Route Presets */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 max-w-full">
          <span className="text-xs font-semibold flex items-center gap-1 flex-shrink-0" style={{ color: 'var(--text-muted)' }}>
            <Compass className="w-3.5 h-3.5" style={{ color: 'var(--accent)' }} />
            Quick Select:
          </span>
          {popularIndianRoutes.map((route, i) => (
            <button
              key={i}
              onClick={() => handleQuickRouteSelect(route)}
              className={`px-3 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition-all border cursor-pointer`}
              style={{
                background: searchParams.originCode === route.origin && searchParams.destCode === route.dest
                  ? 'var(--accent-light)' : 'var(--bg-secondary)',
                borderColor: searchParams.originCode === route.origin && searchParams.destCode === route.dest
                  ? 'var(--accent)' : 'var(--border-base)',
                color: searchParams.originCode === route.origin && searchParams.destCode === route.dest
                  ? 'var(--accent-text)' : 'var(--text-secondary)'
              }}
            >
              {route.label}
            </button>
          ))}
        </div>

        {/* Search Input Card Component */}
        <SearchCard searchParams={searchParams} onSearch={handleSearchSubmit} />

        {/* Smart Insights Panel when route is chosen */}
        {(searchParams.originCode || searchParams.originQuery) && (
          <SmartInsightsBar
            analytics={analytics}
            weather={weather}
            prediction={prediction}
          />
        )}

        {/* Dynamic Query Headline or Guidance */}
        {searchParams.originQuery || searchParams.destQuery ? (
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pt-2">
            <div>
              <h2 className="text-xl md:text-2xl font-bold flex items-center gap-2 flex-wrap" style={{ color: 'var(--text-primary)' }}>
                <span>{searchParams.originQuery || 'Origin'}</span>
                <span className="text-sm font-medium" style={{ color: 'var(--accent)' }}>→</span>
                <span>{searchParams.destQuery || 'Destination'}</span>
              </h2>
              <p className="text-xs mt-0.5" style={{ color: 'var(--text-muted)' }}>
                {searchParams.dateRange} • {searchParams.passengers} Passengers • {searchParams.cabinClass}
              </p>
            </div>

            {compareList.length > 0 && (
              <button
                onClick={() => setShowCompareDrawer(true)}
                className="px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-2 transition-all animate-bounce cursor-pointer"
                style={{ background: 'var(--accent-light)', color: 'var(--accent-text)', border: '1.5px solid var(--accent)' }}
              >
                <Scale className="w-4 h-4" />
                Compare ({compareList.length}) Selected Flights
              </button>
            )}
          </div>
        ) : (
          /* Blank State Guidance Card */
          <div className="glass-card rounded-2xl p-8 text-center space-y-3">
            <div className="w-12 h-12 rounded-full mx-auto flex items-center justify-center" style={{ background: 'var(--accent-light)' }}>
              <Plane className="w-6 h-6 transform -rotate-45" style={{ color: 'var(--accent)' }} />
            </div>
            <h3 className="text-xl font-bold font-sans-ui" style={{ color: 'var(--text-primary)' }}>
              Where would you like to fly today?
            </h3>
            <p className="text-xs max-w-md mx-auto" style={{ color: 'var(--text-muted)' }}>
              Type your origin and destination above or pick a quick-select route to discover real-time flights, price trends, and weather.
            </p>
          </div>
        )}

        {/* 7-Day Flexible Fare Calendar Strip */}
        {calendarDays.length > 0 && (
          <FareCalendar
            days={calendarDays}
            passengers={searchParams.passengers}
            cabinClass={searchParams.cabinClass}
            selectedDate="Oct 18"
            onSelectDate={handleSelectFlexibleDate}
          />
        )}

        {/* Main Content Split Grid */}
        {(searchParams.originQuery || searchParams.destQuery) && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
            {/* Filter Sidebar */}
            <div className="lg:col-span-3">
              <FilterSidebar
                filters={filters}
                onFilterChange={handleFilterChange}
                onResetFilters={handleResetFilters}
              />
            </div>

            {/* Flights List */}
            <div className="lg:col-span-9">
              <SortBar
                sortBy={sortBy}
                onSortChange={setSortBy}
                totalCount={flights.length}
              />

              {loading ? (
                <div className="space-y-4">
                  {[1, 2, 3].map((i) => (
                    <div key={i} className="rounded-2xl h-36 skeleton" />
                  ))}
                </div>
              ) : flights.length === 0 ? (
                <div className="glass-panel rounded-2xl p-12 text-center space-y-3">
                  <div className="w-12 h-12 rounded-full mx-auto flex items-center justify-center" style={{ background: 'var(--accent-light)' }}>
                    <AlertCircle className="w-6 h-6" style={{ color: 'var(--accent)' }} />
                  </div>
                  <h3 className="text-lg font-bold" style={{ color: 'var(--text-primary)' }}>No Flights Found</h3>
                  <p className="text-xs" style={{ color: 'var(--text-muted)' }}>
                    Try adjusting your price range filter or search parameters.
                  </p>
                  <button
                    onClick={handleResetFilters}
                    className="btn-glow px-4 py-2 rounded-xl text-xs uppercase font-bold mt-2 cursor-pointer"
                  >
                    Reset Filters
                  </button>
                </div>
              ) : (
                <div className="space-y-4">
                  {flights.map((flight) => (
                    <FlightCard
                      key={flight.id}
                      flight={flight}
                      currency={currency}
                      isSelectedForCompare={compareList.some((f) => f.id === flight.id)}
                      onToggleCompare={handleToggleCompare}
                      onSelectFlight={(f) => setActiveDetailsFlight(f)}
                      onOpenDetails={(f) => setActiveDetailsFlight(f)}
                    />
                  ))}
                </div>
              )}
            </div>
          </div>
        )}
      </main>

      {/* Auth Modal */}
      {showAuthModal && (
        <AuthModal
          onClose={() => {
            setShowAuthModal(false);
            setPendingFlightBooking(null);
          }}
          onLoginSuccess={handleLoginSuccess}
        />
      )}

      {/* Explore Modal */}
      {showExploreModal && (
        <ExploreModal
          onClose={() => setShowExploreModal(false)}
          onSelectDestination={(origin, dest, cityName) => {
            setSearchParams((prev) => ({
              ...prev,
              originCode: origin,
              originQuery: `${origin} - New Delhi`,
              destCode: dest,
              destQuery: `${dest} - ${cityName}`
            }));
          }}
        />
      )}

      {/* Bookings Modal */}
      {showBookingsModal && (
        <BookingsModal
          userBookings={userBookings}
          onClose={() => setShowBookingsModal(false)}
          onSearchNewFlight={() => {
            window.scrollTo({ top: 300, behavior: 'smooth' });
          }}
        />
      )}

      {/* Fare Alerts Modal */}
      {showFareAlertsModal && (
        <FareAlertsModal onClose={() => setShowFareAlertsModal(false)} />
      )}

      {/* Account Modal */}
      {showAccountModal && (
        <AccountModal
          user={user}
          onClose={() => setShowAccountModal(false)}
          onLogout={handleLogout}
          onOpenAuth={() => setShowAuthModal(true)}
        />
      )}

      {/* Flight Details Modal */}
      {activeDetailsFlight && (
        <FlightDetailsModal
          flight={activeDetailsFlight}
          passengersCount={searchParams.passengers || 1}
          onClose={() => setActiveDetailsFlight(null)}
          onBookNow={(f, seat, paxCount) => {
            setActiveDetailsFlight(null);
            triggerFlightBooking(f, seat || '11A', paxCount || 1);
          }}
        />
      )}

      {/* Compare Modal */}
      {showCompareDrawer && (
        <CompareDrawer
          compareList={compareList}
          onClose={() => setShowCompareDrawer(false)}
          onRemove={(id) => setCompareList(compareList.filter((f) => f.id !== id))}
          onSelectFlight={(f) => {
            setShowCompareDrawer(false);
            triggerFlightBooking(f, '11A');
          }}
        />
      )}

      {/* Booking Checkout Modal */}
      {activeBookingFlight && (
        <BookingModal
          flight={activeBookingFlight}
          selectedSeat={selectedSeat}
          passengersCount={searchParams.passengers || 1}
          onClose={() => setActiveBookingFlight(null)}
          onBookingComplete={handleBookingComplete}
        />
      )}

      {/* Legal & Compliance Modal */}
      {showLegalModal && (
        <LegalModal
          initialTab={activeLegalTab}
          onClose={() => setShowLegalModal(false)}
        />
      )}

      {/* Information & Support Hub Modal */}
      {showInfoModal && (
        <InfoModal
          initialSection={activeInfoSection}
          onClose={() => setShowInfoModal(false)}
          onOpenLegal={(tabKey) => {
            setShowInfoModal(false);
            setActiveLegalTab(tabKey);
            setShowLegalModal(true);
          }}
          user={user}
        />
      )}

      {/* Authenticated Footer */}
      <Footer
        onOpenPolicy={(tabKey) => {
          setActiveLegalTab(tabKey);
          setShowLegalModal(true);
        }}
        onOpenInfo={(sectionKey) => {
          setActiveInfoSection(sectionKey);
          setShowInfoModal(true);
        }}
      />
    </div>
  );
}
