const mongoose = require("mongoose");

const orderSchema = new mongoose.Schema(
  {
    item: { type: String, required: true },
    status: {
      type: String,
      enum: ["created", "start", "done"],
      default: "created",
    },
    destination: {
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
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  },
  { timestamps: true },
);

module.exports = mongoose.model("Order", orderSchema);
