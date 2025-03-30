const Car = require("../models/Car");
const RentalRecord = require("../models/RentalRecords");
const User = require("../models/User");
const RideRequest = require("../models/RideRequest");
const Driver = require("../models/Driver");
const Notification = require("../models/Notification");

// @desc    Search for available cars
// @route   GET /api/car-renter/search
// @access  Private/CarRenter
exports.searchCars = async (req, res, next) => {
  try {
    const { location, category } = req.query;

    // Build query with filters
    const query = { isAvailable: true };

    if (location) {
      query.location = { $regex: location, $options: "i" };
    }

    if (category) {
      query.category = { $regex: category, $options: "i" };
    }

    // Find all available cars
    const cars = await Car.find(query).populate("owner", "name");

    res.status(200).json({
      success: true,
      count: cars.length,
      data: cars,
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Get user's bookings
// @route   GET /api/car-renter/bookings
// @access  Private/CarRenter
exports.getBookings = async (req, res, next) => {
  try {
    // Find all bookings for this renter
    const bookings = await RentalRecord.find({
      renter: req.user.id,
    }).populate({
      path: "car",
      select: "make model category photos features",
    });

    res.status(200).json({
      success: true,
      count: bookings.length,
      data: bookings,
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Book a car
// @route   POST /api/car-renter/cars/:id/book
// @access  Private/CarRenter
exports.bookCar = async (req, res, next) => {
  try {
    const { startDate, endDate, withDriver } = req.body;

    // Validate dates
    if (!startDate || !endDate) {
      return res.status(400).json({
        success: false,
        message: "Please provide start and end dates",
      });
    }

    // Parse dates
    const parsedStartDate = new Date(startDate);
    const parsedEndDate = new Date(endDate);

    // Validate date order
    if (parsedEndDate <= parsedStartDate) {
      return res.status(400).json({
        success: false,
        message: "End date must be after start date",
      });
    }

    // Find the car
    const car = await Car.findById(req.params.id);

    if (!car) {
      return res.status(404).json({
        success: false,
        message: "Car not found",
      });
    }

    // Check if car is available
    if (!car.isAvailable) {
      return res.status(400).json({
        success: false,
        message: "Car is not available for booking",
      });
    }

    // Calculate total days
    const totalDays = Math.ceil(
      (parsedEndDate - parsedStartDate) / (1000 * 60 * 60 * 24)
    );

    // Calculate total price (with driver costs extra if selected)
    const driverCost = withDriver ? 500 : 0; // Example: 500 per day for driver
    const totalPrice = (car.pricePerDay + driverCost) * totalDays;

    // Create booking record
    const booking = await RentalRecord.create({
      car: car._id,
      renter: req.user.id,
      startDate: parsedStartDate,
      endDate: parsedEndDate,
      totalPrice,
      status: withDriver ? "pending" : "confirmed", // If with driver, status starts as pending until driver accepts
      withDriver: withDriver || false,
    });

    // If booked with driver, create ride requests for available drivers in the area
    if (withDriver) {
      // Find available drivers in the same location as the car
      const availableDrivers = await User.find({
        type: "carRental",
        role: "driver",
        isAvailable: true,
        location: car.location, // Assuming drivers have a location field matching car location
      });

      console.log(
        `Found ${availableDrivers.length} available drivers in ${car.location}`
      );

      // Create ride requests for each available driver
      const createRideRequests = availableDrivers.map((driver) => {
        return RideRequest.create({
          car: car._id,
          renter: req.user.id,
          status: "pending",
          startDate: parsedStartDate,
          endDate: parsedEndDate,
          pickupLocation: car.location,
          dropoffLocation: req.body.dropoffLocation || car.location,
          driverPay: driverCost * totalDays,
          rentalRecord: booking._id,
        });
      });

      await Promise.all(createRideRequests);

      console.log(
        `Created ${createRideRequests.length} ride requests for booking ${booking._id}`
      );

      // Notify nearby drivers
      const driversInArea = await Driver.find({
        location: { $regex: car.location, $options: "i" },
        isAvailable: true,
      }).populate("user", "id");

      for (const driver of driversInArea) {
        await Notification.create({
          user: driver.user.id,
          type: "new_ride_request",
          message: "New ride request in your area",
          details: {
            bookingId: booking._id,
            carModel: `${car.make} ${car.model}`,
            renterName: req.user.name,
            location: car.location,
          },
        });
      }
    }

    res.status(201).json({
      success: true,
      data: booking,
      message: withDriver
        ? "Car booked with driver. Waiting for driver confirmation."
        : "Car booked successfully.",
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Cancel booking
// @route   POST /api/car-renter/bookings/:id/cancel
// @access  Private/CarRenter
exports.cancelBooking = async (req, res, next) => {
  try {
    const booking = await RentalRecord.findById(req.params.id);

    if (!booking) {
      return res.status(404).json({
        success: false,
        message: "Booking not found",
      });
    }

    // Ensure the booking belongs to the user
    if (booking.renter.toString() !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: "Not authorized to cancel this booking",
      });
    }

    // Check if booking can be cancelled (not already completed)
    if (booking.status === "completed") {
      return res.status(400).json({
        success: false,
        message: "Cannot cancel a completed booking",
      });
    }

    // Update booking status
    booking.status = "cancelled";
    await booking.save();

    res.status(200).json({
      success: true,
      data: booking,
    });
  } catch (err) {
    next(err);
  }
};
