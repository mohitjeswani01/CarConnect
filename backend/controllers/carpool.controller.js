const CarpoolRide = require('../models/CarpoolRide');

// @desc    Search for rides
// @route   GET /api/carpool/search
// @access  Public
exports.searchRides = async (req, res, next) => {
    try {
        const { from, to, date } = req.query;

        let query = {};

        if (from) {
            query.from = { $regex: from, $options: 'i' };
        }

        if (to) {
            query.to = { $regex: to, $options: 'i' };
        }

        if (date) {
            // Create a date range for the given date (entire day)
            const searchDate = new Date(date);
            const nextDay = new Date(searchDate);
            nextDay.setDate(nextDay.getDate() + 1);

            query.date = {
                $gte: searchDate,
                $lt: nextDay
            };
        }

        // Only return rides with available seats
        query.availableSeats = { $gt: 0 };

        const rides = await CarpoolRide.find(query)
            .populate('driver', 'name')
            .sort({ date: 1 });

        res.status(200).json({
            success: true,
            count: rides.length,
            data: rides
        });
    } catch (err) {
        next(err);
    }
};

// @desc    Post a new ride
// @route   POST /api/carpool/rides
// @access  Private/Carpool
exports.postRide = async (req, res, next) => {
    try {
        // Add driver to ride data
        req.body.driver = req.user.id;

        const ride = await CarpoolRide.create(req.body);

        res.status(201).json({
            success: true,
            data: ride
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
                message: 'Ride not found'
            });
        }

        // Check if user is the driver
        if (ride.driver.toString() === req.user.id) {
            return res.status(400).json({
                success: false,
                message: 'You cannot book your own ride'
            });
        }

        // Check if user already booked this ride
        const alreadyBooked = ride.passengers.some(
            passenger => passenger.user.toString() === req.user.id
        );

        if (alreadyBooked) {
            return res.status(400).json({
                success: false,
                message: 'You have already booked this ride'
            });
        }

        // Check if seats are available
        if (ride.availableSeats <= 0) {
            return res.status(400).json({
                success: false,
                message: 'No seats available for this ride'
            });
        }

        // Add user to passengers and decrease available seats
        ride.passengers.push({
            user: req.user.id,
            status: 'confirmed'
        });

        ride.availableSeats -= 1;
        await ride.save();

        res.status(200).json({
            success: true,
            data: ride
        });
    } catch (err) {
        next(err);
    }
};

// @desc    Get user rides (booked by user)
// @route   GET /api/carpool/user-rides
// @access  Private/Carpool
exports.getUserRides = async (req, res, next) => {
    try {
        // Find rides where user is a passenger
        const rides = await CarpoolRide.find({
            'passengers.user': req.user.id
        })
            .populate('driver', 'name')
            .sort({ date: 1 });

        res.status(200).json({
            success: true,
            count: rides.length,
            data: rides
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
            driver: req.user.id
        })
            .populate('passengers.user', 'name')
            .sort({ date: 1 });

        res.status(200).json({
            success: true,
            count: rides.length,
            data: rides
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
                message: 'Ride not found'
            });
        }

        // Find the passenger
        const passengerIndex = ride.passengers.findIndex(
            passenger => passenger.user.toString() === req.user.id
        );

        if (passengerIndex === -1) {
            return res.status(400).json({
                success: false,
                message: 'You have not booked this ride'
            });
        }

        // Remove passenger and increase available seats
        ride.passengers.splice(passengerIndex, 1);
        ride.availableSeats += 1;
        await ride.save();

        res.status(200).json({
            success: true,
            data: ride
        });
    } catch (err) {
        next(err);
    }
};
