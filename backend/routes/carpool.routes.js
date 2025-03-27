const express = require('express');
const {
    searchRides,
    postRide,
    bookRide,
    getUserRides,
    cancelRideBooking,
    getOfferedRides
} = require('../controllers/carpool.controller');
const { protect, authorize } = require('../middleware/auth');

const router = express.Router();

// Public routes
router.get('/search', searchRides);

// Protected routes
router.use(protect);
router.use(authorize('carpool'));

router.post('/rides', postRide);
router.post('/rides/:id/book', bookRide);
router.get('/user-rides', getUserRides);
router.get('/offered-rides', getOfferedRides);
router.post('/rides/:id/cancel', cancelRideBooking);

module.exports = router;