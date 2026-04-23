const mongoose = require('mongoose');

const hotelSchema = new mongoose.Schema({
  name: { type: String, required: true },
  city: { type: String, required: true },
  address: { type: String, required: true },
  rating: { type: Number, min: 1, max: 5 },
  pricePerNight: { type: Number, required: true },
  amenities: [String],
  image: { type: String, default: '' },
  description: { type: String, default: '' },
  availableRooms: { type: Number, default: 10 },
});

module.exports = mongoose.model('Hotel', hotelSchema);
