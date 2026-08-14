require("dotenv").config();
const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const User = require("./models/User");
const Session = require("./models/Session");
const Truck = require("./models/Truck");
const Order = require("./models/Order");

const MONGO_URI =
  process.env.MONGO_URI || "mongodb://localhost:27017/be-skill-test";

const seedData = async () => {
  try {
    await mongoose.connect(MONGO_URI);
    console.log(" Connected to MongoDB for seeding...");

    await User.deleteMany({});
    await Session.deleteMany({});
    await Truck.deleteMany({});
    await Order.deleteMany({});
    console.log(" Existing data cleared.");

    const hashedPassword = await bcrypt.hash("password123", 10);
    const user = await User.create({
      fullname: "Tester Developer",
      username: "tester",
      password: hashedPassword,
    });
    console.log(` User created: username 'tester' | password 'password123'`);

    const truck1 = await Truck.create({
      policeNumber: "L 1234 AB",
      truckType: "Cold Diesel Double (CDD)",
      location: {
        type: "Point",
        coordinates: [112.785, -7.28],
      },
      owner: user._id,
    });

    const truck2 = await Truck.create({
      policeNumber: "L 5678 CD",
      truckType: "Fuso Box",
      location: {
        type: "Point",
        coordinates: [112.7483, -7.2575],
      },
      owner: user._id,
    });
    console.log(" 2 Trucks seeded.");

    await Order.create({
      item: "Pengiriman Perangkat Server Kampus",
      status: "start",
      destination: {
        type: "Point",
        coordinates: [112.7915, -7.2758],
      },
      user: user._id,
      truck: truck1._id,
    });

    await Order.create({
      item: "Distribusi Bahan Makanan",
      status: "created",
      destination: {
        type: "Point",
        coordinates: [112.7383, -7.3195],
      },
      user: user._id,
      truck: null,
    });
    console.log(" 2 Orders seeded (1 linked to truck1).");

    console.log("\n Seeding completed successfully!");
    process.exit(0);
  } catch (error) {
    console.error(" Seeding failed:", error);
    process.exit(1);
  }
};

seedData();
