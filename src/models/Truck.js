const mongoose = require("mongoose");

const truckSchema = new mongoose.Schema(
  {
    policeNumber: {
      type: String,
      required: true,
      unique: true,
      uppercase: true,
    },

    truckType: {
      type: String,
      required: true,
    },

    location: {
      type: {
        type: String,
        enum: ["Point"],
        default: "Point",
      },
      coordinates: {
        type: [Number],
        required: true,
      },
    },
    owner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  { timestamps: true },
);

truckSchema.index({ location: "2dsphere" });

module.exports = mongoose.model("Truck", truckSchema);
