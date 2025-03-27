const mongoose = require('mongoose');

const CarpoolRideSchema = new mongoose.Schema({
    driver: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },

    from: {
        type: String,
        required: [true, 'Please add a starting location']
    },
    to: {
        type: String,
        required: [true, 'Please add a destination']
    },
    date: {
        type: Date,
        required: [true, 'Please add a date']
    },
    time: {
        type: String,
        required: [true, 'Please add a time']
    },
    price: {
        type: Number,
        required: [true, 'Please add a price']
    },
    seats: {
        type: Number,
        required: [true, 'Please add number of available seats'],
        min: [1, 'Must have at least 1 seat']
    },
    availableSeats: {
        type: Number
    },
    car: {
        type: String,
        required: [true, 'Please add car details']
    },
    notes: String,
    passengers: [{
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User'
        },
        status: {
            type: String,
            enum: ['pending', 'confirmed', 'cancelled'],
            default: 'pending'
        }
    }],
    createdAt: {
        type: Date,
        default: Date.now
    }
});

// Set availableSeats equal to seats when creating a new ride
CarpoolRideSchema.pre('save', function (next) {
    if (this.isNew) {
        this.availableSeats = this.seats;
    }
    next();
});

module.exports = mongoose.model('CarpoolRide', CarpoolRideSchema);