const mongoose = require("mongoose");
const Order = require("../models/Order");

exports.createOrder = async (req, res, next) => {
  try {
    const { item, lat, lng } = req.body;

    if (!item || lat === undefined || lng === undefined) {
      return res.status(401).json({
        success: false,
        message: "field item, lat, dan lng harus diisi.",
      });
    }

    const order = await Order.create({
      item,
      destination: {
        type: "Point",
        coorinates: [parseFloat(lng), parseFloat(lat)],
      },
      user: req.user._id,
    });

    res.status(200).json({
      success: true,
      data: order,
    });
  } catch (error) {
    next(error);
  }
};

exports.getOrders = async (req, res, next) => {
  try {
    const order = await Order.findOne({ user: req.user._id });
    res.json({
      success: true,
      data: order,
    });
  } catch (error) {
    next(error);
  }
};

exports.getOrdersById = async (req, res, next) => {
  try {
    const order = await Order.findOne({
      _id: req.params.id,
      user: req.user._id,
    });

    if (!order) {
      return res.status(404).json({
        success: false,
        message: "Order tidak ditemukan",
      });
    }

    res.json({
      success: true,
      data: order,
    });
  } catch (error) {
    next(error);
  }
};

exports.updateOrder = async (req, res, next) => {
  try {
    const { item, lat, lng } = req.body;
    const updateData = {};

    if (item) updateData.item = item;
    if (lat !== undefined && lng !== undefined) {
      updateData.destination = {
        type: "Point",
        coordinates: [parseFloat(lng), parseFloat(lat)],
      };
    }

    const order = await Order.findOneAndUpdate(
      {
        _id: req.params.id,
        user: req.user._id,
      },
      updateData,
      { returnDocument: "after" },
    );

    if (!order) {
      return res.status(404).json({
        success: false,
        message: "Order tidak ditemukan",
      });
    }
    res.json({
      success: true,
      data: order,
    });
  } catch (error) {
    next(error);
  }
};

exports.orderDelete = async (req, res, next) => {
  try {
    const order = await Order.findOneAndDelete({
      _id: req.params.id,
      user: req.user._id,
    });

    if (!order) {
      return res.status(404).json({
        succes: false,
        message: "Order tidak ditemukan",
      });
    }

    res.json({
      success: true,
      message: " Order berhasil dihapus",
    });
  } catch (error) {
    next(error);
  }
};

exports.updateStatus = async (req, res, next) => {
  try {
    const { status } = req.body;
    const order = await Order.findOne({
      _id: req.params.id,
      user: req.user._id,
    });

    if (!order) {
      res.status(404).json({
        status: false,
        message: "Order tidak ditemukan",
      });
    }

    const validTransition = {
      created: ["start"],
      start: ["done"],
      done: [],
    };

    const allowed = validTransition[order.status];

    if (!allowed || !allowed.includes(status)) {
      return res.status(400).json({
        success: false,
        message: `Transisi status dari '${order.status}' ke '${status}' tidak valid. Urutan resmi: created -> start -> done.`,
      });
    }

    order.status = status;
    await order.save();

    res.json({
      success: true,
      data: order,
    });
  } catch (error) {
    next(error);
  }
};
