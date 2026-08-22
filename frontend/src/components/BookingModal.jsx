import React, { useState, useEffect } from 'react';
import {
  X,
  CheckCircle,
  Ticket,
  ShieldCheck,
  Printer,
  Plane,
  User,
  Mail,
  CreditCard,
  Users,
  Lock,
  QrCode,
  Smartphone,
  Building2,
  Sparkles,
  AlertCircle,
  RefreshCw,
  Check,
  Wallet,
  ArrowRight,
  Shield
} from 'lucide-react';
import { bookFlightApi } from '../services/api';

export default function BookingModal({ flight, selectedSeat, passengersCount = 1, onClose, onBookingComplete }) {
  const [step, setStep] = useState('form'); // 'form', 'processing', 'ticket'

  const paxCount = Math.max(1, Number(passengersCount) || 1);

  const seatsList = (selectedSeat || '11A')
    .split(',')
    .map((s) => s.trim())
    .filter(Boolean);

  const initialPassengersList = Array.from({ length: paxCount }, (_, i) => ({
    id: i + 1,
    seat: seatsList[i] || `${11 + Math.floor(i / 6)}${['A', 'B', 'C', 'D', 'E', 'F'][i % 6]}`,
    firstName: '',
    lastName: '',
    email: '',
    passport: ''
  }));

  const [passengers, setPassengers] = useState(initialPassengersList);

  // Payment states
  const [paymentMethod, setPaymentMethod] = useState('card'); // 'card', 'upi', 'netbanking', 'wallet'
  const [upiMode, setUpiMode] = useState('id'); // 'id' or 'qr'
  const [upiId, setUpiId] = useState('');
  const [cardNumber, setCardNumber] = useState('');
  const [cardExpiry, setCardExpiry] = useState('');
  const [cardCvv, setCardCvv] = useState('');
  const [cardHolder, setCardHolder] = useState('');
  const [selectedBank, setSelectedBank] = useState('HDFC Bank');
  const [selectedWallet, setSelectedWallet] = useState('Skyward Sandbox Credits');

  // Processing animation state
  const [processingStage, setProcessingStage] = useState(0);
  const [txnId, setTxnId] = useState('');

  // Ticket states
  const [issuedTickets, setIssuedTickets] = useState([]);
  const [activeTicketIndex, setActiveTicketIndex] = useState(0);
  const [emailStatus, setEmailStatus] = useState('');

  if (!flight) return null;

  const totalAmount = flight.priceInr || flight.price || 5000;
  const baseFare = Math.round(totalAmount * 0.85);
  const taxesAndFees = totalAmount - baseFare;

  // Auto-detect Card Brand
  const detectCardBrand = (num) => {
    const clean = (num || '').replace(/\D/g, '');
    if (clean.startsWith('4')) return { name: 'Visa', color: '#1a1f71', bg: 'linear-gradient(135deg, #1e3a8a, #0f172a)' };
    if (clean.startsWith('5') || clean.startsWith('2')) return { name: 'Mastercard', color: '#eb001b', bg: 'linear-gradient(135deg, #7c2d12, #1e293b)' };
    if (clean.startsWith('6') || clean.startsWith('508')) return { name: 'RuPay', color: '#097939', bg: 'linear-gradient(135deg, #064e3b, #0f172a)' };
    if (clean.startsWith('3')) return { name: 'Amex', color: '#006fcf', bg: 'linear-gradient(135deg, #164e63, #0f172a)' };
    return { name: 'Card', color: '#475569', bg: 'linear-gradient(135deg, #1e293b, #0f172a)' };
  };

  const currentBrand = detectCardBrand(cardNumber);

  // Format Card Number (adds space every 4 digits)
  const handleCardNumberChange = (e) => {
    const raw = e.target.value.replace(/\D/g, '').slice(0, 16);
    const formatted = raw.replace(/(\d{4})(?=\d)/g, '$1 ');
    setCardNumber(formatted);
  };

  // Format Card Expiry (MM/YY)
  const handleExpiryChange = (e) => {
    let raw = e.target.value.replace(/\D/g, '').slice(0, 4);
    if (raw.length >= 3) {
      raw = `${raw.slice(0, 2)}/${raw.slice(2, 4)}`;
    }
    setCardExpiry(raw);
  };

  // Dummy / Fake Card Fillers for Testing
  const fillDummyCard = (type) => {
    const pName = `${passengers[0]?.firstName || 'PRANAY'} ${passengers[0]?.lastName || 'KASHYAP'}`.trim() || 'TRAVELER DEMO';
    if (type === 'visa') {
      setCardNumber('4242 4242 4242 4242');
      setCardExpiry('12/28');
      setCardCvv('789');
      setCardHolder(pName.toUpperCase());
    } else if (type === 'mastercard') {
      setCardNumber('5555 5555 5555 4444');
      setCardExpiry('08/29');
      setCardCvv('321');
      setCardHolder(pName.toUpperCase());
    } else if (type === 'rupay') {
      setCardNumber('6070 8219 9410 3321');
      setCardExpiry('11/27');
      setCardCvv('552');
      setCardHolder(pName.toUpperCase());
    }
  };

  const fillDummyUpi = (suffix = '@okhdfcbank') => {
    const handle = (passengers[0]?.firstName || 'traveler').toLowerCase().replace(/[^a-z0-9]/g, '') || 'skyward';
    setUpiId(`${handle}${suffix}`);
  };

  const handlePassengerChange = (index, field, value) => {
    const updated = [...passengers];
    updated[index][field] = value;
    setPassengers(updated);
  };

  const handleStartPayment = (e) => {
    e.preventDefault();
    const generatedTxnId = `TXN-${Math.floor(100000000 + Math.random() * 900000000)}`;
    setTxnId(generatedTxnId);
    setStep('processing');
    setProcessingStage(0);

    // Multi-stage realistic gateway simulation
    setTimeout(() => setProcessingStage(1), 500);
    setTimeout(() => setProcessingStage(2), 1200);
    setTimeout(() => {
      setProcessingStage(3);
      finalizeBooking(generatedTxnId);
    }, 2000);
  };

  const finalizeBooking = async (transactionId) => {
    const pnr = Math.random().toString(36).substring(2, 8).toUpperCase();

    const tickets = passengers.map((p, idx) => ({
      pnr,
      ticketId: `${pnr}-${idx + 1}`,
      passengerNumber: idx + 1,
      passengerName: `${p.firstName || 'Traveler'} ${p.lastName || ''}`.trim(),
      passport: p.passport || 'VERIFIED',
      seat: p.seat,
      airlineName: flight.airline.name,
      airlineLogo: flight.airline.logo,
      flightNumber: flight.flightNumber,
      origin: flight.origin,
      destination: flight.destination,
      depTime: flight.depTime,
      arrTime: flight.arrTime,
      priceInr: Math.round(totalAmount / paxCount),
      totalGroupFareInr: totalAmount,
      date: flight.date || new Date().toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric', year: 'numeric' }),
      paymentDetails: {
        txnId: transactionId,
        method: paymentMethod.toUpperCase(),
        paidAmount: totalAmount,
        status: 'SUCCESSFUL (PAID)'
      }
    }));

    setIssuedTickets(tickets);
    setStep('ticket');

    const targetEmail = passengers[0]?.email || 'pranaykashyap8300@gmail.com';
    setEmailStatus(`📧 Sending E-Ticket & Boarding Pass to ${targetEmail}...`);

    try {
      const res = await bookFlightApi({
        flight,
        passengers,
        pnr,
        totalAmount,
        currency: flight.currency || 'INR',
        paymentMethod: `${paymentMethod.toUpperCase()} (${transactionId})`,
        email: targetEmail
      });

      if (res && res.previewUrl) {
        setEmailStatus(`📧 E-Ticket PDF dispatched to ${targetEmail}`);
      } else if (res && res.emailSent) {
        setEmailStatus(`✅ PDF Boarding Pass emailed directly to ${targetEmail}`);
      } else {
        setEmailStatus(`✅ E-Ticket confirmed for ${targetEmail}. PNR: ${pnr}`);
      }
    } catch (err) {
      setEmailStatus(`✅ E-Ticket confirmed for ${targetEmail}. PNR: ${pnr}`);
    }

    if (onBookingComplete) {
      onBookingComplete(tickets[0]);
    }
  };

  const handlePrint = () => {
    window.print();
  };

  const inputStyle = {
    background: 'var(--bg-input)',
    border: '1.5px solid var(--border-base)',
    color: 'var(--text-primary)',
    borderRadius: '10px',
    padding: '10px 14px',
    fontSize: '13px',
    width: '100%',
    outline: 'none',
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 modal-overlay">
      <div
        className="w-full max-w-2xl rounded-2xl overflow-hidden shadow-2xl flex flex-col max-h-[94vh]"
        style={{ background: 'var(--bg-secondary)', border: '1.5px solid var(--border-base)' }}
      >
        {/* Header */}
        <div
          className="p-4 sm:p-5 flex items-center justify-between"
          style={{ borderBottom: '1px solid var(--border-base)', background: 'var(--bg-sidebar)' }}
        >
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl flex items-center justify-center" style={{ background: 'var(--accent-light)' }}>
              <Ticket className="w-4 h-4" style={{ color: 'var(--accent)' }} />
            </div>
            <div>
              <h3 className="text-sm sm:text-base font-bold font-sans-ui" style={{ color: 'var(--text-primary)' }}>
                {step === 'form' && 'Secure Checkout & Traveler Details'}
                {step === 'processing' && 'Bank Payment Gateway Processing'}
                {step === 'ticket' && 'Confirmed E-Ticket & Boarding Pass'}
              </h3>
              <p className="text-[11px]" style={{ color: 'var(--text-muted)' }}>
                {step === 'form' && '100% Secure Encrypted Payment Gateway • Instant E-Ticket Dispatch'}
                {step === 'processing' && 'Authorizing 3D Secure transaction...'}
                {step === 'ticket' && 'Your reservation is confirmed in airline global distribution system'}
              </p>
            </div>
          </div>

          {step !== 'processing' && (
            <button
              onClick={onClose}
              className="w-8 h-8 rounded-full flex items-center justify-center cursor-pointer transition-transform hover:scale-105"
              style={{ background: 'var(--bg-input)', border: '1px solid var(--border-base)', color: 'var(--text-secondary)' }}
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>

        {/* Content Area */}
        <div className="p-5 sm:p-6 overflow-y-auto space-y-6 flex-1">
          {/* STEP 1: FORM & PAYMENT */}
          {step === 'form' && (
            <form onSubmit={handleStartPayment} className="space-y-6">
              {/* Flight Summary Card */}
              <div
                className="p-4 rounded-xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3"
                style={{ background: 'var(--bg-sidebar)', border: '1.5px solid var(--border-base)' }}
              >
                <div className="flex items-center gap-3">
                  <img
                    src={flight.airline.logo}
                    alt=""
                    className="w-10 h-10 rounded-xl object-contain p-1.5"
                    style={{ background: 'var(--bg-card)', border: '1px solid var(--border-base)' }}
                  />
                  <div>
                    <div className="text-xs font-bold flex items-center gap-1.5" style={{ color: 'var(--text-primary)' }}>
                      <span>{flight.airline.name}</span>
                      <span className="font-mono text-[11px] px-1.5 py-0.5 rounded" style={{ background: 'var(--accent-light)', color: 'var(--accent-text)' }}>
                        {flight.flightNumber}
                      </span>
                    </div>
                    <div className="text-[11px] mt-0.5" style={{ color: 'var(--text-muted)' }}>
                      {flight.origin} ➔ {flight.destination} • {flight.duration} ({flight.stopsText || 'Direct'})
                    </div>
                  </div>
                </div>

                <div className="text-left sm:text-right">
                  <div className="text-[10px] uppercase font-bold" style={{ color: 'var(--text-muted)' }}>
                    Total Payable Amount
                  </div>
                  <div className="text-lg font-black font-mono" style={{ color: 'var(--tag-green-text)' }}>
                    ₹{totalAmount.toLocaleString('en-IN')}
                  </div>
                </div>
              </div>

              {/* Passenger Info Section */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <h4 className="text-xs font-bold uppercase tracking-wider flex items-center gap-2" style={{ color: 'var(--text-secondary)' }}>
                    <Users className="w-4 h-4" style={{ color: 'var(--accent)' }} /> Passenger Information
                  </h4>
                  <span className="text-xs font-semibold px-2 py-0.5 rounded-full" style={{ background: 'var(--bg-sidebar)', color: 'var(--text-muted)' }}>
                    {paxCount} Traveler{paxCount > 1 ? 's' : ''}
                  </span>
                </div>

                {passengers.map((p, idx) => (
                  <div
                    key={p.id}
                    className="p-4 rounded-xl space-y-3"
                    style={{ background: 'var(--bg-sidebar)', border: '1.5px solid var(--border-base)' }}
                  >
                    <div className="flex items-center justify-between pb-2" style={{ borderBottom: '1px solid var(--border-base)' }}>
                      <span className="text-xs font-bold flex items-center gap-1.5" style={{ color: 'var(--accent)' }}>
                        <User className="w-3.5 h-3.5" /> Passenger {idx + 1}
                      </span>
                      <span className="text-xs font-mono font-bold px-2 py-0.5 rounded badge-blue">
                        Seat {p.seat}
                      </span>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div>
                        <label className="block text-[11px] font-bold uppercase mb-1" style={{ color: 'var(--text-muted)' }}>
                          First / Given Name
                        </label>
                        <input
                          type="text"
                          required
                          value={p.firstName}
                          onChange={(e) => handlePassengerChange(idx, 'firstName', e.target.value)}
                          placeholder="e.g. Rahul"
                          style={inputStyle}
                        />
                      </div>
                      <div>
                        <label className="block text-[11px] font-bold uppercase mb-1" style={{ color: 'var(--text-muted)' }}>
                          Last / Family Name
                        </label>
                        <input
                          type="text"
                          required
                          value={p.lastName}
                          onChange={(e) => handlePassengerChange(idx, 'lastName', e.target.value)}
                          placeholder="e.g. Sharma"
                          style={inputStyle}
                        />
                      </div>
                    </div>

                    {idx === 0 && (
                      <div>
                        <label className="block text-[11px] font-bold uppercase mb-1" style={{ color: 'var(--text-muted)' }}>
                          Email Address (Boarding Pass & PDF Ticket Dispatch)
                        </label>
                        <input
                          type="email"
                          required
                          value={p.email}
                          onChange={(e) => handlePassengerChange(idx, 'email', e.target.value)}
                          placeholder="e.g. rahul.sharma@example.com"
                          style={inputStyle}
                        />
                      </div>
                    )}

                    <div>
                      <label className="block text-[11px] font-bold uppercase mb-1" style={{ color: 'var(--text-muted)' }}>
                        Govt ID / Passport / Aadhaar Number
                      </label>
                      <input
                        type="text"
                        required
                        value={p.passport}
                        onChange={(e) => handlePassengerChange(idx, 'passport', e.target.value)}
                        placeholder="e.g. T4892019 or 4920-1928-8821"
                        style={inputStyle}
                      />
                    </div>
                  </div>
                ))}
              </div>

              {/* PAYMENT GATEWAY SECTION */}
              <div className="space-y-4 p-4 sm:p-5 rounded-2xl" style={{ background: 'var(--bg-sidebar)', border: '1.5px solid var(--border-base)' }}>
                {/* Section Header */}
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <CreditCard className="w-4 h-4" style={{ color: 'var(--accent)' }} />
                    <h4 className="text-xs font-bold uppercase tracking-wider" style={{ color: 'var(--text-primary)' }}>
                      Payment Gateway Checkout
                    </h4>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="inline-flex items-center gap-1 text-[11px] font-semibold font-mono px-2 py-0.5 rounded-full" style={{ background: 'var(--tag-green-bg)', color: 'var(--tag-green-text)' }}>
                      <ShieldCheck className="w-3 h-3" /> 256-Bit SSL Encrypted
                    </span>
                  </div>
                </div>

                {/* Payment Method Selector Tabs */}
                <div className="grid grid-cols-3 gap-2">
                  {[
                    { id: 'card', label: 'Credit / Debit Card', icon: CreditCard },
                    { id: 'upi', label: 'UPI / QR Code', icon: Smartphone },
                    { id: 'netbanking', label: 'Net Banking', icon: Building2 },
                  ].map((m) => {
                    const IconComponent = m.icon;
                    const isSelected = paymentMethod === m.id;
                    return (
                      <button
                        key={m.id}
                        type="button"
                        onClick={() => setPaymentMethod(m.id)}
                        className="p-3 rounded-xl text-xs font-bold transition-all cursor-pointer flex flex-col items-center justify-center gap-1.5 text-center"
                        style={{
                          background: isSelected ? 'var(--accent)' : 'var(--bg-card)',
                          color: isSelected ? '#ffffff' : 'var(--text-secondary)',
                          border: isSelected ? '1.5px solid var(--accent)' : '1.5px solid var(--border-base)',
                          boxShadow: isSelected ? '0 2px 8px rgba(37,99,235,0.25)' : 'none',
                        }}
                      >
                        <IconComponent className="w-4 h-4" />
                        <span>{m.label}</span>
                      </button>
                    );
                  })}
                </div>

                {/* TAB 1: CARD PAYMENT */}
                {paymentMethod === 'card' && (
                  <div className="space-y-4 pt-2">
                    {/* Interactive Live Virtual Card Visualizer */}
                    <div
                      className="w-full rounded-2xl p-5 text-white relative overflow-hidden shadow-lg"
                      style={{ background: currentBrand.bg, border: '1px solid rgba(255,255,255,0.15)' }}
                    >
                      <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center gap-2">
                          <div className="w-8 h-6 rounded-md bg-amber-400/80 border border-amber-200/50 flex items-center justify-center">
                            <div className="w-5 h-3 border border-amber-800/40 rounded-sm" />
                          </div>
                          <span className="text-[10px] font-mono tracking-widest opacity-75">TEST EMV CHIP</span>
                        </div>
                        <span className="font-extrabold text-sm tracking-wider font-mono uppercase px-2 py-0.5 rounded bg-white/10">
                          {currentBrand.name}
                        </span>
                      </div>

                      <div className="my-3 font-mono text-base sm:text-lg tracking-widest font-bold">
                        {cardNumber || '•••• •••• •••• ••••'}
                      </div>

                      <div className="flex items-end justify-between text-xs font-mono pt-1">
                        <div>
                          <div className="text-[9px] uppercase tracking-wider opacity-60">Card Holder</div>
                          <div className="font-bold tracking-wider truncate max-w-[180px]">
                            {cardHolder || 'TRAVELER NAME'}
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="text-[9px] uppercase tracking-wider opacity-60">Expires</div>
                          <div className="font-bold tracking-wider">{cardExpiry || 'MM/YY'}</div>
                        </div>
                      </div>
                    </div>

                    {/* Quick Test Card Presets */}
                    <div className="space-y-1.5">
                      <span className="text-[11px] font-bold" style={{ color: 'var(--text-muted)' }}>
                        Quick Fill Dummy Test Cards:
                      </span>
                      <div className="flex flex-wrap gap-2">
                        <button
                          type="button"
                          onClick={() => fillDummyCard('visa')}
                          className="px-2.5 py-1 rounded-lg text-[11px] font-bold cursor-pointer transition-all hover:opacity-80 flex items-center gap-1.5"
                          style={{ background: 'var(--bg-card)', border: '1px solid var(--border-base)', color: 'var(--text-primary)' }}
                        >
                          <span className="w-2 h-2 rounded-full bg-blue-500" /> Fill Test Visa (4242)
                        </button>
                        <button
                          type="button"
                          onClick={() => fillDummyCard('mastercard')}
                          className="px-2.5 py-1 rounded-lg text-[11px] font-bold cursor-pointer transition-all hover:opacity-80 flex items-center gap-1.5"
                          style={{ background: 'var(--bg-card)', border: '1px solid var(--border-base)', color: 'var(--text-primary)' }}
                        >
                          <span className="w-2 h-2 rounded-full bg-red-500" /> Fill Test Mastercard (5555)
                        </button>
                        <button
                          type="button"
                          onClick={() => fillDummyCard('rupay')}
                          className="px-2.5 py-1 rounded-lg text-[11px] font-bold cursor-pointer transition-all hover:opacity-80 flex items-center gap-1.5"
                          style={{ background: 'var(--bg-card)', border: '1px solid var(--border-base)', color: 'var(--text-primary)' }}
                        >
                          <span className="w-2 h-2 rounded-full bg-emerald-500" /> Fill Test RuPay (6070)
                        </button>
                      </div>
                    </div>

                    {/* Card Form Inputs */}
                    <div className="space-y-3">
                      <div>
                        <label className="block text-[11px] font-bold uppercase mb-1" style={{ color: 'var(--text-muted)' }}>
                          Card Number (16 Digits)
                        </label>
                        <div className="relative">
                          <input
                            type="text"
                            required
                            maxLength={19}
                            value={cardNumber}
                            onChange={handleCardNumberChange}
                            placeholder="4532 8921 7734 1092"
                            style={inputStyle}
                            className="font-mono"
                          />
                          <span className="absolute right-3 top-2.5 text-xs font-mono font-bold" style={{ color: 'var(--text-muted)' }}>
                            {currentBrand.name}
                          </span>
                        </div>
                      </div>

                      <div className="grid grid-cols-3 gap-3">
                        <div className="col-span-1">
                          <label className="block text-[11px] font-bold uppercase mb-1" style={{ color: 'var(--text-muted)' }}>
                            Expiry (MM/YY)
                          </label>
                          <input
                            type="text"
                            required
                            maxLength={5}
                            value={cardExpiry}
                            onChange={handleExpiryChange}
                            placeholder="12/28"
                            style={inputStyle}
                            className="font-mono text-center"
                          />
                        </div>
                        <div className="col-span-1">
                          <label className="block text-[11px] font-bold uppercase mb-1" style={{ color: 'var(--text-muted)' }}>
                            CVV / CVC
                          </label>
                          <input
                            type="password"
                            required
                            maxLength={4}
                            value={cardCvv}
                            onChange={(e) => setCardCvv(e.target.value.replace(/\D/g, ''))}
                            placeholder="•••"
                            style={inputStyle}
                            className="font-mono text-center"
                          />
                        </div>
                        <div className="col-span-1">
                          <label className="block text-[11px] font-bold uppercase mb-1" style={{ color: 'var(--text-muted)' }}>
                            Cardholder Name
                          </label>
                          <input
                            type="text"
                            required
                            value={cardHolder}
                            onChange={(e) => setCardHolder(e.target.value)}
                            placeholder="NAME ON CARD"
                            style={inputStyle}
                            className="uppercase"
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* TAB 2: UPI & QR CODE */}
                {paymentMethod === 'upi' && (
                  <div className="space-y-4 pt-2">
                    {/* Toggle UPI ID vs Dynamic QR */}
                    <div className="grid grid-cols-2 gap-2 p-1 rounded-xl" style={{ background: 'var(--bg-card)', border: '1px solid var(--border-base)' }}>
                      <button
                        type="button"
                        onClick={() => setUpiMode('id')}
                        className="py-1.5 text-xs font-bold rounded-lg cursor-pointer transition-all"
                        style={{
                          background: upiMode === 'id' ? 'var(--accent)' : 'transparent',
                          color: upiMode === 'id' ? '#ffffff' : 'var(--text-secondary)',
                        }}
                      >
                        Enter UPI ID / VPA
                      </button>
                      <button
                        type="button"
                        onClick={() => setUpiMode('qr')}
                        className="py-1.5 text-xs font-bold rounded-lg cursor-pointer transition-all flex items-center justify-center gap-1.5"
                        style={{
                          background: upiMode === 'qr' ? 'var(--accent)' : 'transparent',
                          color: upiMode === 'qr' ? '#ffffff' : 'var(--text-secondary)',
                        }}
                      >
                        <QrCode className="w-3.5 h-3.5" /> Scan Instant QR Code
                      </button>
                    </div>

                    {upiMode === 'id' ? (
                      <div className="space-y-3">
                        <div>
                          <label className="block text-[11px] font-bold uppercase mb-1" style={{ color: 'var(--text-muted)' }}>
                            Virtual Payment Address (VPA / UPI ID)
                          </label>
                          <div className="flex items-center gap-2">
                            <input
                              type="text"
                              required
                              value={upiId}
                              onChange={(e) => setUpiId(e.target.value)}
                              placeholder="e.g. rahul@okaxis or 9876543210@paytm"
                              style={inputStyle}
                            />
                            <span className="text-[11px] font-bold px-2.5 py-2 rounded-lg whitespace-nowrap badge-green flex items-center gap-1">
                              <Check className="w-3.5 h-3.5" /> Verified
                            </span>
                          </div>
                        </div>

                        {/* Quick UPI Handle suggestions */}
                        <div className="space-y-1.5">
                          <span className="text-[11px] font-bold" style={{ color: 'var(--text-muted)' }}>
                            Quick Fill Test Handles:
                          </span>
                          <div className="flex flex-wrap gap-2">
                            {['@okhdfcbank', '@okaxis', '@paytm', '@ybl', '@ibl'].map((sfx) => (
                              <button
                                key={sfx}
                                type="button"
                                onClick={() => fillDummyUpi(sfx)}
                                className="px-2.5 py-1 rounded-lg text-[11px] font-bold cursor-pointer transition-all hover:opacity-80"
                                style={{ background: 'var(--bg-card)', border: '1px solid var(--border-base)', color: 'var(--text-secondary)' }}
                              >
                                {sfx}
                              </button>
                            ))}
                          </div>
                        </div>
                      </div>
                    ) : (
                      /* Simulated Dynamic UPI QR Code */
                      <div className="p-4 rounded-xl flex flex-col items-center text-center space-y-3" style={{ background: 'var(--bg-card)', border: '1px solid var(--border-base)' }}>
                        <div className="p-3 rounded-2xl bg-white border-2 border-slate-200 shadow-sm relative">
                          {/* QR Code SVG Visualizer */}
                          <svg className="w-36 h-36" viewBox="0 0 100 100" fill="none">
                            <rect width="100" height="100" fill="white" />
                            <rect x="10" y="10" width="25" height="25" rx="3" fill="#0f172a" />
                            <rect x="15" y="15" width="15" height="15" fill="white" />
                            <rect x="18" y="18" width="9" height="9" fill="#2563eb" />

                            <rect x="65" y="10" width="25" height="25" rx="3" fill="#0f172a" />
                            <rect x="70" y="15" width="15" height="15" fill="white" />
                            <rect x="73" y="18" width="9" height="9" fill="#2563eb" />

                            <rect x="10" y="65" width="25" height="25" rx="3" fill="#0f172a" />
                            <rect x="15" y="70" width="15" height="15" fill="white" />
                            <rect x="18" y="73" width="9" height="9" fill="#2563eb" />

                            {/* Center Logo Icon */}
                            <circle cx="50" cy="50" r="10" fill="#2563eb" />
                            <path d="M47 50 L53 50 M50 47 L50 53" stroke="white" strokeWidth="2" strokeLinecap="round" />

                            {/* Pixel Grid */}
                            <rect x="42" y="15" width="5" height="5" fill="#0f172a" />
                            <rect x="52" y="18" width="6" height="6" fill="#0f172a" />
                            <rect x="40" y="70" width="6" height="6" fill="#0f172a" />
                            <rect x="55" y="68" width="6" height="6" fill="#0f172a" />
                            <rect x="68" y="45" width="6" height="6" fill="#0f172a" />
                            <rect x="75" y="72" width="6" height="6" fill="#0f172a" />
                            <rect x="80" y="60" width="6" height="6" fill="#0f172a" />
                            <rect x="45" y="82" width="6" height="6" fill="#0f172a" />
                            <rect x="15" y="45" width="6" height="6" fill="#0f172a" />
                            <rect x="25" y="52" width="6" height="6" fill="#0f172a" />
                          </svg>
                        </div>
                        <div>
                          <div className="text-xs font-bold" style={{ color: 'var(--text-primary)' }}>
                            Scan to pay ₹{totalAmount.toLocaleString('en-IN')} with any UPI App
                          </div>
                          <div className="text-[11px] font-mono mt-0.5" style={{ color: 'var(--text-muted)' }}>
                            GPay • PhonePe • Paytm • BHIM • CRED
                          </div>
                        </div>
                        <button
                          type="button"
                          onClick={() => {
                            setUpiId('sandbox.qr.scan@upi');
                            setUpiMode('id');
                          }}
                          className="px-3 py-1.5 rounded-lg text-xs font-bold cursor-pointer"
                          style={{ background: 'var(--accent-light)', color: 'var(--accent-text)', border: '1px solid var(--accent)' }}
                        >
                          ⚡ Simulate Instant QR Scan & Authorization
                        </button>
                      </div>
                    )}
                  </div>
                )}

                {/* TAB 3: NET BANKING */}
                {paymentMethod === 'netbanking' && (
                  <div className="space-y-4 pt-2">
                    <label className="block text-[11px] font-bold uppercase" style={{ color: 'var(--text-muted)' }}>
                      Popular Banks (Sandbox Instant Clearance)
                    </label>

                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                      {[
                        { name: 'HDFC Bank', code: 'HDFC' },
                        { name: 'State Bank of India', code: 'SBI' },
                        { name: 'ICICI Bank', code: 'ICICI' },
                        { name: 'Axis Bank', code: 'AXIS' },
                        { name: 'Kotak Mahindra', code: 'KOTAK' },
                        { name: 'Punjab National Bank', code: 'PNB' },
                      ].map((b) => (
                        <button
                          key={b.code}
                          type="button"
                          onClick={() => setSelectedBank(b.name)}
                          className="p-3 rounded-xl text-left cursor-pointer transition-all flex items-center justify-between"
                          style={{
                            background: selectedBank === b.name ? 'var(--accent-light)' : 'var(--bg-card)',
                            border: selectedBank === b.name ? '1.5px solid var(--accent)' : '1px solid var(--border-base)',
                            color: selectedBank === b.name ? 'var(--accent-text)' : 'var(--text-primary)',
                          }}
                        >
                          <div>
                            <div className="text-xs font-bold">{b.name}</div>
                            <div className="text-[10px] font-mono opacity-70">{b.code} TEST GATEWAY</div>
                          </div>
                          {selectedBank === b.name && <Check className="w-4 h-4 flex-shrink-0" style={{ color: 'var(--accent)' }} />}
                        </button>
                      ))}
                    </div>

                    <div>
                      <label className="block text-[11px] font-bold uppercase mb-1" style={{ color: 'var(--text-muted)' }}>
                        Or Choose Other Domestic / International Bank
                      </label>
                      <select
                        value={selectedBank}
                        onChange={(e) => setSelectedBank(e.target.value)}
                        style={inputStyle}
                      >
                        <option value="HDFC Bank">HDFC Bank</option>
                        <option value="State Bank of India">State Bank of India (SBI)</option>
                        <option value="ICICI Bank">ICICI Bank</option>
                        <option value="Axis Bank">Axis Bank</option>
                        <option value="Kotak Mahindra Bank">Kotak Mahindra Bank</option>
                        <option value="Punjab National Bank">Punjab National Bank (PNB)</option>
                        <option value="Bank of Baroda">Bank of Baroda</option>
                        <option value="Canara Bank">Canara Bank</option>
                        <option value="Union Bank of India">Union Bank of India</option>
                        <option value="IndusInd Bank">IndusInd Bank</option>
                        <option value="Standard Chartered">Standard Chartered</option>
                        <option value="Citibank Global">Citibank Global</option>
                        <option value="HSBC Bank">HSBC Bank</option>
                      </select>
                    </div>
                  </div>
                )}

                {/* Pricing Breakdown Summary */}
                <div className="pt-3 space-y-1.5 text-xs" style={{ borderTop: '1px solid var(--border-base)' }}>
                  <div className="flex justify-between" style={{ color: 'var(--text-muted)' }}>
                    <span>Base Fare ({paxCount} traveler{paxCount > 1 ? 's' : ''})</span>
                    <span className="font-mono">₹{baseFare.toLocaleString('en-IN')}</span>
                  </div>
                  <div className="flex justify-between" style={{ color: 'var(--text-muted)' }}>
                    <span>Airport Taxes, Fuel Surcharges & Fees</span>
                    <span className="font-mono">₹{taxesAndFees.toLocaleString('en-IN')}</span>
                  </div>
                  <div className="flex justify-between pt-1.5 font-bold text-sm" style={{ borderTop: '1px dashed var(--border-base)', color: 'var(--text-primary)' }}>
                    <span>Total Amount Payable</span>
                    <span className="font-mono" style={{ color: 'var(--tag-green-text)' }}>₹{totalAmount.toLocaleString('en-IN')}</span>
                  </div>
                </div>
              </div>

              {/* Submit Payment Button */}
              <button
                type="submit"
                className="w-full py-4 rounded-xl btn-glow font-bold text-xs uppercase tracking-wider cursor-pointer flex items-center justify-center gap-2 shadow-lg"
              >
                <Lock className="w-4 h-4" /> Pay ₹{totalAmount.toLocaleString('en-IN')} & Confirm Reservation <ArrowRight className="w-4 h-4" />
              </button>
            </form>
          )}

          {/* STEP 2: GATEWAY PROCESSING ANIMATION */}
          {step === 'processing' && (
            <div className="py-12 px-4 flex flex-col items-center justify-center text-center space-y-6">
              <div className="relative w-20 h-20 flex items-center justify-center">
                <div className="absolute inset-0 rounded-full border-4 border-slate-200 dark:border-slate-800" />
                <div className="absolute inset-0 rounded-full border-4 border-blue-600 border-t-transparent animate-spin" />
                <Lock className="w-8 h-8" style={{ color: 'var(--accent)' }} />
              </div>

              <div className="space-y-2 max-w-md">
                <h3 className="text-base font-bold" style={{ color: 'var(--text-primary)' }}>
                  Processing Secure Bank Payment
                </h3>
                <p className="text-xs" style={{ color: 'var(--text-muted)' }}>
                  Transaction Reference: <span className="font-mono font-bold" style={{ color: 'var(--accent)' }}>{txnId}</span>
                </p>
              </div>

              <div className="w-full max-w-sm space-y-3 text-left">
                <div className="p-3 rounded-xl flex items-center gap-3" style={{ background: 'var(--bg-sidebar)', border: '1px solid var(--border-base)' }}>
                  {processingStage >= 1 ? (
                    <CheckCircle className="w-4 h-4 flex-shrink-0 text-emerald-500" />
                  ) : (
                    <RefreshCw className="w-4 h-4 flex-shrink-0 animate-spin text-blue-500" />
                  )}
                  <span className="text-xs font-medium" style={{ color: 'var(--text-primary)' }}>
                    Secure Handshake & 256-Bit SSL Encryption
                  </span>
                </div>

                <div className="p-3 rounded-xl flex items-center gap-3" style={{ background: 'var(--bg-sidebar)', border: '1px solid var(--border-base)' }}>
                  {processingStage >= 2 ? (
                    <CheckCircle className="w-4 h-4 flex-shrink-0 text-emerald-500" />
                  ) : (
                    <RefreshCw className="w-4 h-4 flex-shrink-0 animate-spin text-blue-500" />
                  )}
                  <span className="text-xs font-medium" style={{ color: 'var(--text-primary)' }}>
                    Authorizing 3D Secure 2.0 & Token Exchange
                  </span>
                </div>

                <div className="p-3 rounded-xl flex items-center gap-3" style={{ background: 'var(--bg-sidebar)', border: '1px solid var(--border-base)' }}>
                  {processingStage >= 3 ? (
                    <CheckCircle className="w-4 h-4 flex-shrink-0 text-emerald-500" />
                  ) : (
                    <RefreshCw className="w-4 h-4 flex-shrink-0 animate-spin text-blue-500" />
                  )}
                  <span className="text-xs font-medium" style={{ color: 'var(--text-primary)' }}>
                    Bank Settlement & E-Ticket Generation
                  </span>
                </div>
              </div>
            </div>
          )}

          {/* STEP 3: CONFIRMED TICKET & BOARDING PASS */}
          {step === 'ticket' && (
            <div className="space-y-6">
              {/* Success Notification Banner */}
              <div
                className="p-5 rounded-2xl text-center space-y-2 shadow-sm"
                style={{ background: 'var(--tag-green-bg)', border: '1px solid var(--tag-green-text)44' }}
              >
                <CheckCircle className="w-10 h-10 mx-auto" style={{ color: 'var(--tag-green-text)' }} />
                <h3 className="text-lg font-bold" style={{ color: 'var(--tag-green-text)' }}>
                  Booking & Payment Confirmed!
                </h3>
                <p className="text-xs max-w-md mx-auto" style={{ color: 'var(--tag-green-text)' }}>
                  {emailStatus}
                </p>
                <div className="pt-2 flex items-center justify-center gap-2 text-[11px] font-mono">
                  <span className="px-2 py-0.5 rounded bg-white/70 font-bold text-slate-800">
                    TXN: {txnId}
                  </span>
                  <span className="px-2 py-0.5 rounded bg-white/70 font-bold text-emerald-800">
                    PAID ₹{totalAmount.toLocaleString('en-IN')}
                  </span>
                </div>
              </div>

              {/* Multi-passenger ticket selector if > 1 traveler */}
              {issuedTickets.length > 1 && (
                <div className="flex items-center gap-2 overflow-x-auto pb-1">
                  <span className="text-xs font-bold flex-shrink-0" style={{ color: 'var(--text-muted)' }}>
                    Select Boarding Pass:
                  </span>
                  {issuedTickets.map((t, i) => (
                    <button
                      key={t.ticketId}
                      onClick={() => setActiveTicketIndex(i)}
                      className="px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer whitespace-nowrap"
                      style={{
                        background: activeTicketIndex === i ? 'var(--accent)' : 'var(--bg-sidebar)',
                        color: activeTicketIndex === i ? '#ffffff' : 'var(--text-secondary)',
                        border: activeTicketIndex === i ? '1.5px solid var(--accent)' : '1.5px solid var(--border-base)',
                      }}
                    >
                      P{i + 1}: {t.passengerName} (Seat {t.seat})
                    </button>
                  ))}
                </div>
              )}

              {/* Printable Boarding Pass Card */}
              {issuedTickets[activeTicketIndex] && (
                <div
                  id="printable-ticket"
                  className="p-6 rounded-2xl space-y-5"
                  style={{ background: 'var(--bg-secondary)', border: '2px solid var(--accent)', boxShadow: 'var(--shadow-card)' }}
                >
                  {/* Airline & PNR Header */}
                  <div className="flex items-center justify-between pb-4" style={{ borderBottom: '1px solid var(--border-base)' }}>
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl flex items-center justify-center p-1" style={{ background: 'var(--bg-sidebar)', border: '1px solid var(--border-base)' }}>
                        <img src={issuedTickets[activeTicketIndex].airlineLogo} alt="" className="w-full h-full object-contain" />
                      </div>
                      <div>
                        <div className="font-bold text-sm" style={{ color: 'var(--text-primary)' }}>
                          {issuedTickets[activeTicketIndex].airlineName}
                        </div>
                        <div className="text-xs font-mono" style={{ color: 'var(--accent)' }}>
                          Flight {issuedTickets[activeTicketIndex].flightNumber}
                        </div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-[10px] uppercase font-bold" style={{ color: 'var(--text-muted)' }}>
                        Booking Reference
                      </div>
                      <div
                        className="text-xl font-extrabold font-mono tracking-wider pnr-badge px-3 py-0.5 rounded-lg"
                        style={{ background: 'var(--accent-light)', color: 'var(--accent-text)', border: '1px solid var(--accent)' }}
                      >
                        PNR: {issuedTickets[activeTicketIndex].pnr}
                      </div>
                    </div>
                  </div>

                  {/* Route Timeline */}
                  <div className="grid grid-cols-3 gap-4 text-center p-4 rounded-xl" style={{ background: 'var(--bg-sidebar)' }}>
                    <div>
                      <div className="text-[10px] uppercase font-bold" style={{ color: 'var(--text-muted)' }}>Departure</div>
                      <div className="text-xl font-bold" style={{ color: 'var(--text-primary)' }}>{issuedTickets[activeTicketIndex].depTime}</div>
                      <div className="text-xs font-bold" style={{ color: 'var(--accent)' }}>{issuedTickets[activeTicketIndex].origin}</div>
                    </div>
                    <div className="flex flex-col items-center justify-center">
                      <Plane className="w-5 h-5 rotate-90" style={{ color: 'var(--accent)' }} />
                      <div className="text-[10px] mt-1 font-mono" style={{ color: 'var(--text-muted)' }}>Direct Flight</div>
                    </div>
                    <div>
                      <div className="text-[10px] uppercase font-bold" style={{ color: 'var(--text-muted)' }}>Arrival</div>
                      <div className="text-xl font-bold" style={{ color: 'var(--text-primary)' }}>{issuedTickets[activeTicketIndex].arrTime}</div>
                      <div className="text-xs font-bold" style={{ color: 'var(--accent)' }}>{issuedTickets[activeTicketIndex].destination}</div>
                    </div>
                  </div>

                  {/* Details Grid */}
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs p-4 rounded-xl" style={{ background: 'var(--bg-sidebar)' }}>
                    <div>
                      <div className="text-[10px] uppercase font-bold" style={{ color: 'var(--text-muted)' }}>Passenger</div>
                      <div className="font-bold truncate" style={{ color: 'var(--text-primary)' }}>{issuedTickets[activeTicketIndex].passengerName}</div>
                    </div>
                    <div>
                      <div className="text-[10px] uppercase font-bold" style={{ color: 'var(--text-muted)' }}>Seat Number</div>
                      <div className="font-bold font-mono" style={{ color: 'var(--accent)' }}>{issuedTickets[activeTicketIndex].seat}</div>
                    </div>
                    <div>
                      <div className="text-[10px] uppercase font-bold" style={{ color: 'var(--text-muted)' }}>ID / Passport</div>
                      <div className="font-mono truncate" style={{ color: 'var(--text-primary)' }}>{issuedTickets[activeTicketIndex].passport || 'VERIFIED'}</div>
                    </div>
                    <div>
                      <div className="text-[10px] uppercase font-bold" style={{ color: 'var(--text-muted)' }}>Payment Status</div>
                      <div className="font-bold" style={{ color: 'var(--tag-green-text)' }}>PAID (₹{issuedTickets[activeTicketIndex].priceInr.toLocaleString('en-IN')})</div>
                    </div>
                  </div>

                  {/* Simulated Boarding Pass Barcode */}
                  <div className="p-3 rounded-xl flex flex-col items-center justify-center space-y-1.5" style={{ background: 'var(--bg-sidebar)' }}>
                    <div className="font-mono text-xs tracking-widest text-center" style={{ letterSpacing: '6px', color: 'var(--text-muted)' }}>
                      ||| | |||| | || |||| | ||| |||| | || ||||
                    </div>
                    <div className="text-[10px] font-mono" style={{ color: 'var(--text-muted)' }}>
                      {issuedTickets[activeTicketIndex].ticketId} • GATE OPENS 45M BEFORE DEPARTURE
                    </div>
                  </div>

                  {/* Print / Save PDF Actions */}
                  <div className="flex items-center justify-end gap-3 pt-2">
                    <button
                      onClick={handlePrint}
                      className="btn-glow px-6 py-2.5 rounded-xl text-xs font-bold flex items-center gap-2 cursor-pointer"
                    >
                      <Printer className="w-4 h-4" /> Print / Save PDF Boarding Pass
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
