const mongoose = require("mongoose");

const CarpoolRideSchema = new mongoose.Schema(
  {
    driver: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    from: {
      type: String,
      required: [true, "Please specify departure location"],
    },
    to: {
      type: String,
      required: [true, "Please specify destination"],
    },
    date: {
      type: Date,
      required: [true, "Please specify date and time"],
    },
    availableSeats: {
      type: Number,
      required: [true, "Please specify available seats"],
      min: [1, "At least one seat must be available"],
    },
    pricePerSeat: {
      type: Number,
      required: [true, "Please specify price per seat"],
    },
    carDetails: {
      type: String,
      default: "Not specified",
    },
    additionalInfo: {
      type: String,
      default: "",
    },
    passengers: [
      {
        user: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "User",
          required: true,
        },
        pickupPoint: {
          type: String,
          default: "",
        },
        status: {
          type: String,
          enum: ["confirmed", "cancelled"],
          default: "confirmed",
        },
      },
    ],
    status: {
      type: String,
      enum: ["active", "completed", "cancelled"],
      default: "active",
    },
  },
  { timestamps: true }
);

// Set virtual for total bookings
CarpoolRideSchema.virtual("totalBookings").get(function () {
  return this.passengers.length;
});

// Enable virtuals in JSON
CarpoolRideSchema.set("toJSON", { virtuals: true });
CarpoolRideSchema.set("toObject", { virtuals: true });

module.exports = mongoose.model("CarpoolRide", CarpoolRideSchema);
