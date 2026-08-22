import React from 'react';
import { X, User, Shield, LogOut, CheckCircle2, Mail, Phone, Calendar } from 'lucide-react';

export default function AccountModal({ user, onClose, onLogout, onOpenAuth }) {
  if (!user) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 modal-overlay">
        <div 
          className="w-full max-w-sm rounded-2xl overflow-hidden shadow-2xl p-6 text-center space-y-4 animate-fade-in"
          style={{ background: 'var(--bg-secondary)', border: '1.5px solid var(--border-base)' }}
        >
          <div 
            className="w-14 h-14 rounded-full flex items-center justify-center mx-auto shadow-md"
            style={{ background: 'var(--accent-light)', color: 'var(--accent)', border: '1px solid var(--border-base)' }}
          >
            <User className="w-7 h-7" />
          </div>
          <div>
            <h3 className="text-base font-bold font-sans-ui" style={{ color: 'var(--text-primary)' }}>
              Welcome to Flight Fare
            </h3>
            <p className="text-xs mt-1" style={{ color: 'var(--text-muted)' }}>
              Sign in with your mobile phone OTP, email, Google, or Apple ID to view saved tickets and booking history.
            </p>
          </div>

          <div className="pt-2 space-y-2">
            <button
              onClick={() => {
                onClose();
                onOpenAuth();
              }}
              className="w-full py-3 rounded-xl btn-glow font-bold text-xs uppercase tracking-wider cursor-pointer"
            >
              Sign In / Register
            </button>
            <button
              onClick={onClose}
              className="w-full py-2.5 rounded-xl btn-secondary text-xs font-semibold cursor-pointer"
            >
              Cancel
            </button>
          </div>
        </div>
      </div>
    );
  }

  const initial = (user.name || 'U').charAt(0).toUpperCase();

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 modal-overlay">
      <div 
        className="w-full max-w-md rounded-2xl overflow-hidden shadow-2xl animate-fade-in flex flex-col"
        style={{ background: 'var(--bg-secondary)', border: '1.5px solid var(--border-base)' }}
      >
        {/* Header */}
        <div 
          className="p-5 flex items-center justify-between"
          style={{ borderBottom: '1px solid var(--border-base)', background: 'var(--bg-sidebar)' }}
        >
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-full bg-gradient-to-tr from-blue-600 to-indigo-600 border border-blue-400/40 text-white font-bold text-base flex items-center justify-center font-mono shadow-md">
              {initial}
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <h3 className="text-base font-bold font-sans-ui" style={{ color: 'var(--text-primary)' }}>
                  {user.name}
                </h3>
                <CheckCircle2 className="w-4 h-4 text-emerald-500" />
              </div>
              <p className="text-xs font-mono" style={{ color: 'var(--text-muted)' }}>
                {user.phone || user.email || 'Verified Account'}
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

        {/* Profile Information */}
        <div className="p-6 space-y-4 text-xs">
          {/* Account Profile Card */}
          <div 
            className="p-4 rounded-xl space-y-3"
            style={{ background: 'var(--bg-sidebar)', border: '1px solid var(--border-base)' }}
          >
            <div 
              className="flex items-center justify-between pb-2"
              style={{ borderBottom: '1px solid var(--border-base)' }}
            >
              <span className="text-[10px] uppercase font-extrabold tracking-wider flex items-center gap-1" style={{ color: 'var(--accent)' }}>
                <Shield className="w-3.5 h-3.5" /> Verified User Profile
              </span>
              <span className="font-mono text-xs font-bold" style={{ color: 'var(--text-secondary)' }}>ID: {user.id}</span>
            </div>

            <div className="space-y-2" style={{ color: 'var(--text-secondary)' }}>
              {user.email && (
                <div className="flex items-center justify-between py-1">
                  <span className="flex items-center gap-1.5" style={{ color: 'var(--text-muted)' }}>
                    <Mail className="w-3.5 h-3.5" style={{ color: 'var(--accent)' }} /> Email Address:
                  </span>
                  <span className="font-medium" style={{ color: 'var(--text-primary)' }}>{user.email}</span>
                </div>
              )}

              {user.phone && (
                <div className="flex items-center justify-between py-1">
                  <span className="flex items-center gap-1.5" style={{ color: 'var(--text-muted)' }}>
                    <Phone className="w-3.5 h-3.5" style={{ color: 'var(--accent)' }} /> Mobile Number:
                  </span>
                  <span className="font-mono font-medium" style={{ color: 'var(--text-primary)' }}>{user.phone}</span>
                </div>
              )}

              <div 
                className="flex items-center justify-between py-1 pt-2"
                style={{ borderTop: '1px solid var(--border-base)' }}
              >
                <span className="flex items-center gap-1.5" style={{ color: 'var(--text-muted)' }}>
                  <Calendar className="w-3.5 h-3.5" style={{ color: 'var(--accent)' }} /> Member Since:
                </span>
                <span className="font-bold" style={{ color: 'var(--text-primary)' }}>{user.memberSince || '2026'}</span>
              </div>
            </div>
          </div>

          <div 
            className="p-3 rounded-xl flex items-center justify-between"
            style={{ 
              background: 'var(--tag-green-bg)', 
              border: '1px solid rgba(34, 197, 94, 0.3)',
              color: 'var(--tag-green-text)'
            }}
          >
            <span className="font-semibold flex items-center gap-2 text-xs">
              <CheckCircle2 className="w-4 h-4 text-emerald-500" /> Account Security Status
            </span>
            <span 
              className="font-bold text-[11px] px-2 py-0.5 rounded border"
              style={{
                background: 'rgba(34, 197, 94, 0.15)',
                borderColor: 'rgba(34, 197, 94, 0.4)',
                color: 'var(--tag-green-text)'
              }}
            >
              Verified
            </span>
          </div>

          {/* Action Buttons */}
          <div className="pt-2">
            <button
              onClick={() => {
                onLogout();
                onClose();
              }}
              className="w-full py-3 rounded-xl border font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2 transition-all cursor-pointer hover:bg-rose-500/10"
              style={{
                background: 'var(--bg-sidebar)',
                borderColor: 'rgba(244, 63, 94, 0.3)',
                color: '#f43f5e'
              }}
            >
              <LogOut className="w-4 h-4" /> Sign Out of Account
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
