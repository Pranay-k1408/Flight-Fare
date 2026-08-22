import React, { useState, useEffect } from 'react';
import { 
  X, 
  ShieldCheck, 
  FileText, 
  Lock, 
  RefreshCw, 
  Search, 
  CheckCircle2, 
  AlertCircle, 
  ExternalLink,
  Download,
  Printer,
  ChevronRight
} from 'lucide-react';

export default function LegalModal({ initialTab = 'privacy', onClose }) {
  const [activeTab, setActiveTab] = useState(initialTab);
  const [searchQuery, setSearchQuery] = useState('');

  // Lock body scroll when modal is open
  useEffect(() => {
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, []);

  const tabs = [
    {
      id: 'privacy',
      label: 'Privacy Policy',
      icon: ShieldCheck,
      badge: 'Updated Aug 2026',
      summary: 'How we collect, encrypt, and safeguard your personal and booking data.'
    },
    {
      id: 'terms',
      label: 'Terms of Service',
      icon: FileText,
      badge: 'Binding Agreement',
      summary: 'Rules, user responsibilities, and conditions governing ticket bookings.'
    },
    {
      id: 'security',
      label: 'Security & Trust',
      icon: Lock,
      badge: 'IATA & PCI Certified',
      summary: '256-Bit SSL encryption, ISO/IEC 27001 data center, and payment safety.'
    },
    {
      id: 'refunds',
      label: 'Refund Policies',
      icon: RefreshCw,
      badge: 'Instant Processing',
      summary: 'Cancellation timelines, airline fare rules, and refund turnaround periods.'
    }
  ];

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-3 sm:p-6 overflow-hidden modal-overlay animate-fadeIn">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/60 backdrop-blur-md"
        onClick={onClose}
      />

      {/* Main Legal Window */}
      <div 
        className="relative w-full max-w-5xl h-[90vh] max-h-[820px] rounded-3xl flex flex-col overflow-hidden shadow-2xl transition-all duration-300 z-10"
        style={{
          background: 'var(--bg-secondary)',
          border: '1.5px solid var(--border-base)',
          boxShadow: 'var(--shadow-modal)',
          color: 'var(--text-primary)'
        }}
      >
        {/* Top Header */}
        <div 
          className="px-6 py-4 border-b flex items-center justify-between gap-4 flex-shrink-0"
          style={{ background: 'var(--bg-sidebar)', borderColor: 'var(--border-base)' }}
        >
          <div className="flex items-center gap-3">
            <div 
              className="w-10 h-10 rounded-xl flex items-center justify-center shadow-sm"
              style={{ background: 'var(--accent-light)', color: 'var(--accent)' }}
            >
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base font-extrabold font-sans-ui" style={{ color: 'var(--text-primary)' }}>
                  Skyward Global Compliance & Legal Center
                </h3>
                <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold uppercase tracking-wider badge-blue">
                  Official
                </span>
              </div>
              <p className="text-xs" style={{ color: 'var(--text-muted)' }}>
                Certified Global Air Travel Compliance · Version 3.4
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => window.print()}
              title="Print document"
              className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold cursor-pointer transition-all hover:bg-slate-500/10"
              style={{ border: '1px solid var(--border-base)', color: 'var(--text-secondary)' }}
            >
              <Printer className="w-3.5 h-3.5" />
              <span>Print</span>
            </button>

            <button
              onClick={onClose}
              className="w-9 h-9 rounded-xl flex items-center justify-center transition-all cursor-pointer hover:bg-red-500/10 hover:text-red-500"
              style={{ background: 'var(--bg-card)', border: '1px solid var(--border-base)', color: 'var(--text-muted)' }}
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Content Layout: Left Nav + Right Document */}
        <div className="flex-1 flex flex-col md:flex-row overflow-hidden">
          
          {/* Left Navigation Sidebar */}
          <div 
            className="w-full md:w-72 border-b md:border-b-0 md:border-r p-4 flex flex-col gap-2 flex-shrink-0"
            style={{ background: 'var(--bg-sidebar)', borderColor: 'var(--border-base)' }}
          >
            {/* Search filter within legal terms */}
            <div className="relative mb-2">
              <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2" style={{ color: 'var(--text-muted)' }} />
              <input
                type="text"
                placeholder="Search legal clauses..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-8 pr-3 py-1.5 text-xs rounded-xl focus:outline-none transition-all"
                style={{
                  background: 'var(--bg-input)',
                  border: '1px solid var(--border-base)',
                  color: 'var(--text-primary)'
                }}
              />
            </div>

            {/* Tab buttons */}
            <div className="flex md:flex-col gap-1.5 overflow-x-auto md:overflow-visible pb-1 md:pb-0">
              {tabs.map((tab) => {
                const Icon = tab.icon;
                const isActive = activeTab === tab.id;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className="flex-1 md:flex-initial flex items-center justify-between p-3 rounded-2xl text-left transition-all cursor-pointer group flex-shrink-0"
                    style={{
                      background: isActive ? 'var(--accent-light)' : 'transparent',
                      border: isActive ? '1.5px solid var(--accent)' : '1.5px solid transparent',
                      color: isActive ? 'var(--accent)' : 'var(--text-secondary)'
                    }}
                  >
                    <div className="flex items-center gap-3">
                      <div 
                        className="w-8 h-8 rounded-lg flex items-center justify-center transition-transform group-hover:scale-105"
                        style={{
                          background: isActive ? 'var(--accent)' : 'var(--bg-card)',
                          color: isActive ? '#ffffff' : 'var(--text-secondary)'
                        }}
                      >
                        <Icon className="w-4 h-4" />
                      </div>
                      <div>
                        <div className="text-xs font-bold font-sans-ui" style={{ color: isActive ? 'var(--accent)' : 'var(--text-primary)' }}>
                          {tab.label}
                        </div>
                        <div className="text-[10px] hidden md:block" style={{ color: 'var(--text-muted)' }}>
                          {tab.badge}
                        </div>
                      </div>
                    </div>

                    <ChevronRight 
                      className={`w-4 h-4 hidden md:block transition-transform ${isActive ? 'translate-x-0.5' : 'opacity-40'}`} 
                    />
                  </button>
                );
              })}
            </div>

            {/* Trust Accreditation Box */}
            <div 
              className="mt-auto hidden md:block p-3.5 rounded-2xl border text-xs space-y-1.5"
              style={{ background: 'var(--bg-card)', borderColor: 'var(--border-base)' }}
            >
              <div className="flex items-center gap-1.5 text-[11px] font-bold" style={{ color: 'var(--tag-green-text)' }}>
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span>Audited Compliance 2026</span>
              </div>
              <p className="text-[10px] leading-relaxed" style={{ color: 'var(--text-muted)' }}>
                Skyward Global is registered and audited under International Air Transport Association (IATA Code: 4920194).
              </p>
            </div>
          </div>

          {/* Right Document Content */}
          <div 
            className="flex-1 p-6 md:p-8 overflow-y-auto custom-scrollbar space-y-6"
            style={{ background: 'var(--bg-primary)' }}
          >
            {activeTab === 'privacy' && (
              <div className="space-y-6 animate-fadeIn">
                <div className="border-b pb-4" style={{ borderColor: 'var(--border-base)' }}>
                  <span className="text-[11px] font-mono font-bold uppercase tracking-wider badge-blue">Data Protection & Privacy</span>
                  <h2 className="text-2xl font-black mt-2 font-sans-ui" style={{ color: 'var(--text-primary)' }}>
                    Skyward Global Privacy & Data Governance Policy
                  </h2>
                  <p className="text-xs mt-1" style={{ color: 'var(--text-muted)' }}>
                    Last reviewed and legally binding as of August 22, 2026.
                  </p>
                </div>

                {/* Section 1 */}
                <div className="space-y-2">
                  <h4 className="text-sm font-extrabold uppercase tracking-wide flex items-center gap-2" style={{ color: 'var(--accent)' }}>
                    1. Information We Collect
                  </h4>
                  <p className="text-xs leading-relaxed" style={{ color: 'var(--text-secondary)' }}>
                    When you search, reserve, or book air travel through Skyward Global, we collect required passport/government ID names, contact email addresses, mobile phone numbers, seat allocation preferences, and secure payment identifiers. All personal data is processed strictly for airline ticketing, border manifest regulations, and mandatory passenger notifications.
                  </p>
                </div>

                {/* Section 2 */}
                <div className="space-y-2">
                  <h4 className="text-sm font-extrabold uppercase tracking-wide flex items-center gap-2" style={{ color: 'var(--accent)' }}>
                    2. 256-Bit Cryptographic Storage & Encryption
                  </h4>
                  <p className="text-xs leading-relaxed" style={{ color: 'var(--text-secondary)' }}>
                    All sensitive user credentials, OTP security tokens, and transaction payload records are encrypted at rest using AES-256 GCM encryption and transmitted over TLS 1.3 encrypted secure sockets. Authentication tokens expire automatically, and temporary verification OTPs are permanently purged from database registers after 5 minutes.
                  </p>
                </div>

                {/* Section 3 */}
                <div className="space-y-2">
                  <h4 className="text-sm font-extrabold uppercase tracking-wide flex items-center gap-2" style={{ color: 'var(--accent)' }}>
                    3. Global Distribution Systems (GDS) & Airline Data Exchange
                  </h4>
                  <p className="text-xs leading-relaxed" style={{ color: 'var(--text-secondary)' }}>
                    To issue valid electronic boarding passes and PNR reservations, required passenger details are transmitted directly to verified carrier partner engines (including Air India, IndiGo, British Airways, Emirates, and Vistara) through encrypted IATA-standard NDC and GDS gateways. We never sell, rent, or lease traveler data to third-party advertisers.
                  </p>
                </div>

                {/* Section 4 */}
                <div className="space-y-2">
                  <h4 className="text-sm font-extrabold uppercase tracking-wide flex items-center gap-2" style={{ color: 'var(--accent)' }}>
                    4. Your Data Rights & Deletion
                  </h4>
                  <p className="text-xs leading-relaxed" style={{ color: 'var(--text-secondary)' }}>
                    In accordance with GDPR, CCPA, and India Digital Personal Data Protection (DPDP) Act 2023, travelers retain full rights to request an encrypted export of their flight booking records or permanently delete their user profile by contacting privacy@skywardglobal.com.
                  </p>
                </div>
              </div>
            )}

            {activeTab === 'terms' && (
              <div className="space-y-6 animate-fadeIn">
                <div className="border-b pb-4" style={{ borderColor: 'var(--border-base)' }}>
                  <span className="text-[11px] font-mono font-bold uppercase tracking-wider badge-purple">Legal Agreement</span>
                  <h2 className="text-2xl font-black mt-2 font-sans-ui" style={{ color: 'var(--text-primary)' }}>
                    Terms of Service & Passenger Agreement
                  </h2>
                  <p className="text-xs mt-1" style={{ color: 'var(--text-muted)' }}>
                    Governing all reservations made via the Skyward Global booking portal.
                  </p>
                </div>

                {/* Terms 1 */}
                <div className="space-y-2">
                  <h4 className="text-sm font-extrabold uppercase tracking-wide flex items-center gap-2" style={{ color: 'var(--accent)' }}>
                    1. Booking Authenticity & Passenger Identification
                  </h4>
                  <p className="text-xs leading-relaxed" style={{ color: 'var(--text-secondary)' }}>
                    By completing a reservation, the user certifies that all passenger names, government-issued IDs, and date-of-birth records correspond exactly with physical travel documents (Passport/Aadhaar/National ID). Discrepancies may result in airline boarding denial at airport check-in without aggregator liability.
                  </p>
                </div>

                {/* Terms 2 */}
                <div className="space-y-2">
                  <h4 className="text-sm font-extrabold uppercase tracking-wide flex items-center gap-2" style={{ color: 'var(--accent)' }}>
                    2. Fare Volatility & Instant Ticket Confirmation
                  </h4>
                  <p className="text-xs leading-relaxed" style={{ color: 'var(--text-secondary)' }}>
                    Flight fares and seat inventory fluctuate in real-time according to airline dynamic pricing algorithms. A fare is only guaranteed once a transaction successfully clears and a unique 6-character PNR (Passenger Name Record) is officially issued.
                  </p>
                </div>

                {/* Terms 3 */}
                <div className="space-y-2">
                  <h4 className="text-sm font-extrabold uppercase tracking-wide flex items-center gap-2" style={{ color: 'var(--accent)' }}>
                    3. Schedule Changes, Delays & Carrier Cancellations
                  </h4>
                  <p className="text-xs leading-relaxed" style={{ color: 'var(--text-secondary)' }}>
                    Airlines reserve the right to modify flight schedules, gate assignments, or cancel flights due to weather, air traffic control directives, or technical maintenance. Skyward Global will provide automated SMS and email notifications, while refund or rebooking alternatives follow carrier terms.
                  </p>
                </div>
              </div>
            )}

            {activeTab === 'security' && (
              <div className="space-y-6 animate-fadeIn">
                <div className="border-b pb-4" style={{ borderColor: 'var(--border-base)' }}>
                  <span className="text-[11px] font-mono font-bold uppercase tracking-wider badge-green">Enterprise Protection</span>
                  <h2 className="text-2xl font-black mt-2 font-sans-ui" style={{ color: 'var(--text-primary)' }}>
                    Security Infrastructure & Trust Framework
                  </h2>
                  <p className="text-xs mt-1" style={{ color: 'var(--text-muted)' }}>
                    Bank-grade security protocols safeguarding 100% of flight transactions.
                  </p>
                </div>

                {/* Grid of Security Cards */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                  <div className="p-4 rounded-2xl border" style={{ background: 'var(--bg-secondary)', borderColor: 'var(--border-base)' }}>
                    <div className="w-8 h-8 rounded-lg flex items-center justify-center mb-2" style={{ background: 'var(--tag-green-bg)', color: 'var(--tag-green-text)' }}>
                      <Lock className="w-4 h-4" />
                    </div>
                    <h5 className="font-extrabold text-sm" style={{ color: 'var(--text-primary)' }}>PCI-DSS Level 1 Compliant</h5>
                    <p className="text-xs mt-1 leading-relaxed" style={{ color: 'var(--text-muted)' }}>
                      All card transactions, UPI tokens, and net banking interactions bypass unencrypted servers and pass through audited payment gateways.
                    </p>
                  </div>

                  <div className="p-4 rounded-2xl border" style={{ background: 'var(--bg-secondary)', borderColor: 'var(--border-base)' }}>
                    <div className="w-8 h-8 rounded-lg flex items-center justify-center mb-2" style={{ background: 'var(--accent-light)', color: 'var(--accent)' }}>
                      <ShieldCheck className="w-4 h-4" />
                    </div>
                    <h5 className="font-extrabold text-sm" style={{ color: 'var(--text-primary)' }}>2FA Phone & Email Verification</h5>
                    <p className="text-xs mt-1 leading-relaxed" style={{ color: 'var(--text-muted)' }}>
                      Multi-factor authentication powered by Twilio Verify and enterprise SMTP ensures only authorized travelers access booked PNRs.
                    </p>
                  </div>
                </div>

                <div className="space-y-2">
                  <h4 className="text-sm font-extrabold uppercase tracking-wide flex items-center gap-2" style={{ color: 'var(--accent)' }}>
                    Data Center & Cloud Security
                  </h4>
                  <p className="text-xs leading-relaxed" style={{ color: 'var(--text-secondary)' }}>
                    Hosted in Tier-IV ISO/IEC 27001 certified AWS cloud infrastructure with real-time DDoS mitigation, continuous automated vulnerability scans, and 99.99% uptime SLAs.
                  </p>
                </div>
              </div>
            )}

            {activeTab === 'refunds' && (
              <div className="space-y-6 animate-fadeIn">
                <div className="border-b pb-4" style={{ borderColor: 'var(--border-base)' }}>
                  <span className="text-[11px] font-mono font-bold uppercase tracking-wider badge-orange">Customer Protection</span>
                  <h2 className="text-2xl font-black mt-2 font-sans-ui" style={{ color: 'var(--text-primary)' }}>
                    Cancellations, Rescheduling & Refund Policies
                  </h2>
                  <p className="text-xs mt-1" style={{ color: 'var(--text-muted)' }}>
                    Transparent fare rules and automated refund processing turnaround.
                  </p>
                </div>

                {/* Refund Steps Table */}
                <div 
                  className="rounded-2xl border overflow-hidden"
                  style={{ background: 'var(--bg-secondary)', borderColor: 'var(--border-base)' }}
                >
                  <table className="w-full text-left text-xs border-collapse">
                    <thead>
                      <tr className="border-b" style={{ background: 'var(--bg-sidebar)', borderColor: 'var(--border-base)' }}>
                        <th className="p-3 font-bold">Cancellation Window</th>
                        <th className="p-3 font-bold">Airline Fee</th>
                        <th className="p-3 font-bold">Refund Processing Time</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y" style={{ borderColor: 'var(--border-base)' }}>
                      <tr>
                        <td className="p-3 font-semibold">&gt; 72 Hours Before Departure</td>
                        <td className="p-3 text-emerald-500 font-bold">Standard Carrier Rule</td>
                        <td className="p-3 font-mono">24 – 48 Hours</td>
                      </tr>
                      <tr>
                        <td className="p-3 font-semibold">24 to 72 Hours Before Departure</td>
                        <td className="p-3 text-amber-500 font-bold">Tiered Airline Fee</td>
                        <td className="p-3 font-mono">2 – 3 Business Days</td>
                      </tr>
                      <tr>
                        <td className="p-3 font-semibold">&lt; 24 Hours or No-Show</td>
                        <td className="p-3 text-rose-500 font-bold">Non-Refundable Base / Taxes Only</td>
                        <td className="p-3 font-mono">3 – 5 Business Days</td>
                      </tr>
                    </tbody>
                  </table>
                </div>

                <div className="space-y-2">
                  <h4 className="text-sm font-extrabold uppercase tracking-wide flex items-center gap-2" style={{ color: 'var(--accent)' }}>
                    Automated Instant Refund Dispatch
                  </h4>
                  <p className="text-xs leading-relaxed" style={{ color: 'var(--text-secondary)' }}>
                    Approved refund balances are credited back to the original source payment method (UPI account, Credit/Debit card, or Net Banking) without manual follow-up required.
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Modal Bottom Action Bar */}
        <div 
          className="px-6 py-3.5 border-t flex flex-col sm:flex-row items-center justify-between gap-3 text-xs flex-shrink-0"
          style={{ background: 'var(--bg-sidebar)', borderColor: 'var(--border-base)' }}
        >
          <div className="flex items-center gap-2 text-[11px]" style={{ color: 'var(--text-muted)' }}>
            <span>Need specialized legal or corporate travel support?</span>
            <a href="mailto:support@skywardglobal.com" className="font-bold underline" style={{ color: 'var(--accent)' }}>
              Contact Legal Desk
            </a>
          </div>

          <button
            onClick={onClose}
            className="btn-glow px-6 py-2 rounded-xl text-xs font-bold uppercase tracking-wider cursor-pointer"
          >
            I Understand & Accept
          </button>
        </div>
      </div>
    </div>
  );
}
