const { createStore } = require('../db/store');

const bookings = createStore('bookings');
const flights = createStore('flights');
const hotels = createStore('hotels');

const genRef = () => 'TRV' + Date.now().toString(36).toUpperCase();

exports.createBooking = (req, res) => {
  try {
    const { type, flightId, hotelId, passengers, checkIn, checkOut, rooms } = req.body;
    let totalPrice = 0;
    const bookingData = { user: req.user._id, type, passengers: passengers || [], status: 'confirmed', bookingRef: genRef() };

    if (type === 'flight') {
      const flight = flights.findById(flightId);
      if (!flight) return res.status(404).json({ message: 'Flight not found' });
      totalPrice = flight.price * (passengers?.length || 1);
      bookingData.flightId = flightId;
    } else if (type === 'hotel') {
      const hotel = hotels.findById(hotelId);
      if (!hotel) return res.status(404).json({ message: 'Hotel not found' });
      const nights = checkIn && checkOut
        ? Math.max(1, Math.ceil((new Date(checkOut) - new Date(checkIn)) / 86400000))
        : 1;
      totalPrice = hotel.pricePerNight * nights * (rooms || 1);
      bookingData.hotelId = hotelId;
      bookingData.checkIn = checkIn;
      bookingData.checkOut = checkOut;
      bookingData.rooms = rooms || 1;
    }

    bookingData.totalPrice = totalPrice;
    const booking = bookings.insert(bookingData);

    // Attach full item for response
    const populated = { ...booking };
    if (type === 'flight') populated.flight = flights.findById(flightId);
    else populated.hotel = hotels.findById(hotelId);

    res.status(201).json({ booking: populated });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.getMyBookings = (req, res) => {
  try {
    const myBookings = bookings.findAll((b) => b.user === req.user._id)
      .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
      .map((b) => ({
        ...b,
        flight: b.flightId ? flights.findById(b.flightId) : null,
        hotel: b.hotelId ? hotels.findById(b.hotelId) : null,
      }));
    res.json({ bookings: myBookings });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.cancelBooking = (req, res) => {
  try {
    const booking = bookings.findOne((b) => b._id === req.params.id && b.user === req.user._id);
    if (!booking) return res.status(404).json({ message: 'Booking not found' });
    const updated = bookings.updateById(req.params.id, { status: 'cancelled' });
    res.json({ booking: updated });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
