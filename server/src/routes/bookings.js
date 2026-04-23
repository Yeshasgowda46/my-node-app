const router = require('express').Router();
const { createBooking, getMyBookings, cancelBooking } = require('../controllers/bookingController');
const { protect } = require('../middleware/auth');

router.use(protect);
router.post('/', createBooking);
router.get('/my', getMyBookings);
router.patch('/:id/cancel', cancelBooking);

module.exports = router;
