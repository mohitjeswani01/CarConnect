const CarpoolRide = require("../models/CarpoolRide");
const moment = require('moment');

exports.searchRides = async (req, res, next) => {
  try {
    const { from, to, date } = req.params;

    // Input validation
    if (!from || !to) {
      return res.status(400).json({
        success: false,
        message: "Both 'from' and 'to' parameters are required"
      });
    }

    let query = {
      from: { $regex: new RegExp(from, 'i') },
      to: { $regex: new RegExp(to, 'i') },
      availableSeats: { $gt: 0 }
    };

    if (date && date !== 'undefined') {
      try {
        // Parse date using moment.js with strict validation
        const searchDate = moment(date, 'YYYY-MM-DD', true);

        if (!searchDate.isValid()) {
          return res.status(400).json({
            success: false,
            message: "Invalid date format. Please use YYYY-MM-DD"
          });
        }

        // Create date range for the entire day in UTC
        const startDate = searchDate.startOf('day').toDate();
        const endDate = searchDate.endOf('day').toDate();

        query.date = {
          $gte: startDate,
          $lte: endDate
        };
      } catch (err) {
        return res.status(400).json({
          success: false,
          message: "Invalid date parameter"
        });
      }
    }

    const rides = await CarpoolRide.find(query)
      .populate("driver", "name rating")
      .sort({ date: 1 })
      .lean();

    // Format response data consistently
    const formattedRides = rides.map(ride => {
      // Ensure date is properly formatted
      const rideDate = moment(ride.date).isValid()
        ? moment(ride.date).toISOString()
        : new Date(ride.date).toISOString();

      return {
        _id: ride._id,
        from: ride.from,
        to: ride.to,
        date: rideDate,
        time: ride.time || moment(ride.date).format('HH:mm'),
        pricePerSeat: ride.pricePerSeat,
        availableSeats: ride.availableSeats,
        driver: {
          name: ride.driver?.name || 'Unknown',
          rating: ride.driver?.rating || '4.8'
        }
      };
    });

    res.status(200).json({
      success: true,
      count: formattedRides.length,
      data: formattedRides
    });
  } catch (err) {
    console.error("Error in searchRides:", err);
    next(err);
  }
};

exports.postRide = async (req, res, next) => {
  try {
    const user = req.user;
    console.log(user)

    const driverId = user.id

    const {

      from,
      to,
      date,
      availableSeats,
      pricePerSeat,
      carDetails,
      additionalInfo,
      // passenger,
    } = req.body;

    // const ridePassengers = passenger.slice();
    // console.log(passenger, ridePassengers);

    const newRide = new CarpoolRide({
      driver: driverId,
      from,
      to,
      date,
      availableSeats,
      pricePerSeat,
      carDetails,
      additionalInfo,
      // passenger,
    });
    newRide.save();

    res.status(200).json({
      success: true,
      ride: newRide,
      message: "Ride create successfully",
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Book a ride
// @route   POST /api/carpool/rides/:id/book
// @access  Private/Carpool
exports.bookRide = async (req, res, next) => {
  try {
    const ride = await CarpoolRide.findById(req.params.id);

    if (!ride) {
      return res.status(404).json({
        success: false,
        message: "Ride not found",
      });
    }

    // Check if user is the driver
    if (ride.driver.toString() === req.user.id) {
      return res.status(400).json({
        success: false,
        message: "You cannot book your own ride",
      });
    }

    // Check if user already booked this ride
    const alreadyBooked = ride.passengers.some(
      (passenger) => passenger.user.toString() === req.user.id
    );

    if (alreadyBooked) {
      return res.status(400).json({
        success: false,
        message: "You have already booked this ride",
      });
    }

    // Check if seats are available
    if (ride.availableSeats <= 0) {
      return res.status(400).json({
        success: false,
        message: "No seats available for this ride",
      });
    }

    // Add user to passengers and decrease available seats
    ride.passengers.push({
      user: req.user.id,
      status: "confirmed",
    });

    ride.availableSeats -= 1;
    await ride.save();

    res.status(200).json({
      success: true,
      data: ride,
    });
  } catch (err) {
    console.error("Error booking ride:", err);
    next(err);  // Pass the error to the global error handler
  }
};


// @desc    Get user rides (booked by user)
// @route   GET /api/carpool/user-rides
// @access  Private/Carpool
exports.getUserRides = async (req, res, next) => {
  try {
    // Find rides where user is a passenger
    const rides = await CarpoolRide.find({
      "passengers.user": req.user.id,
    })
      .populate("driver", "name")
      .sort({ date: 1 });

    res.status(200).json({
      success: true,
      count: rides.length,
      data: rides,
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Get offered rides (posted by user)
// @route   GET /api/carpool/offered-rides
// @access  Private/Carpool
exports.getOfferedRides = async (req, res, next) => {
  try {
    // Find rides offered by the user
    const rides = await CarpoolRide.find({
      driver: req.user.id,
    })
      .populate("passengers.user", "name")
      .sort({ date: 1 });
    console.log("rides", rides);

    res.status(200).json({
      success: true,
      count: rides.length,
      data: rides,
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Cancel ride booking
// @route   POST /api/carpool/rides/:id/cancel
// @access  Private/Carpool
exports.cancelRideBooking = async (req, res, next) => {
  try {
    const ride = await CarpoolRide.findById(req.params.id);

    if (!ride) {
      return res.status(404).json({
        success: false,
        message: "Ride not found",
      });
    }

    // Check if user is driver or passenger
    const isDriver = ride.driver.toString() === req.user.id;
    const isPassenger = ride.passengers.some(
      (passenger) => passenger.user.toString() === req.user.id
    );

    if (!isDriver && !isPassenger) {
      return res.status(403).json({
        success: false,
        message: "Not authorized to cancel this ride",
      });
    }

    // If driver cancels, cancel the entire ride
    if (isDriver) {
      ride.status = "cancelled";
      await ride.save();

      return res.status(200).json({
        success: true,
        data: {},
        message: "Ride cancelled successfully",
      });
    }

    // If passenger cancels, only remove their booking
    if (isPassenger) {
      // Find passenger index
      const passengerIndex = ride.passengers.findIndex(
        (passenger) => passenger.user.toString() === req.user.id
      );

      // Remove passenger
      ride.passengers.splice(passengerIndex, 1);

      // Increase available seats
      ride.availableSeats += 1;

      await ride.save();

      return res.status(200).json({
        success: true,
        data: {},
        message: "Booking cancelled successfully",
      });
    }
  } catch (err) {
    next(err);
  }
};

// @desc    Get ride details
// @route   GET /api/carpool/rides/:id
// @access  Private/Carpool
exports.getRideDetails = async (req, res, next) => {
  try {
    const ride = await CarpoolRide.findById(req.params.id)
      .populate("driver", "name email")
      .populate("passengers.user", "name email");

    if (!ride) {
      return res.status(404).json({
        success: false,
        message: "Ride not found",
      });
    }

    res.status(200).json({
      success: true,
      data: ride,
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Update ride details
// @route   PUT /api/carpool/rides/:id
// @access  Private/Carpool
exports.updateRide = async (req, res, next) => {
  try {
    let ride = await CarpoolRide.findById(req.params.id);

    if (!ride) {
      return res.status(404).json({
        success: false,
        message: "Ride not found",
      });
    }

    // Make sure user is ride owner
    if (ride.driver.toString() !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: "Not authorized to update this ride",
      });
    }

    // Don't allow updates if ride has passengers
    if (ride.passengers.length > 0) {
      return res.status(400).json({
        success: false,
        message: "Cannot update ride with existing passengers",
      });
    }

    ride = await CarpoolRide.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });

    res.status(200).json({
      success: true,
      data: ride,
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Get user dashboard stats
// @route   GET /api/carpool/dashboard-stats
// @access  Private/Carpool
exports.getDashboardStats = async (req, res, next) => {
  try {
    const now = new Date();

    // Upcoming rides offered by user
    const upcomingOfferedRides = await CarpoolRide.countDocuments({
      driver: req.user.id,
      date: { $gt: now },
      status: "active",
    });

    // Upcoming rides booked by user
    const upcomingBookedRides = await CarpoolRide.countDocuments({
      "passengers.user": req.user.id,
      date: { $gt: now },
      status: "active",
    });

    // Past rides as driver
    const pastDriverRides = await CarpoolRide.find({
      driver: req.user.id,
      date: { $lt: now },
    });

    // Past rides as passenger
    const pastPassengerRides = await CarpoolRide.find({
      "passengers.user": req.user.id,
      date: { $lt: now },
    });

    // Calculate total earnings (as driver)
    let totalEarnings = 0;
    pastDriverRides.forEach((ride) => {
      totalEarnings += ride.pricePerSeat * ride.passengers.length;
    });

    // Calculate total spent (as passenger)
    let totalSpent = 0;
    pastPassengerRides.forEach((ride) => {
      totalSpent += ride.pricePerSeat;
    });

    res.status(200).json({
      success: true,
      data: {
        upcomingOfferedRides,
        upcomingBookedRides,
        pastDriverRides: pastDriverRides.length,
        pastPassengerRides: pastPassengerRides.length,
        totalEarnings,
        totalSpent,
      },
    });
  } catch (err) {
    next(err);
  }
};
