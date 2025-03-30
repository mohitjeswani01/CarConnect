const express = require("express");
const {
  searchCars,
  getBookings,
  bookCar,
  cancelBooking,
} = require("../controllers/carRenter.controller");
const { protect, authorize, authorizeRole } = require("../middleware/auth");

const router = express.Router();

// Protect all routes
router.use(protect);
router.use(authorize("carRental"));
router.use(authorizeRole("renter"));

// Routes
router.get("/search", searchCars);
router.get("/bookings", getBookings);
router.post("/cars/:id/book", bookCar);
router.post("/bookings/:id/cancel", cancelBooking);

module.exports = router;
