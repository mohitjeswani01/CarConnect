const RideRequest = require('../models/RideRequest');
const User = require('../models/User');

// @desc    Get ride requests
// @route   GET /api/driver/ride-requests
// @access  Private/Driver
exports.getRideRequests = async (req, res, next) => {
    try {
        // Get pending ride requests
        const rideRequests = await RideRequest.find({
            status: 'pending'
        }).populate('rider', 'name');

        res.status(200).json({
            success: true,
            count: rideRequests.length,
            data: rideRequests
        });
    } catch (err) {
        next(err);
    }
};

// @desc    Get active rides
// @route   GET /api/driver/active-rides
// @access  Private/Driver
exports.getActiveRides = async (req, res, next) => {
    try {
        // Get accepted ride requests for this driver
        const activeRides = await RideRequest.find({
            driver: req.user.id,
            status: 'accepted'
        }).populate('rider', 'name phone');

        res.status(200).json({
            success: true,
            count: activeRides.length,
            data: activeRides
        });
    } catch (err) {
        next(err);
    }
};

// @desc    Get ride history
// @route   GET /api/driver/ride-history
// @access  Private/Driver
exports.getRideHistory = async (req, res, next) => {
    try {
        // Get completed or cancelled rides for this driver
        const rideHistory = await RideRequest.find({
            driver: req.user.id,
            status: { $in: ['completed', 'cancelled'] }
        }).populate('rider', 'name');

        res.status(200).json({
            success: true,
            count: rideHistory.length,
            data: rideHistory
        });
    } catch (err) {
        next(err);
    }
};

// @desc    Accept ride request
// @route   POST /api/driver/ride-requests/:id/accept
// @access  Private/Driver
exports.acceptRide = async (req, res, next) => {
    try {
        const rideRequest = await RideRequest.findById(req.params.id);

        if (!rideRequest) {
            return res.status(404).json({
                success: false,
                message: 'Ride request not found'
            });
        }

        if (rideRequest.status !== 'pending') {
            return res.status(400).json({
                success: false,
                message: `Cannot accept a ride that is ${rideRequest.status}`
            });
        }

        // Update ride request
        rideRequest.status = 'accepted';
        rideRequest.driver = req.user.id;
        await rideRequest.save();

        res.status(200).json({
            success: true,
            data: rideRequest
        });
    } catch (err) {
        next(err);
    }
};

// @desc    Reject ride request
// @route   POST /api/driver/ride-requests/:id/reject
// @access  Private/Driver
exports.rejectRide = async (req, res, next) => {
    try {
        const rideRequest = await RideRequest.findById(req.params.id);

        if (!rideRequest) {
            return res.status(404).json({
                success: false,
                message: 'Ride request not found'
            });
        }

        if (rideRequest.status !== 'pending') {
            return res.status(400).json({
                success: false,
                message: `Cannot reject a ride that is ${rideRequest.status}`
            });
        }

        // Update ride request
        rideRequest.status = 'rejected';
        await rideRequest.save();

        res.status(200).json({
            success: true,
            data: rideRequest
        });
    } catch (err) {
        next(err);
    }
};

// @desc    Toggle driver availability
// @route   PATCH /api/driver/toggle-availability
// @access  Private/Driver
exports.toggleAvailability = async (req, res, next) => {
    try {
        const { isAvailable } = req.body;

        if (isAvailable === undefined) {
            return res.status(400).json({
                success: false,
                message: 'Please provide isAvailable status'
            });
        }

        // Update driver availability status
        await User.findByIdAndUpdate(req.user.id, {
            isAvailable: isAvailable
        });

        res.status(200).json({
            success: true,
            data: { isAvailable }
        });
    } catch (err) {
        next(err);
    }
};