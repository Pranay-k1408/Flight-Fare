import React from 'react';
import { X, Ticket, Plane, Printer, Search } from 'lucide-react';

export default function BookingsModal({ userBookings = [], onClose, onSearchNewFlight }) {
  const handlePrintSingleTicket = (pnr) => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 modal-overlay">
      <div
        className="w-full max-w-2xl rounded-2xl overflow-hidden shadow-2xl flex flex-col max-h-[90vh]"
        style={{ background: 'var(--bg-secondary)', border: '1.5px solid var(--border-base)' }}
      >
        {/* Header */}
        <div
          className="p-5 flex items-center justify-between"
          style={{ borderBottom: '1px solid var(--border-base)', background: 'var(--bg-sidebar)' }}
        >
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl" style={{ background: 'var(--accent-light)', color: 'var(--accent-text)' }}>
              <Ticket className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold font-sans-ui" style={{ color: 'var(--text-primary)' }}>
                My Confirmed Bookings & E-Tickets
              </h3>
              <p className="text-xs" style={{ color: 'var(--text-muted)' }}>
                Manage your active flight itineraries and boarding passes
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full flex items-center justify-center cursor-pointer transition-colors"
            style={{ background: 'var(--bg-input)', border: '1px solid var(--border-base)', color: 'var(--text-secondary)' }}
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto space-y-4">
          {userBookings.length === 0 ? (
            /* Empty State */
            <div className="py-12 px-6 text-center space-y-4">
              <div
                className="w-16 h-16 rounded-full flex items-center justify-center mx-auto"
                style={{ background: 'var(--accent-light)', color: 'var(--accent)' }}
              >
                <Ticket className="w-8 h-8" />
              </div>
              <div className="space-y-1">
                <h4 className="text-lg font-bold font-sans-ui" style={{ color: 'var(--text-primary)' }}>
                  No Active Flight Bookings Found
                </h4>
                <p className="text-xs max-w-sm mx-auto" style={{ color: 'var(--text-muted)' }}>
                  You haven't booked any flight tickets yet. Search available flights to book your first e-ticket with instant confirmation.
                </p>
              </div>
              <button
                onClick={() => {
                  onClose();
                  if (onSearchNewFlight) onSearchNewFlight();
                }}
                className="px-6 py-3 rounded-xl btn-glow font-bold text-xs uppercase tracking-wider inline-flex items-center gap-2 cursor-pointer"
              >
                <Search className="w-4 h-4" /> Search & Book Flights
              </button>
            </div>
          ) : (
            /* Active Confirmed Tickets */
            userBookings.map((b) => (
              <div
                key={b.pnr}
                id="printable-ticket"
                className="p-6 rounded-2xl space-y-4 relative shadow-sm"
                style={{ background: 'var(--bg-secondary)', border: '1.5px solid var(--border-base)' }}
              >
                <div className="flex items-center justify-between pb-3" style={{ borderBottom: '1px solid var(--border-base)' }}>
                  <div className="flex items-center gap-2">
                    <img src={b.airlineLogo} alt="" className="w-6 h-6 object-contain" />
                    <span className="font-bold text-sm" style={{ color: 'var(--text-primary)' }}>{b.airlineName} ({b.flightNumber})</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="pnr-badge text-xs font-mono font-bold px-2.5 py-0.5 rounded" style={{ background: 'var(--accent-light)', color: 'var(--accent-text)', border: '1px solid var(--accent)' }}>
                      PNR: {b.pnr}
                    </span>
                    <span className="text-[10px] uppercase font-extrabold px-2 py-0.5 rounded badge-green">
                      Confirmed
                    </span>
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-4 text-center p-3 rounded-xl" style={{ background: 'var(--bg-sidebar)' }}>
                  <div>
                    <div className="text-[10px] uppercase font-bold" style={{ color: 'var(--text-muted)' }}>Departure</div>
                    <div className="text-base font-bold" style={{ color: 'var(--text-primary)' }}>{b.depTime}</div>
                    <div className="text-xs font-bold" style={{ color: 'var(--accent)' }}>{b.origin}</div>
                  </div>
                  <div className="flex flex-col items-center justify-center">
                    <Plane className="w-4 h-4 rotate-90" style={{ color: 'var(--accent)' }} />
                  </div>
                  <div>
                    <div className="text-[10px] uppercase font-bold" style={{ color: 'var(--text-muted)' }}>Arrival</div>
                    <div className="text-base font-bold" style={{ color: 'var(--text-primary)' }}>{b.arrTime}</div>
                    <div className="text-xs font-bold" style={{ color: 'var(--accent)' }}>{b.destination}</div>
                  </div>
                </div>

                <div className="flex items-center justify-between text-xs pt-2">
                  <div>
                    <span style={{ color: 'var(--text-muted)' }}>Passenger: </span>
                    <span className="font-bold" style={{ color: 'var(--text-primary)' }}>{b.passengerName}</span>
                    <span style={{ color: 'var(--text-muted)' }}> • Seat: </span>
                    <span className="font-bold font-mono" style={{ color: 'var(--accent)' }}>{b.seat}</span>
                  </div>

                  <button
                    onClick={() => handlePrintSingleTicket(b.pnr)}
                    className="px-4 py-2 rounded-xl btn-glow text-xs font-bold flex items-center gap-1.5 cursor-pointer"
                  >
                    <Printer className="w-3.5 h-3.5" /> Print E-Ticket
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
