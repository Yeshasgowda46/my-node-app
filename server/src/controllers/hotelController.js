const { createStore } = require('../db/store');

const hotels = createStore('hotels');

exports.searchHotels = (req, res) => {
  try {
    const { city, minPrice, maxPrice, rating } = req.query;
    let results = hotels.findAll();

    if (city) results = results.filter((h) => h.city.toLowerCase().includes(city.toLowerCase()));
    if (minPrice) results = results.filter((h) => h.pricePerNight >= Number(minPrice));
    if (maxPrice) results = results.filter((h) => h.pricePerNight <= Number(maxPrice));
    if (rating) results = results.filter((h) => h.rating >= Number(rating));

    results.sort((a, b) => a.pricePerNight - b.pricePerNight);
    res.json({ hotels: results });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.getHotelById = (req, res) => {
  const hotel = hotels.findById(req.params.id);
  if (!hotel) return res.status(404).json({ message: 'Hotel not found' });
  res.json({ hotel });
};
