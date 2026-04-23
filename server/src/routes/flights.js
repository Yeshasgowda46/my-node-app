const router = require('express').Router();
const { searchFlights, getFlightById } = require('../controllers/flightController');

router.get('/search', searchFlights);
router.get('/:id', getFlightById);

module.exports = router;
