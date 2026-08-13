const express = require("express");
const router = express.Router();
const orderController = require("../controllers/orderController");
const { protect } = require("../middlewares/authMiddleware");

router.use(protect);

router
  .route("/")
  .post(orderController.createOrder)
  .get(orderController.getOrders);

router
  .route("/:id")
  .get(orderController.getOrdersById)
  .put(orderController.updateOrder)
  .delete(orderController.orderDelete);

router.patch("/:id/status", orderController.updateStatus);

module.exports = router;
