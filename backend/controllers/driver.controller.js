const Driver = require("../models/Driver");
const RentalRecord = require("../models/RentalRecords");
const User = require("../models/User");
const Car = require("../models/Car");
const Notification = require("../models/Notification");

// @desc    Get driver profile
// @route   GET /api/driver/profile
// @access  Private/Driver
exports.getDriverProfile = async (req, res) => {
  try {
    const driver = await Driver.findOne({ user: req.user.id });

    if (!driver) {
      return res.status(404).json({
        success: false,
        message: "Driver profile not found",
      });
    }

    res.status(200).json({
      success: true,
      data: driver,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};

// @desc    Create or update driver profile
// @route   POST /api/driver/profile
// @access  Private/Driver
exports.createUpdateDriverProfile = async (req, res) => {
  try {
    // Check if driver profile exists
    let driver = await Driver.findOne({ user: req.user.id });

    // If not, create new profile
    if (!driver) {
      // Extract fields from request body or use defaults
      const {
        location = "Not specified",
        licenseNumber,
        licenseExpiry,
        experience = 0,
        vehiclePreferences = [],
        bio = "",
        phoneNumber,
        emergencyContact = {},
        languages = ["English"],
      } = req.body;

      // Validate required fields
      if (!licenseNumber) {
        return res.status(400).json({
          success: false,
          message: "License number is required",
        });
      }

      if (!licenseExpiry) {
        return res.status(400).json({
          success: false,
          message: "License expiry date is required",
        });
      }

      // Create new driver profile
      driver = await Driver.create({
        user: req.user.id,
        location,
        licenseNumber,
        licenseExpiry,
        experience,
        vehiclePreferences,
        bio,
        phoneNumber,
        emergencyContact,
        languages,
        isAvailable: true,
      });

      res.status(201).json({
        success: true,
        data: driver,
        message: "Driver profile created successfully",
      });
    } else {
      // Update existing profile
      const updatedFields = {};

      // Only update fields that are provided
      Object.keys(req.body).forEach((key) => {
        if (req.body[key] !== undefined) {
          updatedFields[key] = req.body[key];
        }
      });

      driver = await Driver.findOneAndUpdate(
        { user: req.user.id },
        updatedFields,
        { new: true, runValidators: true }
      );

      res.status(200).json({
        success: true,
        data: driver,
        message: "Driver profile updated successfully",
      });
    }
  } catch (err) {
    console.error(err);
    res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};

// @desc    Get ride requests
// @route   GET /api/driver/ride-requests
// @access  Private/Driver
exports.getRideRequests = async (req, res) => {
  try {
    // Find driver to get location
    const driver = await Driver.findOne({ user: req.user.id });

    if (!driver) {
      return res.status(404).json({
        success: false,
        message: "Driver profile not found",
      });
    }

    // Find rental records with driver requests in the same location
    // that haven't been assigned to any driver yet
    const rideRequests = await RentalRecord.find({
      withDriver: true,
      status: "pending",
      driver: null,
      // Match driver's location (using regex for flexibility)
      $or: [
        { pickupLocation: { $regex: driver.location, $options: "i" } },
        { "car.location": { $regex: driver.location, $options: "i" } },
      ],
    }).populate([
      { path: "car", select: "make model category location" },
      { path: "renter", select: "name phone" },
    ]);

    res.status(200).json({
      success: true,
      count: rideRequests.length,
      data: rideRequests,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};

// @desc    Get active rides
// @route   GET /api/driver/active-rides
// @access  Private/Driver
exports.getActiveRides = async (req, res) => {
  try {
    // Find active rides for this driver
    const activeRides = await RentalRecord.find({
      driver: req.user.id,
      status: { $in: ["active", "approved"] },
    }).populate([
      { path: "car", select: "make model category location" },
      { path: "renter", select: "name phone" },
    ]);

    res.status(200).json({
      success: true,
      count: activeRides.length,
      data: activeRides,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};

// @desc    Get ride history
// @route   GET /api/driver/ride-history
// @access  Private/Driver
exports.getRideHistory = async (req, res) => {
  try {
    // Find completed/cancelled rides for this driver
    const completedRides = await RentalRecord.find({
      driver: req.user.id,
      status: { $in: ["completed", "cancelled"] },
    }).populate([
      { path: "car", select: "make model category location" },
      { path: "renter", select: "name phone" },
    ]);

    res.status(200).json({
      success: true,
      count: completedRides.length,
      data: completedRides,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};

// @desc    Accept a ride request
// @route   POST /api/driver/ride-requests/:id/accept
// @access  Private/Driver
exports.acceptRide = async (req, res) => {
  try {
    // Find the booking
    const booking = await RentalRecord.findById(req.params.id);

    if (!booking) {
      return res.status(404).json({
        success: false,
        message: "Booking not found",
      });
    }

    // Check if booking can be accepted (is pending and with driver)
    if (booking.status !== "pending" || !booking.withDriver) {
      return res.status(400).json({
        success: false,
        message: "This booking cannot be accepted",
      });
    }

    // Update booking with driver info and status
    booking.driver = req.user.id;
    booking.status = "approved";
    await booking.save();

    // Create notification for the renter
    await Notification.create({
      user: booking.renter,
      type: "driver_accepted",
      message: "A driver has accepted your ride request",
      details: {
        bookingId: booking._id,
        carModel: `${booking.car.make} ${booking.car.model}`,
        driverName: req.user.name,
      },
    });

    res.status(200).json({
      success: true,
      data: booking,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};

// @desc    Reject a ride request
// @route   POST /api/driver/ride-requests/:id/reject
// @access  Private/Driver
exports.rejectRide = async (req, res) => {
  try {
    // Find the booking
    const booking = await RentalRecord.findById(req.params.id);

    if (!booking) {
      return res.status(404).json({
        success: false,
        message: "Booking not found",
      });
    }

    // Check if booking is still pending
    if (booking.status !== "pending") {
      return res.status(400).json({
        success: false,
        message: "This booking cannot be rejected anymore",
      });
    }

    // Check if the driver is rejecting in the same location
    // If this is the only driver available in the area or the last one to reject,
    // we need to update booking to be without driver
    const driver = await Driver.findOne({ user: req.user.id });

    // Count other available drivers in the same location
    const availableDriversCount = await Driver.countDocuments({
      location: driver.location,
      isAvailable: true,
      user: { $ne: req.user.id }, // Exclude current driver
    });

    if (availableDriversCount === 0) {
      // No other drivers available, update booking to be without driver
      booking.withDriver = false;
      await booking.save();

      // Create notification for the renter
      await Notification.create({
        user: booking.renter,
        type: "driver_rejected",
        message: "No drivers are available for your booking",
        details: {
          bookingId: booking._id,
          carModel: `${booking.car.make} ${booking.car.model}`,
        },
      });
    }

    res.status(200).json({
      success: true,
      data: { message: "Ride request rejected successfully" },
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};

// @desc    Toggle driver availability
// @route   PATCH /api/driver/toggle-availability
// @access  Private/Driver
exports.toggleAvailability = async (req, res) => {
  try {
    const { isAvailable } = req.body;

    if (typeof isAvailable !== "boolean") {
      return res.status(400).json({
        success: false,
        message: "isAvailable must be a boolean value",
      });
    }

    const driver = await Driver.findOne({ user: req.user.id });

    if (!driver) {
      return res.status(404).json({
        success: false,
        message: "Driver profile not found",
      });
    }

    driver.isAvailable = isAvailable;
    await driver.save();

    res.status(200).json({
      success: true,
      data: driver,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};

// @desc    Complete a ride
// @route   POST /api/driver/rides/:id/complete
// @access  Private/Driver
exports.endRide = async (req, res) => {
  try {
    // Find the booking
    const booking = await RentalRecord.findById(req.params.id);

    if (!booking) {
      return res.status(404).json({
        success: false,
        message: "Booking not found",
      });
    }

    // Check if the booking belongs to this driver
    if (booking.driver.toString() !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: "Not authorized to complete this ride",
      });
    }

    // Check if booking is active
    if (booking.status !== "active" && booking.status !== "approved") {
      return res.status(400).json({
        success: false,
        message: "This booking cannot be completed",
      });
    }

    // Update booking status
    booking.status = "completed";
    await booking.save();

    // Create notification for the renter
    await Notification.create({
      user: booking.renter,
      type: "ride_completed",
      message: "Your ride has been completed",
      details: {
        bookingId: booking._id,
        carModel: `${booking.car.make} ${booking.car.model}`,
      },
    });

    res.status(200).json({
      success: true,
      data: booking,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};

// @desc    Get driver notifications
// @route   GET /api/driver/notifications
// @access  Private/Driver
exports.getNotifications = async (req, res) => {
  try {
    const notifications = await Notification.find({
      user: req.user.id,
    }).sort({ createdAt: -1 }); // Newest first

    res.status(200).json({
      success: true,
      count: notifications.length,
      data: notifications,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};

// @desc    Mark notification as read
// @route   PATCH /api/driver/notifications/:id
// @access  Private/Driver
exports.markNotificationAsRead = async (req, res) => {
  try {
    const notification = await Notification.findById(req.params.id);

    if (!notification) {
      return res.status(404).json({
        success: false,
        message: "Notification not found",
      });
    }

    // Ensure the notification belongs to the user
    if (notification.user.toString() !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: "Not authorized to update this notification",
      });
    }

    notification.read = true;
    await notification.save();

    res.status(200).json({
      success: true,
      data: notification,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};

// Helper function to calculate driver pay
const calculateDriverPay = (startDate, endDate) => {
  const start = new Date(startDate);
  const end = new Date(endDate);
  const days = Math.ceil((end - start) / (1000 * 60 * 60 * 24));
  const dailyRate = 500; // Base daily rate for drivers
  return days * dailyRate;
};
