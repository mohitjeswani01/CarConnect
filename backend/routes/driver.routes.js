const express = require('express');
const {
    getRideRequests,
    getActiveRides,
    getRideHistory,
    acceptRide,
    rejectRide,
    toggleAvailability
} = require('../controllers/driver.controller');
const { protect, authorize, authorizeRole } = require('../middleware/auth');

const router = express.Router();

// Protect all routes
router.use(protect);
router.use(authorize('carRental'));
router.use(authorizeRole('driver'));

// Routes
router.get('/ride-requests', getRideRequests);
router.get('/active-rides', getActiveRides);
router.get('/ride-history', getRideHistory);
router.post('/ride-requests/:id/accept', acceptRide);
router.post('/ride-requests/:id/reject', rejectRide);
router.patch('/toggle-availability', toggleAvailability);

module.exports = router;