const mongoose = require('mongoose');

const flightSchema = new mongoose.Schema({
  airline: { type: String, required: true },
  flightNumber: { type: String, required: true },
  from: { type: String, required: true },
  to: { type: String, required: true },
  departureTime: { type: String, required: true },
  arrivalTime: { type: String, required: true },
  duration: { type: String, required: true },
  price: { type: Number, required: true },
  seats: { type: Number, default: 50 },
  class: { type: String, enum: ['Economy', 'Business', 'First'], default: 'Economy' },
  date: { type: String, required: true },
});

module.exports = mongoose.model('Flight', flightSchema);
