const express = require("express");
const {
  getRideRequests,
  getActiveRides,
  getRideHistory,
  acceptRide,
  rejectRide,
  toggleAvailability,
  getDriverProfile,
  getNotifications,
  markNotificationAsRead,
  endRide,
  createUpdateDriverProfile,
} = require("../controllers/driver.controller");
const { protect, authorize, authorizeRole } = require("../middleware/auth");

const router = express.Router();

// Protect all routes
router.use(protect);

// More flexible authorization
// This allows both direct driver users and carRental/driver role users
router.use((req, res, next) => {
  const isDriver =
    req.user.type === "driver" ||
    (req.user.type === "carRental" && req.user.role === "driver");

  if (!isDriver) {
    return res.status(403).json({
      success: false,
      message: `User is not a driver. Type: ${req.user.type}, Role: ${req.user.role}`,
    });
  }

  next();
});

// Routes
router.get("/profile", getDriverProfile);
router.get("/ride-requests", getRideRequests);
router.get("/active-rides", getActiveRides);
router.get("/ride-history", getRideHistory);
router.post("/ride-requests/:id/accept", acceptRide);
router.post("/ride-requests/:id/reject", rejectRide);
router.patch("/toggle-availability", toggleAvailability);
router.post("/rides/:id/complete", endRide);
router.get("/notifications", getNotifications);
router.patch("/notifications/:id", markNotificationAsRead);
router.post("/profile", createUpdateDriverProfile);

module.exports = router;
