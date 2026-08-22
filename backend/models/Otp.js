import mongoose from 'mongoose';

const otpSchema = new mongoose.Schema(
  {
    recipient: {
      type: String,
      required: true,
      index: true
    },
    otp: {
      type: String,
      required: true
    },
    type: {
      type: String,
      enum: ['phone', 'email'],
      default: 'phone'
    },
    expiresAt: {
      type: Date,
      required: true,
      index: { expires: 300 } // MongoDB TTL index auto-deletes expired OTPs after 300 seconds (5 minutes)
    }
  },
  {
    timestamps: true
  }
);

const Otp = mongoose.models.Otp || mongoose.model('Otp', otpSchema);
export default Otp;
