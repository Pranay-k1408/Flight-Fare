import React, { useState } from 'react';
import { X, ShieldCheck, Phone, Mail, ArrowRight, KeyRound, AlertCircle, User, LogIn } from 'lucide-react';
import { sendOtpApi, verifyOtpApi, socialLoginApi } from '../services/authService';

export default function AuthModal({ onClose, onLoginSuccess }) {
  const [method, setMethod] = useState('phone'); // 'phone', 'email'
  const [step, setStep] = useState('input'); // 'input', 'otp'

  // Inputs
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [name, setName] = useState('');
  const [otpInput, setOtpInput] = useState('');

  // Google Sign-In modal view
  const [showGoogleModal, setShowGoogleModal] = useState(false);
  const [googleEmail, setGoogleEmail] = useState('pranaykashyap8300@gmail.com');
  const [googleName, setGoogleName] = useState('Pranay Kashyap');
  const [useCustomGoogle, setUseCustomGoogle] = useState(false);

  // Apple ID Sign-In modal view
  const [showAppleModal, setShowAppleModal] = useState(false);
  const [appleEmail, setAppleEmail] = useState('pranaykashyap8300@icloud.com');
  const [appleName, setAppleName] = useState('Pranay Kashyap');
  const [useCustomApple, setUseCustomApple] = useState(false);

  // Feedback & Demo state
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [demoOtp, setDemoOtp] = useState('');
  const [toastMessage, setToastMessage] = useState('');

  const handleSendOtp = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    const recipient = method === 'phone' ? `+91${phone.replace(/\D/g, '')}` : email;

    try {
      const res = await sendOtpApi(recipient, method);
      if (res && res.success) {
        setStep('otp');
        if (res.smsSent) {
          setDemoOtp('');
          setOtpInput('');
          setToastMessage(`📱 Real SMS sent to ${recipient}. Enter the code you received.`);
        } else if (res.emailSent) {
          setDemoOtp('');
          setOtpInput('');
          setToastMessage(`📧 Real OTP email sent to ${recipient}. Check your inbox.`);
        } else {
          const code = res.demoOtp || '';
          setDemoOtp(code);
          setOtpInput(code);
          setToastMessage(`🔑 Demo OTP (Twilio not configured): ${code}`);
        }
      }
    } catch (err) {
      setError(err.message || 'Failed to send OTP');
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOtp = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    const recipient = method === 'phone' ? `+91${phone.replace(/\D/g, '')}` : email;

    try {
      const res = await verifyOtpApi(recipient, otpInput, name);
      if (res && res.user) {
        onLoginSuccess(res.user);
        onClose();
      }
    } catch (err) {
      setError(err.message || 'Invalid OTP code. Try entering 123456 or the code sent.');
    } finally {
      setLoading(false);
    }
  };

  const handleExecuteGoogleLogin = async (targetEmail, targetName) => {
    setLoading(true);
    setError('');
    try {
      const res = await socialLoginApi('Google', targetEmail, targetName);
      if (res && res.user) {
        onLoginSuccess(res.user);
        setShowGoogleModal(false);
        onClose();
      }
    } catch (err) {
      setError('Failed to complete Google authentication');
    } finally {
      setLoading(false);
    }
  };

  const handleExecuteAppleLogin = async (targetEmail, targetName) => {
    setLoading(true);
    setError('');
    try {
      const res = await socialLoginApi('Apple', targetEmail, targetName);
      if (res && res.user) {
        onLoginSuccess(res.user);
        setShowAppleModal(false);
        onClose();
      }
    } catch (err) {
      setError('Failed to complete Apple authentication');
    } finally {
      setLoading(false);
    }
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
        className="w-full max-w-md rounded-2xl overflow-hidden shadow-2xl relative flex flex-col"
        style={{ background: 'var(--bg-secondary)', border: '1.5px solid var(--border-base)' }}
      >
        {/* Header */}
        <div
          className="p-5 flex items-center justify-between"
          style={{ borderBottom: '1px solid var(--border-base)', background: 'var(--bg-sidebar)' }}
        >
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ background: 'var(--accent)' }}>
              <ShieldCheck className="w-4 h-4 text-white" />
            </div>
            <div>
              <h3 className="text-sm font-bold font-sans-ui" style={{ color: 'var(--text-primary)' }}>
                Account Authentication
              </h3>
              <p className="text-[11px]" style={{ color: 'var(--text-muted)' }}>
                Sign in required prior to booking flights
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="w-7 h-7 rounded-full flex items-center justify-center cursor-pointer"
            style={{ background: 'var(--bg-input)', border: '1px solid var(--border-base)', color: 'var(--text-secondary)' }}
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="p-6 space-y-4">
          {/* Method Switcher */}
          {step === 'input' && (
            <div className="grid grid-cols-2 gap-2 p-1 rounded-xl" style={{ background: 'var(--bg-sidebar)', border: '1px solid var(--border-base)' }}>
              <button
                type="button"
                onClick={() => setMethod('phone')}
                className="py-2 text-xs font-bold rounded-lg flex items-center justify-center gap-1.5 cursor-pointer transition-all"
                style={{
                  background: method === 'phone' ? 'var(--accent)' : 'transparent',
                  color: method === 'phone' ? '#fff' : 'var(--text-secondary)',
                }}
              >
                <Phone className="w-3.5 h-3.5" /> Mobile OTP
              </button>
              <button
                type="button"
                onClick={() => setMethod('email')}
                className="py-2 text-xs font-bold rounded-lg flex items-center justify-center gap-1.5 cursor-pointer transition-all"
                style={{
                  background: method === 'email' ? 'var(--accent)' : 'transparent',
                  color: method === 'email' ? '#fff' : 'var(--text-secondary)',
                }}
              >
                <Mail className="w-3.5 h-3.5" /> Email OTP
              </button>
            </div>
          )}

          {toastMessage && (
            <div className="p-3 rounded-xl text-xs font-semibold" style={{ background: 'var(--accent-light)', color: 'var(--accent-text)', border: '1px solid var(--accent)' }}>
              {toastMessage}
            </div>
          )}

          {error && (
            <div className="p-3 rounded-xl text-xs font-semibold flex items-center gap-2" style={{ background: 'var(--tag-orange-bg)', color: 'var(--tag-orange-text)', border: '1px solid var(--tag-orange-text)44' }}>
              <AlertCircle className="w-4 h-4 flex-shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {step === 'input' ? (
            <form onSubmit={handleSendOtp} className="space-y-3">
              <div>
                <label className="block text-[11px] font-bold uppercase mb-1" style={{ color: 'var(--text-muted)' }}>
                  Full Name
                </label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Pranay Kashyap"
                  style={inputStyle}
                />
              </div>

              {method === 'phone' ? (
                <div>
                  <label className="block text-[11px] font-bold uppercase mb-1" style={{ color: 'var(--text-muted)' }}>
                    Mobile Number (+91)
                  </label>
                  <div className="flex items-center gap-2">
                    <span className="px-3 py-2 text-xs font-bold rounded-lg font-mono" style={{ background: 'var(--bg-sidebar)', border: '1.5px solid var(--border-base)', color: 'var(--text-primary)' }}>
                      +91
                    </span>
                    <input
                      type="tel"
                      required
                      maxLength={10}
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      placeholder="9876543210"
                      style={inputStyle}
                    />
                  </div>
                </div>
              ) : (
                <div>
                  <label className="block text-[11px] font-bold uppercase mb-1" style={{ color: 'var(--text-muted)' }}>
                    Email Address
                  </label>
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="e.g. rahul@example.com"
                    style={inputStyle}
                  />
                </div>
              )}

              <button
                type="submit"
                disabled={loading}
                className="w-full py-3 rounded-xl btn-glow font-bold text-xs uppercase tracking-wider cursor-pointer flex items-center justify-center gap-2"
              >
                {loading ? 'Sending Verification Code...' : 'Get OTP Code'} <ArrowRight className="w-4 h-4" />
              </button>

              <div className="pt-2 text-center">
                <span className="text-[11px]" style={{ color: 'var(--text-muted)' }}>Or continue with</span>
                <div className="grid grid-cols-2 gap-2 mt-2">
                  <button
                    type="button"
                    onClick={() => setShowGoogleModal(true)}
                    className="py-2.5 px-3 rounded-xl text-xs font-bold flex items-center justify-center gap-2 cursor-pointer transition-all"
                    style={{ background: 'var(--bg-sidebar)', border: '1.5px solid var(--border-base)', color: 'var(--text-primary)' }}
                  >
                    <span>Google</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setShowAppleModal(true)}
                    className="py-2.5 px-3 rounded-xl text-xs font-bold flex items-center justify-center gap-2 cursor-pointer transition-all"
                    style={{ background: 'var(--bg-sidebar)', border: '1.5px solid var(--border-base)', color: 'var(--text-primary)' }}
                  >
                    <span>Apple</span>
                  </button>
                </div>
              </div>
            </form>
          ) : (
            <form onSubmit={handleVerifyOtp} className="space-y-4">
              <div>
                <label className="block text-[11px] font-bold uppercase mb-1 text-center" style={{ color: 'var(--text-muted)' }}>
                  Enter 6-Digit OTP Code
                </label>
                <input
                  type="text"
                  required
                  maxLength={6}
                  value={otpInput}
                  onChange={(e) => setOtpInput(e.target.value)}
                  placeholder="123456"
                  className="text-center font-mono text-xl font-bold tracking-widest"
                  style={inputStyle}
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-3 rounded-xl btn-glow font-bold text-xs uppercase tracking-wider cursor-pointer flex items-center justify-center gap-2"
              >
                {loading ? 'Verifying...' : 'Verify OTP & Sign In'} <LogIn className="w-4 h-4" />
              </button>

              <button
                type="button"
                onClick={() => setStep('input')}
                className="w-full text-center text-xs font-semibold cursor-pointer"
                style={{ color: 'var(--accent)' }}
              >
                ← Back to change number / email
              </button>
            </form>
          )}
        </div>
      </div>

      {/* Google Modal Overlay */}
      {showGoogleModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 modal-overlay">
          <div className="w-full max-w-sm rounded-2xl p-5 space-y-4" style={{ background: 'var(--bg-secondary)', border: '1.5px solid var(--border-base)' }}>
            <h4 className="text-sm font-bold" style={{ color: 'var(--text-primary)' }}>Sign in with Google</h4>
            <div className="space-y-2">
              <button
                onClick={() => handleExecuteGoogleLogin(googleEmail, googleName)}
                className="w-full p-3 rounded-xl text-left cursor-pointer flex items-center justify-between"
                style={{ background: 'var(--bg-sidebar)', border: '1px solid var(--border-base)' }}
              >
                <div>
                  <div className="text-xs font-bold" style={{ color: 'var(--text-primary)' }}>{googleName}</div>
                  <div className="text-[11px]" style={{ color: 'var(--text-muted)' }}>{googleEmail}</div>
                </div>
              </button>
            </div>
            <button onClick={() => setShowGoogleModal(false)} className="w-full py-2 text-xs font-semibold" style={{ color: 'var(--text-muted)' }}>Cancel</button>
          </div>
        </div>
      )}

      {/* Apple Modal Overlay */}
      {showAppleModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 modal-overlay">
          <div className="w-full max-w-sm rounded-2xl p-5 space-y-4" style={{ background: 'var(--bg-secondary)', border: '1.5px solid var(--border-base)' }}>
            <h4 className="text-sm font-bold" style={{ color: 'var(--text-primary)' }}>Sign in with Apple ID</h4>
            <div className="space-y-2">
              <button
                onClick={() => handleExecuteAppleLogin(appleEmail, appleName)}
                className="w-full p-3 rounded-xl text-left cursor-pointer flex items-center justify-between"
                style={{ background: 'var(--bg-sidebar)', border: '1px solid var(--border-base)' }}
              >
                <div>
                  <div className="text-xs font-bold" style={{ color: 'var(--text-primary)' }}>{appleName}</div>
                  <div className="text-[11px]" style={{ color: 'var(--text-muted)' }}>{appleEmail}</div>
                </div>
              </button>
            </div>
            <button onClick={() => setShowAppleModal(false)} className="w-full py-2 text-xs font-semibold" style={{ color: 'var(--text-muted)' }}>Cancel</button>
          </div>
        </div>
      )}
    </div>
  );
}
