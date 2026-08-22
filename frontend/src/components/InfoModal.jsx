import React, { useState, useEffect } from 'react';
import { 
  X, 
  Building2, 
  HelpCircle, 
  Briefcase, 
  Newspaper, 
  BookOpen, 
  TrendingUp, 
  PhoneCall, 
  Luggage, 
  Compass, 
  AlertTriangle, 
  Send, 
  CheckCircle2, 
  Gift, 
  QrCode, 
  Smartphone, 
  CreditCard, 
  Copy, 
  ExternalLink,
  ChevronDown,
  ChevronUp,
  Search,
  Users
} from 'lucide-react';

export default function InfoModal({ initialSection = 'about', onClose, onOpenLegal, user }) {
  const [activeSection, setActiveSection] = useState(initialSection);
  const [searchQuery, setSearchQuery] = useState('');
  const [copiedReferral, setCopiedReferral] = useState(false);
  const [openFaq, setOpenFaq] = useState(0);
  const [issueSubmitted, setIssueSubmitted] = useState(false);
  const [issueForm, setIssueForm] = useState({ name: user?.name || '', email: user?.email || '', pnr: '', category: 'Booking', message: '' });
  const [appPhone, setAppPhone] = useState(user?.phone || '');
  const [appLinkSent, setAppLinkSent] = useState(false);

  useEffect(() => {
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, []);

  const referralCode = user?.id ? `SKY-${user.id.substring(0, 6).toUpperCase()}` : 'SKY-TRAVEL2026';

  const handleCopyReferral = () => {
    navigator.clipboard.writeText(`https://skywardglobal.com/join?ref=${referralCode}`);
    setCopiedReferral(true);
    setTimeout(() => setCopiedReferral(false), 3000);
  };

  const handleSendAppLink = (e) => {
    e.preventDefault();
    if (appPhone.trim()) {
      setAppLinkSent(true);
      setTimeout(() => setAppLinkSent(false), 5000);
    }
  };

  const handleIssueSubmit = (e) => {
    e.preventDefault();
    if (issueForm.message.trim()) {
      setIssueSubmitted(true);
    }
  };

  const faqs = [
    {
      q: 'How do I receive my confirmed e-ticket and boarding pass?',
      a: 'Immediately upon completing payment, your official PDF electronic ticket and boarding pass with barcode/QR code are generated and delivered to your registered email address. You can also view and download it anytime from the "My Bookings" tab.'
    },
    {
      q: 'Can I change my flight date or seat after booking?',
      a: 'Yes! You can reschedule your flight or change your seat allocation through the "My Bookings" tab up to 4 hours before scheduled departure, subject to carrier fare rules.'
    },
    {
      q: 'What is the standard baggage allowance for domestic and international flights?',
      a: 'For domestic flights within India (IndiGo, Air India, Vistara), standard allowance is 7 kg Cabin Baggage + 15 kg Check-in. For international routes (DEL-LHR, DEL-DXB, DEL-JFK), check-in allowance ranges from 23 kg to 2x 23 kg pieces depending on cabin class.'
    },
    {
      q: 'How long do flight cancellation refunds take to process?',
      a: 'Refunds initiated through Skyward Global are automatically processed back to your original payment method (UPI account or Card) within 24 to 48 hours.'
    },
    {
      q: 'What travel documents do I need for airport web check-in?',
      a: 'For domestic travel, a government photo ID (Aadhaar Card, Passport, Voter ID, or Driving License) is required. For international flights, a valid Passport (with minimum 6 months validity) and relevant destination Visas are mandatory.'
    }
  ];

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-3 sm:p-6 overflow-hidden modal-overlay animate-fadeIn">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/60 backdrop-blur-md"
        onClick={onClose}
      />

      {/* Main Container */}
      <div 
        className="relative w-full max-w-5xl h-[90vh] max-h-[820px] rounded-3xl flex flex-col overflow-hidden shadow-2xl transition-all duration-300 z-10 font-sans-ui"
        style={{
          background: 'var(--bg-secondary)',
          border: '1.5px solid var(--border-base)',
          boxShadow: 'var(--shadow-modal)',
          color: 'var(--text-primary)'
        }}
      >
        {/* Header */}
        <div 
          className="px-6 py-4 border-b flex items-center justify-between gap-4 flex-shrink-0"
          style={{ background: 'var(--bg-sidebar)', borderColor: 'var(--border-base)' }}
        >
          <div className="flex items-center gap-3">
            <div 
              className="w-10 h-10 rounded-xl flex items-center justify-center shadow-sm"
              style={{ background: '#2563eb', color: '#ffffff' }}
            >
              <Building2 className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base font-extrabold" style={{ color: 'var(--text-primary)' }}>
                  Skyward Global Information & Support Hub
                </h3>
                <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold uppercase tracking-wider badge-blue">
                  Live Center
                </span>
              </div>
              <p className="text-xs" style={{ color: 'var(--text-muted)' }}>
                Official Travel Guides, Company Portals, and Customer Services
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="w-9 h-9 rounded-xl flex items-center justify-center transition-all cursor-pointer hover:bg-red-500/10 hover:text-red-500"
            style={{ background: 'var(--bg-card)', border: '1px solid var(--border-base)', color: 'var(--text-muted)' }}
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body Layout */}
        <div className="flex-1 flex flex-col md:flex-row overflow-hidden">
          
          {/* Sidebar Nav */}
          <div 
            className="w-full md:w-64 border-b md:border-b-0 md:border-r p-3.5 flex flex-col gap-1.5 flex-shrink-0 overflow-y-auto"
            style={{ background: 'var(--bg-sidebar)', borderColor: 'var(--border-base)' }}
          >
            <div className="text-[10px] font-bold uppercase tracking-wider px-2 pt-1 pb-1" style={{ color: 'var(--text-muted)' }}>
              Company & Media
            </div>
            {[
              { id: 'about', label: 'About Us', icon: Building2 },
              { id: 'careers', label: 'Careers & Jobs', icon: Briefcase },
              { id: 'press', label: 'Press & Media', icon: Newspaper },
              { id: 'blog', label: 'Travel Blog & Guides', icon: BookOpen },
              { id: 'investors', label: 'Investor Relations', icon: TrendingUp },
              { id: 'contact', label: 'Contact & Offices', icon: PhoneCall },
            ].map(item => {
              const Icon = item.icon;
              const isActive = activeSection === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => setActiveSection(item.id)}
                  className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-left text-xs font-semibold transition-all cursor-pointer"
                  style={{
                    background: isActive ? 'var(--accent-light)' : 'transparent',
                    border: isActive ? '1.5px solid var(--accent)' : '1.5px solid transparent',
                    color: isActive ? 'var(--accent)' : 'var(--text-secondary)'
                  }}
                >
                  <Icon className="w-4 h-4 flex-shrink-0" />
                  <span>{item.label}</span>
                </button>
              );
            })}

            <div className="text-[10px] font-bold uppercase tracking-wider px-2 pt-3 pb-1" style={{ color: 'var(--text-muted)' }}>
              Customer Support
            </div>
            {[
              { id: 'help', label: 'Help Center', icon: HelpCircle },
              { id: 'faqs', label: 'Frequently Asked Questions', icon: BookOpen },
              { id: 'booking-guide', label: 'Booking Guide', icon: Compass },
              { id: 'baggage', label: 'Baggage Allowance Policy', icon: Luggage },
              { id: 'travel-advisory', label: 'Travel Advisory & Visas', icon: Compass },
              { id: 'report-issue', label: 'Report an Issue / Ticket', icon: AlertTriangle },
            ].map(item => {
              const Icon = item.icon;
              const isActive = activeSection === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => setActiveSection(item.id)}
                  className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-left text-xs font-semibold transition-all cursor-pointer"
                  style={{
                    background: isActive ? 'var(--accent-light)' : 'transparent',
                    border: isActive ? '1.5px solid var(--accent)' : '1.5px solid transparent',
                    color: isActive ? 'var(--accent)' : 'var(--text-secondary)'
                  }}
                >
                  <Icon className="w-4 h-4 flex-shrink-0" />
                  <span>{item.label}</span>
                </button>
              );
            })}

            <div className="text-[10px] font-bold uppercase tracking-wider px-2 pt-3 pb-1" style={{ color: 'var(--text-muted)' }}>
              Promos & Mobile App
            </div>
            {[
              { id: 'refer', label: 'Refer & Earn (₹1,500)', icon: Gift },
              { id: 'apps', label: 'Download Mobile App', icon: Smartphone },
              { id: 'payments', label: 'Payment Options & EMI', icon: CreditCard },
            ].map(item => {
              const Icon = item.icon;
              const isActive = activeSection === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => setActiveSection(item.id)}
                  className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-left text-xs font-semibold transition-all cursor-pointer"
                  style={{
                    background: isActive ? 'var(--accent-light)' : 'transparent',
                    border: isActive ? '1.5px solid var(--accent)' : '1.5px solid transparent',
                    color: isActive ? 'var(--accent)' : 'var(--text-secondary)'
                  }}
                >
                  <Icon className="w-4 h-4 flex-shrink-0" />
                  <span>{item.label}</span>
                </button>
              );
            })}
          </div>

          {/* Main Content Area */}
          <div 
            className="flex-1 p-6 md:p-8 overflow-y-auto custom-scrollbar space-y-6"
            style={{ background: 'var(--bg-primary)' }}
          >
            {/* ABOUT US */}
            {activeSection === 'about' && (
              <div className="space-y-6 animate-fadeIn">
                <div className="border-b pb-4" style={{ borderColor: 'var(--border-base)' }}>
                  <span className="text-[11px] font-mono font-bold uppercase tracking-wider badge-blue">About Skyward Global</span>
                  <h2 className="text-2xl font-black mt-2 font-sans-ui" style={{ color: 'var(--text-primary)' }}>
                    Pioneering Next-Generation Flight Booking
                  </h2>
                  <p className="text-xs mt-1" style={{ color: 'var(--text-muted)' }}>
                    Founded in 2026, Skyward Global connects millions of passengers with 500+ airlines worldwide.
                  </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div className="p-4 rounded-2xl border text-center" style={{ background: 'var(--bg-secondary)', borderColor: 'var(--border-base)' }}>
                    <div className="text-2xl font-black text-blue-500 font-mono">500+</div>
                    <div className="text-xs font-bold mt-1" style={{ color: 'var(--text-primary)' }}>Partner Airlines</div>
                    <div className="text-[11px] mt-0.5" style={{ color: 'var(--text-muted)' }}>Global GDS Integration</div>
                  </div>
                  <div className="p-4 rounded-2xl border text-center" style={{ background: 'var(--bg-secondary)', borderColor: 'var(--border-base)' }}>
                    <div className="text-2xl font-black text-emerald-500 font-mono">2.4M+</div>
                    <div className="text-xs font-bold mt-1" style={{ color: 'var(--text-primary)' }}>Tickets Issued</div>
                    <div className="text-[11px] mt-0.5" style={{ color: 'var(--text-muted)' }}>100% Verified PNRs</div>
                  </div>
                  <div className="p-4 rounded-2xl border text-center" style={{ background: 'var(--bg-secondary)', borderColor: 'var(--border-base)' }}>
                    <div className="text-2xl font-black text-indigo-500 font-mono">99.98%</div>
                    <div className="text-xs font-bold mt-1" style={{ color: 'var(--text-primary)' }}>Uptime SLA</div>
                    <div className="text-[11px] mt-0.5" style={{ color: 'var(--text-muted)' }}>Real-Time Pricing Engine</div>
                  </div>
                </div>

                <div className="space-y-3 text-xs leading-relaxed" style={{ color: 'var(--text-secondary)' }}>
                  <p>
                    Skyward Global was built with a singular vision: to make global air travel transparent, instantaneous, and stress-free. By aggregating direct GDS feeds from IATA carriers and applying real-time price trend prediction models, we empower travelers to secure the lowest guaranteed fares on domestic and international routes.
                  </p>
                </div>
              </div>
            )}

            {/* CAREERS */}
            {activeSection === 'careers' && (
              <div className="space-y-6 animate-fadeIn">
                <div className="border-b pb-4" style={{ borderColor: 'var(--border-base)' }}>
                  <span className="text-[11px] font-mono font-bold uppercase tracking-wider badge-purple">We Are Hiring</span>
                  <h2 className="text-2xl font-black mt-2 font-sans-ui" style={{ color: 'var(--text-primary)' }}>
                    Join the Team Shaping the Future of Aviation Tech
                  </h2>
                  <p className="text-xs mt-1" style={{ color: 'var(--text-muted)' }}>
                    Explore open roles in Engineering, Flight Operations, Product, and 24/7 Support.
                  </p>
                </div>

                <div className="space-y-3">
                  {[
                    { title: 'Senior Backend Engineer (Node.js & MongoDB)', team: 'Core Platform', location: 'New Delhi / Remote', type: 'Full-Time' },
                    { title: 'Flight GDS & NDC Protocol Specialist', team: 'Aviation Integrations', location: 'Bengaluru / Hybrid', type: 'Full-Time' },
                    { title: 'UI/UX Product Designer', team: 'Design Systems', location: 'Remote Global', type: 'Full-Time' },
                    { title: 'Customer Success & Ticketing Specialist', team: '24/7 Operations', location: 'Mumbai / Office', type: 'Full-Time' },
                  ].map((job, idx) => (
                    <div key={idx} className="p-4 rounded-2xl border flex items-center justify-between gap-4 transition-all hover:border-blue-500/50" style={{ background: 'var(--bg-secondary)', borderColor: 'var(--border-base)' }}>
                      <div>
                        <div className="text-sm font-bold" style={{ color: 'var(--text-primary)' }}>{job.title}</div>
                        <div className="text-xs mt-0.5" style={{ color: 'var(--text-muted)' }}>{job.team} • {job.location} • <span className="font-semibold text-blue-500">{job.type}</span></div>
                      </div>
                      <button 
                        onClick={() => alert(`Application submitted for ${job.title}! Our recruitment team will review your profile.`)}
                        className="btn-glow px-4 py-1.5 rounded-xl text-xs font-bold uppercase tracking-wider cursor-pointer flex-shrink-0"
                      >
                        Apply Now
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* PRESS & MEDIA */}
            {activeSection === 'press' && (
              <div className="space-y-6 animate-fadeIn">
                <div className="border-b pb-4" style={{ borderColor: 'var(--border-base)' }}>
                  <span className="text-[11px] font-mono font-bold uppercase tracking-wider badge-blue">Newsroom</span>
                  <h2 className="text-2xl font-black mt-2 font-sans-ui" style={{ color: 'var(--text-primary)' }}>
                    Press Releases & Industry Announcements
                  </h2>
                </div>

                <div className="space-y-4">
                  {[
                    { date: 'August 2026', title: 'Skyward Global Expands Direct Non-Stop Connectivity on London (LHR) & Dubai (DXB) Routes', tag: 'Network Expansion' },
                    { date: 'July 2026', title: 'Official Launch of AI-Powered 7-Day Flexible Fare Prediction Engine with 98% Price Accuracy', tag: 'Product Launch' },
                    { date: 'May 2026', title: 'Skyward Global Receives Full IATA & ISO/IEC 27001 Security Certification for Electronic Ticketing', tag: 'Security & Compliance' }
                  ].map((news, idx) => (
                    <div key={idx} className="p-4 rounded-2xl border space-y-1.5" style={{ background: 'var(--bg-secondary)', borderColor: 'var(--border-base)' }}>
                      <div className="flex items-center gap-2">
                        <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded badge-blue">{news.tag}</span>
                        <span className="text-xs" style={{ color: 'var(--text-muted)' }}>{news.date}</span>
                      </div>
                      <h4 className="text-sm font-bold leading-snug" style={{ color: 'var(--text-primary)' }}>{news.title}</h4>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* BLOG & GUIDES */}
            {activeSection === 'blog' && (
              <div className="space-y-6 animate-fadeIn">
                <div className="border-b pb-4" style={{ borderColor: 'var(--border-base)' }}>
                  <span className="text-[11px] font-mono font-bold uppercase tracking-wider badge-orange">Travel Inspiration</span>
                  <h2 className="text-2xl font-black mt-2 font-sans-ui" style={{ color: 'var(--text-primary)' }}>
                    Skyward Travel Blog & Pro Flight Tips
                  </h2>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {[
                    { title: 'How to Save up to 35% on International Flights by Booking on Tuesday Afternoons', tag: 'Smart Booking' },
                    { title: 'Top 10 Hidden Gem Destinations from Delhi (DEL) Under ₹5,000 Fares', tag: 'Weekend Getaways' },
                    { title: 'Complete Guide to Airport Security Fast-Track & Terminal Navigation in 2026', tag: 'Airport Tips' },
                    { title: 'Carry-on vs Check-in Baggage: Everything You Need to Know Before Flying', tag: 'Baggage Guide' }
                  ].map((post, idx) => (
                    <div key={idx} className="p-4 rounded-2xl border space-y-2 flex flex-col justify-between" style={{ background: 'var(--bg-secondary)', borderColor: 'var(--border-base)' }}>
                      <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded badge-blue w-fit">{post.tag}</span>
                      <h4 className="text-sm font-bold leading-snug" style={{ color: 'var(--text-primary)' }}>{post.title}</h4>
                      <button onClick={() => alert('Full blog article loaded!')} className="text-xs font-bold text-blue-500 hover:underline flex items-center gap-1 cursor-pointer pt-2">
                        Read Full Story →
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* INVESTOR RELATIONS */}
            {activeSection === 'investors' && (
              <div className="space-y-6 animate-fadeIn">
                <div className="border-b pb-4" style={{ borderColor: 'var(--border-base)' }}>
                  <span className="text-[11px] font-mono font-bold uppercase tracking-wider badge-green">Investor Relations</span>
                  <h2 className="text-2xl font-black mt-2 font-sans-ui" style={{ color: 'var(--text-primary)' }}>
                    Financial Performance & Growth Metrics
                  </h2>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div className="p-4 rounded-2xl border text-center" style={{ background: 'var(--bg-secondary)', borderColor: 'var(--border-base)' }}>
                    <div className="text-2xl font-black text-emerald-500 font-mono">+184%</div>
                    <div className="text-xs font-bold mt-1" style={{ color: 'var(--text-primary)' }}>YoY GMV Growth</div>
                  </div>
                  <div className="p-4 rounded-2xl border text-center" style={{ background: 'var(--bg-secondary)', borderColor: 'var(--border-base)' }}>
                    <div className="text-2xl font-black text-blue-500 font-mono">140+</div>
                    <div className="text-xs font-bold mt-1" style={{ color: 'var(--text-primary)' }}>Direct Airport Hubs</div>
                  </div>
                  <div className="p-4 rounded-2xl border text-center" style={{ background: 'var(--bg-secondary)', borderColor: 'var(--border-base)' }}>
                    <div className="text-2xl font-black text-purple-500 font-mono">$120M+</div>
                    <div className="text-xs font-bold mt-1" style={{ color: 'var(--text-primary)' }}>Annual Booking Volume</div>
                  </div>
                </div>
              </div>
            )}

            {/* CONTACT US */}
            {activeSection === 'contact' && (
              <div className="space-y-6 animate-fadeIn">
                <div className="border-b pb-4" style={{ borderColor: 'var(--border-base)' }}>
                  <span className="text-[11px] font-mono font-bold uppercase tracking-wider badge-blue">Global Offices & Help Desk</span>
                  <h2 className="text-2xl font-black mt-2 font-sans-ui" style={{ color: 'var(--text-primary)' }}>
                    We Are Available 24/7 Across All Continents
                  </h2>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div className="p-4 rounded-2xl border space-y-1" style={{ background: 'var(--bg-secondary)', borderColor: 'var(--border-base)' }}>
                    <div className="text-xs font-bold text-blue-500">🇮🇳 India Headquarters</div>
                    <div className="text-sm font-bold" style={{ color: 'var(--text-primary)' }}>New Delhi Airport Hub</div>
                    <div className="text-xs font-mono pt-1" style={{ color: 'var(--text-muted)' }}>+91 (011) 4920-8000</div>
                    <div className="text-xs text-blue-500">delhi@skywardglobal.com</div>
                  </div>

                  <div className="p-4 rounded-2xl border space-y-1" style={{ background: 'var(--bg-secondary)', borderColor: 'var(--border-base)' }}>
                    <div className="text-xs font-bold text-blue-500">🇬🇧 United Kingdom Office</div>
                    <div className="text-sm font-bold" style={{ color: 'var(--text-primary)' }}>London Heathrow Terminal 2</div>
                    <div className="text-xs font-mono pt-1" style={{ color: 'var(--text-muted)' }}>+44 20 7946 0912</div>
                    <div className="text-xs text-blue-500">london@skywardglobal.com</div>
                  </div>

                  <div className="p-4 rounded-2xl border space-y-1" style={{ background: 'var(--bg-secondary)', borderColor: 'var(--border-base)' }}>
                    <div className="text-xs font-bold text-blue-500">🇦🇪 Middle East Operations</div>
                    <div className="text-sm font-bold" style={{ color: 'var(--text-primary)' }}>Dubai International Hub</div>
                    <div className="text-xs font-mono pt-1" style={{ color: 'var(--text-muted)' }}>+971 4 224 5555</div>
                    <div className="text-xs text-blue-500">dubai@skywardglobal.com</div>
                  </div>
                </div>
              </div>
            )}

            {/* FAQS */}
            {activeSection === 'faqs' && (
              <div className="space-y-6 animate-fadeIn">
                <div className="border-b pb-4" style={{ borderColor: 'var(--border-base)' }}>
                  <span className="text-[11px] font-mono font-bold uppercase tracking-wider badge-blue">Knowledge Base</span>
                  <h2 className="text-2xl font-black mt-2 font-sans-ui" style={{ color: 'var(--text-primary)' }}>
                    Frequently Asked Questions
                  </h2>
                </div>

                <div className="space-y-3">
                  {faqs.map((faq, idx) => (
                    <div 
                      key={idx} 
                      className="rounded-2xl border overflow-hidden transition-all"
                      style={{ background: 'var(--bg-secondary)', borderColor: 'var(--border-base)' }}
                    >
                      <button
                        onClick={() => setOpenFaq(openFaq === idx ? -1 : idx)}
                        className="w-full p-4 flex items-center justify-between text-left font-bold text-xs cursor-pointer hover:text-blue-500 transition-colors"
                        style={{ color: 'var(--text-primary)' }}
                      >
                        <span>{faq.q}</span>
                        {openFaq === idx ? <ChevronUp className="w-4 h-4 text-blue-500" /> : <ChevronDown className="w-4 h-4 opacity-50" />}
                      </button>
                      {openFaq === idx && (
                        <div className="px-4 pb-4 text-xs leading-relaxed border-t pt-3" style={{ color: 'var(--text-secondary)', borderColor: 'var(--border-base)' }}>
                          {faq.a}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* BAGGAGE POLICY */}
            {activeSection === 'baggage' && (
              <div className="space-y-6 animate-fadeIn">
                <div className="border-b pb-4" style={{ borderColor: 'var(--border-base)' }}>
                  <span className="text-[11px] font-mono font-bold uppercase tracking-wider badge-orange">Luggage Guidelines</span>
                  <h2 className="text-2xl font-black mt-2 font-sans-ui" style={{ color: 'var(--text-primary)' }}>
                    Airline Baggage Allowance & Excess Rates
                  </h2>
                </div>

                <div className="rounded-2xl border overflow-hidden" style={{ background: 'var(--bg-secondary)', borderColor: 'var(--border-base)' }}>
                  <table className="w-full text-left text-xs border-collapse">
                    <thead>
                      <tr className="border-b" style={{ background: 'var(--bg-sidebar)', borderColor: 'var(--border-base)' }}>
                        <th className="p-3 font-bold">Route Type</th>
                        <th className="p-3 font-bold">Cabin Baggage</th>
                        <th className="p-3 font-bold">Check-in Baggage</th>
                        <th className="p-3 font-bold">Excess Rate</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y" style={{ borderColor: 'var(--border-base)' }}>
                      <tr>
                        <td className="p-3 font-semibold">Domestic Flights (India)</td>
                        <td className="p-3 font-mono">1x 7 kg (55x35x25 cm)</td>
                        <td className="p-3 font-mono">1x 15 kg</td>
                        <td className="p-3 text-blue-500 font-bold">₹500 / kg</td>
                      </tr>
                      <tr>
                        <td className="p-3 font-semibold">Short-Haul International (Dubai, Singapore)</td>
                        <td className="p-3 font-mono">1x 7 kg</td>
                        <td className="p-3 font-mono">1x 23 kg – 30 kg</td>
                        <td className="p-3 text-blue-500 font-bold">₹1,200 / kg</td>
                      </tr>
                      <tr>
                        <td className="p-3 font-semibold">Long-Haul International (London, New York)</td>
                        <td className="p-3 font-mono">1x 8 kg + Laptop Bag</td>
                        <td className="p-3 font-mono">2x 23 kg (46 kg Total)</td>
                        <td className="p-3 text-blue-500 font-bold">₹1,800 / kg</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* REPORT AN ISSUE */}
            {activeSection === 'report-issue' && (
              <div className="space-y-6 animate-fadeIn">
                <div className="border-b pb-4" style={{ borderColor: 'var(--border-base)' }}>
                  <span className="text-[11px] font-mono font-bold uppercase tracking-wider badge-orange">Customer Escalation</span>
                  <h2 className="text-2xl font-black mt-2 font-sans-ui" style={{ color: 'var(--text-primary)' }}>
                    Submit a Support Ticket
                  </h2>
                </div>

                {issueSubmitted ? (
                  <div className="p-6 rounded-2xl border text-center space-y-3" style={{ background: 'var(--bg-secondary)', borderColor: 'var(--tag-green-text)55' }}>
                    <div className="w-12 h-12 rounded-full bg-emerald-500/20 text-emerald-500 flex items-center justify-center mx-auto">
                      <CheckCircle2 className="w-6 h-6" />
                    </div>
                    <h3 className="text-base font-extrabold" style={{ color: 'var(--text-primary)' }}>Ticket Logged: TKT-89241</h3>
                    <p className="text-xs max-w-md mx-auto" style={{ color: 'var(--text-secondary)' }}>
                      Our priority aviation support team has received your inquiry. A senior ticketing supervisor will contact you at <strong>{issueForm.email || 'your email'}</strong> within 15 minutes.
                    </p>
                    <button onClick={() => setIssueSubmitted(false)} className="btn-glow px-5 py-2 rounded-xl text-xs font-bold">
                      Submit Another Query
                    </button>
                  </div>
                ) : (
                  <form onSubmit={handleIssueSubmit} className="space-y-4">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="text-xs font-bold block mb-1" style={{ color: 'var(--text-primary)' }}>Full Name</label>
                        <input
                          type="text"
                          required
                          value={issueForm.name}
                          onChange={e => setIssueForm({...issueForm, name: e.target.value})}
                          placeholder="e.g. Rahul Sharma"
                          className="w-full px-3 py-2 text-xs rounded-xl focus:outline-none"
                          style={{ background: 'var(--bg-input)', border: '1px solid var(--border-base)', color: 'var(--text-primary)' }}
                        />
                      </div>
                      <div>
                        <label className="text-xs font-bold block mb-1" style={{ color: 'var(--text-primary)' }}>Email Address</label>
                        <input
                          type="email"
                          required
                          value={issueForm.email}
                          onChange={e => setIssueForm({...issueForm, email: e.target.value})}
                          placeholder="user@example.com"
                          className="w-full px-3 py-2 text-xs rounded-xl focus:outline-none"
                          style={{ background: 'var(--bg-input)', border: '1px solid var(--border-base)', color: 'var(--text-primary)' }}
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="text-xs font-bold block mb-1" style={{ color: 'var(--text-primary)' }}>Flight PNR (Optional)</label>
                        <input
                          type="text"
                          value={issueForm.pnr}
                          onChange={e => setIssueForm({...issueForm, pnr: e.target.value})}
                          placeholder="e.g. SKY-8924"
                          className="w-full px-3 py-2 text-xs rounded-xl focus:outline-none"
                          style={{ background: 'var(--bg-input)', border: '1px solid var(--border-base)', color: 'var(--text-primary)' }}
                        />
                      </div>
                      <div>
                        <label className="text-xs font-bold block mb-1" style={{ color: 'var(--text-primary)' }}>Category</label>
                        <select
                          value={issueForm.category}
                          onChange={e => setIssueForm({...issueForm, category: e.target.value})}
                          className="w-full px-3 py-2 text-xs rounded-xl focus:outline-none"
                          style={{ background: 'var(--bg-input)', border: '1px solid var(--border-base)', color: 'var(--text-primary)' }}
                        >
                          <option>Booking Confirmation / E-Ticket</option>
                          <option>Cancellation & Refund Status</option>
                          <option>Seat Allocation / Baggage Inquiry</option>
                          <option>Payment & Invoicing</option>
                        </select>
                      </div>
                    </div>

                    <div>
                      <label className="text-xs font-bold block mb-1" style={{ color: 'var(--text-primary)' }}>Describe your issue in detail</label>
                      <textarea
                        required
                        rows="3"
                        value={issueForm.message}
                        onChange={e => setIssueForm({...issueForm, message: e.target.value})}
                        placeholder="Please provide flight details, error messages, or assistance needed..."
                        className="w-full px-3 py-2 text-xs rounded-xl focus:outline-none"
                        style={{ background: 'var(--bg-input)', border: '1px solid var(--border-base)', color: 'var(--text-primary)' }}
                      ></textarea>
                    </div>

                    <button type="submit" className="btn-glow px-6 py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider cursor-pointer">
                      Submit Priority Ticket
                    </button>
                  </form>
                )}
              </div>
            )}

            {/* REFER & EARN */}
            {activeSection === 'refer' && (
              <div className="space-y-6 animate-fadeIn">
                <div className="border-b pb-4" style={{ borderColor: 'var(--border-base)' }}>
                  <span className="text-[11px] font-mono font-bold uppercase tracking-wider badge-purple">Skyward Referral Program</span>
                  <h2 className="text-2xl font-black mt-2 font-sans-ui" style={{ color: 'var(--text-primary)' }}>
                    Refer Friends & Earn ₹1,500 Flight Discount Cash
                  </h2>
                  <p className="text-xs mt-1" style={{ color: 'var(--text-muted)' }}>
                    Give ₹1,000 off on your friend's first booking, and earn ₹1,500 travel wallet credits when they fly!
                  </p>
                </div>

                {/* Referral Code Box */}
                <div className="p-6 rounded-2xl border text-center space-y-4" style={{ background: 'var(--bg-secondary)', borderColor: 'var(--border-base)' }}>
                  <div className="text-xs font-bold uppercase tracking-wider" style={{ color: 'var(--text-muted)' }}>
                    Your Exclusive Referral Code
                  </div>

                  <div className="flex items-center justify-center gap-3">
                    <div className="text-2xl sm:text-3xl font-black font-mono tracking-widest text-blue-500 bg-blue-500/10 px-6 py-2.5 rounded-2xl border border-blue-500/30">
                      {referralCode}
                    </div>
                    <button
                      onClick={handleCopyReferral}
                      className="p-3 rounded-2xl bg-blue-600 hover:bg-blue-700 text-white transition-all cursor-pointer shadow-md"
                      title="Copy link"
                    >
                      <Copy className="w-5 h-5" />
                    </button>
                  </div>

                  {copiedReferral && (
                    <div className="text-xs font-bold text-emerald-500 flex items-center justify-center gap-1">
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      <span>Referral Link Copied to Clipboard!</span>
                    </div>
                  )}

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2 text-left">
                    <div className="p-3 rounded-xl border text-xs" style={{ background: 'var(--bg-card)', borderColor: 'var(--border-base)' }}>
                      <div className="font-bold text-blue-500">1. Share Your Link</div>
                      <div className="text-[11px] mt-0.5" style={{ color: 'var(--text-muted)' }}>Send via WhatsApp, SMS, or Socials</div>
                    </div>
                    <div className="p-3 rounded-xl border text-xs" style={{ background: 'var(--bg-card)', borderColor: 'var(--border-base)' }}>
                      <div className="font-bold text-blue-500">2. Friend Gets ₹1,000</div>
                      <div className="text-[11px] mt-0.5" style={{ color: 'var(--text-muted)' }}>Instant discount applied at checkout</div>
                    </div>
                    <div className="p-3 rounded-xl border text-xs" style={{ background: 'var(--bg-card)', borderColor: 'var(--border-base)' }}>
                      <div className="font-bold text-emerald-500">3. You Earn ₹1,500</div>
                      <div className="text-[11px] mt-0.5" style={{ color: 'var(--text-muted)' }}>Direct credit to Skyward Wallet</div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* DOWNLOAD APPS */}
            {activeSection === 'apps' && (
              <div className="space-y-6 animate-fadeIn">
                <div className="border-b pb-4" style={{ borderColor: 'var(--border-base)' }}>
                  <span className="text-[11px] font-mono font-bold uppercase tracking-wider badge-blue">Mobile Experience</span>
                  <h2 className="text-2xl font-black mt-2 font-sans-ui" style={{ color: 'var(--text-primary)' }}>
                    Download Skyward Global for iOS & Android
                  </h2>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 items-center">
                  <div className="space-y-4">
                    <h4 className="text-sm font-extrabold" style={{ color: 'var(--text-primary)' }}>
                      Unlock Exclusive App-Only Benefits:
                    </h4>
                    <ul className="space-y-2 text-xs" style={{ color: 'var(--text-secondary)' }}>
                      <li className="flex items-center gap-2">
                        <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                        <span>Live Gate Changes & Terminal Flight Trackers</span>
                      </li>
                      <li className="flex items-center gap-2">
                        <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                        <span>Offline PDF Boarding Passes in Apple Wallet / Google Wallet</span>
                      </li>
                      <li className="flex items-center gap-2">
                        <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                        <span>Instant Push Notifications for Fare Drop Alerts</span>
                      </li>
                    </ul>

                    {/* Send Link Form */}
                    <form onSubmit={handleSendAppLink} className="space-y-2 pt-2">
                      <label className="text-xs font-bold block" style={{ color: 'var(--text-primary)' }}>Get Direct SMS Download Link</label>
                      <div className="flex gap-2">
                        <input
                          type="tel"
                          required
                          value={appPhone}
                          onChange={e => setAppPhone(e.target.value)}
                          placeholder="+91 9625787729"
                          className="flex-1 px-3 py-2 text-xs rounded-xl focus:outline-none"
                          style={{ background: 'var(--bg-input)', border: '1px solid var(--border-base)', color: 'var(--text-primary)' }}
                        />
                        <button type="submit" className="btn-glow px-4 py-2 rounded-xl text-xs font-bold cursor-pointer">
                          Send Link
                        </button>
                      </div>
                      {appLinkSent && (
                        <div className="text-xs font-bold text-emerald-500 flex items-center gap-1">
                          <CheckCircle2 className="w-3.5 h-3.5" />
                          <span>SMS download link sent to your phone!</span>
                        </div>
                      )}
                    </form>
                  </div>

                  <div className="p-6 rounded-3xl border text-center space-y-3" style={{ background: 'var(--bg-secondary)', borderColor: 'var(--border-base)' }}>
                    <div className="w-32 h-32 bg-white p-2.5 rounded-2xl mx-auto flex items-center justify-center border shadow-md">
                      {/* Stylized QR placeholder */}
                      <div className="w-full h-full border-4 border-dashed border-slate-800 rounded-lg flex items-center justify-center text-slate-800 font-bold text-[10px]">
                        SCAN TO GET APP
                      </div>
                    </div>
                    <div className="text-xs font-bold" style={{ color: 'var(--text-primary)' }}>Point Camera to Download</div>
                    <div className="text-[11px]" style={{ color: 'var(--text-muted)' }}>Compatible with iOS 16+ & Android 12+</div>
                  </div>
                </div>
              </div>
            )}

            {/* PAYMENT & EMI */}
            {activeSection === 'payments' && (
              <div className="space-y-6 animate-fadeIn">
                <div className="border-b pb-4" style={{ borderColor: 'var(--border-base)' }}>
                  <span className="text-[11px] font-mono font-bold uppercase tracking-wider badge-green">Zero-Cost Payment Options</span>
                  <h2 className="text-2xl font-black mt-2 font-sans-ui" style={{ color: 'var(--text-primary)' }}>
                    Accepted Payment Methods & Bank Discounts
                  </h2>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="p-4 rounded-2xl border space-y-1.5" style={{ background: 'var(--bg-secondary)', borderColor: 'var(--border-base)' }}>
                    <div className="text-xs font-bold text-blue-500">⚡ UPI & Instant QR</div>
                    <div className="text-sm font-bold" style={{ color: 'var(--text-primary)' }}>Google Pay, PhonePe, Paytm, BHIM</div>
                    <p className="text-xs leading-relaxed" style={{ color: 'var(--text-muted)' }}>
                      Instant 0-fee checkout with dynamic UPI QR and direct bank account debit.
                    </p>
                  </div>

                  <div className="p-4 rounded-2xl border space-y-1.5" style={{ background: 'var(--bg-secondary)', borderColor: 'var(--border-base)' }}>
                    <div className="text-xs font-bold text-purple-500">💳 No-Cost EMI (3 to 12 Months)</div>
                    <div className="text-sm font-bold" style={{ color: 'var(--text-primary)' }}>HDFC, ICICI, SBI, Axis, Amex</div>
                    <p className="text-xs leading-relaxed" style={{ color: 'var(--text-muted)' }}>
                      Split domestic and international flight tickets into easy zero-interest monthly installments.
                    </p>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Bottom Bar */}
        <div 
          className="px-6 py-3.5 border-t flex items-center justify-between gap-3 text-xs flex-shrink-0"
          style={{ background: 'var(--bg-sidebar)', borderColor: 'var(--border-base)' }}
        >
          <div className="text-[11px]" style={{ color: 'var(--text-muted)' }}>
            Need direct phone support? Call 24/7 Toll-Free: <strong className="text-blue-500">+1 (800) 123-4567</strong>
          </div>
          <button
            onClick={onClose}
            className="btn-glow px-6 py-2 rounded-xl text-xs font-bold uppercase tracking-wider cursor-pointer"
          >
            Close Window
          </button>
        </div>
      </div>
    </div>
  );
}
