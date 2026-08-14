const turf = require("@turf/turf");
const Truck = require("../models/Truck");
const Order = require("../models/Order");

exports.createTruck = async (req, res, next) => {
  try {
    const { policeNumber, truckType, lat, lng } = req.body;

    if (!policeNumber || !truckType || lat === undefined || lng === undefined) {
      return res.status(400).json({
        success: false,
        message: " Field policeNumber, truckType, lat, dan lng wajib diisi",
      });
    }

    const existingTruck = await Truck.findOne({
      policeNumber: policeNumber.toUpperCase(),
    });
    if (existingTruck) {
      return res.status(400).json({
        success: false,
        message: "Plat nomor sudah terdaftar",
      });
    }

    const truck = await Truck.create({
      policeNumber,
      truckType,
      location: {
        type: "Point",
        coordinates: [parseFloat(lng), parseFloat(lat)],
      },

      owner: req.user._id,
    });

    res.json({
      success: true,
      data: truck,
    });
  } catch (error) {
    next(error);
  }
};

exports.getTruck = async (req, res, next) => {
  try {
    const truck = await Truck.find({
      owner: req.user._id,
    });
    res.json({
      success: true,
      data: truck,
    });
  } catch (error) {
    next(error);
  }
};

exports.getTruckById = async (req, res, next) => {
  try {
    const truck = await Truck.findOne({
      _id: req.params.id,
      owner: req.user._id,
    });

    if (!truck) {
      return res.status(404).json({
        succes: false,
        message: "Truck Tidak ditemukan",
      });
    }

    res.json({
      success: true,
      data: truck,
    });
  } catch (error) {
    next(error);
  }
};

exports.updateTruck = async (req, res, next) => {
  try {
    const { policeNumber, truckType, lat, lng } = req.body;
    const updateData = {};

    if (policeNumber) updateData.policeNumber = policeNumber.toUpperCase();
    if (truckType) updateData.truckType = truckType;
    if (lat !== undefined && lng !== undefined) {
      updateData.location = {
        type: "Point",
        coordinates: [parseFloat(lng), parseFloat(lat)],
      };
    }

    const truck = await Truck.findOneAndUpdate(
      {
        _id: req.params.id,
        owner: req.user._id,
      },
      updateData,
      { returnDocument: "after" },
    );

    if (!truck) {
      return res.status(404).json({
        success: false,
        message: " Truck tidak ditemukan",
      });
    }

    res.json({
      success: true,
      data: truck,
    });
  } catch (error) {
    next(error);
  }
};

exports.deleteTruck = async (req, res, next) => {
  try {
    const truck = await Truck.findOneAndDelete({
      _id: req.params.id,
      owner: req.user._id,
    });

    if (!truck) {
      return res.status(404).json({
        success: false,
        message: "Truck tidak ditemukan",
      });
    }

    res.json({
      success: true,
      data: truck,
    });
  } catch (error) {
    next(error);
  }
};

exports.updateTruckLocation = async (req, res, next) => {
  try {
    const { lat, lng } = req.body;

    if (lat === undefined && lng === undefined) {
      return res.status(404).json({
        success: false,
        message: "Field lat dan lng wajib diisi",
      });
    }

    newCoordinates = [parseFloat(lng), parseFloat(lat)];

    const truck = await Truck.findOneAndUpdate(
      {
        _id: req.params.id,
        owner: req.user._id,
      },
      {
        location: {
          type: "Point",
          coordinates: newCoordinates,
        },
      },
      { returnDocument: "after" },
    );

    if (!truck) {
      return res.status(404).json({
        success: false,
        message: "Truck tidak ditemukan",
      });
    }

    const linkOrder = await Order.findOne({
      truck: truck._id,
      status: "start",
      user: req.user._id,
    });

    let geofenceResult = {
      hasActiveOrder: false,
      message: "Truck tidak membawa order aktif dengan status 'start'.",
    };

    if (linkOrder) {
      const truckPoint = turf.point(newCoordinates);
      const destinationPoint = turf.point(linkOrder.destination.coordinates);
      const distanceMeters = turf.distance(truckPoint, destinationPoint, {
        units: "meters",
      });

      const GEOFENCE_THRESHOLD_METERS = 100;
      const isInside = distanceMeters <= GEOFENCE_THRESHOLD_METERS;

      geofenceResult = {
        hasActiveOrder: true,
        orderId: linkOrder._id,
        item: linkOrder.item,
        distanceToDestination: `${Math.round(distanceMeters)} meter`,
        event: isInside ? "ARRIVED" : "DEPARTED / END ROUTE",
        description: isInside
          ? `Truk TIBA di area tujuan pengiriman (radius <= ${GEOFENCE_THRESHOLD_METERS}m).`
          : `Truk BERANGKAT / DI LUAR area tujuan pengiriman (radius > ${GEOFENCE_THRESHOLD_METERS}m).`,
      };
    }

    return res.json({
      success: true,
      message: "Lokasi truk berhasil diperbarui.",
      data: {
        truck,
        geofence: geofenceResult,
      },
    });
  } catch (error) {
    next(error);
  }
};
