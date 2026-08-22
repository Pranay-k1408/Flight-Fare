export const AIRLINES = [
  {
    code: 'AI',
    name: 'Air India',
    logo: 'https://images.unsplash.com/photo-1540959733332-eab4deabeeaf?auto=format&fit=crop&w=120&q=80',
    color: '#da251d',
    accentColor: '#e5aa70',
    rating: 4.6
  },
  {
    code: '6E',
    name: 'IndiGo',
    logo: 'https://images.unsplash.com/photo-1436491865332-7a61a109cc05?auto=format&fit=crop&w=120&q=80',
    color: '#003399',
    accentColor: '#0055ff',
    rating: 4.7
  },
  {
    code: 'UK',
    name: 'Vistara',
    logo: 'https://images.unsplash.com/photo-1559297434-fae8a1916a79?auto=format&fit=crop&w=120&q=80',
    color: '#491937',
    accentColor: '#cf9b52',
    rating: 4.9
  },
  {
    code: 'QP',
    name: 'Akasa Air',
    logo: 'https://images.unsplash.com/photo-1570710891163-6d3b5c47248b?auto=format&fit=crop&w=120&q=80',
    color: '#ff6600',
    accentColor: '#491937',
    rating: 4.5
  },
  {
    code: 'BA',
    name: 'British Airways',
    logo: 'https://images.unsplash.com/photo-1540959733332-eab4deabeeaf?auto=format&fit=crop&w=120&q=80',
    color: '#00205b',
    accentColor: '#eb2226',
    rating: 4.6
  },
  {
    code: 'VS',
    name: 'Virgin Atlantic',
    logo: 'https://images.unsplash.com/photo-1436491865332-7a61a109cc05?auto=format&fit=crop&w=120&q=80',
    color: '#c8102e',
    accentColor: '#8b0000',
    rating: 4.8
  },
  {
    code: 'DL',
    name: 'Delta Air Lines',
    logo: 'https://images.unsplash.com/photo-1559297434-fae8a1916a79?auto=format&fit=crop&w=120&q=80',
    color: '#e01933',
    accentColor: '#002244',
    rating: 4.7
  },
  {
    code: 'EK',
    name: 'Emirates',
    logo: 'https://images.unsplash.com/photo-1569154941061-e231b4725ef1?auto=format&fit=crop&w=120&q=80',
    color: '#d71921',
    accentColor: '#ffb81c',
    rating: 4.9
  },
  {
    code: 'SQ',
    name: 'Singapore Airlines',
    logo: 'https://images.unsplash.com/photo-1508873696983-2df515122519?auto=format&fit=crop&w=120&q=80',
    color: '#002663',
    accentColor: '#ffaa00',
    rating: 4.95
  }
];

// Helper: Dynamic Yield Management Proximity Pricing Multiplier
export function getProximityPriceMultiplier(dateStr) {
  if (!dateStr) return { multiplier: 1.0, label: 'Standard Rate', badge: null };

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const target = new Date(dateStr);
  if (isNaN(target.getTime())) return { multiplier: 1.0, label: 'Standard Rate', badge: null };
  target.setHours(0, 0, 0, 0);

  const diffMs = target.getTime() - today.getTime();
  const diffDays = Math.round(diffMs / (1000 * 60 * 60 * 24));

  if (diffDays <= 1) {
    // ⚡ Same Day / Tomorrow: Last-Minute Surge (+85%)
    return { multiplier: 1.85, label: '⚡ Last-Minute Surge (+85%)', badge: 'LAST MINUTE SURGE' };
  } else if (diffDays <= 3) {
    // ⚡ High Demand (2-3 days out): +50%
    return { multiplier: 1.50, label: '📈 High Demand Surge (+50%)', badge: 'HIGH DEMAND' };
  } else if (diffDays <= 7) {
    // ⚡ Proximity Fares (4-7 days out): +25%
    return { multiplier: 1.25, label: '📈 Proximity Fare (+25%)', badge: 'FARES RISING' };
  } else if (diffDays <= 21) {
    // 🎯 Standard Advance Booking Window (8-21 days out): Base Price 1.0x
    return { multiplier: 1.0, label: '🎯 Standard Fare (Best Window)', badge: 'STABLE PRICE' };
  } else if (diffDays <= 45) {
    // 🏷️ Early Bird Discount (22-45 days out): -15% discount
    return { multiplier: 0.85, label: '🏷️ Early Bird Discount (-15%)', badge: 'EARLY BIRD' };
  } else {
    // 🏷️ Extended Advance Booking Discount (45+ days out): -30% discount
    return { multiplier: 0.70, label: '🏷️ Extended Booking Discount (-30%)', badge: 'GREAT VALUE' };
  }
}

// Route Base Prices matching Real-Life Flight Engines (Google Flights / MakeMyTrip)
export function getRouteBasePrices(origin = 'DEL', destination = 'BOM') {
  const pair = `${origin.toUpperCase()}-${destination.toUpperCase()}`;
  const reversePair = `${destination.toUpperCase()}-${origin.toUpperCase()}`;

  const realPrices = {
    'DEL-BOM': { base: 4600, label: 'New Delhi to Mumbai' },
    'BOM-BLR': { base: 3800, label: 'Mumbai to Bengaluru' },
    'DEL-BLR': { base: 5100, label: 'New Delhi to Bengaluru' },
    'DEL-HYD': { base: 4200, label: 'New Delhi to Hyderabad' },
    'DEL-CCU': { base: 4500, label: 'New Delhi to Kolkata' },
    'BOM-GOI': { base: 2900, label: 'Mumbai to Goa' },
    'DEL-GOI': { base: 4900, label: 'New Delhi to Goa' },
    'DEL-DXB': { base: 14800, label: 'New Delhi to Dubai' },
    'DEL-LHR': { base: 44500, label: 'New Delhi to London Heathrow' },
    'DEL-LGW': { base: 42000, label: 'New Delhi to London Gatwick' },
    'DEL-LON': { base: 44500, label: 'New Delhi to London' },
    'BOM-LHR': { base: 46000, label: 'Mumbai to London' },
    'BOM-LON': { base: 46000, label: 'Mumbai to London' },
    'LHR-JFK': { base: 39500, label: 'London to New York' },
    'LON-JFK': { base: 39500, label: 'London to New York' },
    'SIN-DEL': { base: 18500, label: 'Singapore to New Delhi' },
    'DEL-SIN': { base: 18500, label: 'New Delhi to Singapore' },
    'DEL-HND': { base: 52000, label: 'New Delhi to Tokyo' },
    'DEL-CDG': { base: 43000, label: 'New Delhi to Paris' },
    'DEL-JFK': { base: 62000, label: 'New Delhi to New York' },
    'DEL-SFO': { base: 68000, label: 'New Delhi to San Francisco' }
  };

  return realPrices[pair] || realPrices[reversePair] || { base: 4800, label: 'Standard Route' };
}

// Weather Forecast & Predictions
export function getWeatherAndPricePredictions(origin = 'DEL', destination = 'BOM', dateStr = null) {
  const proximity = getProximityPriceMultiplier(dateStr);

  const weatherMap = {
    BOM: { city: 'Mumbai', temp: '29°C', condition: 'Partly Cloudy ⛅', humidity: '74%', wind: '12 km/h', delayRisk: 'Low (4%)' },
    DEL: { city: 'New Delhi', temp: '31°C', condition: 'Sunny ☀️', humidity: '55%', wind: '9 km/h', delayRisk: 'Minimal (2%)' },
    BLR: { city: 'Bengaluru', temp: '24°C', condition: 'Pleasant Breeze 🌤️', humidity: '62%', wind: '14 km/h', delayRisk: 'Low (3%)' },
    HYD: { city: 'Hyderabad', temp: '28°C', condition: 'Clear Sky 🌤️', humidity: '58%', wind: '10 km/h', delayRisk: 'Low (3%)' },
    MAA: { city: 'Chennai', temp: '32°C', condition: 'Tropical Humid 🌤️', humidity: '80%', wind: '15 km/h', delayRisk: 'Moderate (6%)' },
    CCU: { city: 'Kolkata', temp: '30°C', condition: 'Scattered Clouds ⛅', humidity: '76%', wind: '11 km/h', delayRisk: 'Low (4%)' },
    AMD: { city: 'Ahmedabad', temp: '33°C', condition: 'Dry & Sunny ☀️', humidity: '48%', wind: '11 km/h', delayRisk: 'Minimal (2%)' },
    COK: { city: 'Kochi', temp: '28°C', condition: 'Coastal Breeze 🌤️', humidity: '82%', wind: '15 km/h', delayRisk: 'Low (4%)' },
    GOI: { city: 'Goa', temp: '27°C', condition: 'Light Coastal Rain 🌧️', humidity: '82%', wind: '18 km/h', delayRisk: 'Moderate (8%)' },
    DXB: { city: 'Dubai', temp: '36°C', condition: 'Sunny & Hot ☀️', humidity: '42%', wind: '16 km/h', delayRisk: 'Low (3%)' },
    LHR: { city: 'London', temp: '18°C', condition: 'Overcast & Cool ☁️', humidity: '68%', wind: '20 km/h', delayRisk: 'Moderate (7%)' },
    LGW: { city: 'London', temp: '18°C', condition: 'Overcast & Cool ☁️', humidity: '68%', wind: '20 km/h', delayRisk: 'Moderate (7%)' },
    LON: { city: 'London', temp: '18°C', condition: 'Overcast & Cool ☁️', humidity: '68%', wind: '20 km/h', delayRisk: 'Moderate (7%)' },
    JFK: { city: 'New York', temp: '22°C', condition: 'Clear 🌤️', humidity: '50%', wind: '13 km/h', delayRisk: 'Low (5%)' },
    EWR: { city: 'New York', temp: '22°C', condition: 'Clear 🌤️', humidity: '50%', wind: '13 km/h', delayRisk: 'Low (5%)' },
    SFO: { city: 'San Francisco', temp: '17°C', condition: 'Breezy Fog 🌫️', humidity: '75%', wind: '22 km/h', delayRisk: 'Moderate (9%)' },
    LAX: { city: 'Los Angeles', temp: '25°C', condition: 'Sunny & Clear ☀️', humidity: '52%', wind: '12 km/h', delayRisk: 'Minimal (2%)' },
    SIN: { city: 'Singapore', temp: '30°C', condition: 'Tropical Warm 🌤️', humidity: '79%', wind: '10 km/h', delayRisk: 'Low (4%)' },
    CDG: { city: 'Paris', temp: '20°C', condition: 'Mild & Sunny 🌤️', humidity: '58%', wind: '14 km/h', delayRisk: 'Low (4%)' },
    HND: { city: 'Tokyo', temp: '23°C', condition: 'Clear Skies 🌸', humidity: '60%', wind: '11 km/h', delayRisk: 'Low (3%)' },
    SYD: { city: 'Sydney', temp: '19°C', condition: 'Fresh Breeze 🌊', humidity: '64%', wind: '18 km/h', delayRisk: 'Low (4%)' }
  };

  const destCode = (destination || '').toUpperCase();
  const weather = weatherMap[destCode] || {
    city: destCode || 'Destination',
    temp: '24°C',
    condition: 'Pleasant 🌤️',
    humidity: '60%',
    wind: '12 km/h',
    delayRisk: 'Low (4%)'
  };

  let prediction = {
    recommendation: 'BUY NOW',
    confidence: '92% High Confidence',
    adviceText: 'Fares on this route are expected to rise by ~14% over the next 48 hours.',
    trend: 'Upward 📈',
    badge: proximity.badge
  };

  if (proximity.multiplier >= 1.5) {
    prediction = {
      recommendation: 'SURGE PRICING ACTIVE',
      confidence: '98% High Demand',
      adviceText: '⚡ Last-minute surge pricing active for near departure dates. Fares are higher due to immediate demand.',
      trend: 'Surging ⚡',
      badge: proximity.badge
    };
  } else if (proximity.multiplier <= 0.85) {
    prediction = {
      recommendation: 'EARLY BIRD SAVINGS',
      confidence: '95% Great Value',
      adviceText: '🏷️ Extended advance booking discount active! Fares are ~30% lower than near-date travel fares.',
      trend: 'Discounted 🏷️',
      badge: proximity.badge
    };
  }

  return { weather, prediction };
}

export function generateFlightResults({
  origin = 'DEL',
  destination = 'BOM',
  date = '2026-08-12',
  passengers = 1,
  cabinClass = 'Economy',
  tripType = 'One Way'
}) {
  const clsLower = (cabinClass || '').toLowerCase();
  let baseClassMultiplier = 1.0;
  let reqClass = 'Economy';

  if (clsLower.includes('first')) {
    baseClassMultiplier = 4.5;
    reqClass = 'First Class';
  } else if (clsLower.includes('business')) {
    baseClassMultiplier = 2.8;
    reqClass = 'Business';
  } else if (clsLower.includes('premium')) {
    baseClassMultiplier = 1.6;
    reqClass = 'Premium Economy';
  }

  const proximity = getProximityPriceMultiplier(date);
  const routeBase = getRouteBasePrices(origin, destination).base;

  // Day-of-week yield multiplier (Weekend vs Midweek)
  const dObj = new Date(date);
  const dayOfWeek = isNaN(dObj.getTime()) ? 3 : dObj.getDay();
  let dayOfWeekMultiplier = 1.0;
  if (dayOfWeek === 0 || dayOfWeek === 6) dayOfWeekMultiplier = 1.22; // Sat/Sun weekend peak
  else if (dayOfWeek === 5) dayOfWeekMultiplier = 1.15; // Fri peak
  else if (dayOfWeek === 2 || dayOfWeek === 3) dayOfWeekMultiplier = 0.90; // Tue/Wed midweek discount

  const finalPriceMultiplier = baseClassMultiplier * proximity.multiplier * dayOfWeekMultiplier;

  const isDomesticIndianRoute = ['DEL', 'BOM', 'BLR', 'HYD', 'MAA', 'CCU', 'AMD', 'COK', 'GOI'].includes(origin) &&
                                ['DEL', 'BOM', 'BLR', 'HYD', 'MAA', 'CCU', 'AMD', 'COK', 'GOI'].includes(destination);

  let flightTemplates = [];

  if (isDomesticIndianRoute) {
    flightTemplates = [
      {
        airlineCode: '6E',
        flightNumber: '6E2131',
        depTime: '07:15',
        arrTime: '09:25',
        durationMinutes: 130,
        stopsCount: 0,
        layoverInfo: null,
        basePriceInr: Math.round(routeBase * 0.96),
        seatsAvailable: 18,
        aircraft: 'Airbus A321neo',
        isCheapest: true,
        tag: 'Cheapest Direct',
        supportedClasses: ['Economy'] // IndiGo LCC = Economy Only!
      },
      {
        airlineCode: 'QP',
        flightNumber: 'QP1102',
        depTime: '11:45',
        arrTime: '13:55',
        durationMinutes: 130,
        stopsCount: 0,
        layoverInfo: null,
        basePriceInr: Math.round(routeBase * 1.04),
        seatsAvailable: 14,
        aircraft: 'Boeing 737 MAX 8',
        isCheapest: false,
        tag: 'Best Value',
        supportedClasses: ['Economy'] // Akasa Air LCC = Economy Only!
      },
      {
        airlineCode: 'AI',
        flightNumber: 'AI805',
        depTime: '09:00',
        arrTime: '11:15',
        durationMinutes: 135,
        stopsCount: 0,
        layoverInfo: null,
        basePriceInr: Math.round(routeBase * 1.18),
        seatsAvailable: 9,
        aircraft: 'Boeing 787 Dreamliner',
        isCheapest: false,
        tag: 'Full Service Included',
        supportedClasses: ['Economy', 'Premium Economy', 'Business', 'First Class']
      },
      {
        airlineCode: 'UK',
        flightNumber: 'UK945',
        depTime: '06:30',
        arrTime: '08:40',
        durationMinutes: 130,
        stopsCount: 0,
        layoverInfo: null,
        basePriceInr: Math.round(routeBase * 1.32),
        seatsAvailable: 12,
        aircraft: 'Airbus A320neo',
        isCheapest: false,
        tag: 'Vistara Premium',
        supportedClasses: ['Economy', 'Premium Economy', 'Business']
      },
      {
        airlineCode: '6E',
        flightNumber: '6E5042',
        depTime: '14:30',
        arrTime: '16:40',
        durationMinutes: 130,
        stopsCount: 0,
        layoverInfo: null,
        basePriceInr: Math.round(routeBase * 1.12),
        seatsAvailable: 6,
        aircraft: 'Airbus A320neo',
        isCheapest: false,
        tag: 'Afternoon Flight',
        supportedClasses: ['Economy']
      }
    ];
  } else {
    // International routes
    flightTemplates = [
      {
        airlineCode: 'AI',
        flightNumber: 'AI161',
        depTime: '02:30',
        arrTime: '07:30',
        durationMinutes: 570,
        stopsCount: 0,
        layoverInfo: null,
        basePriceInr: Math.round(routeBase * 1.0),
        seatsAvailable: 11,
        aircraft: 'Boeing 787-8 Dreamliner',
        isCheapest: true,
        tag: 'Non-Stop Direct',
        supportedClasses: ['Economy', 'Premium Economy', 'Business', 'First Class']
      },
      {
        airlineCode: 'EK',
        flightNumber: 'EK511',
        depTime: '04:15',
        arrTime: '12:45',
        durationMinutes: 660,
        stopsCount: 1,
        layoverInfo: { airport: 'DXB', city: 'Dubai', duration: '2h 10m' },
        basePriceInr: Math.round(routeBase * 1.15),
        seatsAvailable: 15,
        aircraft: 'Airbus A380-800',
        isCheapest: false,
        tag: 'Luxury Layover',
        supportedClasses: ['Economy', 'Premium Economy', 'Business', 'First Class']
      },
      {
        airlineCode: 'BA',
        flightNumber: 'BA142',
        depTime: '10:15',
        arrTime: '15:10',
        durationMinutes: 565,
        stopsCount: 0,
        layoverInfo: null,
        basePriceInr: Math.round(routeBase * 1.35),
        seatsAvailable: 6,
        aircraft: 'Boeing 777-300ER',
        isCheapest: false,
        tag: 'Popular Choice',
        supportedClasses: ['Economy', 'Premium Economy', 'Business', 'First Class']
      }
    ];
  }

  // Filter templates so ONLY flights that actually operate the requested cabin class are shown!
  const availableTemplates = flightTemplates.filter(item => item.supportedClasses.includes(reqClass));
  const finalTemplates = availableTemplates.length > 0 ? availableTemplates : flightTemplates;

  return finalTemplates.map((item, index) => {
    const airline = AIRLINES.find(a => a.code === item.airlineCode) || AIRLINES[0];
    const finalPriceInr = Math.round(item.basePriceInr * finalPriceMultiplier);

    const hours = Math.floor(item.durationMinutes / 60);
    const mins = item.durationMinutes % 60;
    const durationFormatted = `${hours}h ${mins.toString().padStart(2, '0')}m`;

    return {
      id: `FL-${origin}-${destination}-${item.flightNumber}-${index}`,
      airline: {
        code: airline.code,
        name: airline.name,
        logo: airline.logo,
        color: airline.color,
        rating: airline.rating
      },
      flightNumber: item.flightNumber,
      aircraft: item.aircraft,
      origin,
      destination,
      depTime: item.depTime,
      arrTime: item.arrTime,
      duration: durationFormatted,
      durationMinutes: item.durationMinutes,
      stopsCount: item.stopsCount,
      stopsText: item.stopsCount === 0 ? 'direct' : `${item.stopsCount} stop`,
      layoverInfo: item.layoverInfo,
      priceInr: finalPriceInr,
      price: finalPriceInr,
      currency: 'INR',
      cabinClass: reqClass,
      seatsAvailable: item.seatsAvailable,
      tag: item.tag,
      amenities: {
        wifi: true,
        power: true,
        meal: true,
        entertainment: true,
        seatPitch: reqClass === 'First Class' ? 'Private Suite' : reqClass === 'Business' ? '60 in (Lie-Flat)' : reqClass === 'Premium Economy' ? '38 in Extra Legroom' : '31-32 in'
      },
      baggageAllowance: {
        carryOn: reqClass === 'First Class' || reqClass === 'Business' ? '2x 10kg included' : '1x 7kg included',
        checked: reqClass === 'First Class' ? '2x 32kg included' : reqClass === 'Business' ? '2x 23kg included' : isDomesticIndianRoute ? '1x 15kg included' : '2x 23kg included'
      },
      carbonEmissionsKg: isDomesticIndianRoute ? Math.round(85 + Math.random() * 20) : Math.round(310 + Math.random() * 80),
      refundPolicy: 'Flexible - Cancellation allowed up to 4h before departure'
    };
  });
}
