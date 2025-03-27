const mongoose = require('mongoose');

const RideRequestSchema = new mongoose.Schema({
    rider: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    driver: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    pickupLocation: {
        type: String,
        required: [true, 'Please add a pickup location']
    },
    dropoffLocation: {
        type: String,
        required: [true, 'Please add a dropoff location']
    },
    pickupTime: {
        type: Date,
        required: [true, 'Please add a pickup time']
    },
    status: {
        type: String,
        enum: ['pending', 'accepted', 'rejected', 'completed', 'cancelled'],
        default: 'pending'
    },
    price: {
        type: Number
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model('RideRequest', RideRequestSchema);