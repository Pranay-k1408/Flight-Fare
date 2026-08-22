import nodemailer from 'nodemailer';
import twilio from 'twilio';
import dotenv from 'dotenv';
import User from '../models/User.js';
import Otp from '../models/Otp.js';

dotenv.config();

// In-memory OTP store and User Registry for instant fallback
const otpStore = new Map();
const userRegistryMap = new Map();

// ─── SMS CLIENT (Twilio) ───────────────────────────────────────────────────────
let smsClient = null;
if (process.env.TWILIO_ACCOUNT_SID && process.env.TWILIO_AUTH_TOKEN &&
    !process.env.TWILIO_ACCOUNT_SID.includes('xxx')) {
  smsClient = twilio(process.env.TWILIO_ACCOUNT_SID, process.env.TWILIO_AUTH_TOKEN);
  console.log('📱 [TWILIO SMS] Initialized with real credentials.');
} else {
  console.warn('⚠️  [TWILIO SMS] Not configured. Set TWILIO_ACCOUNT_SID, TWILIO_AUTH_TOKEN, TWILIO_PHONE_NUMBER in .env to enable real SMS OTP.');
}

// ─── EMAIL TRANSPORTER (Nodemailer) ───────────────────────────────────────────
let transporter = null;
const initTransporter = async () => {
  if (process.env.SMTP_HOST && process.env.SMTP_USER && process.env.SMTP_PASS &&
      process.env.SMTP_PASS !== 'your_gmail_app_password_here') {
    transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: Number(process.env.SMTP_PORT) || 587,
      secure: process.env.SMTP_SECURE === 'true',
      auth: { user: process.env.SMTP_USER, pass: process.env.SMTP_PASS }
    });
    console.log(`📧 [SMTP EMAIL] Initialized with ${process.env.SMTP_HOST}`);
  } else {
    try {
      const testAccount = await nodemailer.createTestAccount();
      transporter = nodemailer.createTransport({
        host: 'smtp.ethereal.email', port: 587, secure: false,
        auth: { user: testAccount.user, pass: testAccount.pass }
      });
      console.log(`📧 [SMTP EMAIL] Using Ethereal test transport: ${testAccount.user}`);
    } catch (err) {
      console.error('⚠️  [SMTP EMAIL] Failed to initialize:', err.message);
    }
  }
};
initTransporter();

// ─── SEND OTP ─────────────────────────────────────────────────────────────────
export const sendOtp = async (req, res) => {
  const { recipient, type = 'phone' } = req.body;

  if (!recipient) {
    return res.status(400).json({ error: 'Phone number or email is required' });
  }

  const generatedOtp = Math.floor(100000 + Math.random() * 900000).toString();
  const expiresAt = new Date(Date.now() + 5 * 60 * 1000);

  // In-memory caching
  otpStore.set(recipient, { otp: generatedOtp, expiresAt: expiresAt.getTime() });

  // MongoDB Persistent Storage
  try {
    await Otp.deleteMany({ recipient });
    await Otp.create({ recipient, otp: generatedOtp, type, expiresAt });
  } catch (dbErr) {
    // If DB is offline/reconnecting, in-memory store handles it
  }

  let isExistingUser = userRegistryMap.has(recipient);
  try {
    const isEmail = recipient.includes('@');
    const existingDbUser = await User.findOne(isEmail ? { email: recipient.toLowerCase() } : { phone: recipient });
    if (existingDbUser) isExistingUser = true;
  } catch (e) {}

  let smsSent = false;
  let emailSent = false;
  let emailPreviewUrl = '';

  console.log(`🔑 [OTP GENERATED] For ${type} (${recipient}): ${generatedOtp}`);

  // ── SMS via Twilio (phone numbers) ──────────────────────────────────────────
  if (type === 'phone' && smsClient) {
    try {
      let formattedRecipient = recipient.trim().replace(/[\s\-()]/g, '');
      if (!formattedRecipient.startsWith('+')) {
        formattedRecipient = `+91${formattedRecipient}`;
      }

      if (process.env.TWILIO_VERIFY_SERVICE_SID) {
        const verification = await smsClient.verify.v2
          .services(process.env.TWILIO_VERIFY_SERVICE_SID)
          .verifications.create({ to: formattedRecipient, channel: 'sms' });
        smsSent = true;
        console.log(`✅ [TWILIO VERIFY SMS SENT] Real SMS OTP dispatched to ${formattedRecipient} (Status: ${verification.status})`);
      } else if (process.env.TWILIO_PHONE_NUMBER) {
        const msg = await smsClient.messages.create({
          body: `Your verification code is: ${generatedOtp}`,
          from: process.env.TWILIO_PHONE_NUMBER,
          to: formattedRecipient
        });
        smsSent = true;
        console.log(`✅ [TWILIO SMS SENT] OTP ${generatedOtp} delivered to ${formattedRecipient} (SID: ${msg.sid})`);
      }
    } catch (smsErr) {
      console.error(`❌ [TWILIO SMS FAILED] Recipient: ${recipient}, Error: ${smsErr.message}`);
    }
  }

  // ── Email via Nodemailer (email addresses) ────────────────────────────────
  if (recipient.includes('@') && transporter) {
    try {
      const info = await transporter.sendMail({
        from: '"Skyward Global Flight Fare" <auth@skywardglobal.com>',
        to: recipient,
        subject: `Your Security Verification Code: ${generatedOtp}`,
        text: `Your Skyward Flight Fare verification code is ${generatedOtp}. Valid for 5 minutes.`,
        html: `
          <div style="font-family:Arial,sans-serif;background:#07090e;color:#fff;padding:30px;border-radius:16px;border:1px solid #1e293b;max-width:500px;margin:auto;">
            <div style="text-align:center;margin-bottom:20px;">
              <h2 style="color:#06b6d4;margin:0;letter-spacing:2px;text-transform:uppercase;">SKYWARD GLOBAL</h2>
              <p style="color:#94a3b8;font-size:12px;margin-top:4px;">Flight Fare Security Verification</p>
            </div>
            <div style="background:#0f172a;padding:24px;border-radius:12px;text-align:center;border:1px solid #334155;">
              <p style="color:#cbd5e1;font-size:14px;margin-bottom:12px;">Your 6-Digit Verification Code:</p>
              <div style="font-size:34px;font-weight:800;font-family:monospace;letter-spacing:8px;color:#38bdf8;background:rgba(2,132,199,0.15);padding:14px;border-radius:8px;border:1px solid rgba(2,132,199,0.5);margin-bottom:16px;">
                ${generatedOtp}
              </div>
              <p style="color:#64748b;font-size:11px;margin:0;">This code is valid for 5 minutes. Do not share with anyone.</p>
            </div>
            <div style="text-align:center;margin-top:20px;font-size:11px;color:#64748b;">&copy; 2026 Skyward Global. All rights reserved.</div>
          </div>`
      });
      emailSent = true;
      emailPreviewUrl = nodemailer.getTestMessageUrl(info) || '';
      console.log(`✅ [EMAIL SENT] OTP delivered to ${recipient}. Preview: ${emailPreviewUrl || 'real email'}`);
    } catch (mailErr) {
      console.error(`❌ [EMAIL FAILED] ${mailErr.message}`);
    }
  }

  res.json({
    success: true,
    message: isExistingUser
      ? `Welcome back! Verification OTP sent to ${recipient}`
      : `Registration OTP sent to ${recipient}`,
    type,
    recipient,
    smsSent,
    emailSent,
    emailPreviewUrl,
    isExistingUser,
    demoOtp: (!smsSent && !emailSent) ? generatedOtp : undefined
  });
};

// ─── VERIFY OTP ───────────────────────────────────────────────────────────────
export const verifyOtp = async (req, res) => {
  const { recipient, otp, name } = req.body;

  if (!recipient || !otp) {
    return res.status(400).json({ error: 'Recipient and OTP code are required' });
  }

  let isValid = false;

  // 1. Check Twilio Verify Service (if real phone)
  if (smsClient && process.env.TWILIO_VERIFY_SERVICE_SID) {
    try {
      let formattedRecipient = recipient.trim().replace(/[\s\-()]/g, '');
      if (!formattedRecipient.startsWith('+') && !formattedRecipient.includes('@')) {
        formattedRecipient = `+91${formattedRecipient}`;
      }
      if (formattedRecipient.startsWith('+')) {
        const check = await smsClient.verify.v2
          .services(process.env.TWILIO_VERIFY_SERVICE_SID)
          .verificationChecks.create({ to: formattedRecipient, code: otp.trim() });
        if (check.status === 'approved') {
          isValid = true;
        }
      }
    } catch (twilioCheckErr) {
      // Fall through to memory / DB check
    }
  }

  // 2. Check in-memory
  if (!isValid) {
    const record = otpStore.get(recipient);
    if (record && record.otp === otp && record.expiresAt >= Date.now()) {
      isValid = true;
      otpStore.delete(recipient);
    }
  }

  // 3. Check MongoDB
  if (!isValid) {
    try {
      const dbOtp = await Otp.findOne({ recipient, otp, expiresAt: { $gte: new Date() } });
      if (dbOtp) {
        isValid = true;
        await Otp.deleteMany({ recipient });
      }
    } catch (dbErr) {}
  }

  if (!isValid) {
    return res.status(400).json({ error: 'Invalid or expired OTP code. Please request a new one.' });
  }

  const isEmail = recipient.includes('@');
  const cleanName = (name || '').trim() || (isEmail ? recipient.split('@')[0] : 'Traveler');

  let user = null;
  let statusMessage = 'Signed in successfully.';

  // MongoDB User Upsert
  try {
    const query = isEmail ? { email: recipient.toLowerCase() } : { phone: recipient };
    let dbUser = await User.findOne(query);

    if (dbUser) {
      statusMessage = `Welcome back, ${dbUser.name}! Signed in successfully.`;
      user = {
        id: dbUser._id.toString(),
        name: dbUser.name,
        email: dbUser.email || '',
        phone: dbUser.phone || '',
        isVerified: true,
        memberSince: dbUser.memberSince || '2026',
        token: `JWT_TOKEN_${Date.now()}`
      };
    } else {
      dbUser = await User.create({
        name: cleanName,
        email: isEmail ? recipient.toLowerCase() : undefined,
        phone: !isEmail ? recipient : undefined,
        authProvider: isEmail ? 'email' : 'phone',
        isVerified: true,
        memberSince: new Date().getFullYear().toString()
      });
      statusMessage = 'Account created & verified! Welcome to Flight Fare.';
      user = {
        id: dbUser._id.toString(),
        name: dbUser.name,
        email: dbUser.email || '',
        phone: dbUser.phone || '',
        isVerified: true,
        memberSince: dbUser.memberSince || '2026',
        token: `JWT_TOKEN_${Date.now()}`
      };
    }
  } catch (dbErr) {
    // In-memory fallback
    if (userRegistryMap.has(recipient)) {
      user = userRegistryMap.get(recipient);
      statusMessage = 'Welcome back! Signed in successfully.';
    } else {
      user = {
        id: `USR-${Math.floor(10000 + Math.random() * 90000)}`,
        name: cleanName,
        email: isEmail ? recipient : '',
        phone: isEmail ? '' : recipient,
        isVerified: true,
        memberSince: '2026',
        token: `JWT_TOKEN_${Date.now()}`
      };
      userRegistryMap.set(recipient, user);
      statusMessage = 'Account verified! Welcome to Flight Fare.';
    }
  }

  // Update in-memory registry map
  if (user) {
    userRegistryMap.set(recipient, user);
  }

  res.json({ success: true, message: statusMessage, user });
};

// ─── SOCIAL LOGIN ─────────────────────────────────────────────────────────────
export const socialLogin = async (req, res) => {
  const { provider = 'Google', email, name, avatar } = req.body;
  const key = email || `${provider.toLowerCase()}_user`;
  const cleanName = (name || '').trim() || (email ? email.split('@')[0] : `${provider} User`);

  let user = null;

  try {
    if (email) {
      let dbUser = await User.findOne({ email: email.toLowerCase() });
      if (!dbUser) {
        dbUser = await User.create({
          name: cleanName,
          email: email.toLowerCase(),
          authProvider: provider.toLowerCase(),
          avatar: avatar || '',
          isVerified: true,
          memberSince: new Date().getFullYear().toString()
        });
      }
      user = {
        id: dbUser._id.toString(),
        name: dbUser.name,
        email: dbUser.email,
        phone: dbUser.phone || '',
        avatar: dbUser.avatar || '',
        isVerified: true,
        memberSince: dbUser.memberSince || '2026',
        token: `JWT_SOCIAL_${Date.now()}`
      };
    }
  } catch (dbErr) {
    // fallback
  }

  if (!user) {
    if (userRegistryMap.has(key)) {
      user = userRegistryMap.get(key);
    } else {
      user = {
        id: `USR-${Math.floor(10000 + Math.random() * 90000)}`,
        name: cleanName,
        email: email || `${provider.toLowerCase()}_user@skyward.com`,
        phone: '',
        avatar: avatar || '',
        isVerified: true,
        memberSince: '2026',
        token: `JWT_SOCIAL_${Date.now()}`
      };
      userRegistryMap.set(key, user);
    }
  }

  res.json({ success: true, message: `Signed in via ${provider}`, user });
};
