const Truck = require("../models/Truck");

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
