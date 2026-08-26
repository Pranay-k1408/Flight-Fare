import { AIRPORTS } from '../data/airports.js';
import { AIRLINES, generateFlightResults, getWeatherAndPricePredictions, getProximityPriceMultiplier, getRouteBasePrices } from '../data/flights.js';
import nodemailer from 'nodemailer';
import { generateTicketPdfBuffer } from '../services/pdfTicketService.js';
import Booking from '../models/Booking.js';
import User from '../models/User.js';

export const searchAirports = (req, res) => {
  const query = (req.query.q || '').trim().toLowerCase();
  if (!query) {
    return res.json(AIRPORTS.slice(0, 10));
  }

  const results = AIRPORTS.filter(airport => 
    airport.code.toLowerCase().includes(query) ||
    airport.city.toLowerCase().includes(query) ||
    airport.name.toLowerCase().includes(query) ||
    airport.country.toLowerCase().includes(query)
  );

  res.json(results);
};

export const searchFlights = (req, res) => {
  const {
    origin = 'DEL',
    destination = 'BOM',
    date = '2026-08-12',
    passengers = 2,
    cabinClass = 'Economy',
    tripType = 'One Way',
    maxPrice,
    stops,
    airlines,
    sortBy = 'price'
  } = req.query;

  const paxCount = Math.max(1, Number(passengers) || 1);

  let flights = generateFlightResults({
    origin: origin.toUpperCase(),
    destination: destination.toUpperCase(),
    date,
    passengers: paxCount,
    cabinClass,
    tripType
  });

  // Single person base fare is preserved for clear, non-confusing price display
  flights = flights.map(f => ({
    ...f,
    pricePerPersonInr: f.priceInr,   // 1 person fare
    priceInr: f.priceInr,            // 1 person fare
    price: f.priceInr,               // 1 person fare
    totalPriceInr: f.priceInr * paxCount // total fare for all passengers
  }));

  // Calculate Price Metrics based on single person fare
  const allPrices = flights.map(f => f.pricePerPersonInr);
  const bestPrice = allPrices.length ? Math.min(...allPrices) : 0;
  const worstPrice = allPrices.length ? Math.max(...allPrices) : 0;
  const avgPrice = allPrices.length ? Math.round(allPrices.reduce((a, b) => a + b, 0) / allPrices.length) : 0;

  // Weather & Proximity Price Predictions
  const insights = getWeatherAndPricePredictions(origin.toUpperCase(), destination.toUpperCase(), date);
  const proximityInfo = getProximityPriceMultiplier(date);

  // Apply filters by per-person fare
  if (maxPrice && !isNaN(Number(maxPrice)) && Number(maxPrice) > 0) {
    const numMax = Number(maxPrice);
    flights = flights.filter(f => f.pricePerPersonInr <= numMax);
  }

  if (stops === 'direct') {
    flights = flights.filter(f => f.stopsCount === 0);
  } else if (stops === '1-stop') {
    flights = flights.filter(f => f.stopsCount === 1);
  }

  if (airlines) {
    const airlineList = Array.isArray(airlines) ? airlines : airlines.split(',');
    flights = flights.filter(f => airlineList.includes(f.airline.code));
  }

  // Apply sorting
  if (sortBy === 'price') {
    flights.sort((a, b) => a.priceInr - b.priceInr);
  } else if (sortBy === 'duration') {
    flights.sort((a, b) => a.durationMinutes - b.durationMinutes);
  } else if (sortBy === 'departure') {
    flights.sort((a, b) => a.depTime.localeCompare(b.depTime));
  } else if (sortBy === 'value') {
    flights.sort((a, b) => (a.priceInr * 0.7 + a.durationMinutes * 50) - (b.priceInr * 0.7 + b.durationMinutes * 50));
  }

  res.json({
    meta: {
      origin,
      destination,
      date,
      passengers: paxCount,
      cabinClass,
      totalResults: flights.length,
      currency: 'INR',
      proximityLabel: proximityInfo.label,
      proximityBadge: proximityInfo.badge,
      analytics: {
        bestPrice,
        avgPrice,
        worstPrice,
        fairValueRating: bestPrice < avgPrice * 0.9 ? 'Great Value 🟢' : 'Average Market Rate 🟡'
      },
      weather: insights.weather,
      prediction: insights.prediction,
      insights
    },
    flights
  });
};

export const getFlightDetails = (req, res) => {
  const { id } = req.params;
  res.json({
    id,
    amenities: ['Wi-Fi High-Speed', 'In-seat USB Power', 'Complimentary Meal', 'Extra Legroom'],
    baggage: { cabin: '7 kg', checkIn: '15 kg per passenger' },
    seatMap: Array.from({ length: 30 }, (_, i) => ({
      row: i + 1,
      seats: ['A', 'B', 'C', 'D', 'E', 'F'].map(letter => ({
        code: `${i + 1}${letter}`,
        isAvailable: Math.random() > 0.35,
        priceInr: (i + 1) <= 5 ? 850 : 350
      }))
    }))
  });
};

export const getFareCalendar = (req, res) => {
  const { origin = 'DEL', destination = 'BOM', startDate = '2026-08-12', passengers = 1, cabinClass = 'Economy' } = req.query;
  const paxCount = Math.max(1, Number(passengers) || 1);
  const routeBase = getRouteBasePrices(origin.toUpperCase(), destination.toUpperCase());

  const classMultiplier = cabinClass.toLowerCase().includes('first') ? 4.5
    : cabinClass.toLowerCase().includes('business') ? 2.8
    : cabinClass.toLowerCase().includes('premium') ? 1.6
    : 1.0;

  const days = [];
  let minPrice = Infinity;
  let minIdx = 0;

  const baseDateObj = new Date(startDate);
  const startDayTime = isNaN(baseDateObj.getTime()) ? new Date('2026-08-12') : baseDateObj;

  for (let i = 0; i < 7; i++) {
    const dayObj = new Date(startDayTime);
    dayObj.setDate(startDayTime.getDate() + i);

    const dayOfWeek = dayObj.getDay();
    const dayMultiplier = (dayOfWeek === 6 || dayOfWeek === 0) ? 1.24
      : (dayOfWeek === 5) ? 1.16
      : (dayOfWeek === 2 || dayOfWeek === 3) ? 0.88
      : 1.0;

    const monthStr = dayObj.toLocaleString('en-US', { month: 'short' });
    const dayNum = dayObj.getDate();
    const dateFormatted = `${monthStr} ${dayNum}`;

    const proximity = getProximityPriceMultiplier(dayObj.toISOString().split('T')[0]);

    // Generate a visibly distinct per-day variance (±12% spread around base) for single person
    const seed = (dayNum * 7 + i * 13 + dayOfWeek * 3) % 25;
    const dayVariance = 0.90 + seed / 100; // range: 0.90 – 1.14 (±12%)
    const finalPrice = Math.round(routeBase.base * classMultiplier * proximity.multiplier * dayMultiplier * dayVariance);

    if (finalPrice < minPrice) {
      minPrice = finalPrice;
      minIdx = days.length;
    }

    days.push({
      date: dateFormatted,
      fullDate: dayObj.toISOString().split('T')[0],
      priceInr: finalPrice,
      isCheapest: false,
      isSelected: i === 0,
      proximityBadge: proximity.badge
    });
  }

  if (days[minIdx]) {
    days[minIdx].isCheapest = true;
  }

  res.json({ origin, destination, currency: 'INR', passengers: paxCount, cabinClass, days });
};

export const getAirlines = (req, res) => {
  res.json(AIRLINES);
};

export const bookFlight = async (req, res) => {
  try {
    const { flight, passengers = [], pnr = `SKY-${Math.floor(1000 + Math.random() * 9000)}`, totalAmount = 0, currency = 'INR', paymentMethod = 'UPI', email } = req.body;

    const targetEmail = email || (passengers[0] && passengers[0].email) || 'pranaykashyap8300@gmail.com';

    // Generate PDF ticket buffer using PDFKit
    const pdfBuffer = await generateTicketPdfBuffer({
      flight,
      passengers,
      pnr,
      totalAmount,
      currency,
      paymentMethod
    });

    let emailSent = false;
    let previewUrl = '';

    try {
      let transporter;

      if (process.env.SMTP_HOST && process.env.SMTP_USER && process.env.SMTP_PASS && process.env.SMTP_PASS !== 'your_gmail_app_password_here') {
        transporter = nodemailer.createTransport({
          host: process.env.SMTP_HOST,
          port: Number(process.env.SMTP_PORT) || 587,
          secure: process.env.SMTP_SECURE === 'true',
          auth: {
            user: process.env.SMTP_USER,
            pass: process.env.SMTP_PASS
          }
        });
      } else {
        const testAccount = await nodemailer.createTestAccount();
        transporter = nodemailer.createTransport({
          host: 'smtp.ethereal.email',
          port: 587,
          secure: false,
          auth: {
            user: testAccount.user,
            pass: testAccount.pass
          }
        });
      }

      const senderEmail = process.env.SMTP_USER || 'pranaykashyap8300@gmail.com';

      const mailInfo = await transporter.sendMail({
        from: `"Skyward Global" <${senderEmail}>`,
        replyTo: senderEmail,
        to: targetEmail,
        subject: `✈️ Confirmed Flight Ticket & PDF Boarding Pass (PNR: ${pnr})`,
        text: `Dear Passenger,\n\nYour flight booking is CONFIRMED!\nPNR Reference: ${pnr}\nAirline: ${flight?.airline?.name || 'Vistara'}\nFlight Number: ${flight?.flightNumber || 'UK-815'}\nRoute: ${flight?.origin?.code || flight?.origin || 'DEL'} to ${flight?.destination?.code || flight?.destination || 'BOM'}\nPassengers Count: ${passengers.length}\n\nYour official PDF electronic ticket and boarding pass is attached to this email.\n\nThank you for choosing Skyward Global!`,
        attachments: [
          {
            filename: `Flight_Ticket_${pnr}.pdf`,
            content: pdfBuffer,
            contentType: 'application/pdf'
          }
        ]
      });

      emailSent = true;
      previewUrl = nodemailer.getTestMessageUrl(mailInfo) || '';
      console.log(`📧 [TICKET EMAIL DISPATCHED] Sent PDF boarding pass to ${targetEmail} (PNR: ${pnr}). ID: ${mailInfo.messageId}`);
      if (previewUrl) {
        console.log(`🔗 [TICKET EMAIL PREVIEW LINK]: ${previewUrl}`);
      }
    } catch (mailErr) {
      console.error(`⚠️ [TICKET EMAIL NOTICE]: ${mailErr.message}`);
    }

    // Persist booking in MongoDB
    try {
      let dbUser = null;
      if (targetEmail) {
        dbUser = await User.findOne({ email: targetEmail.toLowerCase() });
      }

      const bookingDoc = await Booking.create({
        pnr,
        user: dbUser ? dbUser._id : undefined,
        passengerName: (passengers[0] && passengers[0].name) || (dbUser ? dbUser.name : 'Traveler'),
        email: targetEmail,
        phone: (passengers[0] && passengers[0].phone) || '',
        flight: {
          flightNumber: flight?.flightNumber,
          airline: flight?.airline,
          origin: flight?.origin,
          destination: flight?.destination,
          depTime: flight?.depTime,
          arrTime: flight?.arrTime,
          duration: flight?.duration,
          date: flight?.date,
          aircraft: flight?.aircraft,
          cabinClass: flight?.cabinClass
        },
        seat: passengers.map(p => p.seat || '11A').join(', '),
        passengers: passengers.length || 1,
        totalPrice: totalAmount || (flight?.priceInr || 5400),
        currency: currency || 'INR',
        status: 'CONFIRMED'
      });

      if (dbUser) {
        dbUser.bookings.push(bookingDoc._id);
        await dbUser.save();
      }
      console.log(`🍃 [MONGODB] Booking ${pnr} saved to database.`);
    } catch (dbErr) {
      // Graceful fallback if offline
    }

    res.json({
      success: true,
      message: emailSent
        ? `Booking confirmed! PDF ticket generated and sent to ${targetEmail}`
        : `Booking confirmed! PNR: ${pnr}`,
      pnr,
      targetEmail,
      emailSent,
      previewUrl
    });
  } catch (err) {
    console.error('❌ Book Flight Error:', err);
    res.status(500).json({ error: 'Failed to process flight booking and generate PDF ticket' });
  }
};
