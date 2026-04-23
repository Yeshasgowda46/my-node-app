const { createStore } = require('../db/store');

const flights = createStore('flights');

exports.searchFlights = (req, res) => {
  try {
    const { from, to, date, class: cls } = req.query;
    let results = flights.findAll();

    if (from) results = results.filter((f) => f.from.toLowerCase().includes(from.toLowerCase()));
    if (to) results = results.filter((f) => f.to.toLowerCase().includes(to.toLowerCase()));
    if (date) results = results.filter((f) => f.date === date);
    if (cls) results = results.filter((f) => f.class === cls);

    results.sort((a, b) => a.price - b.price);
    res.json({ flights: results });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.getFlightById = (req, res) => {
  const flight = flights.findById(req.params.id);
  if (!flight) return res.status(404).json({ message: 'Flight not found' });
  res.json({ flight });
};
