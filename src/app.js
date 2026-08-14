const express = require("express");
const app = express();
const authRoutes = require("./routes/authRoutes");
const orderRoutes = require("./routes/orderRoutes");
const truckRoutes = require("./routes/truckRoutes");
const locationRoutes = require("./routes/locationRoutes");
const errorMiddleware = require("./middlewares/errorMiddleware");

app.use(express.json());

app.use("/api", authRoutes);
app.use("/api/orders", orderRoutes);
app.use("/api/trucks", truckRoutes);
app.use("/api/locations", locationRoutes);

app.get("/", (req, res) => {
  res.json({
    success: true,
    message: "BE Skill Test API is running",
  });
});

app.use(errorMiddleware);

module.exports = app;
