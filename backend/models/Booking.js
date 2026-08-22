import mongoose from 'mongoose';

const bookingSchema = new mongoose.Schema(
  {
    pnr: {
      type: String,
      required: true,
      unique: true,
      index: true
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      index: true
    },
    passengerName: {
      type: String,
      required: true
    },
    email: {
      type: String,
      trim: true,
      lowercase: true
    },
    phone: {
      type: String,
      trim: true
    },
    flight: {
      flightNumber: String,
      airline: {
        code: String,
        name: String,
        logo: String
      },
      origin: String,
      destination: String,
      depTime: String,
      arrTime: String,
      duration: String,
      date: String,
      aircraft: String,
      cabinClass: String
    },
    seat: {
      type: String,
      default: '11A'
    },
    passengers: {
      type: Number,
      default: 1
    },
    totalPrice: {
      type: Number,
      required: true
    },
    currency: {
      type: String,
      default: 'INR'
    },
    status: {
      type: String,
      enum: ['CONFIRMED', 'PENDING', 'CANCELLED'],
      default: 'CONFIRMED'
    }
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

const Booking = mongoose.models.Booking || mongoose.model('Booking', bookingSchema);
export default Booking;
