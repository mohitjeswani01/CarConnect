const mongoose = require("mongoose");

const DriverSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      unique: true,
    },
    location: {
      type: String,
      required: [true, "Please provide your service location"],
    },
    isAvailable: {
      type: Boolean,
      default: true,
    },
    licenseNumber: {
      type: String,
      required: [true, "Please provide your driving license number"],
    },
    licenseExpiry: {
      type: Date,
      required: [true, "Please provide license expiry date"],
    },
    experience: {
      type: Number, // Years of driving experience
      default: 0,
    },
    vehiclePreferences: {
      type: [String], // Array of preferred vehicle types/categories
      default: [],
    },
    averageRating: {
      type: Number,
      min: 0,
      max: 5,
      default: 0,
    },
    totalRides: {
      type: Number,
      default: 0,
    },
    totalEarnings: {
      type: Number,
      default: 0,
    },
    bio: {
      type: String,
      maxlength: [500, "Bio cannot be more than 500 characters"],
    },
    profileImage: {
      type: String, // Path to profile image
    },
    phoneNumber: {
      type: String,
      match: [
        /^(\+\d{1,3}[- ]?)?\d{10}$/,
        "Please provide a valid phone number",
      ],
    },
    emergencyContact: {
      name: String,
      relationship: String,
      phone: String,
    },
    languages: {
      type: [String],
      default: ["English"],
    },
    createdAt: {
      type: Date,
      default: Date.now,
    },
  },
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

// Virtual for getting the full name from user
DriverSchema.virtual("fullName").get(function () {
  return this.user ? this.user.name : "";
});

// Method to update driver statistics after a ride
DriverSchema.methods.updateStats = async function (rideEarnings, rideRating) {
  // Update total rides
  this.totalRides += 1;

  // Update total earnings
  this.totalEarnings += rideEarnings;

  // Update average rating
  if (rideRating) {
    if (this.totalRides === 1) {
      this.averageRating = rideRating;
    } else {
      const oldRatingWeight = (this.totalRides - 1) / this.totalRides;
      const newRatingWeight = 1 / this.totalRides;
      this.averageRating =
        this.averageRating * oldRatingWeight + rideRating * newRatingWeight;
    }
  }

  await this.save();
};

// Index for optimizing queries by location and availability
DriverSchema.index({ location: 1, isAvailable: 1 });

module.exports = mongoose.model("Driver", DriverSchema);
