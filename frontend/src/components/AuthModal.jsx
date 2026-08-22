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

              <div className="pt-2">
                <div className="relative flex items-center justify-center my-3">
                  <div className="flex-grow border-t" style={{ borderColor: 'var(--border-base)' }} />
                  <span className="px-3 text-[11px] font-medium tracking-wider" style={{ color: 'var(--text-muted)' }}>
                    Or continue with
                  </span>
                  <div className="flex-grow border-t" style={{ borderColor: 'var(--border-base)' }} />
                </div>
                <div className="grid grid-cols-2 gap-2 mt-2">
                  <button
                    type="button"
                    onClick={() => setShowGoogleModal(true)}
                    className="py-2.5 px-3 rounded-xl text-xs font-bold flex items-center justify-center gap-2 cursor-pointer transition-all hover:opacity-90"
                    style={{ background: 'var(--bg-sidebar)', border: '1.5px solid var(--border-base)', color: 'var(--text-primary)' }}
                  >
                    <svg className="w-4 h-4 flex-shrink-0" viewBox="0 0 24 24">
                      <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                      <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                      <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" />
                      <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" />
                    </svg>
                    <span>Google</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setShowAppleModal(true)}
                    className="py-2.5 px-3 rounded-xl text-xs font-bold flex items-center justify-center gap-2 cursor-pointer transition-all hover:opacity-90"
                    style={{ background: 'var(--bg-sidebar)', border: '1.5px solid var(--border-base)', color: 'var(--text-primary)' }}
                  >
                    <svg className="w-4 h-4 flex-shrink-0 fill-current" viewBox="0 0 170 170">
                      <path d="M150.37 130.25c-2.45 5.66-5.35 10.87-8.71 15.66-4.58 6.53-8.33 11.05-11.22 13.56-4.48 4.12-9.28 6.23-14.42 6.35-3.69 0-8.14-1.05-13.32-3.18-5.19-2.12-9.97-3.17-14.34-3.17-4.58 0-9.49 1.05-14.75 3.17-5.26 2.13-9.5 3.24-12.74 3.35-4.35.13-9.16-1.9-14.42-6.08-3.7-3.04-7.6-7.79-11.7-14.25-5.74-9.03-10.24-19.16-13.5-30.39-3.26-11.22-4.89-21.99-4.89-32.31 0-14.59 3.73-26.68 11.2-36.26 7.47-9.58 16.89-14.45 28.26-14.61 5.34 0 11.07 1.41 17.2 4.22 6.12 2.81 10.02 4.27 11.7 4.38 1.45 0 5.48-1.52 12.09-4.56 6.61-3.04 12.44-4.35 17.5-3.92 13.59.88 24.3 5.76 32.13 14.64-11.75 7.1-17.51 16.73-17.29 28.89.22 9.57 3.99 17.53 11.31 23.88 7.32 6.36 15.89 9.87 25.7 10.55-2.07 6.19-4.58 12.35-7.55 18.49zM119.22 31.84c0-7.39 2.67-14.29 8.01-20.7 5.34-6.41 11.88-10.45 19.62-12.14.76 3.04 1.14 5.92 1.14 8.64 0 7.39-2.73 14.39-8.19 21.01-5.46 6.62-12.18 10.66-20.16 12.12-.22-2.83-.42-5.81-.42-8.93z" />
                    </svg>
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
            <h4 className="text-sm font-bold flex items-center gap-2" style={{ color: 'var(--text-primary)' }}>
              <svg className="w-4 h-4 flex-shrink-0" viewBox="0 0 24 24">
                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" />
                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" />
              </svg>
              <span>Sign in with Google</span>
            </h4>
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
            <h4 className="text-sm font-bold flex items-center gap-2" style={{ color: 'var(--text-primary)' }}>
              <svg className="w-4 h-4 flex-shrink-0 fill-current" viewBox="0 0 170 170">
                <path d="M150.37 130.25c-2.45 5.66-5.35 10.87-8.71 15.66-4.58 6.53-8.33 11.05-11.22 13.56-4.48 4.12-9.28 6.23-14.42 6.35-3.69 0-8.14-1.05-13.32-3.18-5.19-2.12-9.97-3.17-14.34-3.17-4.58 0-9.49 1.05-14.75 3.17-5.26 2.13-9.5 3.24-12.74 3.35-4.35.13-9.16-1.9-14.42-6.08-3.7-3.04-7.6-7.79-11.7-14.25-5.74-9.03-10.24-19.16-13.5-30.39-3.26-11.22-4.89-21.99-4.89-32.31 0-14.59 3.73-26.68 11.2-36.26 7.47-9.58 16.89-14.45 28.26-14.61 5.34 0 11.07 1.41 17.2 4.22 6.12 2.81 10.02 4.27 11.7 4.38 1.45 0 5.48-1.52 12.09-4.56 6.61-3.04 12.44-4.35 17.5-3.92 13.59.88 24.3 5.76 32.13 14.64-11.75 7.1-17.51 16.73-17.29 28.89.22 9.57 3.99 17.53 11.31 23.88 7.32 6.36 15.89 9.87 25.7 10.55-2.07 6.19-4.58 12.35-7.55 18.49zM119.22 31.84c0-7.39 2.67-14.29 8.01-20.7 5.34-6.41 11.88-10.45 19.62-12.14.76 3.04 1.14 5.92 1.14 8.64 0 7.39-2.73 14.39-8.19 21.01-5.46 6.62-12.18 10.66-20.16 12.12-.22-2.83-.42-5.81-.42-8.93z" />
              </svg>
              <span>Sign in with Apple ID</span>
            </h4>
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
