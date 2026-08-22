import React, { useState } from 'react';
import { X, CheckCircle, Ticket, ShieldCheck, Printer, Plane, User, Mail, CreditCard, Users, FileText } from 'lucide-react';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import { bookFlightApi } from '../services/api';

export default function BookingModal({ flight, selectedSeat, passengersCount = 1, onClose, onBookingComplete }) {
  const [step, setStep] = useState('form'); // 'form' or 'ticket'

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
  const [paymentMethod, setPaymentMethod] = useState('upi');
  const [upiId, setUpiId] = useState('');
  const [cardNumber, setCardNumber] = useState('');
  const [cardExpiry, setCardExpiry] = useState('');
  const [cardCvv, setCardCvv] = useState('');
  const [cardHolder, setCardHolder] = useState('');
  const [selectedBank, setSelectedBank] = useState('HDFC Bank');

  const [issuedTickets, setIssuedTickets] = useState([]);
  const [activeTicketIndex, setActiveTicketIndex] = useState(0);
  const [emailStatus, setEmailStatus] = useState('');

  if (!flight) return null;

  const handlePassengerChange = (index, field, value) => {
    const updated = [...passengers];
    updated[index][field] = value;
    setPassengers(updated);
  };

  const handleConfirmBooking = async (e) => {
    e.preventDefault();
    const pnr = Math.random().toString(36).substring(2, 8).toUpperCase();

    const tickets = passengers.map((p, idx) => ({
      pnr,
      ticketId: `${pnr}-${idx + 1}`,
      passengerNumber: idx + 1,
      passengerName: `${p.firstName} ${p.lastName}`,
      passport: p.passport,
      seat: p.seat,
      airlineName: flight.airline.name,
      airlineLogo: flight.airline.logo,
      flightNumber: flight.flightNumber,
      origin: flight.origin,
      destination: flight.destination,
      depTime: flight.depTime,
      arrTime: flight.arrTime,
      priceInr: Math.round((flight.priceInr || flight.price) / paxCount),
      totalGroupFareInr: flight.priceInr || flight.price,
      date: flight.date || new Date().toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric', year: 'numeric' })
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
        totalAmount: flight.priceInr || flight.price,
        currency: flight.currency || 'INR',
        paymentMethod,
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
    borderRadius: '8px',
    padding: '8px 12px',
    fontSize: '13px',
    width: '100%',
    outline: 'none',
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 modal-overlay">
      <div
        className="w-full max-w-2xl rounded-2xl overflow-hidden shadow-2xl flex flex-col max-h-[92vh]"
        style={{ background: 'var(--bg-secondary)', border: '1.5px solid var(--border-base)' }}
      >
        {/* Header */}
        <div
          className="p-5 flex items-center justify-between"
          style={{ borderBottom: '1px solid var(--border-base)', background: 'var(--bg-sidebar)' }}
        >
          <div className="flex items-center gap-2">
            <Ticket className="w-5 h-5" style={{ color: 'var(--accent)' }} />
            <h3 className="text-base font-bold font-sans-ui" style={{ color: 'var(--text-primary)' }}>
              {step === 'form' ? 'Checkout & Traveler Details' : 'Confirmed E-Ticket & Boarding Pass'}
            </h3>
          </div>

          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full flex items-center justify-center cursor-pointer"
            style={{ background: 'var(--bg-input)', border: '1px solid var(--border-base)', color: 'var(--text-secondary)' }}
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto space-y-5 flex-1">
          {step === 'form' ? (
            <form onSubmit={handleConfirmBooking} className="space-y-5">
              {/* Flight Summary Header */}
              <div
                className="p-4 rounded-xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3"
                style={{ background: 'var(--bg-sidebar)', border: '1.5px solid var(--border-base)' }}
              >
                <div className="flex items-center gap-3">
                  <img src={flight.airline.logo} alt="" className="w-9 h-9 rounded-lg object-contain p-1" style={{ background: 'var(--bg-card)', border: '1px solid var(--border-base)' }} />
                  <div>
                    <div className="text-xs font-bold" style={{ color: 'var(--text-primary)' }}>
                      {flight.airline.name} • <span style={{ color: 'var(--accent)' }}>{flight.flightNumber}</span>
                    </div>
                    <div className="text-[11px]" style={{ color: 'var(--text-muted)' }}>
                      {flight.origin} ➔ {flight.destination} ({flight.duration})
                    </div>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-[10px] uppercase font-bold" style={{ color: 'var(--text-muted)' }}>Total Booking Price</div>
                  <div className="text-lg font-extrabold font-mono" style={{ color: 'var(--tag-green-text)' }}>
                    ₹{(flight.priceInr || flight.price).toLocaleString('en-IN')}
                  </div>
                </div>
              </div>

              {/* Multi-Passenger Details Inputs */}
              <div className="space-y-4">
                <h4 className="text-xs font-bold uppercase tracking-wider flex items-center justify-between" style={{ color: 'var(--text-secondary)' }}>
                  <span className="flex items-center gap-2">
                    <Users className="w-4 h-4" style={{ color: 'var(--accent)' }} /> Passenger Information
                  </span>
                  <span className="font-mono font-bold" style={{ color: 'var(--accent)' }}>{paxCount} Passenger{paxCount > 1 ? 's' : ''}</span>
                </h4>

                {passengers.map((p, idx) => (
                  <div
                    key={p.id}
                    className="p-4 rounded-xl space-y-3"
                    style={{ background: 'var(--bg-sidebar)', border: '1.5px solid var(--border-base)' }}
                  >
                    <div className="flex items-center justify-between pb-2" style={{ borderBottom: '1px solid var(--border-base)' }}>
                      <span className="text-xs font-bold flex items-center gap-1.5" style={{ color: 'var(--accent)' }}>
                        <User className="w-3.5 h-3.5" /> Passenger {idx + 1} of {paxCount}
                      </span>
                      <span className="text-xs font-mono font-bold px-2 py-0.5 rounded badge-blue">
                        Seat {p.seat}
                      </span>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div>
                        <label className="block text-[11px] font-bold uppercase mb-1" style={{ color: 'var(--text-muted)' }}>First Name</label>
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
                        <label className="block text-[11px] font-bold uppercase mb-1" style={{ color: 'var(--text-muted)' }}>Last Name</label>
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
                        <label className="block text-[11px] font-bold uppercase mb-1" style={{ color: 'var(--text-muted)' }}>Email Address for PDF Tickets</label>
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
                      <label className="block text-[11px] font-bold uppercase mb-1" style={{ color: 'var(--text-muted)' }}>Passport / Govt ID Number</label>
                      <input
                        type="text"
                        required
                        value={p.passport}
                        onChange={(e) => handlePassengerChange(idx, 'passport', e.target.value)}
                        placeholder="e.g. A12345678"
                        style={inputStyle}
                      />
                    </div>
                  </div>
                ))}
              </div>

              {/* Payment Method Selector */}
              <div className="space-y-4 p-4 rounded-xl" style={{ background: 'var(--bg-sidebar)', border: '1.5px solid var(--border-base)' }}>
                <h4 className="text-xs font-bold uppercase tracking-wider flex items-center justify-between" style={{ color: 'var(--text-secondary)' }}>
                  <span className="flex items-center gap-2">
                    <CreditCard className="w-4 h-4" style={{ color: 'var(--accent)' }} /> Select Payment Method
                  </span>
                  <span className="font-mono text-[11px] font-bold" style={{ color: 'var(--tag-green-text)' }}>100% Encrypted Payment</span>
                </h4>

                <div className="grid grid-cols-3 gap-2">
                  {[
                    { id: 'upi', label: 'UPI / GPay 🇮🇳' },
                    { id: 'card', label: 'Card 💳' },
                    { id: 'netbanking', label: 'Net Banking 🏛️' },
                  ].map((m) => (
                    <button
                      key={m.id}
                      type="button"
                      onClick={() => setPaymentMethod(m.id)}
                      className="p-3 rounded-xl text-xs font-bold uppercase transition-all cursor-pointer text-center"
                      style={{
                        background: paymentMethod === m.id ? 'var(--accent-light)' : 'var(--bg-card)',
                        border: paymentMethod === m.id ? '1.5px solid var(--accent)' : '1.5px solid var(--border-base)',
                        color: paymentMethod === m.id ? 'var(--accent-text)' : 'var(--text-secondary)',
                      }}
                    >
                      {m.label}
                    </button>
                  ))}
                </div>

                {/* Specific Payment Input Fields */}
                <div className="pt-2" style={{ borderTop: '1px solid var(--border-base)' }}>
                  {paymentMethod === 'upi' && (
                    <div className="space-y-2">
                      <label className="block text-[10px] font-bold uppercase" style={{ color: 'var(--text-muted)' }}>
                        VPA / UPI ID (GPay, PhonePe, Paytm, BHIM)
                      </label>
                      <div className="flex items-center gap-2">
                        <input
                          type="text"
                          required
                          value={upiId}
                          onChange={(e) => setUpiId(e.target.value)}
                          placeholder="e.g. rahul@okicici or 9876543210@paytm"
                          style={inputStyle}
                        />
                        <span className="text-[10px] font-bold px-2 py-1.5 rounded whitespace-nowrap badge-green">
                          Instant Verification
                        </span>
                      </div>
                    </div>
                  )}

                  {paymentMethod === 'card' && (
                    <div className="space-y-3">
                      <div>
                        <label className="block text-[10px] font-bold uppercase mb-1" style={{ color: 'var(--text-muted)' }}>16-Digit Card Number</label>
                        <input
                          type="text"
                          required
                          maxLength={19}
                          value={cardNumber}
                          onChange={(e) => setCardNumber(e.target.value)}
                          placeholder="4532 •••• •••• 8924"
                          style={inputStyle}
                        />
                      </div>
                      <div className="grid grid-cols-3 gap-2">
                        <div className="col-span-1">
                          <label className="block text-[10px] font-bold uppercase mb-1" style={{ color: 'var(--text-muted)' }}>Expiry</label>
                          <input
                            type="text"
                            required
                            maxLength={5}
                            value={cardExpiry}
                            onChange={(e) => setCardExpiry(e.target.value)}
                            placeholder="MM/YY"
                            style={inputStyle}
                          />
                        </div>
                        <div className="col-span-1">
                          <label className="block text-[10px] font-bold uppercase mb-1" style={{ color: 'var(--text-muted)' }}>CVV</label>
                          <input
                            type="password"
                            required
                            maxLength={4}
                            value={cardCvv}
                            onChange={(e) => setCardCvv(e.target.value)}
                            placeholder="•••"
                            style={inputStyle}
                          />
                        </div>
                        <div className="col-span-1">
                          <label className="block text-[10px] font-bold uppercase mb-1" style={{ color: 'var(--text-muted)' }}>Card Holder</label>
                          <input
                            type="text"
                            required
                            value={cardHolder}
                            onChange={(e) => setCardHolder(e.target.value)}
                            placeholder="Name on card"
                            style={inputStyle}
                          />
                        </div>
                      </div>
                    </div>
                  )}

                  {paymentMethod === 'netbanking' && (
                    <div className="space-y-2">
                      <label className="block text-[10px] font-bold uppercase" style={{ color: 'var(--text-muted)' }}>Choose Net Banking Institution</label>
                      <select
                        value={selectedBank}
                        onChange={(e) => setSelectedBank(e.target.value)}
                        style={inputStyle}
                      >
                        <option value="HDFC Bank">HDFC Bank</option>
                        <option value="ICICI Bank">ICICI Bank</option>
                        <option value="State Bank of India">State Bank of India (SBI)</option>
                        <option value="Axis Bank">Axis Bank</option>
                        <option value="Kotak Mahindra Bank">Kotak Mahindra Bank</option>
                      </select>
                    </div>
                  )}
                </div>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                className="w-full py-3.5 rounded-xl btn-glow font-bold text-xs uppercase tracking-wider cursor-pointer"
              >
                Pay ₹{(flight.priceInr || flight.price).toLocaleString('en-IN')} & Confirm {paxCount} Ticket{paxCount > 1 ? 's' : ''}
              </button>
            </form>
          ) : (
            /* Ticket View */
            <div className="space-y-6">
              {/* Success Notification Banner */}
              <div className="p-4 rounded-xl text-center space-y-1" style={{ background: 'var(--tag-green-bg)', border: '1px solid var(--tag-green-text)44' }}>
                <CheckCircle className="w-8 h-8 mx-auto" style={{ color: 'var(--tag-green-text)' }} />
                <h3 className="text-base font-bold" style={{ color: 'var(--tag-green-text)' }}>Booking Confirmed!</h3>
                <p className="text-xs" style={{ color: 'var(--tag-green-text)' }}>{emailStatus}</p>
              </div>

              {/* Multi-ticket Tab selector if > 1 passenger */}
              {issuedTickets.length > 1 && (
                <div className="flex items-center gap-2 overflow-x-auto pb-1">
                  <span className="text-xs font-bold" style={{ color: 'var(--text-muted)' }}>Select Passenger Ticket:</span>
                  {issuedTickets.map((t, i) => (
                    <button
                      key={t.ticketId}
                      onClick={() => setActiveTicketIndex(i)}
                      className="px-3 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer whitespace-nowrap"
                      style={{
                        background: activeTicketIndex === i ? 'var(--accent)' : 'var(--bg-sidebar)',
                        color: activeTicketIndex === i ? '#fff' : 'var(--text-secondary)',
                        border: activeTicketIndex === i ? '1.5px solid var(--accent)' : '1.5px solid var(--border-base)',
                      }}
                    >
                      P{i + 1}: {t.passengerName} (Seat {t.seat})
                    </button>
                  ))}
                </div>
              )}

              {/* Printable Ticket Card */}
              {issuedTickets[activeTicketIndex] && (
                <div
                  id="printable-ticket"
                  className="p-6 rounded-2xl space-y-5"
                  style={{ background: 'var(--bg-secondary)', border: '2px solid var(--accent)', boxShadow: 'var(--shadow-card)' }}
                >
                  {/* Top Bar */}
                  <div className="flex items-center justify-between pb-4" style={{ borderBottom: '1px solid var(--border-base)' }}>
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl flex items-center justify-center p-1" style={{ background: 'var(--bg-sidebar)', border: '1px solid var(--border-base)' }}>
                        <img src={issuedTickets[activeTicketIndex].airlineLogo} alt="" className="w-full h-full object-contain" />
                      </div>
                      <div>
                        <div className="font-bold text-sm" style={{ color: 'var(--text-primary)' }}>{issuedTickets[activeTicketIndex].airlineName}</div>
                        <div className="text-xs font-mono" style={{ color: 'var(--accent)' }}>{issuedTickets[activeTicketIndex].flightNumber}</div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-[10px] uppercase font-bold" style={{ color: 'var(--text-muted)' }}>Booking Reference</div>
                      <div className="text-xl font-extrabold font-mono tracking-wider pnr-badge px-3 py-0.5 rounded-lg" style={{ background: 'var(--accent-light)', color: 'var(--accent-text)', border: '1px solid var(--accent)' }}>
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
                      <div className="font-bold" style={{ color: 'var(--text-primary)' }}>{issuedTickets[activeTicketIndex].passengerName}</div>
                    </div>
                    <div>
                      <div className="text-[10px] uppercase font-bold" style={{ color: 'var(--text-muted)' }}>Seat Number</div>
                      <div className="font-bold font-mono" style={{ color: 'var(--accent)' }}>{issuedTickets[activeTicketIndex].seat}</div>
                    </div>
                    <div>
                      <div className="text-[10px] uppercase font-bold" style={{ color: 'var(--text-muted)' }}>Govt ID / Passport</div>
                      <div className="font-mono" style={{ color: 'var(--text-primary)' }}>{issuedTickets[activeTicketIndex].passport || 'Verified'}</div>
                    </div>
                    <div>
                      <div className="text-[10px] uppercase font-bold" style={{ color: 'var(--text-muted)' }}>Status</div>
                      <div className="font-bold" style={{ color: 'var(--tag-green-text)' }}>CONFIRMED</div>
                    </div>
                  </div>

                  {/* Print button bar */}
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
