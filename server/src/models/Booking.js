const mongoose = require('mongoose');

const bookingSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    type: { type: String, enum: ['flight', 'hotel'], required: true },
    flight: { type: mongoose.Schema.Types.ObjectId, ref: 'Flight' },
    hotel: { type: mongoose.Schema.Types.ObjectId, ref: 'Hotel' },
    passengers: [
      {
        name: String,
        age: Number,
        gender: String,
      },
    ],
    checkIn: { type: String },
    checkOut: { type: String },
    rooms: { type: Number, default: 1 },
    totalPrice: { type: Number, required: true },
    status: { type: String, enum: ['confirmed', 'cancelled'], default: 'confirmed' },
    bookingRef: { type: String, unique: true },
  },
  { timestamps: true }
);

bookingSchema.pre('save', function (next) {
  if (!this.bookingRef) {
    this.bookingRef = 'TRV' + Date.now().toString(36).toUpperCase();
  }
  next();
});

module.exports = mongoose.model('Booking', bookingSchema);
