const turf = require("@turf/turf");
const Truck = require("../models/Truck");
const Order = require("../models/Order");

exports.getDistance = async (req, res, next) => {
  try {
    const { truckId, orderId } = req.query;

    if (!truckId) {
      return res.status(404).json({
        success: false,
        message: "Query parameter 'truckId' harus diisi",
      });
    }

    const truck = await Truck.findOne({
      _id: truckId,
      owner: req.user._id,
    });

    if (!truck) {
      return res.status(404).json({
        success: false,
        message: "Truck tidak ditemukan",
      });
    }

    let targetOrder = null;

    if (orderId) {
      targetOrder = await Order.findOne({
        _id: orderId,
        owner: req.user._id,
      });
    } else {
      targetOrder = await Order.findOne({
        truck: truckId,
        status: "start",
        user: req.user._id,
      });
    }

    if (!targetOrder) {
      return res.status(404).json({
        success: false,
        message: "Order tidak ditemukan atau truk tidak memiliki order aktif",
      });
    }

    const truckPoint = turf.point(truck.location.coordinates);
    const orderPoint = turf.point(targetOrder.destination.coordinates);
    const distanceKm = turf.distance(truckPoint, orderPoint, {
      units: "kilometers",
    });
    const distanceMeters = turf.distance(truckPoint, orderPoint, {
      units: "meters",
    });

    return res.json({
      success: true,
      data: {
        truck: {
          id: truck._id,
          policeNumber: truck.policeNumber,
          coordinates: truck.location.coordinates,
        },

        order: {
          id: targetOrder._id,
          item: targetOrder.item,
          destinationCoordinates: targetOrder.destination.coordinates,
        },

        distance: {
          kilometers: parseFloat(distanceKm.toFixed(2)),
          meters: Math.round(distanceMeters),
        },
      },
    });
  } catch (error) {
    next(error);
  }
};
