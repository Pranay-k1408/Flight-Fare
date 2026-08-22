import React, { useState } from 'react';
import { 
  Plane, 
  ShieldCheck, 
  Lock, 
  CheckCircle2, 
  ArrowUp, 
  Award, 
  ChevronRight, 
  Headphones, 
  Tag, 
  Gift, 
  Mail, 
  Send, 
  Globe, 
  Smartphone 
} from 'lucide-react';

const FacebookIcon = () => (
  <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 24 24">
    <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
  </svg>
);

const InstagramIcon = () => (
  <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 24 24">
    <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
  </svg>
);

const TwitterIcon = () => (
  <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 24 24">
    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
  </svg>
);

const LinkedinIcon = () => (
  <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 24 24">
    <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"/>
  </svg>
);

const YoutubeIcon = () => (
  <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 24 24">
    <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
  </svg>
);

export default function Footer({ onOpenPolicy, onOpenInfo }) {
  const [newsletterEmail, setNewsletterEmail] = useState('');
  const [newsletterSubscribed, setNewsletterSubscribed] = useState(false);
  const [selectedLanguage, setSelectedLanguage] = useState('English (US)');
  const [showLangMenu, setShowLangMenu] = useState(false);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleOpenLegal = (tabKey) => {
    if (onOpenPolicy) {
      onOpenPolicy(tabKey);
    }
  };

  const handleOpenInfo = (sectionKey) => {
    if (onOpenInfo) {
      onOpenInfo(sectionKey);
    }
  };

  const handleNewsletterSubmit = (e) => {
    e.preventDefault();
    if (newsletterEmail.trim() && newsletterEmail.includes('@')) {
      setNewsletterSubscribed(true);
      setTimeout(() => {
        setNewsletterEmail('');
      }, 4000);
    }
  };

  return (
    <footer 
      className="mt-16 border-t transition-colors duration-300 font-sans-ui"
      style={{ 
        background: 'var(--bg-secondary)', 
        borderColor: 'var(--border-base)',
        color: 'var(--text-primary)'
      }}
    >
      {/* ─── 1. TOP SECURITY & ACCREDITATION TRUST RIBBON ───────────────────────── */}
      <div 
        className="py-3.5 px-6 border-b"
        style={{ 
          background: 'var(--bg-sidebar)', 
          borderColor: 'var(--border-base)' 
        }}
      >
        <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-4 text-xs">
          
          <div className="flex flex-wrap items-center gap-6 sm:gap-8" style={{ color: 'var(--text-secondary)' }}>
            <button 
              type="button" 
              onClick={() => handleOpenLegal('security')}
              className="flex items-center gap-2 cursor-pointer hover:underline text-left"
            >
              <Lock className="w-3.5 h-3.5 text-emerald-500 flex-shrink-0" />
              <span className="font-semibold text-[11px]">256-Bit SSL Encrypted Checkout</span>
            </button>
            
            <button 
              type="button" 
              onClick={() => handleOpenLegal('security')}
              className="flex items-center gap-2 cursor-pointer hover:underline text-left"
            >
              <ShieldCheck className="w-3.5 h-3.5 text-blue-500 flex-shrink-0" />
              <span className="font-semibold text-[11px]">IATA Accredited Fare Verification</span>
            </button>

            <button 
              type="button" 
              onClick={() => handleOpenLegal('security')}
              className="flex items-center gap-2 cursor-pointer hover:underline text-left"
            >
              <Award className="w-3.5 h-3.5 text-indigo-500 flex-shrink-0" />
              <span className="font-semibold text-[11px]">PCI-DSS & ISO/IEC 27001 Certified</span>
            </button>

            <button 
              type="button" 
              onClick={() => handleOpenInfo('about')}
              className="flex items-center gap-2 cursor-pointer hover:underline text-left"
            >
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 flex-shrink-0" />
              <span className="font-semibold text-[11px]">Verified Airline Partner Engine</span>
            </button>
          </div>

          <div className="flex items-center gap-2 text-[11px]">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
            <span className="font-semibold" style={{ color: 'var(--text-secondary)' }}>Live GDS Systems:</span>
            <span className="font-mono font-bold text-blue-500">Operational</span>
          </div>

        </div>
      </div>

      {/* ─── 2. MAIN FOOTER CONTENT (5-COLUMN GRID) ────────────────────────────── */}
      <div className="max-w-7xl mx-auto px-6 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-8 lg:gap-6">
          
          {/* Column 1: Brand & Key Selling Points (Span 4 cols) */}
          <div className="lg:col-span-4 space-y-6">
            {/* Brand Header */}
            <div>
              <div className="flex items-center gap-2.5">
                <div 
                  className="w-8 h-8 rounded-xl flex items-center justify-center shadow-sm"
                  style={{ background: '#2563eb' }}
                >
                  <Plane className="w-4 h-4 text-white transform -rotate-45" />
                </div>
                <span className="font-black text-lg tracking-tight font-sans-ui" style={{ color: 'var(--text-primary)' }}>
                  Skyward <span style={{ color: '#2563eb' }}>Global</span>
                </span>
                <span 
                  className="text-[9px] font-mono px-2 py-0.5 rounded font-bold uppercase tracking-wider badge-blue ml-1"
                >
                  OFFICIAL PLATFORM
                </span>
              </div>

              <p className="text-xs mt-3 leading-relaxed max-w-sm" style={{ color: 'var(--text-muted)' }}>
                Your trusted travel partner for flights worldwide. We connect you to 500+ airlines and travel thousands of routes with the best fares, secure bookings, and 24/7 support.
              </p>
            </div>

            {/* 4 Feature Badges with rounded icon containers */}
            <div className="space-y-3.5 pt-1">
              <button 
                type="button"
                onClick={() => handleOpenInfo('about')}
                className="w-full flex items-center gap-3 text-left cursor-pointer group"
              >
                <div 
                  className="w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 transition-transform group-hover:scale-110"
                  style={{ background: 'rgba(37,99,235,0.12)', color: '#2563eb' }}
                >
                  <Plane className="w-4 h-4" />
                </div>
                <div>
                  <div className="text-xs font-bold group-hover:text-blue-500 transition-colors" style={{ color: 'var(--text-primary)' }}>500+ Airlines</div>
                  <div className="text-[11px]" style={{ color: 'var(--text-muted)' }}>Global network</div>
                </div>
              </button>

              <button 
                type="button"
                onClick={() => handleOpenInfo('about')}
                className="w-full flex items-center gap-3 text-left cursor-pointer group"
              >
                <div 
                  className="w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 transition-transform group-hover:scale-110"
                  style={{ background: 'rgba(37,99,235,0.12)', color: '#2563eb' }}
                >
                  <Tag className="w-4 h-4" />
                </div>
                <div>
                  <div className="text-xs font-bold group-hover:text-blue-500 transition-colors" style={{ color: 'var(--text-primary)' }}>Best Price Guarantee</div>
                  <div className="text-[11px]" style={{ color: 'var(--text-muted)' }}>Competitive fares</div>
                </div>
              </button>

              <button 
                type="button"
                onClick={() => handleOpenLegal('security')}
                className="w-full flex items-center gap-3 text-left cursor-pointer group"
              >
                <div 
                  className="w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 transition-transform group-hover:scale-110"
                  style={{ background: 'rgba(16,185,129,0.12)', color: '#10b981' }}
                >
                  <ShieldCheck className="w-4 h-4" />
                </div>
                <div>
                  <div className="text-xs font-bold group-hover:text-emerald-500 transition-colors" style={{ color: 'var(--text-primary)' }}>Secure Booking</div>
                  <div className="text-[11px]" style={{ color: 'var(--text-muted)' }}>100% protected</div>
                </div>
              </button>

              <button 
                type="button"
                onClick={() => handleOpenInfo('contact')}
                className="w-full flex items-center gap-3 text-left cursor-pointer group"
              >
                <div 
                  className="w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 transition-transform group-hover:scale-110"
                  style={{ background: 'rgba(99,102,241,0.12)', color: '#6366f1' }}
                >
                  <Headphones className="w-4 h-4" />
                </div>
                <div>
                  <div className="text-xs font-bold group-hover:text-indigo-500 transition-colors" style={{ color: 'var(--text-primary)' }}>24/7 Customer Support</div>
                  <div className="text-[11px]" style={{ color: 'var(--text-muted)' }}>Always here to help</div>
                </div>
              </button>
            </div>
          </div>

          {/* Column 2: Company (Span 2 cols) */}
          <div className="lg:col-span-2 flex flex-col justify-between space-y-6">
            <div>
              <h4 className="text-xs font-bold uppercase tracking-wider mb-4" style={{ color: 'var(--text-primary)' }}>
                Company
              </h4>
              <ul className="space-y-2.5 text-xs">
                {[
                  { label: 'About Us', action: () => handleOpenInfo('about') },
                  { label: 'Careers', action: () => handleOpenInfo('careers') },
                  { label: 'Press & Media', action: () => handleOpenInfo('press') },
                  { label: 'Blog', action: () => handleOpenInfo('blog') },
                  { label: 'Investor Relations', action: () => handleOpenInfo('investors') },
                  { label: 'Contact Us', action: () => handleOpenInfo('contact') },
                ].map((item, idx) => (
                  <li key={idx}>
                    <button
                      type="button"
                      onClick={item.action}
                      className="w-full flex items-center justify-between group cursor-pointer transition-colors py-0.5 hover:text-blue-500"
                      style={{ color: 'var(--text-secondary)' }}
                    >
                      <span className="group-hover:translate-x-0.5 transition-transform">{item.label}</span>
                      <ChevronRight className="w-3.5 h-3.5 opacity-40 group-hover:opacity-100 group-hover:text-blue-500 transition-all" />
                    </button>
                  </li>
                ))}
              </ul>
            </div>

            {/* Refer & Earn Promo Card */}
            <div 
              className="p-3.5 rounded-2xl border space-y-1.5 transition-all hover:border-blue-500/40"
              style={{ background: 'var(--bg-card)', borderColor: 'var(--border-base)' }}
            >
              <div className="flex items-center gap-1.5 text-xs font-bold" style={{ color: 'var(--text-primary)' }}>
                <Gift className="w-4 h-4 text-blue-500" />
                <span>Refer & Earn</span>
              </div>
              <p className="text-[11px] leading-snug" style={{ color: 'var(--text-muted)' }}>
                Invite friends and earn exclusive rewards.
              </p>
              <button 
                type="button"
                onClick={() => handleOpenInfo('refer')}
                className="text-[11px] font-bold text-blue-500 hover:underline flex items-center gap-1 cursor-pointer pt-1"
              >
                <span>Learn More</span>
                <span>→</span>
              </button>
            </div>
          </div>

          {/* Column 3: Support (Span 2 cols) */}
          <div className="lg:col-span-2 flex flex-col justify-between space-y-6">
            <div>
              <h4 className="text-xs font-bold uppercase tracking-wider mb-4" style={{ color: 'var(--text-primary)' }}>
                Support
              </h4>
              <ul className="space-y-2.5 text-xs">
                {[
                  { label: 'Help Center', action: () => handleOpenInfo('help') },
                  { label: 'FAQs', action: () => handleOpenInfo('faqs') },
                  { label: 'Booking Guide', action: () => handleOpenInfo('booking-guide') },
                  { label: 'Cancellation & Refund', action: () => handleOpenLegal('refunds') },
                  { label: 'Baggage Policy', action: () => handleOpenInfo('baggage') },
                  { label: 'Travel Advisory', action: () => handleOpenInfo('travel-advisory') },
                  { label: 'Report an Issue', action: () => handleOpenInfo('report-issue') },
                ].map((item, idx) => (
                  <li key={idx}>
                    <button
                      type="button"
                      onClick={item.action}
                      className="w-full flex items-center justify-between group cursor-pointer transition-colors py-0.5 hover:text-blue-500"
                      style={{ color: 'var(--text-secondary)' }}
                    >
                      <span className="group-hover:translate-x-0.5 transition-transform">{item.label}</span>
                      <ChevronRight className="w-3.5 h-3.5 opacity-40 group-hover:opacity-100 group-hover:text-blue-500 transition-all" />
                    </button>
                  </li>
                ))}
              </ul>
            </div>

            {/* Need Help Card */}
            <div 
              className="p-3.5 rounded-2xl border space-y-1.5 transition-all hover:border-blue-500/40"
              style={{ background: 'var(--bg-card)', borderColor: 'var(--border-base)' }}
            >
              <div className="flex items-center gap-1.5 text-xs font-bold" style={{ color: 'var(--text-primary)' }}>
                <Headphones className="w-4 h-4 text-blue-500" />
                <span>Need Help?</span>
              </div>
              <p className="text-[11px] leading-snug" style={{ color: 'var(--text-muted)' }}>
                Our support team is available 24/7 to assist you.
              </p>
              <a 
                href="tel:+18001234567"
                className="text-xs font-bold font-mono text-blue-500 pt-0.5 block hover:underline"
              >
                +1 (800) 123-4567
              </a>
              <a 
                href="mailto:support@skywardglobal.com" 
                className="text-[10px] text-blue-500 hover:underline block truncate"
              >
                support@skywardglobal.com
              </a>
            </div>
          </div>

          {/* Column 4: Policies & Newsletter (Span 2 cols) */}
          <div className="lg:col-span-2 flex flex-col justify-between space-y-6">
            <div>
              <h4 className="text-xs font-bold uppercase tracking-wider mb-4" style={{ color: 'var(--text-primary)' }}>
                Policies
              </h4>
              <ul className="space-y-2.5 text-xs">
                {[
                  { label: 'Privacy Policy', action: () => handleOpenLegal('privacy') },
                  { label: 'Terms of Service', action: () => handleOpenLegal('terms') },
                  { label: 'Security & Trust', action: () => handleOpenLegal('security') },
                  { label: 'Refund Policies', action: () => handleOpenLegal('refunds') },
                  { label: 'Cookie Policy', action: () => handleOpenLegal('privacy') },
                ].map((item, idx) => (
                  <li key={idx}>
                    <button
                      type="button"
                      onClick={item.action}
                      className="w-full flex items-center justify-between group cursor-pointer transition-colors py-0.5 hover:text-blue-500"
                      style={{ color: 'var(--text-secondary)' }}
                    >
                      <span className="group-hover:translate-x-0.5 transition-transform">{item.label}</span>
                      <ChevronRight className="w-3.5 h-3.5 opacity-40 group-hover:opacity-100 group-hover:text-blue-500 transition-all" />
                    </button>
                  </li>
                ))}
              </ul>
            </div>

            {/* Newsletter Subscription Box */}
            <div 
              className="p-3.5 rounded-2xl border space-y-2 transition-all hover:border-blue-500/40"
              style={{ background: 'var(--bg-card)', borderColor: 'var(--border-base)' }}
            >
              <div className="flex items-center gap-1.5 text-xs font-bold" style={{ color: 'var(--text-primary)' }}>
                <Mail className="w-4 h-4 text-blue-500" />
                <span>Newsletter</span>
              </div>
              <p className="text-[11px] leading-snug" style={{ color: 'var(--text-muted)' }}>
                Stay updated with the best deals and travel tips.
              </p>
              
              {newsletterSubscribed ? (
                <div className="text-[11px] font-bold text-emerald-500 flex items-center gap-1">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  <span>Subscribed! Use code: SKY1000</span>
                </div>
              ) : (
                <form onSubmit={handleNewsletterSubmit} className="flex items-center gap-1.5">
                  <input
                    type="email"
                    placeholder="Enter your email"
                    value={newsletterEmail}
                    onChange={(e) => setNewsletterEmail(e.target.value)}
                    required
                    className="w-full px-2.5 py-1.5 text-[11px] rounded-lg focus:outline-none transition-all"
                    style={{
                      background: 'var(--bg-input)',
                      border: '1px solid var(--border-base)',
                      color: 'var(--text-primary)'
                    }}
                  />
                  <button
                    type="submit"
                    title="Subscribe"
                    className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 cursor-pointer text-white bg-blue-600 hover:bg-blue-700 transition-colors shadow-sm"
                  >
                    <Send className="w-3.5 h-3.5" />
                  </button>
                </form>
              )}
            </div>
          </div>

          {/* Column 5: Payment Badges & Mobile Apps (Span 2 cols) */}
          <div className="lg:col-span-2 space-y-6">
            {/* We Accept Payment Badges */}
            <div>
              <h4 className="text-xs font-bold uppercase tracking-wider mb-3" style={{ color: 'var(--text-primary)' }}>
                We Accept
              </h4>
              
              <div className="grid grid-cols-4 gap-2">
                {[
                  { name: 'Visa', content: <span className="italic font-sans font-black text-[11px]" style={{ color: '#1a1f71' }}>VISA</span>, bg: '#ffffff' },
                  { name: 'Mastercard', content: <div className="flex items-center -space-x-1.5"><span className="w-3.5 h-3.5 rounded-full bg-red-500 opacity-90 inline-block"></span><span className="w-3.5 h-3.5 rounded-full bg-amber-400 opacity-90 inline-block"></span></div>, bg: '#ffffff' },
                  { name: 'American Express', content: <span className="font-bold text-[8px] text-white">AMEX</span>, bg: '#006fcf' },
                  { name: 'RuPay', content: <span className="font-bold text-[9px]"><span style={{ color: '#097939' }}>Ru</span><span style={{ color: '#f37021' }}>Pay</span></span>, bg: '#ffffff' },
                  { name: 'UPI', content: <span className="font-extrabold text-[9px] tracking-tight" style={{ color: '#0f7938' }}>UPI ⚡</span>, bg: '#ffffff' },
                  { name: 'Paytm', content: <span className="font-bold text-[8px]" style={{ color: '#00baf2' }}>Paytm</span>, bg: '#ffffff' },
                  { name: 'Apple Pay', content: <span className="font-bold text-[9px] text-white">Pay</span>, bg: '#000000' },
                  { name: 'Google Pay', content: <span className="font-bold text-[9px]" style={{ color: '#4285f4' }}>G Pay</span>, bg: '#ffffff' }
                ].map((p, pIdx) => (
                  <button 
                    key={pIdx}
                    type="button"
                    onClick={() => handleOpenInfo('payments')}
                    className="h-8 rounded-lg flex items-center justify-center border shadow-xs cursor-pointer hover:scale-105 transition-transform"
                    style={{ background: p.bg, borderColor: 'var(--border-base)' }}
                    title={`View ${p.name} Payment Options & EMI`}
                  >
                    {p.content}
                  </button>
                ))}
              </div>
            </div>

            {/* Download Our App */}
            <div className="space-y-2.5">
              <h4 className="text-xs font-bold uppercase tracking-wider" style={{ color: 'var(--text-primary)' }}>
                Download Our App
              </h4>
              <p className="text-[11px] leading-snug" style={{ color: 'var(--text-muted)' }}>
                Book flights on the go with our mobile app.
              </p>

              <div className="space-y-2">
                {/* App Store Badge */}
                <button
                  type="button"
                  onClick={() => handleOpenInfo('apps')}
                  className="w-full bg-black text-white px-3 py-1.5 rounded-xl flex items-center gap-2 border border-slate-700 cursor-pointer hover:bg-slate-900 transition-all shadow-xs"
                >
                  <span className="text-lg leading-none"></span>
                  <div className="text-left">
                    <div className="text-[8px] uppercase tracking-wider text-slate-300 font-medium">Download on the</div>
                    <div className="text-xs font-bold tracking-tight">App Store</div>
                  </div>
                </button>

                {/* Google Play Badge */}
                <button
                  type="button"
                  onClick={() => handleOpenInfo('apps')}
                  className="w-full bg-black text-white px-3 py-1.5 rounded-xl flex items-center gap-2 border border-slate-700 cursor-pointer hover:bg-slate-900 transition-all shadow-xs"
                >
                  <span className="text-sm">▶</span>
                  <div className="text-left">
                    <div className="text-[8px] uppercase tracking-wider text-slate-300 font-medium">GET IT ON</div>
                    <div className="text-xs font-bold tracking-tight">Google Play</div>
                  </div>
                </button>
              </div>
            </div>

          </div>

        </div>
      </div>

      {/* ─── 3. BOTTOM BAR (COPYRIGHT, LANGUAGE, SOCIALS, TOP BUTTON) ───────────── */}
      <div 
        className="border-t py-6 px-6"
        style={{ 
          background: 'var(--bg-sidebar)', 
          borderColor: 'var(--border-base)' 
        }}
      >
        <div className="max-w-7xl mx-auto flex flex-col lg:flex-row items-center justify-between gap-6">
          
          {/* Left: Copyright & Registration Notice */}
          <div className="text-center lg:text-left space-y-1">
            <div className="text-xs font-bold" style={{ color: 'var(--text-primary)' }}>
              © 2026 <strong>Skyward Global Inc.</strong> All rights reserved.
            </div>
            <div className="text-[11px]" style={{ color: 'var(--text-muted)' }}>
              Registered Online Travel Booking Aggregator. All airline trademarks, logos, and flight data feeds are the property of their respective carriers.
            </div>
          </div>

          {/* Right: Language Dropdown, Social Circles, Back to Top */}
          <div className="flex flex-wrap items-center justify-center gap-5">
            
            {/* Language Selector */}
            <div className="relative">
              <button
                type="button"
                onClick={() => setShowLangMenu(!showLangMenu)}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold cursor-pointer transition-all"
                style={{
                  background: 'var(--bg-card)',
                  border: '1px solid var(--border-base)',
                  color: 'var(--text-secondary)'
                }}
              >
                <Globe className="w-3.5 h-3.5 text-blue-500" />
                <span>{selectedLanguage}</span>
                <span className="text-[10px] opacity-60">⌵</span>
              </button>

              {showLangMenu && (
                <div 
                  className="absolute bottom-full mb-2 left-0 w-36 rounded-xl border shadow-xl p-1 z-30 space-y-0.5 animate-fadeIn"
                  style={{ background: 'var(--bg-secondary)', borderColor: 'var(--border-base)' }}
                >
                  {['English (US)', 'English (UK)', 'हिन्दी (Hindi)', 'Español', 'Français'].map((lang) => (
                    <button
                      key={lang}
                      type="button"
                      onClick={() => { setSelectedLanguage(lang); setShowLangMenu(false); }}
                      className="w-full text-left px-2.5 py-1 text-xs rounded-lg transition-colors cursor-pointer hover:bg-blue-500/10 hover:text-blue-500"
                      style={{ color: lang === selectedLanguage ? '#2563eb' : 'var(--text-primary)', fontWeight: lang === selectedLanguage ? 'bold' : 'normal' }}
                    >
                      {lang}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Follow Us & Social Icons */}
            <div className="flex items-center gap-2.5">
              <span className="text-xs font-semibold" style={{ color: 'var(--text-secondary)' }}>Follow Us</span>
              
              {[
                { icon: FacebookIcon, label: 'Facebook' },
                { icon: InstagramIcon, label: 'Instagram' },
                { icon: TwitterIcon, label: 'Twitter' },
                { icon: LinkedinIcon, label: 'LinkedIn' },
                { icon: YoutubeIcon, label: 'YouTube' },
              ].map((item, idx) => {
                const Icon = item.icon;
                return (
                  <button
                    key={idx}
                    type="button"
                    title={item.label}
                    onClick={() => window.open('https://twitter.com', '_blank')}
                    className="w-7 h-7 rounded-full flex items-center justify-center transition-all cursor-pointer hover:scale-110 hover:bg-blue-500 hover:text-white"
                    style={{
                      background: 'var(--bg-card)',
                      border: '1px solid var(--border-base)',
                      color: 'var(--text-secondary)'
                    }}
                  >
                    <Icon className="w-3.5 h-3.5" />
                  </button>
                );
              })}
            </div>

            {/* Back to Top */}
            <button
              onClick={scrollToTop}
              title="Scroll to top"
              className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-bold cursor-pointer transition-all hover:scale-105 shadow-sm"
              style={{
                background: 'var(--bg-card)',
                border: '1px solid var(--border-base)',
                color: 'var(--text-primary)'
              }}
            >
              <ArrowUp className="w-3.5 h-3.5 text-blue-500" />
              <span>Top</span>
            </button>

          </div>

        </div>
      </div>

    </footer>
  );
}
