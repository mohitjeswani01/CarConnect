const Car = require('../models/Car');
const RentalRecord = require('../models/RentalRecords');

// @desc    Get car listings for owner
// @route   GET /api/car-owner/listings
// @access  Private/CarOwner
exports.getCarListings = async (req, res, next) => {
    try {
        const cars = await Car.find({ owner: req.user.id });

        res.status(200).json({
            success: true,
            count: cars.length,
            data: cars
        });
    } catch (err) {
        next(err);
    }
};

// @desc    Add new car
// @route   POST /api/car-owner/cars
// @access  Private/CarOwner
exports.addCar = async (req, res, next) => {
    try {
        // Add owner to car data
        req.body.owner = req.user.id;

        // Add photo paths if uploaded
        if (req.files && req.files.length > 0) {
            req.body.photos = req.files.map(file => `/uploads/cars/${file.filename}`);
        }

        const car = await Car.create(req.body);

        res.status(201).json({
            success: true,
            data: car
        });
    } catch (err) {
        next(err);
    }
};

// @desc    Get single car
// @route   GET /api/car-owner/cars/:id
// @access  Private/CarOwner
exports.getCar = async (req, res, next) => {
    try {
        const car = await Car.findById(req.params.id);

        if (!car) {
            return res.status(404).json({
                success: false,
                message: 'Car not found'
            });
        }

        // Make sure user is car owner
        if (car.owner.toString() !== req.user.id) {
            return res.status(403).json({
                success: false,
                message: 'Not authorized to access this car'
            });
        }

        res.status(200).json({
            success: true,
            data: car
        });
    } catch (err) {
        next(err);
    }
};

// @desc    Update car
// @route   PUT /api/car-owner/cars/:id
// @access  Private/CarOwner
exports.updateCar = async (req, res, next) => {
    try {
        let car = await Car.findById(req.params.id);

        if (!car) {
            return res.status(404).json({
                success: false,
                message: 'Car not found'
            });
        }

        // Make sure user is car owner
        if (car.owner.toString() !== req.user.id) {
            return res.status(403).json({
                success: false,
                message: 'Not authorized to update this car'
            });
        }

        // Add photo paths if uploaded
        if (req.files && req.files.length > 0) {
            req.body.photos = req.files.map(file => `/uploads/cars/${file.filename}`);
        }

        car = await Car.findByIdAndUpdate(req.params.id, req.body, {
            new: true,
            runValidators: true
        });

        res.status(200).json({
            success: true,
            data: car
        });
    } catch (err) {
        next(err);
    }
};

// @desc    Delete car
// @route   DELETE /api/car-owner/cars/:id
// @access  Private/CarOwner
exports.deleteCar = async (req, res, next) => {
    try {
        const car = await Car.findById(req.params.id);

        if (!car) {
            return res.status(404).json({
                success: false,
                message: 'Car not found'
            });
        }

        // Make sure user is car owner
        if (car.owner.toString() !== req.user.id) {
            return res.status(403).json({
                success: false,
                message: 'Not authorized to delete this car'
            });
        }

        await car.deleteOne();

        res.status(200).json({
            success: true,
            data: {}
        });
    } catch (err) {
        next(err);
    }
};

// @desc    Toggle car availability
// @route   PATCH /api/car-owner/cars/:id/toggle-availability
// @access  Private/CarOwner
exports.toggleCarAvailability = async (req, res, next) => {
    try {
        let car = await Car.findById(req.params.id);

        if (!car) {
            return res.status(404).json({
                success: false,
                message: 'Car not found'
            });
        }

        // Make sure user is car owner
        if (car.owner.toString() !== req.user.id) {
            return res.status(403).json({
                success: false,
                message: 'Not authorized to update this car'
            });
        }

        car = await Car.findByIdAndUpdate(
            req.params.id,
            { isAvailable: !car.isAvailable },
            { new: true }
        );

        res.status(200).json({
            success: true,
            data: car
        });
    } catch (err) {
        next(err);
    }
};

// @desc    Get rental records for owner
// @route   GET /api/car-owner/rental-records
// @access  Private/CarOwner
exports.getRentalRecords = async (req, res, next) => {
    try {
        // Find all cars owned by this user
        const cars = await Car.find({ owner: req.user.id });
        const carIds = cars.map(car => car._id);

        // Find all rental records for these cars
        const rentalRecords = await RentalRecord.find({
            car: { $in: carIds }
        })
            .populate('car')
            .populate('renter', 'name email');

        res.status(200).json({
            success: true,
            count: rentalRecords.length,
            data: rentalRecords
        });
    } catch (err) {
        next(err);
    }
};