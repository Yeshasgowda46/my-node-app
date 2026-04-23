const router = require('express').Router();
const { searchHotels, getHotelById } = require('../controllers/hotelController');

router.get('/search', searchHotels);
router.get('/:id', getHotelById);

module.exports = router;
