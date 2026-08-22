import mongoose from 'mongoose';

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true
    },
    email: {
      type: String,
      trim: true,
      lowercase: true,
      index: { unique: true, sparse: true }
    },
    phone: {
      type: String,
      trim: true,
      index: { unique: true, sparse: true }
    },
    authProvider: {
      type: String,
      enum: ['phone', 'email', 'google', 'apple'],
      default: 'phone'
    },
    isVerified: {
      type: Boolean,
      default: true
    },
    memberSince: {
      type: String,
      default: () => new Date().getFullYear().toString()
    },
    avatar: {
      type: String,
      default: ''
    },
    bookings: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Booking'
      }
    ]
  },
  {
    timestamps: true,
    toJSON: {
      virtuals: true,
      transform: (doc, ret) => {
        ret.id = ret._id.toString();
        delete ret.__v;
        return ret;
      }
    }
  }
);

const User = mongoose.models.User || mongoose.model('User', userSchema);
export default User;
