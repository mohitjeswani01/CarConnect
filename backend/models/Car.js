const mongoose = require('mongoose');

const CarSchema = new mongoose.Schema({
    owner: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    make: {
        type: String,
        required: [true, 'Please add a make']
    },
    model: {
        type: String,
        required: [true, 'Please add a model']
    },
    year: {
        type: Number,
        required: [true, 'Please add a year']
    },
    color: String,
    licensePlate: String,
    photos: [String],
    pricePerDay: {
        type: Number,
        required: [true, 'Please add a price per day']
    },
    isAvailable: {
        type: Boolean,
        default: true
    },
    location: String,
    description: String,
    features: [String],
    createdAt: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model('Car', CarSchema);
